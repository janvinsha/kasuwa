import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string | HTMLElement | JSX.Element;
  subLabel?: string;
  inputLabel?: any;
  className?: string;
  asterik?: boolean;
  id?: string;
  rows: number;
  placeholder: string;
  onChange: (e: any) => void;
  optional: boolean;
  theme: boolean;
}
const Textarea = ({
  name,
  label,
  subLabel,
  asterik,
  className,
  id,
  optional,
  theme,
  ...rest
}: Props) => {
  return (
    <StyledInput theme_={theme}>
      <div className={`textarea-box ${className && className}`} id={id}>
        <div className="head-box">
          <div className="label-box">
            {label && (
              <div className={`text-primary label ${className && className}`}>
                {label}
                <span className={asterik ? "asterik" : "hide"}> * </span>
                <span className={optional ? "optional" : "hide"}>
                  {" "}
                  (Optional){" "}
                </span>
              </div>
            )}
            {subLabel && (
              <p
                className={`text-secondary sub-label ${className && className}`}
              >
                {subLabel}
              </p>
            )}
          </div>
        </div>

        <div className={`input-cont ${className && className}`}>
          <textarea
            className={`input ${className && className}`}
            id={id}
            rows={6}
            {...rest}
          ></textarea>
        </div>
      </div>
    </StyledInput>
  );
};

const StyledInput = styled(motion.div)`
  .textarea-box {
    width: 100%;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    &.stake-input {
      margin-top: 5vh;
    }
    &.stake-type {
      margin-top: 5vh;
    }

    .head-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .label-box {
        justify-self: flex-start;
        width: 100%;
        .label {
          width: 100%;

          display: flex;
          align-items: center;
          // color: #000000;
          margin: 0 0 0.5rem 0;

          display: flex;
          align-items: flex-start;
          font-size: 1.2rem;
          .asterik {
            display: block;
            margin-left: 0.2vw;
            color: #0592ec;
          }
          .optional {
            margin-left: 0.2vw;
            font-size: 0.8rem;
            font-weight: 200;
          }
          .hide {
            display: none;
          }
        }
        .sub-label {
          // color: #6D6D6D;

          margin-bottom: 0.4rem;
        }
      }
      .input-right {
        justify-self: flex-end;
      }
    }

    .input-cont {
      &.text-area {
      }
      width: 100%;
      -moz-box-shadow: 0 0 3px #ccc;
      -webkit-box-shadow: 0 0 3px #ccc;
      box-shadow: 0 0 3px #ccc;
      box-sizing: border-box;
      border-radius: 7px;
      height: auto;
      background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 1rem 0rem;
      .input {
        display: flex;
        align-items: center;
        padding: 1rem;
        font-size: 1rem;
        width: 100%;
        resize: none;

        height: 100%;
        border: none;
        box-sizing: border-box;
        border-radius: 7px;
        padding: 0 2.5%;

        display: flex;
        align-items: center;
        outline: none;
        background: transparent;

        color: ${({ theme_ }) => (theme_ ? "white" : "black")};
        &.stake-type {
          text-align: center;
        }
      }
      .suffix {
        width: 6rem;
        height: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      &.step-input {
        border: 2px solid #ff6600;
        input {
          width: 65%;
          color: #1f1f20;
        }
        .suffix {
          width: 35%;
        }
      }
    }

    ///// label component //////
    .label-cont {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2vw;
      box-sizing: border-box;
      width: 100%;
    }
    .label-right {
      display: flex;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        #available {
          // color: #6D6D6D;
        }
        #coin {
          margin-left: 0.3vw;
        }
        #max {
          background: #f3dbca;

          color: #ff6600;
          padding: 0.6vw 0.5vw;
          border-radius: 100px;
          margin-left: 1vw;
          cursor: pointer;
        }
      }
    }
  }
`;

export default Textarea;
