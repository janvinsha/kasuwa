import React, { useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

import AppContext from "../context/AppContext";

interface Props {
  show: boolean;
  onClose?: () => void;
  title?: string;
  subTitle?: string;
  theme?: boolean;
  backdropStyle?: any;
  modalStyle?: any;
  children?: any;
}

const Modal = ({
  modalStyle,
  children,
  show,
  onClose,
  backdropStyle,
  title,
}: Props) => {
  const modalRef = useRef(null);
  const { theme } = useContext(AppContext);

  useEffect(() => {
    if (show) {
      modalRef.current.classList.add("visible");
    } else {
      modalRef.current.classList.remove("visible");
    }
  }, [show]);
  return (
    <StyledModal theme_={theme}>
      <div
        ref={modalRef}
        style={backdropStyle}
        className="modal__wrap"
        onClick={onClose}
      >
        <div
          style={modalStyle}
          className="modal"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="header">
            <span className="title">{title}</span>{" "}
            <span onClick={onClose} className="close__btn">
              <CloseIcon />
            </span>
          </span>

          {children}
        </div>
      </div>
    </StyledModal>
  );
};
const StyledModal = styled(motion.div)<{ theme_: boolean }>`
  .modal__wrap {
    position: fixed;
    display: block;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    overflow-x: hidden;
    background-color: rgba(31, 32, 41, 0.75);
    pointer-events: none;
    opacity: 0;
    transition: opacity 250ms 700ms ease;
  }

  .visible {
    pointer-events: auto;
    opacity: 1;
    transition: all 120ms ease-in-out;
  }

  .modal {
    overflow-y: hidden;
    overflow-x: hidden;
    position: relative;
    display: block;
    height: 20rem;
    width: 30rem;
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    padding-bottom: 20px;

    background: ${({ theme_ }) => (theme_ ? "#16161A" : "#f2f2f2")};
    align-self: center;
    -moz-box-shadow: 0 0 3px #ccc;
    -webkit-box-shadow: 0 0 3px #ccc;
    box-shadow: 0 0 3px #ccc;
    opacity: 0;
    transition: opacity 120ms 120ms ease-in-out,
      transform 120ms 120ms ease-in-out;
    transform: scale(0.6);
    padding: 2rem;
    @media screen and (max-width: 900px) {
      padding: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 1.5rem;
      }
      .close__btn {
        cursor: pointer;
      }
    }
  }

  .visible .modal {
    opacity: 1;
    transform: scale(1);
  }
`;
export default Modal;
