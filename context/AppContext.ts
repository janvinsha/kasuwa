import React from "react";

interface GlobalContent {
  theme?: boolean;
  changeTheme?: (e: boolean) => void;
  connectWallet?: (e: boolean) => void;
  disconnectWallet?: (e: boolean) => void;
  currentAccount?: string;
  chainId?: string;
  createSeaportOrder?: (e: any) => void;
  createTable?: (e: any) => void;
  updateProfile?: (e: any) => void;
}
const AppContext = React.createContext<GlobalContent>({});

export default AppContext;
