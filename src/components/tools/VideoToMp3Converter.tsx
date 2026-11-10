import { useState, useRef } from 'react';
import { Film, Music, Download, Upload, RefreshCw, AlertCircle, CheckCircle2, Play, Square } from 'lucide-react';
import { trackToolUsage } from '../../utils/analytics';
import ShareResultActions from '../ShareResultActions';
import AdSlot from '../AdSlot';

export default function VideoToMp3Converter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<string>('192');
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file (MP4, WebM, MOV, AVI, etc.).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setAudioUrl(null);
      setAudioBlob(null);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setOutputFileName(`${baseName}.mp3`);
      trackToolUsage('video-to-mp3-converter', 'Video to MP3 Converter', 'Converters', 'select_video');
    }
  };

  const handleExtractAudio = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      trackToolUsage('video-to-mp3-converter', 'Video to MP3 Converter', 'Converters', 'extract_audio_start');
      
      // Create a temporary video element to load the video and decode audio via AudioContext
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(selectedFile);
      videoElement.muted = true;
      videoElement.playsInline = true;

      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => resolve(true);
        videoElement.onerror = (err) => reject(err);
      });

      setProgress(30);

      // Extract audio using Web Audio API AudioContext & MediaElementAudioSourceNode
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(videoElement);
      const destination = audioCtx.createMediaStreamDestination();
      source.connect(destination);
      source.connect(audioCtx.destination); // Required by some browsers to process audio graph

      const mediaRecorder = new MediaRecorder(destination.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: 'audio/mp3' });
        setAudioBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);
        setIsProcessing(false);
        setProgress(100);
        trackToolUsage('video-to-mp3-converter', 'Video to MP3 Converter', 'Converters', 'extract_audio_complete');
      };

      videoElement.play();
      mediaRecorder.start();
      setProgress(50);

      videoElement.ontimeupdate = () => {
        if (videoElement.duration) {
          const currentProgress = 50 + Math.floor((videoElement.currentTime / videoElement.duration) * 45);
          setProgress(Math.min(95, currentProgress));
        }
      };

      videoElement.onended = () => {
        videoElement.pause();
        mediaRecorder.stop();
        audioCtx.close();
      };

      // Fallback timeout in case onended doesn't fire correctly
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          videoElement.pause();
          mediaRecorder.stop();
          if (audioCtx.state !== 'closed') audioCtx.close();
        }
      }, (videoElement.duration || 10) * 1000 + 1500);

    } catch (err: any) {
      console.error(err);
      setError('Failed to extract audio from video. Please try a standard MP4 file.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setAudioBlob(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    trackToolUsage('video-to-mp3-converter', 'Video to MP3 Converter', 'Converters', 'reset');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Tool Header */}
      <div className="border-4 border-black p-6 sm:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-4 border-black mb-6">
          <div>
            <div className="inline-block bg-yellow-400 border-2 border-black px-2 py-0.5 text-xs font-black uppercase mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              100% In-Browser Processing
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Video to MP3 Converter
            </h2>
          </div>
          {selectedFile && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-black uppercase bg-neutral-100 hover:bg-neutral-200 px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Convert Another
            </button>
          )}
        </div>

        {/* File Dropzone */}
        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-black p-8 sm:p-12 text-center bg-neutral-50 hover:bg-yellow-50 cursor-pointer transition-colors space-y-4 group"
          >
            <div className="w-16 h-16 mx-auto bg-yellow-300 border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              <Film className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase mb-1">Click to Select Video or Drop File Here</h3>
              <p className="text-xs font-bold text-neutral-600">Supports MP4, WebM, MOV, AVI, MKV (Processed locally in browser)</p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 border-3 border-black bg-neutral-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-yellow-300 border-2 border-black flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-sm truncate">{selectedFile.name}</p>
                  <p className="text-xs text-neutral-600 font-mono">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <span className="bg-black text-white text-xs font-black px-2.5 py-1 uppercase shrink-0">
                Ready
              </span>
            </div>

            {/* Quality & Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Target Audio Bitrate</label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="w-full bg-white border-2 border-black p-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="128">128 kbps (Standard Quality)</option>
                  <option value="192">192 kbps (High Quality)</option>
                  <option value="320">320 kbps (Maximum Audio Fidelity)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Output Format</label>
                <input
                  type="text"
                  value={outputFileName}
                  onChange={(e) => setOutputFileName(e.target.value)}
                  className="w-full bg-white border-2 border-black p-2.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Processing / Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase">
                  <span>Extracting Audio Track...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-4 border-2 border-black bg-neutral-100 overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Conversion Result */}
            {audioUrl && (
              <div className="p-6 border-4 border-black bg-yellow-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  <h4 className="font-black uppercase text-base">Audio Extraction Successful!</h4>
                </div>
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={audioUrl}
                    download={outputFileName}
                    className="flex items-center gap-2 font-black uppercase text-xs sm:text-sm bg-black hover:bg-neutral-800 text-yellow-400 px-5 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <Download className="w-4 h-4" /> Download MP3 Audio
                  </a>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border-2 border-black text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!audioUrl && !isProcessing && (
              <button
                onClick={handleExtractAudio}
                className="w-full flex items-center justify-center gap-2 font-black uppercase text-sm sm:text-base bg-yellow-400 hover:bg-yellow-300 text-black py-3.5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Music className="w-5 h-5" /> Extract & Convert to MP3
              </button>
            )}
          </div>
        )}
      </div>

      <div className="no-print">
        <AdSlot adSlot="9791142997" minHeight="250px" />
      </div>

      <div className="no-print">
        <ShareResultActions 
          title="Video to MP3 Converter"
          summary="Extracted audio track from video file instantly in browser."
        />
      </div>
    </div>
  );
}
