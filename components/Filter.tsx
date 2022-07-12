import React, { useContext } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import AppContext from "../context/AppContext";

interface Props {
  className?: string;
  options?: any;
  value?: string | number;
  name?: string;
  onChange?: (e: any) => void;
  label?: string | HTMLElement | JSX.Element;
  asterik?: boolean;
  subLabel?: string;
  id?: string;
  marginButtom?: boolean;
  defaultValue?: number | string;
}

const Filter = ({
  className,
  options,
  name,
  defaultValue,
  onChange,
  id,
  label,
  value,
  asterik,
  subLabel,
}: Props) => {
  const { theme } = useContext(AppContext);

  return (
    <StyledFilter theme_={theme}>
      {/* {label && <label >{label}</label>} */}
      <div className="label-box">
        {label && (
          <div className={` label ${className && className}`}>
            {label}
            <span className={asterik ? "asterik" : "hide"}> * </span>
          </div>
        )}
        {subLabel && (
          <p className={`sub-label ${className && className}`}>{subLabel}</p>
        )}
      </div>
      <div className={`select-cont ${className && className}`}>
        <select
          className={`bg-primary select ${className && className}`}
          name={name}
          id={id}
          onChange={onChange}
        >
          {options?.map((item: any, i: any) => (
            <option
              key={i}
              defaultValue={defaultValue}
              value={item.value}
              id={id}
              className={`option ${className && className}`}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </StyledFilter>
  );
};

const StyledFilter = styled(motion.div)<{ theme_: boolean }>`
  width: 100%;
  &.suffix {
    margin-bottom: 0rem;
  }
  &.border {
    margin-bottom: 2rem;
  }
  &.stake-filter {
    margin-top: 5vh;
  }
  .label {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: flex-start;
    font-size: 1.2rem;
    .asterik {
      display: block;
      margin-left: 0.2vw;
      color: #0592ec;
    }
    .hide {
      display: none;
    }
  }
  .select-cont {
    width: 50%;
    &.border {
      -moz-box-shadow: 0 0 3px #ccc;
      -webkit-box-shadow: 0 0 3px #ccc;
      box-shadow: 0 0 3px #ccc;
      box-sizing: border-box;
      border-radius: 7px;
      height: 2.5rem;
      background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0rem 1rem;
  }
  .select {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 100%;
    outline: none;
    border: none;
    box-sizing: border-box;
    font-style: normal;
    font-size: 1rem;
    color: ${({ theme_ }) => (theme_ ? "white" : "black")};
    cursor: pointer;
    background-color: transparent;
    .option {
      color: ${({ theme_ }) => (theme_ ? "white" : "black")};
      background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
    }
  }
  &.ship-filter-long {
    width: 100%;
    margin-bottom: 1.5rem;
    .select {
      border: 1px solid #707070;
      height: 3rem;
      font-size: 1.2rem;
      color: #6d6d6d;
      background: none;
      -webkit-background-clip: text;
      -webkit-text-fill-color: #6d6d6d;
    }
  }
`;
export default Filter;
