import { useState, useEffect, useContext } from "react";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

// import protons from 'protons';
import protobuf from "protobufjs";

import ScrollContainer from "react-indiana-drag-scroll";
import { motion } from "framer-motion";
import styled from "styled-components";

import { NftCard } from "../../components";
import AppContext from "../../context/AppContext";

import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function ListingDetails() {
  const router = useRouter();
  const { pathname } = router;
  const { id: nftId } = router.query;

  const [loading, setLoading] = useState(false);
  const { theme, buyingNft, buyNft, currentAccount } = useContext(AppContext);
  const [share, setShare] = useState(false);
  const [text, setText] = useState("");
  const tabs = ["Description", "History"];
  const [activeTab, setActiveTab] = useState("Description");
  let comments = [];
  let nft = { tokenId: 1 };
  let COVALENT_KEY = "ckey_9ebee12fd55e4e05b33496e5c7e";

  let [nftData, setNftData] = useState();
  let data;
  const getData = async () => {
    try {
      data = await axios.get(
        `https://api.covalenthq.com/v1/80001/tokens/0xBaFDdDCd96e18Bedd401f781c4020E8677898828/nft_transactions/${nft.tokenId}/?quote-currency=USD&format=JSON&key=ckey_9ebee12fd55e4e05b33496e5c7e`
      );
      setNftData(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  let history = nftData?.data?.data?.items[0]?.nft_transactions;

  let userProfile = {};
  return (
    <StyledListingDetails theme_={theme}>
      {/* <Loader visible={buyingNft} /> */}
      <div className="desc">
        <div className="left">
          <img src={"/images/swing.jpeg"} alt="img" />
        </div>

        <div className="right">
          <h2>Encode (2022)</h2>
          <span className="author">
            <img src={userProfile?.dp || "/images/swing.jpeg"} alt="img" />{" "}
            <Link href={`/profile/${userProfile?.id}`}>
              {userProfile?.name || "Comrade"}
            </Link>
          </span>
          <span className="tabs">
            {tabs.map((tab, index) => (
              <span
                className={`tab ${activeTab === tab && "active"}`}
                key="index"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <div className="line"></div>
              </span>
            ))}
          </span>

          <div>
            {activeTab == "Description" ? (
              <div className="descr">
                <p>Build the future of Finance</p>
                <span className="price">
                  <span>Price</span>
                  <h2>1 ETH</h2>
                </span>

                <div className="buy">
                  <button onClick={() => buyNft(nft?.tokenId)}>Buy NFT</button>
                </div>
              </div>
            ) : activeTab == "History" ? (
              <ScrollContainer className="historys">
                {history &&
                  history?.map((transaction, index) => (
                    <div className="history" key={index}>
                      <span className="title">
                        Transaction {history?.length - index}
                      </span>
                      <span className="row">
                        <h4>Txn Hash</h4>
                        <h4>{transaction?.tx_hash?.slice(0, 33)}</h4>
                        <h4>{transaction?.tx_hash?.slice(33)}</h4>
                      </span>
                      <span className="row">
                        <h4>From:</h4> <h4> {transaction?.from_address}</h4>
                      </span>
                      <span className="row">
                        <h4>To:</h4> <h4> {transaction?.to_address}</h4>
                      </span>
                      <span className="row">
                        <h4>Token ID:</h4>
                        <h4>{nft.tokenId}</h4>
                      </span>
                      <span className="row">
                        <h4>Token:</h4>
                        <h4>UTT</h4>
                      </span>
                    </div>
                  ))}
              </ScrollContainer>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </StyledListingDetails>
  );
}
const StyledListingDetails = styled(motion.div)<{ theme_: boolean }>`
  min-height: 81vh;
  display: flex;
  flex-flow: column wrap;

  padding: 4rem 8rem;
  gap: 1.5rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 0rem;
  }

  .author {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
  .comments {
    width: 50%;
    display: flex;
    flex-flow: column wrap;
    border-radius: 0.5rem;
    display: flex;
    flex-flow: column wrap;
    font-size: 1.2rem;
    overflow: hidden;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    @media screen and (max-width: 900px) {
      border-radius: 0rem;
      width: 100%;
    }
  }
  .tabs {
    display: flex;
    flex-flow: row wrap;
    gap: 1rem;
    width: 100%;
    .tab {
      padding: 0rem 1.2rem;
      padding-top: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;
      background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
      -moz-box-shadow: 0 0 4.5px #ccc;
      -webkit-box-shadow: 0 0 4.5px #ccc;
      box-shadow: 0 0 4.5px #ccc;
      border-radius: 2rem;
      &:hover {
        color: gray;
      }
      .line {
        margin-top: 0.5rem;
        padding: 2px;
        background: inherit;
        border-radius: 3rem 3rem 0px 0px;
      }
      &.active {
        color: ${({ theme_ }) => (theme_ ? "black" : "white")};
        background: ${({ theme_ }) => (theme_ ? "#ffffff" : "#16161A")};
      }
    }
  }
  .desc {
    display: flex;
    flex-flow: row wrap;
    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 0rem 1rem;
      gap: 1rem;
    }
    .left {
      width: 50%;
      @media screen and (max-width: 900px) {
        width: 100%;
        height: 100%;
        padding-right: 0rem;
      }
      padding-right: 2rem;

      img {
        width: 100%;
        height: auto;

        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
    .right {
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      width: 50%;
      display: flex;
      flex-flow: column wrap;

      padding: 2rem 4rem;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        padding: 0rem 0rem;
      }
      .descr {
        display: flex;
        flex-flow: column wrap;

        @media screen and (max-width: 900px) {
          width: 100%;
        }
        .price {
          display: flex;
          flex-flow: column wrap;
          padding: 0.4rem 0rem;
          gap: 0.3rem;
          span {
            font-size: 1.4rem;
          }
          h2 {
            color: #0592ec;
            font-size: 1.2rem;
          }
          a {
            font-size: 1.2rem;
            color: #0592ec;
          }
        }
        .buy {
          padding: 0.5rem 0rem;
        }
        .interact {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 0rem;
        }
      }
      .creator {
        display: flex;
        flex-flow: row wrap;
        gap: 20rem;
        @media screen and (max-width: 900px) {
          gap: 1rem;
        }
        .creator-row {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          img {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
          }
        }
        h5 {
          color: #acacac;
        }
      }
    }
  }

  .historys {
    display: flex;
    width: 100%;
    flex-direction: column;
    cursor: grab;
    height: 15rem;
    overflow-y: scroll;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
    padding: 1rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
    @media screen and (max-width: 900px) {
    }
    .history {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      -moz-box-shadow: 0 0 3px #ccc;
      -webkit-box-shadow: 0 0 3px #ccc;
      box-shadow: 0 0 3px #ccc;
      border: none;
      padding: 1rem;

      .title {
        text-align: center;
      }
      h4 {
        font-size: 0.8rem;
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }
`;
