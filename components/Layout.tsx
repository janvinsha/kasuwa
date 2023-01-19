import React, { useState, useEffect } from "react";
import { CreateOrderInput, Fulfillment } from "@opensea/seaport-js/lib/types";
import { Seaport } from "@opensea/seaport-js";

import { ethers } from "ethers";
import axios from "axios";

import Web3Modal from "@0xsequence/web3modal";

const UAuthWeb3Modal = require("@uauth/web3modal");

import UAuthSPA from "@uauth/js";
import { Database } from "@tableland/sdk";
import { sequence } from "0xsequence";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import styled from "styled-components";
import { motion } from "framer-motion";
import Header from "./Header";

import AppContext from "../context/AppContext";
import { GlobalStyle } from "../components";

import {
  OfferItem,
  ConsiderationItem,
  OrderWithMetadata,
} from "types/tokenTypes";
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";

import { v4 as uuid } from "uuid";
import notify from "../hooks/notification";
import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
interface Props {
  children: any;
}

const uauthOptions: UAuthWeb3Modal.IUAuthOptions = {
  clientID: "d14e4742-45ab-409c-a538-61928156ddba",
  redirectUri: "https://kasuwa-hackfs.vercel.app",
  scope: "openid wallet",
};

let web3Modal;

if (typeof window != "undefined") {
  // let connector = UAuthWeb3Modal.connector;
  let providerOptions = {
    "custom-uauth": {
      display: UAuthWeb3Modal.display,

      connector: UAuthWeb3Modal?.connector,

      package: UAuthSPA,

      options: uauthOptions,
    },
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
    sequence: {
      package: sequence,
      options: {
        appName: "Kasuwa",
        defaultNetwork: "",
        chainId: 80001,
      },
    },
  };
  web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: true,
    theme: `dark`,
  });
  UAuthWeb3Modal?.registerWeb3Modal(web3Modal);
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
    offerer?: any;
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

        let offers = await client.add(JSON.stringify(offerItems));
        let considerations = await client.add(
          JSON.stringify(considerationItems)
        );
        let orderJson = await client.add(JSON.stringify(res));
        console.log(
          "HERE SRE THE IPFS LINKS",
          offers,
          considerations,
          orderJson
        );
        const orderToSave: OrderWithMetadata = {
          id: unique_id.toString(),
          orderJson: `https://kasuwa.infura-ipfs.io/ipfs/${orderJson.path}`,
          offers: `https://kasuwa.infura-ipfs.io/ipfs/${offers.path}`,
          considerations: `https://kasuwa.infura-ipfs.io/ipfs/${considerations.path}`,
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
  const fulfillSeaportOrder = async (order) => {
    try {
      let wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      const seaport = new Seaport(tProvider);
      let transactionHash: string;

      const { executeAllActions } = await seaport.fulfillOrder({
        order: order,
        accountAddress: currentAccount,
      });

      const transaction = await executeAllActions();
      transactionHash = transaction.hash;
      notify({ title: "Order fulfilled successfully", type: "success" });
      return transactionHash;
    } catch (err) {
      console.log(err);
      if (err?.method == "balanceOf(address)") {
        notify({
          title: "You do not have the necessary requirements to fulfill order",
          type: "error",
        });
      } else {
        notify({ title: "Error fulfilling order", type: "error" });
      }
    }
  };

  const getProfile = async (id) => {
    try {
      const db = Database.readOnly("maticmum"); // Polygon Mumbai testnet
      // id int, address text, bio text, handle text
      console.log("GETTING PROFILE........");
      const { results } = await db
        .prepare(`SELECT * FROM ${usersTable} WHERE id = '${id}'`)
        .all();
      console.log("WHAT IS THE GETPROFILE RETURNING", results);
      return results;
    } catch (err) {
      console.log(err), "THIS IS THE ERROR";
    }
  };

  const updateProfile = async (profile) => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const db = new Database({ signer });
      console.log("UPDATING PROFILE.................");

      const getResponse = await getProfile(profile.id);
      if (!getResponse[0]) {
        console.log("CREATING BECAUSE NO USER FOUND", profile);
        const { meta: insert } = await db
          .prepare(
            `INSERT INTO ${usersTable} (id, bio, handle, dp, banner) VALUES (?, ?, ?, ?, ?);`
          )
          .bind(
            profile.id,
            profile.bio,
            profile.handle,
            profile.dp,
            profile.banner
          )
          .run();
        await insert?.txn?.wait();
      } else {
        console.log("UPDATING BECAUSE USER FOUND", profile);
        const { meta: update } = await db
          .prepare(
            `UPDATE 
            ${usersTable} SET bio = ?2, handle = ?3, dp = ?4, banner = 5? WHERE id = ?1'`
          )
          .bind(
            profile.id,
            profile.bio,
            profile.handle,
            profile.dp,
            profile.banner
          )
          .run();

        await update?.txn?.wait();
      }
      const { results } = await db
        .prepare(`SELECT * FROM ${usersTable};`)
        .all();
      notify({ title: "Profile edited successfully", type: "success" });
      return results;
    } catch (error) {
      console.log(error);
    }
  };

  const getListings = async () => {
    try {
      const db = Database.readOnly("maticmum"); // Polygon Mumbai testnet

      const { results } = await db
        .prepare(`SELECT * FROM ${listingsTable};`)
        .all();
      console.log(results);

      return results;
    } catch (err) {
      console.log(err);
    }
  };
  const getListing = async (id) => {
    try {
      const db = Database.readOnly("maticmum"); // Polygon Mumbai testnet

      const { results } = await db
        .prepare(`SELECT * FROM ${listingsTable} WHERE id = '${id}'`)
        .all();
      console.log(results);

      return results;
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
        `id text, name text,image text,owner text,decription text, price text, startDate text,endDate text, primary key (id)`, // Table schema definition
        `collections` // Optional prefix; used to define a human-readable string
      );
      // const { name, txnHash } = await tbl.create(
      //   `id text,bio text, handle text,dp text, banner text, primary key (id)`, // Table schema definition
      //   `users` // Optional prefix; used to define a human-readable string
      // );

      console.log(name, txnHash, "HERE IS THE RESPONSE");
    } catch (error) {
      console.log(error, "THIS IS THE ERROR ");
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
