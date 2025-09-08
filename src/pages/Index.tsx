import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { CreditsModal } from "@/components/CreditsModal";
import { toast } from "sonner";
import {
  Volume2,
  Upload,
  Heart,
  Sparkles,
  Copy,
  ReceiptText,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@/contexts/AudioContext";
import GeneratedResultContainer from "@/components/GeneratedResultContainer";
import { usePromptCache } from "@/contexts/PromptCacheContext";
import { Toggle } from "@radix-ui/react-toggle";
import LoadingScreen from "@/components/ui/loadingScreen";

const TAB_KEY = "app.activeTab";
const getInitialTab = (): "music" | "lyrics" => {
  try {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(TAB_KEY) : null;
    return saved === "lyrics" ? "lyrics" : "music";
  } catch {
    return "music";
  }
};

const Index = () => {
  const { musicPrompt, lyricsPrompt, setMusicPrompt, setLyricsPrompt } =
    usePromptCache();
  const [duration, setDuration] = useState<number>(4);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [genre, setGenre] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"music" | "lyrics">(getInitialTab);
  const [prompt, setPrompt] = useState(
    activeTab === "music" ? musicPrompt : lyricsPrompt
  );
  const [animatedLyrics, setAnimatedLyrics] = useState<string>("");
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const {
    user,
    isLoggedIn,
    saveTrack,
    saveLyric,
    currentGeneratedTrack,
    setCurrentGeneratedTrack,
  } = useUser();

  const { generateMusic, lyricsText, isGenerating, generateLyrics } =
    useAudio();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, activeTab);
    } catch {}
  }, [activeTab]);

  // handle the audio and lyrics generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        `Please enter a ${activeTab === "music" ? "music" : "lyrics"} prompt`
      );
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please log in to generate music");
      navigate("/login");
      return;
    }

    if (!user || user.credits < 1) {
      setShowCreditsModal(true);
      return;
    }

    try {
      if (activeTab === "lyrics") {
        await generateLyrics(prompt, genre);
        return;
      }
      await generateMusic(prompt, duration, uploadedFile || undefined);
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ["audio/mp3", "audio/wav", "audio/m4a", "audio/mpeg"];
    if (validTypes.includes(file.type)) {
      setUploadedFile(file);
      console.log(file);
      toast.success(`Uploaded: ${file.name}`);
    } else {
      toast.error("Please upload a valid audio file (.mp3, .wav, .m4a)");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleLike = async () => {
    if (activeTab === "music") {
      if (!currentGeneratedTrack) {
        toast.error("Generate a track first.");
        return;
      }
      saveTrack({
        id: currentGeneratedTrack.id,
        title: currentGeneratedTrack.title,
        url: currentGeneratedTrack.url,
        downloadUrl: currentGeneratedTrack.downloadUrl,
        duration: currentGeneratedTrack.duration,
        dateCreated: currentGeneratedTrack.dateCreated,
      });
      return;
    }

    if (activeTab === "lyrics") {
      if (!lyricsText?.trim()) {
        toast.error("Generate lyrics first");
        return;
      }

      const lyricId = `lyric_${Date.now()}`;
      const lyricTitle =
        (prompt?.trim()?.slice(0, 60) || "Untitled Lyrics") +
        (prompt && prompt.length > 60 ? "_" : "");

      await saveLyric({
        id: lyricId,
        title: lyricTitle,
        content: lyricsText,
        dateCreated: new Date().toISOString(),
      });
      return;
    }
  };

  const handleRegenerate = () => {
    if (!user || user.credits < 1) {
      setShowCreditsModal(true);
      return;
    }
    setCurrentGeneratedTrack(null);
    handleGenerate();
  };

  const handleCopy = () => {
    if (!lyricsText) return;

    navigator.clipboard
      .writeText(lyricsText)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy lyrics");
      });
  };

  useEffect(() => {
    if (lyricsText) {
      setAnimatedLyrics("");
      setTypingIndex(0);
    }
  }, [lyricsText]);

  useEffect(() => {
    if (lyricsText && typingIndex < lyricsText.length) {
      const timeout = setTimeout(() => {
        setAnimatedLyrics((prev) => prev + lyricsText.charAt(typingIndex));
        setTypingIndex((prev) => prev + 1);
      }, 20); // typing speed in ms

      return () => clearTimeout(timeout);
    }
  }, [lyricsText, typingIndex]);

  useEffect(() => {
    if (activeTab === "music") {
      setLyricsPrompt(prompt);
      setPrompt(musicPrompt);
    } else {
      setMusicPrompt(prompt);
      setPrompt(lyricsPrompt);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Generate AI-Powered Music Instantly
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Type a mood, upload a sample, and hear your imagination.
            </p>
          </div>

          {/* tabs start */}
          <div className="relative w-fit mx-auto bg-slate-700/50 rounded-full p-1 flex border border-purple-500/30 mb-5">
            <div
              className={`absolute top-1 left-1 h-8 w-[48%] bg-purple-500 rounded-full transition-all duration-300 z-0 ${
                activeTab === "lyrics" ? "translate-x-[100%]" : ""
              }`}
            />
            <button
              className={`relative z-10 w-24 h-8 rounded-full text-sm font-medium transition-colors  ${
                activeTab === "music" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("music")}
            >
              Music
            </button>
            <button
              className={`relative z-10 w-24 h-8 rounded-full text-sm font-medium transition-colors  ${
                activeTab === "lyrics" ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("lyrics")}
            >
              Lyrics
            </button>
          </div>
          {/* tabs end */}

          {/* Start for music tab */}

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="space-y-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Enter {activeTab === "lyrics" ? "Lyrics" : "Audio"} Prompt
                </label>
                <Input
                  value={prompt}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setPrompt(newValue);
                    activeTab === "music"
                      ? setMusicPrompt(newValue)
                      : setLyricsPrompt(newValue);
                  }}
                  placeholder={
                    activeTab === "lyrics"
                      ? "e.g. Write a chorus about hope and stars"
                      : "e.g. Chill lo-fi with piano and rain sounds"
                  }
                  className="w-full h-14 text-lg bg-slate-700/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
              </div>

              {/* duration selection fro the audio */}
              {activeTab === "music" && (
                <>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Select Duration (seconds)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-12 px-4 rounded-md bg-slate-700/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {[4, 5, 6, 7, 8].map((sec) => (
                        <option key={sec} value={sec}>
                          {sec} seconds
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Drag and drop for the audio */}
              {activeTab === "music" && (
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
                    isDragOver ? "scale-105" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label
                    className={`flex flex-col items-center gap-2 px-6 py-4 bg-slate-700/50 text-gray-300 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 min-h-[60px] ${
                      isDragOver
                        ? "border-purple-400 bg-purple-500/10 text-purple-300"
                        : "border-purple-500/30 hover:border-purple-400"
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    <div className="text-center">
                      {uploadedFile ? (
                        <span>{uploadedFile.name}</span>
                      ) : (
                        <>
                          <div>Upload Sample (optional)</div>
                          <div className="text-sm text-gray-400 mt-1">
                            Click to browse or drag & drop audio files
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".mp3,.wav,.m4a"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* genre selection for the lyrics */}
              {activeTab === "lyrics" && (
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Select Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full h-12 px-4 rounded-md bg-slate-700/50 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value=""> Select Genre </option>
                    <option value="rap">Rap</option>
                    <option value="poetic">Poetic</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="r&b">R&B</option>
                    <option value="lofi">Lo-fi</option>
                    <option value="country">Country</option>
                  </select>
                </div>
              )}

              {isLoggedIn && (
                <div className="text-sm text-gray-400">
                  Cost: 1 credit per generation • You have {user?.credits || 0}{" "}
                  credits
                  <br />
                  {activeTab === "music" && (
                    <span className="text-sm text-gray-400">
                      💡 Tip: When uploading an audio file, use descriptive
                      prompts like
                      <br />
                      <span className="text-purple-300">
                        {" "}
                        “keep the melody but add strong hip hop drums,
                        percussion, and bassline in the background”
                      </span>{" "}
                      for better results.
                    </span>
                  )}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 border-0"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating {activeTab === "music" ? "Music" : "Lyrics"}...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate {activeTab === "music" ? "Music" : "Lyrics"}
                  </div>
                )}
              </Button>
            </div>
          </div>

          {isGenerating ? (
            <LoadingScreen
              message={activeTab === "music" ? "Music" : "Lyrics"}
            />
          ) : null}

          {/* End for music tab */}

          {(activeTab === "lyrics" && lyricsText) ||
          (activeTab === "music" && currentGeneratedTrack) ? (
            <GeneratedResultContainer
              onLike={handleLike}
              onRegenerate={handleRegenerate}
            >
              {/* show audio player result */}
              {activeTab === "music" && currentGeneratedTrack && (
                <>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Your Generated Track
                  </h3>
                  <AudioPlayer track={currentGeneratedTrack} />
                </>
              )}

              {/* show lyrics result */}
              {activeTab === "lyrics" && lyricsText && (
                <div className="mt-2 p-4 bg-slate-800/30 rounded-lg border border-purple-500/30 text-white whitespace-pre-wrap text-left text-base font-mono leading-relaxed min-h-[150px]">
                  <div className="flex justify-between">
                    <span className="flex items-center text-xl font-semibold text-white mb-4">
                      <ReceiptText className="mr-2" />
                      Your Generated Lyrics
                    </span>
                    <button className="flex items-center" onClick={handleCopy}>
                      <Copy className="mr-2" /> {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <hr className="mb-4" />
                  {animatedLyrics}
                  {typingIndex < lyricsText.length && (
                    <span className="animate-pulse">▍</span>
                  )}
                </div>
              )}
            </GeneratedResultContainer>
          ) : null}

          {/* {(currentGeneratedTrack || lyricsText) && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              {activeTab === "music" && currentGeneratedTrack && (
                <>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Your Generated Track
                  </h3>
                  <AudioPlayer track={currentGeneratedTrack} />
                </>
              )}

              {activeTab === "lyrics" && lyricsText && (
                <div className="mt-2 p-4 bg-slate-800/30 rounded-lg border border-purple-500/30 text-white whitespace-pre-wrap text-left text-base font-mono leading-relaxed min-h-[150px]">
                  <div className="flex justify-between">
                    <span className="flex items-center text-xl font-semibold text-white mb-4">
                      <ReceiptText className="mr-2" />
                      Your Generated Lyrics
                    </span>
                    <button className="flex items-center" onClick={handleCopy}>
                      <Copy className="mr-2" /> {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <hr className="mb-4" />
                  {animatedLyrics}
                  {typingIndex < lyricsText.length && (
                    <span className="animate-pulse">▍</span>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center mt-6">
                <Button
                  onClick={handleLike}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-white"
                >
                  <Heart className="w-4 h-4" />
                  Like & Save
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex items-center gap-2 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                  Regenerate (1 credit)
                </Button>
              </div>
            </div>
          )} */}
        </div>
      </main>

      <CreditsModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
      />
    </div>
  );
};

export default Index;
