import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styled from "styled-components";

import { NftCard } from "../components";
import AppContext from "../context/AppContext";
import Lottie from "react-lottie";
import homeData from "../public/animations/home.json";

export default function Home() {
  const router = useRouter();

  const { theme } = useContext(AppContext);

  const nfts = [{}, {}, {}, {}, {}, {}, {}, {}];
  const userProfile = {};
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: homeData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <StyledHome theme_={theme}>
      <div className="desc">
        <h1>List Your Nfts on the new Open Sea Seaport Protocol</h1>
        <h2>
          You can create Nfts and list it for other Nfts, or multiple Nfts
        </h2>
        <h3>The new Seaport Protocol is the Future</h3>
        <button className="plain-btn" onClick={() => router.push("/listings")}>
          Listings
        </button>
      </div>
      <div className="nft-desc">
        <Lottie options={defaultOptions} height={500} width={"100%"} />
      </div>
    </StyledHome>
  );
}
const StyledHome = styled(motion.div)<{ theme_: boolean }>`
  display: flex;
  flex-flow: column wrap;

  width: 100%;

  padding: 2rem 6rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
  }
  .desc {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0rem;

    h2 {
      font-weight: medium;
    }
    button {
      margin-top: 1rem;
    }
  }
  .nft-desc {
    display: flex;
    gap: 6rem;
    padding: 1rem 10rem;
    justify-content: center;
    padding-bottom: 6rem;
    @media screen and (max-width: 900px) {
      width: 100%;
      padding: 1rem 0rem;
      align-items: center;
      flex-direction: column;
    }
    .img {
      width: 26rem;
      height: 26rem;
      overflow: hidden;
      border-radius: 1rem;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .about {
      width: 23rem;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-align: center;
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      button {
      }
      .author {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-align: center;
        img {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.2rem;
          object-fit: cover;
        }
      }

      .price {
        display: flex;
        flex-flow: column wrap;
        padding: 0rem 0rem;
        gap: 0.3rem;
        text-align: center;
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
      .btn-group {
        display: flex;
        gap: 1rem;
      }
    }
  }
  .popular-nfts {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    .title {
      display: flex;
      flex-flow: column wrap;
      .sub-title {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0rem;
      }
      .divider {
        background: #ccc;
        background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
        padding: 1px;
        width: 100%;
      }
    }

    .nfts {
      width: 100%;
      padding: 2rem 0rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 1rem;
      grid-row-gap: 1rem;
      @media screen and (max-width: 900px) {
        grid-template-columns: repeat(1 1fr);
        grid-column-gap: 0.5rem;
        grid-row-gap: 0.5rem;
        width: 100%;
        padding: 0rem 0rem;
      }
    }
  }
  .about {
    width: 100%;

    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
    align-items: center;
    .about-desc {
      text-align: center;
    }
  }
`;
