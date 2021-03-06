import React, { useState, useEffect } from "react";
import { CreateOrderInput } from "@opensea/seaport-js/lib/types";
import { Seaport } from "@opensea/seaport-js";

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

import { v4 as uuid } from "uuid";
import notify from "../hooks/notification";

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
const listingsTable = "orderListings_80001_665";
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
    orderParams: any;
    offerItems: any;
    considerationItems: any;
  }
  const createSeaportOrder = async ({
    offerItems,
    considerationItems,
  }: SeaportOrderProps) => {
    try {
      if (currentAccount) {
        let wallet = await web3Modal.connect();
        const tProvider = new ethers.providers.Web3Provider(wallet);
        const seaport = new Seaport(tProvider);

        const orderParams: CreateOrderInput = {
          offer: offerItems?.map((item) => item?.inputItem),
          consideration: considerationItems?.map((item) => item?.inputItem),
          endTime: undefined,
        };

        const { executeAllActions } = await seaport?.createOrder(
          orderParams,
          currentAccount
        );

        const res = await executeAllActions();

        console.log("order: ", JSON.stringify(res));
        const unique_id = uuid();
        const orderToSave: OrderWithMetadata = {
          id: unique_id.toString(),
          orderJson: JSON.stringify(res),
          offers: JSON.stringify(offerItems),
          considerations: JSON.stringify(considerationItems),
        };
        console.log("HERE IS THE ORDER TO SAVE", orderToSave);
        createListings(orderToSave);

        notify({ title: "Order created successfully", type: "success" });
      }
    } catch (e) {
      notify({ title: "Error creating order", type: "error" });
      console.log(e);
    }
  };
  const fulfillSeaportOrder = async ({
    offerItems,
    considerationItems,
  }: SeaportOrderProps) => {
    try {
      let wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      const seaport = new Seaport(tProvider);
      let transactionHash: string;
      const orderParams: CreateOrderInput = {
        offer: offerItems?.map((item) => item?.inputItem),
        consideration: considerationItems?.map((item) => item?.inputItem),
      };
      const { executeAllActions } = await seaport.fulfillOrder({
        order: orderParams,
        accountAddress: currentAccount,
      });
      const transaction = await executeAllActions();
      transactionHash = transaction.hash;
      notify({ title: "Order fulfilled successfully", type: "success" });
      return transactionHash;
    } catch (err) {
      console.log(err);
      notify({ title: "Error fulfilling order", type: "error" });
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

  const getListings = async () => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const { rows } = await tbl.read(`SELECT * FROM ${listingsTable}`);
      console.log(rows);
      return rows;
    } catch (err) {
      console.log(err);
    }
  };
  const getListing = async (id) => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const { rows } = await tbl.read(
        `SELECT * FROM ${listingsTable} WHERE id = '${id}'`
      );
      console.log(rows);
      return rows;
    } catch (err) {
      console.log(err);
    }
  };
  const createListings = async (listing) => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const writeTx = await tbl.write(
        `INSERT INTO ${listingsTable} VALUES ('${listing.id}', '${listing.orderJson}', '${listing.offers}','${listing.considerations}')`
      );
      console.log(writeTx);
    } catch (err) {
      console.log(err);
    }
  };
  const createTable = async () => {
    try {
      console.log("CREATING TABLE ..........");
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      console.log(tbl, "THIS IS THE TBL");
      const { name, txnHash } = await tbl.create(
        `id text, orderJson text, offers text,considerations text,primary key (id)`, // Table schema definition
        `orderListings` // Optional prefix; used to define a human-readable string
      );
      // const { name, txnHash } = await tbl.create(
      //   `id text,bio text, handle text,dp text, banner text, primary key (id)`, // Table schema definition
      //   `users` // Optional prefix; used to define a human-readable string
      // );

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
          getListings,
          getListing,
          fulfillSeaportOrder,
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
