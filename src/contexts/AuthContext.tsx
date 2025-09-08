import { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import axios from "../api/axiosConfig";
import { toast } from "sonner";
import { encryptData, importKey } from "@/utils/crypto";
import { useUser } from "./UserContext";
import { updateEncryptedUser } from "@/utils/secureStorage";
import { useNavigate } from "react-router-dom";
import { rejects } from "assert";
import api from "@/utils/api";

// ---------- Types ----------
interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  signup: (
    formData: SignupData,
    navigate: (path: string) => void
  ) => Promise<void>;
  login: (
    formData: LoginData,
    navigate: (path: string) => void
  ) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- Context ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider ----------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, setSavedTracks } = useUser();
  // const navigate = useNavigate();

  const isLoggedInRef = useRef(!!user);
  useEffect(() => {
    isLoggedInRef.current = !!user;
  }, [user]);

  // ----- Refresh orchestration -----
  const isRefreshingRef = useRef(false);
  const refreshPromiseRef = useRef<Promise<any> | null>(null);
  const subscribersRef = useRef<Array<(ok: boolean) => void>>([]);

  const notifySubscribers = (ok: boolean) => {
    subscribersRef.current.forEach((cb) => {
      try {
        cb(ok);
      } catch {}
    });
    subscribersRef.current = [];
  };

  const enqueueSubscriber = (cb: (ok: boolean) => void) => {
    subscribersRef.current.push(cb);
  };

  const atemptRefresh = () => {
    if (!refreshPromiseRef.current) {
      console.log("refresh token function ran");
      refreshPromiseRef.current = api.post(`/auth/refresh`).finally(() => {
        refreshPromiseRef.current = null;
      });
    }
    return refreshPromiseRef.current;
  };

  // ----- Axios response interceptor: auto-refresh & retry -----
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;
        const url = String(error?.config?.url || "");
        const msg = String(
          error?.response?.data?.message || error?.message || ""
        );
        const originalRequest = error?.config || {};

        const isAuthEndpoint = /\/auth\/(login|signup|logout|refresh)$/i.test(
          url
        );
        const expiredStatus =
          status === 401 || status === 419 || status === 440;
        const expiredMsg =
          /expired|jwt.*expired|invalid token|unauthori[sz]ed/i.test(msg);

        // If not a candidate for refresh, or no user, or it's an auth endpoint → just reject
        if (!expiredStatus && !expiredMsg) {
          return Promise.reject(error);
        }
        if (isAuthEndpoint || !isLoggedInRef.current) {
          return Promise.reject(error);
        }

        // Prevent infinite retry loops per request
        (originalRequest as any)._retry =
          (originalRequest as any)._retry ?? false;
        if ((originalRequest as any)._retry) {
          // Already retried once and still failing -> inline forced logout
          try {
            setUser(null);
            setSavedTracks([]);
            localStorage.removeItem("user_encrypted");
            localStorage.removeItem("user_iv");
          } finally {
            toast.error("Your session has expired. Please log in again.");
            window.location.replace("/login");
          }
          return Promise.reject(error);
        }

        // Mark this request as a retry candidate
        (originalRequest as any)._retry = true;

        // If a refresh is already in progress, wait for it, then retry or logout
        if (isRefreshingRef.current) {
          return new Promise((resolve, reject) => {
            enqueueSubscriber((ok) => {
              if (ok) resolve(axios(originalRequest));
              else {
                try {
                  // inline forced logout
                  setUser(null);
                  setSavedTracks([]);
                  localStorage.removeItem("user_encrypted");
                  localStorage.removeItem("user_iv");
                } finally {
                  toast.error("Your session has expired. Please log in again.");
                  window.location.replace("/login");
                }
                reject(error);
              }
            });
          });
        }

        // Start a new refresh
        isRefreshingRef.current = true;

        try {
          console.log("requested for a new token");
          await atemptRefresh();
          isRefreshingRef.current = false;
          notifySubscribers(true);

          await new Promise((res) => setTimeout(res, 100));

          // Retry the original request with the new access token (cookie)
          return axios(originalRequest);
        } catch (refreshErr) {
          isRefreshingRef.current = false;
          notifySubscribers(false);
          // inline forced logout
          try {
            setUser(null);
            setSavedTracks([]);
            localStorage.removeItem("user_encrypted");
            localStorage.removeItem("user_iv");
          } finally {
            toast.error("Your session has expired. Please log in again.");
            window.location.replace("/login");
          }
          return Promise.reject(refreshErr);
        }
      }
    );

    return () => axios.interceptors.response.eject(id);
  }, [setSavedTracks, setUser]);

  // ---------- Actions ----------
  const signup = async (
    formData: SignupData,
    navigate: (path: string) => void
  ) => {
    try {
      console.log("formdata from the context for signup", formData);
      const response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
        withCredentials: true,
      });
      const userData = response.data.user;
      const transformedUser = {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        credits: userData.credits,
        createdAt: userData.createdAt,
      };
      // console.log("response", response.data);

      await updateEncryptedUser(transformedUser);

      setUser(transformedUser);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup Failed");
      throw error;
    }
  };

  const login = async (
    formData: LoginData,
    navigate: (path: string) => void
  ) => {
    try {
      // console.log("formdata from the context for login", formData);
      const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      const userData = response.data.user;
      const transformedUser = {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        credits: userData.credits,
        createdAt: userData.createdAt,
      };
      console.log("response", response.data);

      await updateEncryptedUser(transformedUser);

      setUser(transformedUser);

      toast.success(response.data.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login Failed");
      throw error;
    }
  };

  const logout = async (navigate: (path: string) => void) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      setSavedTracks([]);
      localStorage.removeItem("user_encrypted");
      localStorage.removeItem("user_iv");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------- Hook ----------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
