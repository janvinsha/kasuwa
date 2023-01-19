import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styled from "styled-components";

import AppContext from "../../context/AppContext";

import {
  UserNftCard,
  NftCard,
  EditProfileModal,
  CreateListingModal,
  Loader,
} from "../../components";

export default function Profile() {
  // Import private key & instantiate wallet

  const router = useRouter();
  const { pathname } = router;
  const { id: foundAddress } = router.query;
  const [listings, setListings] = useState();
  const [activeTab, setActiveTab] = useState("User Nfts");
  const {
    currentAccount,
    theme,
    disconnectWallet,
    createTable,
    getProfile,
    chainId,
    getListings,
  } = useContext(AppContext);
  const [userNfts, setUserNfts] = useState([]);
  const [clickedNft, setClickedNft] = useState();
  const [createListingModal, setCreateListingModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [foundUser, setFoundUser] = useState([]);

  const getProfileNfts = async () => {
    // let chainId = 137;

    if (currentAccount) {
      const { data } = await axios.get(
        `https://api.covalenthq.com/v1/${chainId}/address/${currentAccount}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_a2341ac051bd419d815522ed217`
      );
      console.log("THIS IS THE NFTS OF THE USER", data?.data?.items, chainId);

      let nftsArray = data?.data?.items;
      let tempArray = [];
      for (let x of nftsArray) {
        if (x.type == "nft") {
          let testArray = [...x?.nft_data].map((y) =>
            Object.assign(
              {
                contract_name: x?.contract_name,
                contract_ticker_symbol: x?.contract_ticker_symbol,
                contract_address: x?.contract_address,
              },
              y
            )
          );
          tempArray = [...tempArray, ...testArray];
        }
      }
      console.log("LETS SEE THE CONTENTS OF THE TEMP ARRAY", tempArray);

      setUserNfts(tempArray);
    }
  };

  useEffect(() => {
    getProfileNfts();
    getUserProfile();
    getData();
  }, [foundAddress, currentAccount]);

  const getUserProfile = async () => {
    const res = await getProfile(`${foundAddress}`);
    console.log("GET PRFOILE RESPOMSE HERE", res);
    setFoundUser(res?.[0]);
  };
  const getData = async () => {
    const tempListings = await getListings();
    setListings(tempListings);
    console.log("listings"), listings;
  };
  const clickNft = (nft) => {
    setClickedNft(nft);
    console.log("THIS IS THE CLICKED NFT", nft);
  };
  console.log("THIS IS THE FOUND USER", foundUser);
  return (
    <StyledProfile theme_={theme}>
      <Loader visible={editingProfile} />
      <>
        <div className="profile">
          <div className="photo-cont">
            <img
              src={foundUser ? `${foundUser?.banner}` : "/images/swing.jpeg"}
              className="cover"
              alt="img"
            />
            <div className="dp">
              <img
                src={foundUser ? `${foundUser?.dp}` : "/images/swing.jpeg"}
                className="cover img"
                alt="img"
              />
              <span className="bio">
                <h3>{foundUser ? foundUser?.handle : "Comrade"}</h3>
                <p>{foundUser?.bio}</p>
              </span>
            </div>
            <div className="dpBtns">
              {currentAccount && currentAccount == foundAddress && (
                <button
                  className="secondary-btn"
                  onClick={() => disconnectWallet()}
                >
                  Disconnect
                </button>
              )}
              {currentAccount && currentAccount == foundAddress && (
                <button
                  className="secondary-btn"
                  onClick={() => setProfileModal(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          <div className="nfts_section">
            <span className="tabs">
              {currentAccount == foundAddress && (
                <span
                  className={`tab ${activeTab === "User Nfts" && "active"}`}
                  key="index"
                  onClick={() => setActiveTab("User Nfts")}
                >
                  User Nfts
                  <div className="line"></div>
                </span>
              )}
              <span
                className={`tab ${activeTab === "Listed Items" && "active"}`}
                key="index"
                onClick={() => setActiveTab("Listed Items")}
              >
                Listed Items
                <div className="line"></div>
              </span>
            </span>
            <div className="cards">
              {activeTab === "Listed Items"
                ? listings?.map((listing, i) => (
                    <NftCard listing={listing} key={i} />
                  ))
                : userNfts?.map((nft, i) => (
                    <UserNftCard
                      nft={nft}
                      key={i}
                      clickNft={() => {
                        clickNft(nft);
                        setCreateListingModal(true);
                      }}
                    />
                  ))}
            </div>
          </div>
        </div>
        <CreateListingModal
          show={createListingModal}
          onClose={() => setCreateListingModal(false)}
          nft={clickedNft}
          userNfts={userNfts}
          clickedNft={clickedNft}
        />
        <EditProfileModal
          show={profileModal}
          onClose={() => setProfileModal(false)}
          user={foundUser}
          setEditingProfile={setEditingProfile}
        />
      </>
    </StyledProfile>
  );
}
const StyledProfile = styled(motion.div)<{ theme_: boolean }>`
  display: flex;
  flex-flow: row wrap;
  min-height: 80vh;
  @media screen and (max-width: 900px) {
    padding: 0rem 0rem;
  }
  padding: 0rem 0rem;
  .profile {
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    h3 {
      font-size: 1.3rem;
      font-weight: 500;
    }

    h3 {
      font-size: 1.3rem;
      font-weight: 500;
    }
    .body {
    }
    @media screen and (max-width: 900px) {
      width: 100%;
    }
    .header {
      display: flex;
      gap: 1rem;
      align-items: center;
      position: sticky;
      top: 0;
      padding: 1rem 2rem;
      @media screen and (max-width: 900px) {
        padding: 1rem 2rem;
      }
      .back {
        cursor: pointer;
      }
      z-index: 2;
      @media screen and (max-width: 900px) {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0.8rem 0rem;
        width: 100%;
      }
    }
    .photo-cont {
      height: 18rem;
      position: relative;
      margin-bottom: 0rem;
      .cover {
        display: block;
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
      .dpBtns {
        position: absolute;
        bottom: 0%;
        right: 0%;
        padding: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
        @media screen and (max-width: 900px) {
          display: flex;
          flex-direction: column;
        }
      }
      .dp {
        position: absolute;
        bottom: -80%;
        left: 4%;
        width: 22%;
        min-height: 15rem;
        border-radius: 1rem;
        border: 5px solid ${({ theme_ }) => (theme_ ? "#0f0f0f" : "#ffffff")};
        overflow: hidden;
        display: flex;
        cursor: pointer;
        background: ${({ theme_ }) =>
          theme_ ? "rgb(15, 15, 15,1)" : "rgb(255, 255, 255,1)"};
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        -moz-box-shadow: 0 0 4.5px #ccc;
        -webkit-box-shadow: 0 0 4.5px #ccc;
        box-shadow: 0 0 4.5px #ccc;
        @media screen and (max-width: 900px) {
          bottom: 3%;
          width: 10rem;
        }
        .bio {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .img {
          width: 9rem;
          height: 9rem;
          object-fit: cover;
          display: block;
          border-radius: 50%;
        }
        .edit {
          display: none;
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
        }
        &:hover {
          img {
            opacity: 0.8;
          }

          .edit {
            display: block;
          }
        }
      }
    }

    img {
      display: block;
    }
    .nfts_section {
      display: flex;
      width: 75%;
      flex-direction: column;
      align-self: flex-end;
      padding: 2rem 3rem;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding: 1rem 1rem;
      }
    }

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
  }
  .cards {
    width: 100%;
    padding: 2rem 0rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 1.5rem;
    grid-row-gap: 1.5rem;
    @media screen and (max-width: 900px) {
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 0.5rem;
      width: 100%;
      padding: 1rem 0rem;
    }
  }
`;
