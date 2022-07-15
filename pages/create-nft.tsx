import React, { FC, useEffect, useContext, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { motion } from "framer-motion";
import styled from "styled-components";

import Input from "../components/Input";
import Filter from "../components/Filter";
import Textarea from "../components/Textarea";
import TagInput from "../components/TagInput";
import { Loader } from "../components";
import AppContext from "../context/AppContext";

import PhotoIcon from "@mui/icons-material/Photo";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
const CreateListing = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [hashtags, setHashtags] = useState([]);
  const hiddenDpInput = React.useRef(null);
  const [dp, setDp] = useState();

  const { theme, currentAccount, connectWallet } = useContext(AppContext);

  const categories = [];
  const handleDpClick = (event) => {
    hiddenDpInput.current.click();
  };

  const uploadDpHandler = async (e) => {
    const file = e.target.files[0];
    console.log("This is the file", file);
    if (file.type.startsWith("image")) {
      setDp(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      connectWallet();
      return;
    }
    if (!dp) {
      alert("Upload Photo");
      return;
    }

    try {
      let photo = await client.add(dp);
      let photoUrl = `https://ipfs.infura.io/ipfs/${photo.path}`;
      let result = await client.add(
        JSON.stringify({
          name: name,
          description: description,
          image: photoUrl,
        })
      );
      console.log("Token  uri result", result);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "0a0a1461-a071-4db5-b1dd-0ae4c8e45122",
        },
      };
      const response = await axios.post(
        "https://api.nftport.xyz/v0/mints/customizable",
        {
          chain: "rinkeby",
          contract_address: "0x56D85382E54CE5A4432861Aef0a9ca1357Fe9F14",
          metadata_uri: `https://ipfs.infura.io/ipfs/${result.path}`,
          mint_to_address: `${currentAccount}`,
        },
        config
      );

      console.log(response, "RESPONSE ");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledCreateListing theme_={theme}>
      {/* <Loader visible={creatingItem} /> */}
      <motion.div className="page_header">
        <h2 className="page_title text-gradient">Create new Item</h2>
      </motion.div>
      <motion.div className="page_container">
        <div className="img_input ">
          <div className="box">
            {dp?.preview ? (
              <>
                <img src={dp.preview} />
              </>
            ) : (
              <>
                <h3>PNG, JPEG, GIF, WEBP</h3>
                <h3>Max 100mb</h3>
                <PhotoIcon className="icon" />

                <h3> Click button select</h3>
                <button className="plain-btn" onClick={handleDpClick}>
                  Select file
                </button>
              </>
            )}
          </div>
        </div>
        <form onSubmit={submitHandler}>
          <Input
            name="name"
            label="Name"
            asterik={true}
            placeholder="Item Name"
            onChange={(e) => setName(e.target.value)}
            required
            theme={theme}
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="Description..."
            className="text-area"
            role="textbox"
            asterik={true}
            rows={6}
            onChange={(e) => setDescription(e.target.value)}
            required
            theme={theme}
          />

          <button type="submit">Create Nft</button>
        </form>
      </motion.div>
      <input
        type="file"
        ref={hiddenDpInput}
        onChange={uploadDpHandler}
        style={{ display: "none" }}
      />
    </StyledCreateListing>
  );
};

const StyledCreateListing = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  padding: 3rem 6rem;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 900px) {
    gap: 0.5rem;
  }
  width: 100%;
  .page_header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
    h2 {
    }
  }
  .page_container {
    padding: 1rem 6rem;
    display: flex;
    flex-flow: column wrap;
    width: 55rem;
    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 1rem 0rem;
      gap: 0rem;
    }
    h2 {
      font-size: 1.6rem;
      @media screen and (max-width: 900px) {
        font-size: 1.3rem;
      }
    }

    .img_input {
      /* border: 2px solid #7aedc7; */
      border-radius: 0.5rem;
      width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 14rem;
      border: 2.5px dashed ${({ theme_ }) => (theme_ ? "#575555" : " #cdcdcd")};

      width: 100%;
      box-sizing: border-box;
      border-radius: 5px;
      margin-bottom: 2rem;

      background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
      /* box-shadow: 0 0 3px #ccc; */
      h3 {
        font-size: 1.2rem;
      }
      img {
        width: 100%;
        display: block;
        object-fit: cover;
      }
    }
    .box {
      width: 100%;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      border-radius: 0.5rem;
      .icon {
        font-size: 3rem;
      }
      .plain-btn {
        margin-top: 1rem;
        padding: 0.5rem 3rem;
      }
    }

    .preview_div {
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      padding-left: 2rem;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding-left: 0rem;
        padding: 1rem;
      }
      .listing-price {
        padding: 2rem 0.5rem;
        color: #0592ec;
      }
    }
  }
`;
export default CreateListing;
