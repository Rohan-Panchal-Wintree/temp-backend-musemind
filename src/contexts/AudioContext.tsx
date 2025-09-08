import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { toast } from "sonner";
import axios from "axios";
import { encryptData, importKey } from "@/utils/crypto";
import { updateEncryptedUser } from "@/utils/secureStorage";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AudioContextType {
  generatedAudioURL: string | null;
  lyricsText: string | null;
  isGenerating: boolean;
  generateMusic: (
    prompt: string,
    duration: number,
    file?: File
  ) => Promise<void>;
  generateLyrics: (prompt: string, genre: string) => Promise<string | null>;
}

const AudioGenContext = createContext<AudioContextType | undefined>(undefined);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_GENAI_API_KEY;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [generatedAudioURL, setGeneratedAudioURL] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const { setUser, user, setCurrentGeneratedTrack } = useUser();
  const [lyricsText, setLyricsText] = useState<string | null>(null);

  // Generate audio
  const generateMusic = async (
    prompt: string,
    duration: number,
    file?: File
  ) => {
    if (!prompt || !duration) {
      toast.error("Prompt and duration are required");
      return;
    }

    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("duration", duration.toString());

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        `${BASE_URL}/audio/generate`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { url, downloadUrl, credits, message } = response.data;

      console.log("response for the music", response.data);

      if (!url || credits === undefined) {
        throw new Error("Invalid response from server.");
      }

      setGeneratedAudioURL(url);
      toast.success(message || "Music generated succesfully");

      if (user) {
        const updatedUser = { ...user, credits };
        setUser(updatedUser);

        await updateEncryptedUser(updatedUser);
      }

      if (setCurrentGeneratedTrack) {
        const newTrack = {
          id: `track_${Date.now()}`,
          title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
          url: url,
          downloadUrl: downloadUrl,
          duration: duration,
          dateCreated: new Date().toISOString(),
        };

        setCurrentGeneratedTrack(newTrack);
      }
    } catch (error: any) {
      console.error("Music generation failed:", error);
      toast.error(error?.response?.data?.message || "Failed to generate audio");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLyrics = async (
    prompt: string,
    genre: string
  ): Promise<string | null> => {
    if (!prompt || !genre) {
      toast.error("Please select a genre");
      return null;
    }

    try {
      setIsGenerating(true);

      const ai = new GoogleGenAI({
        apiKey: API_KEY,
      });

      const genreInstruction = genre
        ? `The lyrics should be in the style of ${genre} music.`
        : "";

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a lyrics generator. Only generate creative song lyrics. ${genreInstruction}
          If the prompt is not related to music or lyrics, respond with: "Invalid prompt for lyrics generation."

          Here is the prompt: "${prompt}"`,
              },
            ],
          },
        ],
      });

      const lyrics = response.text;

      setLyricsText(lyrics);

      if (!lyrics || lyrics.toLowerCase().includes("invalid prompt")) {
        toast.error(
          "Invalid lyrics prompt. Please try something song-related."
        );
        return null;
      }

      toast.success("Lyrics Generated succesfully");

      const creditRes = await axios.post(
        `${BASE_URL}/audio/deduct-credits`,
        {},
        { withCredentials: true }
      );

      const { credits } = creditRes.data;

      if (user) {
        const updatedUser = { ...user, credits };
        setUser(updatedUser);
        await updateEncryptedUser(updatedUser);
      }
    } catch (error) {
      console.error("Lyrics generation failed:", error);
      toast.error("error generating lyrics");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AudioGenContext.Provider
      value={{
        generatedAudioURL,
        lyricsText,
        isGenerating,
        generateMusic,
        generateLyrics,
      }}
    >
      {children}
    </AudioGenContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioGenContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
