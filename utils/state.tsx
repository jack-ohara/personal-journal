import GoTrue, { User } from "gotrue-js";
import { createContext, ReactNode, useContext, useState } from "react";
import { getGoTrue } from "./go-true";

type AppContext = {
  user: User | null;
  login: (emailAddress: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const defaultContext: AppContext = {
  user: null,
  login: () => new Promise(() => {}),
  logout: () => new Promise(() => {}),
};

const AppContext = createContext(defaultContext);

interface Props {
  children: ReactNode;
}

export function AppWrapper({ children }: Props) {
  const auth = getGoTrue();
  const [user, setUser] = useState(auth.currentUser());

  const login = async (
    emailAddress: string,
    password: string
  ): Promise<boolean> => {
    const user = await auth.login(emailAddress, password, true);

    setUser(user);

    return Boolean(user);
  };

  const logout = async () => {
    await user?.logout();
  };

  const initialState = {
    user,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
