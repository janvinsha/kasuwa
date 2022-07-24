import React, { useContext } from "react";

import styled from "styled-components";

import { motion } from "framer-motion";
import AppContext from "../context/AppContext";

interface Props {
  nft: any;
  clickNft: (e: any) => void;
}

const UserNftCard = ({ nft, clickNft }: Props) => {
  const { theme, currentAccount } = useContext(AppContext);

  return (
    <StyledUserNftCard theme_={theme}>
      {nft?.external_data?.image?.endsWith("mp4") ? (
        <video
          controls={false}
          controlsList="nodownload"
          loop
          autoPlay={true}
          preload="true"
          muted={true}
        >
          <source src={nft?.external_data?.image} type="video/mp4" />
        </video>
      ) : (
        <img src={nft?.external_data?.image} alt="img" />
      )}

      <div className="nft-desc">
        <span className="nft_title">
          <h4>{nft?.external_data?.name}</h4>
        </span>

        <span className="nft_btn">
          {nft?.owner == currentAccount?.toLowerCase() && (
            <button className="secondary-btn" onClick={clickNft}>
              List Nft
            </button>
          )}
        </span>
      </div>
    </StyledUserNftCard>
  );
};

const StyledUserNftCard = styled(motion.div)<{ theme_: boolean }>`
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;

  background: ${({ theme_ }) =>
    theme_ ? "rgb(23, 24, 24,0.9)" : "rgb(248, 248, 248,0.9)"};
  background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};

  &:hover {
    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
  }
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  overflow: hidden;
  img,
  video {
    height: 15rem;
    width: 100%;
    object-fit: cover;
  }
  .nft-desc {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    padding: 1.2rem 1rem;
    gap: 0.8rem;
    .nft_btn {
      justify-self: end;
    }
  }
`;

export default UserNftCard;
