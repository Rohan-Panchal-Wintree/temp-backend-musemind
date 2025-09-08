import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { AudioProvider } from "./AudioContext";
import { PromptCacheProvider } from "./PromptCacheContext";
import { CurrencyProvider } from "./CurrencyContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <AudioProvider>
          <PromptCacheProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </PromptCacheProvider>
        </AudioProvider>
      </AuthProvider>
    </UserProvider>
  );
};

export default AppProvider;
