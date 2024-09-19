import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userId: number | null;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
