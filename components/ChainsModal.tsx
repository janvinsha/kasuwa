import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import AppContext from "../context/AppContext";
import Modal from "./Modal";
import Image from "next/image";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;
  chainList: any;
  handleChainChange: (e: any) => void;
}

const ChainsModal = ({
  show,
  onClose,
  title,
  handleChainChange,

  chainList,
}: Props) => {
  const { pathname } = useRouter;
  const { theme, changeTheme } = useContext(AppContext);
  console.log(chainList, "HERE IS THE chain LIST");
  const handleSelect = (chainId: any) => {
    handleChainChange(chainId);
    onClose();
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      modalStyle={{ height: "auto" }}
    >
      <StyledChainsModal theme_={theme}>
        {chainList?.map((v: any, i: any) => (
          <span
            className="chain"
            onClick={() => handleSelect(v.chainId)}
            key={i}
          >
            <img
              src={v.logo || "https://etherscan.io/images/main/empty-token.png"}
              alt=""
              width="30px"
            />{" "}
            <h3>{v.slug}</h3>
          </span>
        ))}
      </StyledChainsModal>
    </Modal>
  );
};
const StyledChainsModal = styled.div<{ theme_: boolean }>`
  padding: 2rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 30rem;
  overflow-y: scroll;
  .chain {
    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 1rem;
    background: ${({ theme_ }) => (theme_ ? "#16161A" : "#ffffff")};
    background: blue;
    background: ${({ theme_ }) => (theme_ ? "#24242b" : "#ffffff")};
    padding: 1rem;
    cursor: pointer;
  }
`;
export default ChainsModal;
