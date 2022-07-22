import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { create } from "ipfs-http-client";

import AppContext from "../context/AppContext";
import Modal from "./Modal";

import { Input, Loader } from "./index";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;

  tokenList: any;

  handleTokenChange: (e: any) => void;
  nft: any;
  clickedNft: any;
}

const CreateListingModal = ({ show, onClose, nft, clickedNft }: Props) => {
  const { theme } = useContext(AppContext);
  const tabs = ["Offers", "Considerations"];
  const [activeTab, setActiveTab] = useState("Offers");
  const [chosenNfts, setChosenNfts] = useState([clickedNft]);
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Create Listing"
      modalStyle={{ height: "auto", width: "90%" }}
    >
      <Loader visible={false} />
      <StyledCreateListingModal theme_={theme}>
        <div>
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
          {activeTab == "Offers" && <div className="offers"></div>}
          {activeTab == "Considerations" && (
            <div className="considerations"></div>
          )}
        </div>
      </StyledCreateListingModal>
    </Modal>
  );
};
const StyledCreateListingModal = styled.div<{ theme_: boolean }>`
  padding: 2rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 0rem;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  height: 30rem;
  margin-top: 1rem;
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 6px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  padding: 1rem;
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
`;

export default CreateListingModal;
