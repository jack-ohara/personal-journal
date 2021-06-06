import { User } from "gotrue-js";
import { getGoTrue } from "./go-true";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContext = {
  user: User | null;
  login: (emailAddress: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  acceptInvite: (inviteToken: string, password: string) => Promise<boolean>;
  selectedEntry: string | undefined;
  setSelectedEntry: Dispatch<SetStateAction<string | undefined>>;
  navIsDisplayed: boolean;
  setNavIsDisplayed: Dispatch<SetStateAction<boolean>>;
};

const defaultContext: AppContext = {
  user: null,
  login: () => new Promise(() => {}),
  logout: () => new Promise(() => {}),
  acceptInvite: () => new Promise(() => {}),
  selectedEntry: undefined,
  setSelectedEntry: () => {},
  navIsDisplayed: false,
  setNavIsDisplayed: () => {},
};

const AppContext = createContext(defaultContext);

interface Props {
  children: ReactNode;
}

export function AppWrapper({ children }: Props) {
  const auth = getGoTrue();

  const [user, setUser] = useState(auth.currentUser());
  const [selectedEntry, setSelectedEntry] = useState<string | undefined>();
  const [navIsDisplayed, setNavIsDisplayed] = useState(false);

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

  const acceptInvite = async (inviteToken: string, password: string) => {
    const user = await auth.acceptInvite(inviteToken, password, true);

    setUser(user);

    return Boolean(user);
  };

  const initialState = {
    user,
    login,
    logout,
    acceptInvite,
    selectedEntry,
    setSelectedEntry,
    navIsDisplayed,
    setNavIsDisplayed,
  };

  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
