import { getLocalStorageItem } from "common/utils/localStorage";
import { getSessionStorageItem } from "common/utils/sessionStorage";
import React, { createContext, useState } from "react";

interface State {
  idToken: string;
}

interface Context {
  idToken: string;
  setIdToken: (idToken: string) => void;
}

export const UserContext = createContext({} as Context);

interface Props {
  children: React.ReactNode;
}

export const UserContextProdiver = ({ children }: Props) => {
  const [idToken, setIdToken] = useState(getLocalStorageItem("idToken") || getSessionStorageItem("idToken") || "");

  return (
    <UserContext.Provider
      value={{
        idToken,
        setIdToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
