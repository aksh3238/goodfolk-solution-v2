import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroBrandVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  headline?: string;
  className?: string;
  isFullWidth?: boolean;
  onOpenLetsTalk?: () => void;
}

export const HeroBrandVideo: React.FC<HeroBrandVideoProps> = ({
  videoUrl,
  posterUrl,
  headline = 'Good Ideas Deserve Good Folks.',
  className = '',
  isFullWidth = false,
  onOpenLetsTalk
}) => {
  const { siteContent } = useSiteContent();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [activeScene, setActiveScene] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const fallbackPoster = posterUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

  // Check reduced-motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
    }
  }, []);

  // Built-in 15s Brand Film Loop when using original animated engine
  useEffect(() => {
    if (videoUrl || !isPlaying || prefersReducedMotion) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= 15) {
          return 0; // Seamless loop back to 0
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [videoUrl, isPlaying, prefersReducedMotion]);

  // Exact 4-Scene Timing:
  // 00–03 seconds — GOOD IDEAS.
  // 03–07 seconds — GREAT THINKING.
  // 07–11 seconds — REAL IMPACT.
  // 11–15 seconds — GOOD IDEAS DESERVE GOODFOLK.
  useEffect(() => {
    if (currentTime < 3.0) setActiveScene(0);
    else if (currentTime < 7.0) setActiveScene(1);
    else if (currentTime < 11.0) setActiveScene(2);
    else setActiveScene(3);
  }, [currentTime]);

  // Letter by letter reveal calculation for Scene 1 (0 to 3s)
  const scene1Text = "GOOD IDEAS.";
  const scene1Progress = Math.max(0, Math.min(1, (currentTime - 0.3) / 2.0));
  const scene1VisibleChars = Math.floor(scene1Progress * scene1Text.length);

  // If HTML5 video is present
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 15);
    }
  };

  const togglePlay = () => {
    if (videoUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoUrl && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const progressPercent = Math.min(100, (currentTime / (duration || 15)) * 100);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden bg-black select-none group ${
        isFullWidth
          ? 'w-full aspect-video sm:aspect-[21/9] min-h-[360px] sm:min-h-[460px] max-h-[640px]'
          : 'rounded-3xl shadow-2xl border border-[#173B75]/15 aspect-video'
      } ${className}`}
    >
      {/* 1. ACTUAL VIDEO PLAYBACK (When an uploaded video URL exists in CMS) */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={fallbackPoster}
          autoPlay={!prefersReducedMotion}
          muted={isMuted}
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        /* 2. ORIGINAL 15-SECOND CINEMATIC BRAND FILM ENGINE */
        <div className="relative w-full h-full overflow-hidden bg-black">
          {/* ========================================================= */}
          {/* SCENE 0: 00–03s — GOOD IDEAS.                             */}
          {/* Black background with bold white typography revealing     */}
          {/* letter by letter.                                         */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 flex flex-col justify-center items-center p-6 text-center bg-black ${
              activeScene === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Subtle ambient lens flare in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-wider font-['Poppins',sans-serif]">
                <span>{scene1Text.slice(0, scene1VisibleChars)}</span>
                <span className="inline-block w-1 h-9 sm:h-14 lg:h-16 ml-1 bg-[#F07822] animate-pulse align-middle" />
              </h2>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SCENE 1: 03–07s — GREAT THINKING.                         */}
          {/* Original footage / visuals of a designer sketching,        */}
          {/* creating a moodboard or creative brainstorming.           */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center p-6 overflow-hidden ${
              activeScene === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background design studio footage asset */}
            <img
              src="https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80"
              alt="Designer sketching and creative moodboard brainstorming"
              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-3000 ease-out"
            />
            {/* Elegant cinematic overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-[#173B75]/35 mix-blend-multiply" />

            <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                GREAT THINKING.
              </h2>
              <p className="text-sm sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed font-medium drop-shadow-md">
                Strategic discovery, moodboard curation & collaborative design sprints.
              </p>

              {/* Graphic Craft Swatches & Sketches Visual */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#173B75]" />
                  <span>Color Strategy</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F07822]" />
                  <span>Typographic Rhythm</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2458A6]" />
                  <span>Dieline Architecture</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SCENE 2: 07–11s — REAL IMPACT.                            */}
          {/* Quick, polished cuts of brand identities, packaging,      */}
          {/* website designs and campaign creatives.                   */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center p-6 overflow-hidden ${
              activeScene === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background creative studio showcase */}
            <img
              src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1600&q=80"
              alt="Brand identities packaging and campaign creatives"
              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-3000 ease-out"
            />
            {/* Deep agency blue overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#173B75]/90 via-[#0F264D]/80 to-black/70" />

            <div className="relative z-10 max-w-4xl w-full text-center space-y-5">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                REAL IMPACT.
              </h2>

              {/* Multi-discipline Showcase Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-1">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
                  <span className="text-xl sm:text-2xl block mb-1">📦</span>
                  <div className="text-xs font-bold text-white">Packaging</div>
                  <div className="text-[10px] text-white/70">Custom Dielines</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
                  <span className="text-xl sm:text-2xl block mb-1">✨</span>
                  <div className="text-xs font-bold text-white">Visual Identity</div>
                  <div className="text-[10px] text-white/70">Comprehensive Systems</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
                  <span className="text-xl sm:text-2xl block mb-1">💻</span>
                  <div className="text-xs font-bold text-white">Digital Stores</div>
                  <div className="text-[10px] text-white/70">DTC & E-commerce</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
                  <span className="text-xl sm:text-2xl block mb-1">🎬</span>
                  <div className="text-xs font-bold text-white">Ad Creatives</div>
                  <div className="text-[10px] text-white/70">High-Retention Motion</div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SCENE 3: 11–15s — GOOD IDEAS DESERVE GOODFOLK.            */}
          {/* All visual elements resolve into the supplied Good Folk   */}
          {/* logo, ending with a clean, confident brand reveal.        */}
          {/* ========================================================= */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 flex flex-col justify-center items-center p-6 text-center bg-gradient-to-b from-[#173B75] via-[#0F264D] to-[#173B75] ${
              activeScene === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Subtle brand glow behind logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#F07822]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6 max-w-2xl animate-in zoom-in-95 duration-500">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                GOOD IDEAS DESERVE GOODFOLK.
              </h2>

              {/* Official Clean Brand Reveal */}
              <div className="flex justify-center items-center py-2">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-2xl">
                  <Logo
                    variant="white"
                    size="lg"
                    customLogoUrl={siteContent?.logoUrl}
                    logoText={siteContent?.logoText}
                    logoSubtitle={siteContent?.logoSubtitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle, Professional Playback Controls (Visible on hover or mobile, no demo tags/timers) */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-8 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
        }`}
      >
        {/* Subtle Progress Bar */}
        <div
          className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            const newTime = ratio * 15;
            setCurrentTime(newTime);
            if (videoRef.current) {
              videoRef.current.currentTime = newTime;
            }
          }}
        >
          <div
            className="h-full bg-[#F07822] rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Minimal Control Buttons */}
        <div className="flex items-center justify-between text-white text-xs pt-0.5">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-white/20 hover:bg-[#F07822] transition-colors cursor-pointer text-white"
              aria-label={isPlaying ? 'Pause film' : 'Play film'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer text-white"
              aria-label="Restart film"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {videoUrl && (
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors cursor-pointer text-white"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {onOpenLetsTalk && (
            <button
              onClick={onOpenLetsTalk}
              className="bg-[#F07822] hover:bg-[#d65805] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              Let's Talk
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
