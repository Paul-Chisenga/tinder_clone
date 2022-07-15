import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  singInWithGoogle: () => void;
  logout: () => void;
};

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  error: null,
  singInWithGoogle: () => {},
  logout: () => {},
});

export const AuthProdider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // With Firebase
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "880828964301-msg1on9j8okqpfv83adsvgqhug13sqqs.apps.googleusercontent.com",
  });

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const singInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await promptAsync();
    } catch (error: any) {
      setError(error.message);
      console.log("ERROR DURING PROMPT : ", error.message);
    } finally {
      setLoading(false);
    }
  }, [promptAsync]);

  const signInWithFirebase = useCallback(async () => {
    try {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      } else {
        console.log(response?.type);
        throw new Error("Login failed");
      }
    } catch (error: any) {
      setError(error.message);
      console.log("ERROR WHILE SIGNING IN : ", error.message);
    }
  }, [response]);

  useEffect(() => {
    if (response) {
      signInWithFirebase();
    }
  }, [response, signInWithFirebase]);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setInitialLoading(false);
      }),
    []
  );

  const memoisedValues = useMemo(
    () => ({
      user: user,
      loading,
      error,
      singInWithGoogle,
      logout,
    }),
    [user, loading, error]
  );

  // Providers
  // const [accessToken, setAccessToken] = useState<string | null>(null);
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId:
  //     "880828964301-hsnqsskfsfgrjmaq94f9e7li8tgvmf1t.apps.googleusercontent.com",
  //   // iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
  //   // androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
  //   // webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
  // });

  // const singInWithGoogle = async () => {
  //   promptAsync();
  // };

  // const getUserData = useCallback(async () => {
  //   try {
  //     const userInfo = await fetch(
  //       "https://www.googleapis.com/oauth2/v3/userinfo",
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       }
  //     );
  //     if (userInfo.status !== 200) {
  //       console.log("FAILED : ", userInfo.status);
  //     } else {
  //       const data = await userInfo.json();
  //       console.log("DATA : ", data);
  //       setUser(data);
  //     }
  //   } catch (error) {
  //     console.log("ERROR OCCUERERD : ", error);
  //   }
  // }, [accessToken]);

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { authentication } = response;
  //     console.log("success");
  //     setAccessToken(authentication?.accessToken as string);
  //   } else {
  //     console.log("Failed");
  //   }
  // }, [response]);

  // useEffect(() => {
  //   if (accessToken) {
  //     getUserData();
  //   }
  // }, [accessToken, getUserData]);

  return (
    <AuthContext.Provider value={memoisedValues}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
