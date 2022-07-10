import { FC } from "react";
import styled from "styled-components";
interface Props {
  open: boolean;
  onClick?: () => void;
}
const Hambuger: FC<Props> = ({ onClick, open }) => {
  return (
    <StyledHambuger onClick={onClick} open={open}>
      <div className="bar top"></div>
      <div className="bar bottom"></div>
    </StyledHambuger>
  );
};

const StyledHambuger = styled.div<{ open: boolean }>`
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
    background: white;
    border-radius: 5px;
    margin: 2px 0px;
    transform-origin: left;
    transition: all 0.5s;
  }
`;

export default Hambuger;
