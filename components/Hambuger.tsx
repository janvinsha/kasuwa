import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../context/AppContext";

interface Props {
  open: boolean;
  onClick?: () => void;
}
const Hambuger = ({ onClick, open }: Props) => {
  const { theme } = useContext(AppContext);

  return (
    <StyledHambuger onClick={onClick} open={open} theme_={theme}>
      <div className="bar top"></div>
      <div className="bar bottom"></div>
    </StyledHambuger>
  );
};

const StyledHambuger = styled.div<{ open: boolean; theme_: boolean }>`
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  height: 1.5rem;
  width: 2rem;
  cursor: pointer;

  .top {
    transform: ${({ open }) => (open ? "rotate(45deg) " : "")};
  }
  .mid {
    opacity: ${({ open }) => (open ? "0" : "")};
  }

  .bottom {
    transform: ${({ open }) => (open ? "rotate(-45deg) " : "")};
  }

  .bar {
    height: 3px;
    background: ${({ theme_ }) => (theme_ ? "#f2f2f2" : "#24242b")};
    border-radius: 5px;
    margin: 2px 0px;
    transform-origin: left;
    transition: all 0.5s;
  }
`;

export default Hambuger;
