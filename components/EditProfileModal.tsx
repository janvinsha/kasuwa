import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js";
import { create } from "ipfs-http-client";

import AppContext from "../context/AppContext";
import Modal from "./Modal";

import { Input, Textarea, Loader } from "./index";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import notify from "../hooks/notification";

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
const EditProfileModal = ({ show, onClose, user, setEditingProfile }) => {
  const {
    theme,
    updateProfile,

    editingProfile,
    currentAccount,
  } = useContext(AppContext);
  const [name, setName] = useState(user?.[2]);

  const [bio, setBio] = useState(user?.[1]);
  const [dp, setDp] = useState();
  const [cover, setCover] = useState();
  const hiddenCoverInput = React.useRef(null);
  const hiddenDpInput = React.useRef(null);

  const handleDpClick = (event) => {
    hiddenDpInput.current.click();
  };

  const handleCoverClick = (event) => {
    hiddenCoverInput.current.click();
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
  const uploadCoverHandler = async (e) => {
    const file = e.target.files[0];
    console.log("This is the file", file);
    if (file.type.startsWith("image")) {
      setCover(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };
  const editProfileHandler = async (e) => {
    e.preventDefault();
    try {
      let banner;
      let bannerUrl;
      let photo;
      let photoUrl;
      let tempUrl;
      if (dp) {
        photo = await client.add(dp);
        photoUrl = `https://kasuwa.infura-ipfs.io/ipfs/${photo.path}`;
      }
      if (cover) {
        banner = await client.add(cover);
        bannerUrl = `https://kasuwa.infura-ipfs.io/ipfs/${banner.path}`;
      }

      console.log("IPFS OBJECT", banner, photo);
      console.log("IPFS UPLOAD FILE BANNERURL", bannerUrl);

      console.log("IPFS UPLOAD FILE PHOTOURL", photoUrl);
      // console.log('FILES ARE HERE', files, dpFiles);
      setEditingProfile(true);
      updateProfile({
        id: `${currentAccount}`,
        banner:
          bannerUrl ||
          user?.[4] ||
          "https://kasuwa.infura-ipfs.io/ipfs/QmTnLF4RnkuDL2yT8VawLTXKE4L5Px5uYnxtj6dNSF97q4",
        dp:
          photoUrl ||
          user?.[3] ||
          "https://kasuwa.infura-ipfs.io/ipfs/QmTnLF4RnkuDL2yT8VawLTXKE4L5Px5uYnxtj6dNSF97q4",
        handle: name || "Comrade",
        bio: bio || "WAGMI",
      });
      notify({ title: "Profile edited successfully", type: "success" });
      setEditingProfile(false);

      // console.log('IPFS UPLOAD FILE URL', url);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setEditingProfile(false);
      notify({ title: "Error while editing profile", type: "error" });
    }
  };
  const tabs = ["Edit Profile", "Change Profile picture"];

  const [activeTab, setActiveTab] = useState("Edit Profile");
  console.log(name, bio);
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Edit Profile"
      modalStyle={{ height: "auto" }}
    >
      <Loader visible={editingProfile} />
      <StyledEditProfileModal theme_={theme}>
        <div>
          <div className="photo-cont">
            <img
              src={cover ? cover.preview : user?.[4] || "/images/swing.jpeg"}
              className="cover"
              alt="img"
            />{" "}
            <span className="dp">
              <img
                src={dp ? dp.preview : user?.[3] || "/images/swing.jpeg"}
                className="cover"
                alt="img"
              />
              {dp ? (
                <button className="dp-edit" onClick={() => setDp()}>
                  <CloseIcon />
                </button>
              ) : (
                <button className="dp-edit" onClick={handleDpClick}>
                  <EditIcon />
                </button>
              )}
            </span>
            {cover ? (
              <button className="cover-edit" onClick={() => setCover()}>
                <CloseIcon />
              </button>
            ) : (
              <button className="cover-edit" onClick={handleCoverClick}>
                <EditIcon />
              </button>
            )}
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            name="Name"
            label="Name"
            theme={theme}
          />

          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            name="Bio"
            label="Bio"
            maxLength="50"
            theme={theme}
          />
          <span>
            <button onClick={editProfileHandler}>Submit</button>
          </span>
        </div>
        <input
          type="file"
          ref={hiddenDpInput}
          onChange={uploadDpHandler}
          style={{ display: "none" }}
        />
        <input
          type="file"
          ref={hiddenCoverInput}
          onChange={uploadCoverHandler}
          style={{ display: "none" }}
        />
      </StyledEditProfileModal>
    </Modal>
  );
};
const StyledEditProfileModal = styled.div`
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
  .pp {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0rem;
    position: relative;
    gap: 1rem;
    width: 100%;

    .dp {
      position: relative;
      width: 8.5rem;
      height: 8.5rem;
      border-radius: 50%;
      border: 5px solid ${({ theme_ }) => (theme_ ? "#0f0f0f" : "#ffffff")};
      overflow: hidden;
      display: flex;
      cursor: pointer;
      background: ${({ theme_ }) =>
        theme_ ? "rgb(15, 15, 15,1)" : "rgb(255, 255, 255,1)"};
      img {
        width: 100%;
        object-fit: cover;
        display: block;
        opacity: 0.6;
      }
      .dp-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 4rem;
        background: transparent;
        color: ${({ theme_ }) => (theme_ ? "white" : "black")};
      }
    }
  }
  .tabs {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    width: 100%;
    .tab {
      padding: 0rem 2rem;
      padding-top: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;
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
        .line {
          background: #50c1e9;
        }
      }
    }
  }
  .photo-cont {
    height: 10rem;
    position: relative;
    margin-bottom: 4.5rem;
    width: 100%;
    background: ${({ theme_ }) =>
      theme_ ? "rgb(15, 15, 15,1)" : "rgb(255, 255, 255,1)"};
    .cover {
      display: block;
      object-fit: cover;
      height: 100%;
      width: 100%;
      opacity: 0.6;
    }
    .cover-edit {
      position: absolute;
      right: 5%;
      top: 5%;
      background: transparent;
      color: ${({ theme_ }) => (theme_ ? "white" : "black")};
    }

    .dp {
      position: absolute;
      bottom: -28%;
      left: 50%;
      transform: translateX(-50%);
      width: 8.5rem;
      height: 8.5rem;
      border-radius: 50%;
      border: 5px solid ${({ theme_ }) => (theme_ ? "#0f0f0f" : "#ffffff")};
      overflow: hidden;
      display: flex;
      cursor: pointer;
      background: ${({ theme_ }) =>
        theme_ ? "rgb(15, 15, 15,1)" : "rgb(255, 255, 255,1)"};
      img {
        width: 100%;
        object-fit: cover;
        display: block;
        opacity: 0.6;
      }
      .dp-edit {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 4rem;
        background: transparent;
        color: ${({ theme_ }) => (theme_ ? "white" : "black")};
      }
    }
  }
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
`;

export default EditProfileModal;
