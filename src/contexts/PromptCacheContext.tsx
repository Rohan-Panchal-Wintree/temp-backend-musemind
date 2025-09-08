import React, { createContext, useContext, useState } from "react";

type PromptCache = {
  musicPrompt: string;
  lyricsPrompt: string;
  setMusicPrompt: (value: string) => void;
  setLyricsPrompt: (value: string) => void;
};

const PromptCacheContext = createContext<PromptCache | undefined>(undefined);

export const PromptCacheProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [musicPrompt, setMusicPrompt] = useState("");
  const [lyricsPrompt, setLyricsPrompt] = useState("");

  return (
    <PromptCacheContext.Provider
      value={{ musicPrompt, lyricsPrompt, setMusicPrompt, setLyricsPrompt }}
    >
      {children}
    </PromptCacheContext.Provider>
  );
};

export const usePromptCache = (): PromptCache => {
  const context = useContext(PromptCacheContext);

  if (!context) {
    throw new Error("usePromptCache must be used within a PromptCacheProvider");
  }

  return context;
};
