import React, { useContext } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AppContext from "../context/AppContext";

const NftCard = ({ nft }) => {
  const { theme, currentAccount } = useContext(AppContext);
  const router = useRouter();

  return (
    <StyledNftCard theme_={theme} onClick={() => router.push("/nfts/1")}>
      <img src="/images/swing.jpeg" alt="img" />
      <div className="nft-desc">
        <span className="nft_title">
          <h3>Nft</h3> <p>1 Eth</p>
        </span>

        <span className="nft_sale">
          <span className="nft_author">
            {" "}
            <img
              src="/images/swing.jpeg"
              alt="img"
              className="nft_author_image"
            />
            <p>Comrade</p>{" "}
          </span>{" "}
        </span>
      </div>
    </StyledNftCard>
  );
};

const StyledNftCard = styled(motion.div)<{ theme_: boolean }>`
  width: 100%;
  padding: 0rem 0rem;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  background: ${({ theme_ }) =>
    theme_ ? "rgb(23, 24, 24,0.9)" : "rgb(248, 248, 248,0.9)"};
  background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
  cursor: pointer;
  &:hover {
    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
  }

  overflow: hidden;
  img {
    height: 15rem;
    width: 100%;
    object-fit: cover;
  }

  display: flex;
  flex-flow: column wrap;
  width: 100%;
  .nft-desc {
    display: flex;
    flex-flow: column wrap;
    padding: 0rem 1rem;
    gap: 0.5rem;

    .nft_title,
    .nft_sale {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;

      .nft_author_image {
        width: 2rem;
        height: 2rem;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .nft_title {
      h3 {
        font-weight: 500;
      }
      p {
        color: #0592ec;
      }
    }
    .nft_sale {
      padding: 1rem 0rem;
      .nft_author {
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
    }
  }
`;

export default NftCard;
