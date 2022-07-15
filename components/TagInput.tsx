import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string | HTMLElement | JSX.Element;
  subLabel?: string;
  inputLabel?: any;
  className?: string;
  asterik?: boolean;
  id?: string;
  tags: Array<string>;
  optional?: boolean;
  setTags: (e: any) => void;
  theme: boolean;
}

const TagInput = ({
  name,
  label,
  subLabel,
  asterik,
  className,
  id,
  tags,
  setTags,
  optional,
  theme,
  ...rest
}: InputProps) => {
  const [input, setInput] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };
  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();
    if (
      key === "Enter" &&
      trimmedInput.length &&
      !tags.includes(trimmedInput)
    ) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput("");
    }

    if (key === "Backspace" && !input.length && tags.length) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();

      setTags(tagsCopy);
      setInput(poppedTag);
    }
    setIsKeyReleased(false);
  };
  const onKeyUp = () => {
    setIsKeyReleased(true);
  };
  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };
  return (
    <StyledTagInput
      className={`tag-input-box ${className && className}`}
      id={id}
      theme_={theme}
    >
      <div className="head-box">
        <div className="label-box">
          {label && (
            <div
              className={`text-gradient text-primary label ${
                className && className
              }`}
            >
              {label}
              <span className={asterik ? "asterik" : "hide"}> * </span>
              <span className={optional ? "optional" : "hide"}>
                {" "}
                (Optional){" "}
              </span>
            </div>
          )}
          {subLabel && (
            <p className={`text-secondary sub-label ${className && className}`}>
              {subLabel}
            </p>
          )}
        </div>
      </div>
      {/* {phone && <p id="code">+123</p>} */}

      <div className={`input-cont ${className && className}`}>
        {tags?.map((tag, index) => (
          <div className="tag" key={index}>
            {tag}
            <button onClick={() => deleteTag(index)}>
              <CloseIcon className="icon" />
            </button>
          </div>
        ))}
        <input
          name={name}
          {...rest}
          className={`input ${className && className}`}
          id={id}
          onKeyDown={onKeyDown}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={input}
        />
      </div>
    </StyledTagInput>
  );
};

const StyledTagInput = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  margin-bottom: 1rem;
  &.stake-input {
    margin-top: 5vh;
  }
  &.stake-type {
    margin-top: 5vh;
  }

  .head-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .label-box {
      justify-self: flex-start;
      width: 100%;

      .label {
        width: 100%;
        @include fonts(14, 17, 500);
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
        @include fonts(13, 17, 500);
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
    background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
    border: 2.5px solid transparent;
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    box-sizing: border-box;

    flex-flow: row wrap;

    display: flex;

    align-items: center;
    margin-bottom: 1rem;

    max-width: 100%;
    padding-left: 1rem;

    .input {
      min-width: 50%;
      display: flex;

      align-items: center;
      height: 100%;
      border: none;
      box-sizing: border-box;
      font-size: 1rem;
      display: flex;
      align-items: center;
      outline: none;
      background: transparent;
      padding: 0.5rem 0rem;
      color: ${({ theme_ }) => (theme_ ? "white" : "black")};
    }
    .tag {
      display: flex;
      align-items: center;
      margin: 7px 0;
      margin-right: 10px;
      padding: 0 10px;
      padding-right: 5px;
      border: none;
      border-radius: 0.2rem;
      background-color: #0592ec;
      white-space: nowrap;
      color: white;
      button {
        display: flex;
        padding: 3px;
        border: none;
        background-color: unset;
        .icon {
          font-size: 1.3rem;
        }
        cursor: pointer;
        color: white;
      }
    }

    .suffix {
      width: 6rem;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      @include screen("inbetween") {
      }
    }

    &.step-input {
      border: 2px solid #ff6600;
      input {
        width: 65%;
      }
      .suffix {
        width: 35%;
      }
      @include screen("inbetween") {
        .input-cont {
          input {
            width: 60%;
          }
          .suffix {
            width: 40%;
          }
        }
      }
    }
  }

  ///// label component //////
  .label-cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2vw;
    box-sizing: border-box;
    width: 100%;
    #label-text {
      @include fonts(18, 23, bold);
      // color: #6D6D6D;
      @include screen("inbetween") {
        @include fonts(14, 20, bold);
      }
    }
    .label-right {
      display: flex;

      align-items: center;
      p {
        display: flex;

        align-items: center;
        #available {
          @include fonts(12, 20, normal);
          // color: #6D6D6D;
        }
        #coin {
          @include fonts(12, 20, bold);
          margin-left: 0.3vw;
        }
        #max {
          background: #f3dbca;
          @include fonts(12, 16, bold);
          color: #ff6600;
          padding: 0.6vw 0.5vw;
          border-radius: 100px;
          margin-left: 1vw;
          cursor: pointer;
        }
      }
    }
  }

  .trasnaction-suffix {
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    #arrow {
      cursor: pointer;
    }
  }

  .step-suffix {
    width: 90%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    @include screen("inbetween") {
      width: 90%;
    }
    #coin {
      @include screen("inbetween") {
        width: 3vw;
        height: 3vh;
      }
    }
    #currency {
      @include fonts(15, 23, bold);
      @include screen("inbetween") {
        @include fonts(12, 20, bold);
      }
    }
  }
`;

export default TagInput;
