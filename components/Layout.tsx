import React, { useState, useEffect } from "react";
import {
  CreateOrderInput,
  OrderWithCounter,
} from "@opensea/seaport-js/lib/types";
import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";

import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import styled from "styled-components";
import { motion } from "framer-motion";
import Header from "./Header";

import AppContext from "../context/AppContext";
import { GlobalStyle } from "../components";

import { OfferItem, ConsiderationItem } from "types/tokenTypes";
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import { write } from "fs";

interface Props {
  children: any;
}

let providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: "fdd5eb8e3a004c9c9caa5a91a48b92b6",
      chainId: 80001,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Kasuwa",
      infuraId: "fdd5eb8e3a004c9c9caa5a91a48b92b6",
      chainId: 80001,
    },
  },
};
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: true,
    theme: `dark`,
  });
}
const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const tblWallet = new Wallet(privateKey);
const tblProvider = new providers.AlchemyProvider("maticmum", alchemyKey);
const usersTable = "users_80001_361";

const Layout = ({ children }: Props) => {
  console.log(
    process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY,
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    "CHECKING THE ENVS"
  );
  const [theme, setTheme] = useState(true);
  interface Bool {}
  const [currentAccount, setCurrentAccount] = useState();
  const [provider, setProvider] = useState();
  const [chainId, setChainId] = useState();
  const [isMember, setIsMember] = useState(false);
  const [offerItems, setOfferItems] = useState<OfferItem[]>([]);
  const [considerationItems, setConsiderationItems] = useState<
    ConsiderationItem[]
  >([]);
  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme") || "true"));
  }, []);
  const changeTheme = () => {
    setTheme(!theme);
    localStorage.setItem("theme", JSON.stringify(!theme));
  };

  const poll = async () => {
    if (web3Modal.cachedProvider) {
      let wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      setProvider(tProvider);
      const accounts = await tProvider?.listAccounts();
      console.log("CHECKING ACCOUNT ADDRESS", accounts[0]);
      //   console.log('Accounts', accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("Found an authorized account:", account);
        const signer = tProvider.getSigner();
        let chainID = await signer.getChainId();
        setChainId(chainID);
        if (chainID == 80001) {
        } else {
          console.log("Wrong chain ID");
        }
        let eventId = 123;
        const { statusCode } = await axios.get(
          `https://api.poap.tech/actions/scan/${currentAccount}/${eventId}`
        );

        ///This app is only people that have atteneded HackFs hackathon
        setIsMember(statusCode === 200 ? true : false);
      } else {
        console.log("No authorized account found");
      }
    } else {
      setCurrentAccount();
    }
  };

  const connectWallet = async () => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    try {
      const wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);

      setProvider(tProvider);
      const accounts = await tProvider.listAccounts();
      const signer = tProvider.getSigner();
      setCurrentAccount(accounts[0]);
      poll();
    } catch (error) {
      console.log("CONNECT ERROR HERE", error);
    }
  };

  const disconnectWallet = async () => {
    const wallet = await web3Modal.connect();
    web3Modal.clearCachedProvider();
    setCurrentAccount(null);
  };
  useEffect(() => {
    poll();
  }, []);

  interface SeaportOrderProps {
    currentAccount: string;
  }
  const createSeaportOrder = async ({ currentAccount }: SeaportOrderProps) => {
    if (currentAccount) {
      let wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      const seaport = new Seaport(tProvider);
      const orderParams: CreateOrderInput = {
        offer: offerItems.map((item) => item.inputItem),
        consideration: considerationItems.map((item) => item.inputItem),
      };

      const { executeAllActions } = await seaport?.createOrder(
        orderParams,
        currentAccount
      );

      const res = await executeAllActions();
      setOrder(res);
      console.log("order: ", JSON.stringify(res));
      await saveOrder(res);
    }
  };

  const getProfile = async (id) => {
    try {
      // id int, address text, bio text, handle text
      console.log("GETTING PROFILE........");
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const { rows } = await tbl.read(
        `SELECT * FROM ${usersTable} WHERE id = '${id}'`
      );
      console.log(rows);
      return rows;
    } catch (err) {
      console.log(err), "THIS IS THE ERROR";
    }
  };

  const updateProfile = async (profile) => {
    try {
      console.log("UPDATING PROFILE.................");
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const getResponse = await getProfile(profile.id);
      if (!getResponse[0]) {
        console.log("CREATING BECAUSE NO USER FOUND", profile);
        const writeTx = await tbl.write(
          `INSERT INTO ${usersTable} VALUES ('${profile.id}', '${profile.bio}', '${profile.handle}','${profile.dp}','${profile.banner}')`
        );
        console.log(writeTx);
        return writeTx;
      } else {
        console.log("UPDATING BECAUSE USER FOUND", profile);
        const writeTx = await tbl.write(`UPDATE ${usersTable}
        SET Handle='${profile.handle}', Bio='${profile.bio}', Dp='${profile.dp}', Banner='${profile.banner}'
        WHERE id = '${profile.id}'`);
        console.log(writeTx);
        return writeTx;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListings = async () => {};
  const getListing = async () => {};
  const createListings = async () => {};
  const createTable = async () => {
    try {
      console.log("CREATING TABLE ..........");
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      console.log(tbl, "THIS IS THE TBL");
      const { name, txnHash } = await tbl.create(
        `id text,bio text, handle text,dp text, banner text, primary key (id)`, // Table schema definition
        `users` // Optional prefix; used to define a human-readable string
      );

      console.log(name, txnHash, "HERE IS THE RESPONSE");
    } catch (error) {
      console.log(error, "THIS IS THE ERROR           ");
    }
  };
  return (
    <StyledLayout>
      <AppContext.Provider
        value={{
          theme,
          changeTheme,
          connectWallet,
          currentAccount,
          disconnectWallet,
          chainId,
          createSeaportOrder,
          createTable,
          getProfile,
          updateProfile,
        }}
      >
        <GlobalStyle theme={theme} />
        <Header />
        {children}
      </AppContext.Provider>
    </StyledLayout>
  );
};
const StyledLayout = styled(motion.div)``;
export default Layout;

const dummyData = [
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 582,
    },
    name: "Azuki #582",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/1.png",
    token_id: "582",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Azuki",
    symbol: "AZUKI",
  },
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
      identifier: 2294,
    },
    name: "Punk #2294",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/10.png",
    token_id: "326",
    address: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
    collectionName: "CryptoPunks",
    symbol: "PUNK",
  },
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 68,
    },
    name: "Doodle #68",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/2.png",
    token_id: "68",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Doodles",
    symbol: "DOODLE",
  },
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 1478,
    },
    name: "MAYC #1478",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/21.png",
    token_id: "1478",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Mutant Ape Yacht Club",
    symbol: "MAYC",
  },
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 2938,
    },
    name: "Azuki #2938",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/8.jpg",
    token_id: "2938",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Azuki",
    symbol: "AZUKI",
  },

  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
      identifier: 24,
    },
    name: "Punk #24",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/9.png",
    token_id: "24",
    address: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
    collectionName: "CryptoPunks",
    symbol: "PUNK",
  },

  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 8482,
    },
    name: "Doodle #8482",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/7.png",
    token_id: "8482",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Doodles",
    symbol: "DOODLE",
  },

  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
      identifier: 3859,
    },
    name: "Punk #3859",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/22.png",
    token_id: "3859",
    address: "0xfc3e0d0c54a7b7ea9c5bb976a46dcdbdade7cd3e",
    collectionName: "CryptoPunks",
    symbol: "PUNK",
  },

  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 13,
    },
    name: "Azuki #13",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/17.jpg",
    token_id: "13",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Azuki",
    symbol: "AZUKI",
  },
  {
    inputItem: {
      itemType: ItemType.ERC721,
      token: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
      identifier: 2084,
    },
    name: "Doodles #2084",
    image_url:
      "https://gateway.pinata.cloud/ipfs/QmfDVMnhvkULBUszfb8nVq6uRRPzafVymzJqUsqqSAH4DQ/5.png",
    token_id: "2084",
    address: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    collectionName: "Doodles",
    symbol: "DOODLE",
  },
];
