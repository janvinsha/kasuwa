import React, { useContext } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AppContext from "../context/AppContext";
import ScrollContainer from "react-indiana-drag-scroll";
const NftCard = ({ nft }) => {
  const { theme, currentAccount } = useContext(AppContext);
  const router = useRouter();
  const offerItems = [, { img: "nn" }];
  const considerationItems = [{}];
  return (
    <StyledNftCard theme_={theme} onClick={() => router.push("/listings/1")}>
      <h2>Offer</h2>
      <ScrollContainer className="scroll-container" horizontal>
        {offerItems.map((offerItem) => (
          <div className="offer">
            {offerItem?.img && <img src="/images/swing.jpeg" alt="ig" />}
            <h3>1 Bay</h3>
          </div>
        ))}
      </ScrollContainer>

      <span>
        <h2>For</h2>
      </span>

      <ScrollContainer className="scroll-container" horizontal={true}>
        {considerationItems.map((consideration) => (
          <div className="consideration">
            {consideration?.img && <img src="/images/swing.jpeg" alt="ig" />}
            <h3>1 Bay</h3>
          </div>
        ))}
      </ScrollContainer>

      <div className="nft-desc">
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
  padding: 1rem;
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

  .scroll-container {
    display: flex;
    flex-direction: row;
    width: 100%;

    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
    padding: 1rem;
    gap: 1rem;
    border-radius: 0.5rem;
    width: 100%;
    overflow-x: scroll;
  }
  .offer,
  .consideration {
    display: flex;
    flex-direction: column;
    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
    overflow: hidden;
    border-radius: 0.5rem;
    min-height: 5rem;
    width: 10rem;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    h3 {
      padding: 0.5rem;
    }
    img {
      width: 10rem;
      height: 5rem;
      object-fit: cover;
    }
  }

  .nft-desc {
    display: flex;
    flex-flow: column wrap;

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
