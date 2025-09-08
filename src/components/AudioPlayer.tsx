import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Track {
  id: string;
  title: string;
  url: string;
  downloadUrl: string;
  duration: number;
  dateCreated: string;
}

interface AudioPlayerProps {
  track: Track;
}

export const AudioPlayer = ({ track }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Create a dummy audio source for demo purposes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set duration from track props since we don't have real audio

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetaData = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleLoadedMetaData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleLoadedMetaData);
      audio.removeEventListener("ended", handleEnded);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [track.url, track.duration]);

  const togglePlay = async () => {
    // new code with audio
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("audio play failed", error);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // download the generated audio
  // const handleDownload = () => {
  //   if (!track.url) return;
  //   const link = document.createElement("a");
  //   link.href = track.downloadUrl;
  //   link.setAttribute("download", `${track.title || "generated_audio"}.mp3`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleDownload = async () => {
    if (!track.downloadUrl) return;

    try {
      const response = await axios.get(track.downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${track.title || "generated_audio"}.mp3`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download audio");
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.5);
      setIsMuted(false);
    } else {
      // setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress =
    (duration || track.duration) > 0
      ? (currentTime / (duration || track.duration)) * 100
      : 0;

  return (
    <div className="bg-slate-700/50 rounded-xl p-6 border border-purple-500/20">
      <audio ref={audioRef} src={track.url} preload="metadata" />

      <div className="flex flex-col space-y-4">
        {/* Track Info */}
        <div className="text-center">
          <h4 className="text-white font-medium text-lg">{track.title}</h4>
        </div>

        {/* Waveform Visualization */}
        <div className="h-16 bg-slate-800/50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="flex items-end gap-1 h-8">
            {Array.from({ length: 50 }).map((_, i) => {
              const isActive = i < (progress / 100) * 50;
              const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className={`w-1 transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-t from-green-500 to-purple-500"
                      : "bg-gradient-to-t from-purple-500/30 to-green-500/30"
                  } ${isPlaying && isActive ? "animate-pulse" : ""}`}
                  style={{
                    height: `${Math.max(10, Math.min(100, height))}%`,
                    animationDelay: `${i * 50}ms`,
                    animationDuration: "1s",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || track.duration}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #22c55e ${progress}%, #475569 ${progress}%, #475569 100%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <Button
            onClick={togglePlay}
            className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 p-3 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gray-400 hover:text-gray-700 p-2"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #22c55e);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #22c55e);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `,
        }}
      />
    </div>
  );
};
