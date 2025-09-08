import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptData, importKey } from "@/utils/crypto";
import axios from "@/api/axiosConfig";
import { updateEncryptedUser } from "@/utils/secureStorage";
import { toast } from "sonner";
import api from "@/utils/api";

// ---------- Types ----------
interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  createdAt: string;
}

interface SavedTrack {
  id: string;
  title: string;
  url: string;
  downloadUrl: string;
  duration: number;
  dateCreated: string;
}

interface SavedLyric {
  id: string;
  title: string;
  url: string;
  downloadUrl: string;
  dateCreated: string;
}

interface UserContextType {
  user: User | null;
  savedTracks: SavedTrack[];
  savedLyrics: SavedLyric[];
  currentGeneratedTrack: SavedTrack | null;
  isLoggedIn: boolean;
  isLoadingUserData: boolean;
  addCredits: (amount: number) => void;
  saveTrack: (track: SavedTrack) => void;
  saveLyric: (item: {
    id: string;
    title: string;
    content: string;
    dateCreated: string;
  }) => Promise<void>;
  removeTrack: (trackId: string) => void;
  removeLyric: (lyricId: string) => Promise<void>;
  updateUsername: (newName: string) => Promise<void>;
  setCurrentGeneratedTrack: (track: SavedTrack | null) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSavedTracks: React.Dispatch<React.SetStateAction<SavedTrack[]>>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- Context ----------
const UserContext = createContext<UserContextType | undefined>(undefined);

// ---------- Provider ----------
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [currentGeneratedTrack, setCurrentGeneratedTrack] =
    useState<SavedTrack | null>(null);
  const [savedLyrics, setSavedLyrics] = useState<SavedLyric[]>([]);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // -------- Load Encrypted User on Mount --------
  useEffect(() => {
    const loadUserFromEncryptedStorage = async () => {
      const encrypted = localStorage.getItem("user_encrypted");
      const iv = localStorage.getItem("user_iv");

      if (encrypted && iv) {
        try {
          const key = await importKey();
          const userData = await decryptData(encrypted, iv, key);

          setUser(userData);
        } catch (error) {
          console.error("Decryption error:", error);
          setUser(null);
        }
      }
    };
    loadUserFromEncryptedStorage();
  }, []);

  // -------- Load Saved Tracks and Current Track on Mount --------
  useEffect(() => {
    const savedTracksData = localStorage.getItem("musemind_tracks");
    const savedCurrentTrack = localStorage.getItem("musemind_current_track");

    if (savedTracksData) {
      setSavedTracks(JSON.parse(savedTracksData));
    }
    if (savedCurrentTrack) {
      setCurrentGeneratedTrack(JSON.parse(savedCurrentTrack));
    }
  }, []);

  // -------- Persist Current Generated Track --------
  useEffect(() => {
    if (currentGeneratedTrack) {
      localStorage.setItem(
        "musemind_current_track",
        JSON.stringify(currentGeneratedTrack)
      );
    } else {
      localStorage.removeItem("musemind_current_track");
    }
  }, [currentGeneratedTrack]);

  // -------- Core Functions --------

  const addCredits = (amount: number) => {
    setUser((prev) =>
      prev ? { ...prev, credits: prev.credits + amount } : null
    );
  };

  // Save the tracks in the backend
  const saveTrack = async (track: SavedTrack) => {
    try {
      // Optimistic update
      setSavedTracks((prev) =>
        prev.some((t) => t.id === track.id) ? prev : [track, ...prev]
      );

      const { data } = await axios.post(
        `${BASE_URL}/savedTracks`,
        track, // sends all: id, title, url, downloadUrl, duration, dateCreated
        { withCredentials: true }
      );
      if (data?.tracks) setSavedTracks(data.tracks);
      toast.success("Track saved to your saved list! ❤️");
    } catch (err: any) {
      console.error("Failed to save track", err?.response?.data || err.message);
      toast.error("Failed to save track");
      // Rollback on error
      setSavedTracks((prev) => prev.filter((t) => t.id !== track.id));
    }
  };

  // Save the lyrics in the backend
  const saveLyric = async ({
    id,
    title,
    content,
    dateCreated,
  }: {
    id: string;
    title: string;
    content: string;
    dateCreated: string;
  }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/lyrics`,
        {
          id,
          title,
          content,
          dateCreated: dateCreated || new Date().toISOString(),
        },
        { withCredentials: true }
      );
      if (data?.lyrics) setSavedLyrics(data.lyrics);
      toast.success("Lyrics saved to your saved list! ❤️");
    } catch (err) {
      console.error("Failed to save Lyric", err?.response?.data || err.message);
      toast.error("Failed to save lyric");
    }
  };

  // Remove a saved track from backend
  const removeTrack = async (trackId: string) => {
    const snapshot = savedTracks;

    try {
      // Optimistic remove
      setSavedTracks((prev) => prev.filter((t) => t.id !== trackId));

      const { data } = await axios.delete(
        `${BASE_URL}/savedTracks/${trackId}`,
        {
          withCredentials: true,
        }
      );

      if (data?.tracks) setSavedTracks(data.tracks);
      toast.success("Track removed from your saved list");
    } catch (err: any) {
      console.error(
        "Failed to remove track",
        err?.response?.data || err.message
      );
      toast.error("Failed to remove track");
      // Rollback
      setSavedTracks(snapshot);
    }
  };

  // Remove a saved lyric from backend
  const removeLyric = async (lyricId: string) => {
    const snapshot = savedLyrics;
    try {
      setSavedLyrics((prev) => prev.filter((l) => l.id !== lyricId));

      const { data } = await axios.delete(`${BASE_URL}/lyrics/${lyricId}`, {
        withCredentials: true,
      });
      if (data?.lyrics) setSavedLyrics(data.lyrics);
      toast.success("Lyric removed from your saved list");
    } catch (err) {
      console.error(
        "Failed to remove lyric",
        err?.response?.data || err.message
      );
      toast.error("Failed to remove lyric");
    }
  };

  const updateUsername = async (newName: string) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/update-name`,
        { name: newName },
        { withCredentials: true }
      );

      const updatedUser = {
        ...user,
        name: response.data.name,
      };

      setUser(updatedUser);
      await updateEncryptedUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error(
        "Failed to update username",
        error?.response?.data || error.message
      );
      toast.error(`${error?.response?.data?.message}`);
    }
  };

  // Load saved tracks on login
  useEffect(() => {
    if (!user) return;

    const fetchSavedTracks = async () => {
      try {
        setIsLoadingUserData(true);
        const { data } = await api.get(`/savedTracks`);
        setSavedTracks(data?.tracks || []);
      } catch (error: any) {
        console.error(
          "Failed to fetch saved tracks",
          error?.response?.data || error.message
        );
      } finally {
        setIsLoadingUserData(false);
      }
    };

    const fetchSavedLyrics = async () => {
      try {
        setIsLoadingUserData(true);
        const { data } = await api.get(`/lyrics`);
        setSavedLyrics(data?.lyrics || []);
      } catch (err: any) {
        console.error(
          "Failed to Load Lyrics",
          err?.response?.data || err.message
        );
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchSavedTracks();
    fetchSavedLyrics();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        savedTracks,
        savedLyrics,
        currentGeneratedTrack,
        isLoggedIn: !!user,
        isLoadingUserData,
        addCredits,
        saveTrack,
        saveLyric,
        removeTrack,
        removeLyric,
        updateUsername,
        setCurrentGeneratedTrack,
        setUser,
        setSavedTracks,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ---------- Hook ----------
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
