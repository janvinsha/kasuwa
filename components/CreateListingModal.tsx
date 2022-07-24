import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import AppContext from "../context/AppContext";
import Modal from "./Modal";

import { Input, Loader } from "./index";

import CloseIcon from "@mui/icons-material/Close";

import { ItemType } from "@opensea/seaport-js/lib/constants";

import { parseEther } from "ethers/lib/utils";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;

  tokenList: any;

  handleTokenChange: (e: any) => void;
  nft: any;
  clickedNft: any;
  userNfts: any;
}

const CreateListingModal = ({
  show,
  onClose,
  nft,
  clickedNft,
  userNfts,
}: Props) => {
  const { theme, currentAccount, createSeaportOrder } = useContext(AppContext);
  const tabs = ["Offers", "Considerations"];
  const [activeTab, setActiveTab] = useState("Offers");
  const [search, setSearch] = useState(
    "0x3dAd63203f1A62724DAcb6A473fE9AE042e2ecc3"
  );
  const [nfts, setNfts] = useState();
  const [selectedChain, setSelectedChain] = useState(137);
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [selectedUserNfts, setSelectedUserNfts] = useState([clickedNft]);
  const [duration, setDuration] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);
  const [eth, setEth] = useState();
  useEffect(() => {
    getData();
  }, [search]);
  useEffect(() => {
    setSelectedUserNfts([clickedNft]);
  }, [clickedNft]);

  const getData = async () => {
    const { data } = await axios.get(
      `https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=${search}&order_direction=desc&offset=0&limit=50&include_orders=false`,
      {
        Accept: "application/json",
        "X-API-KEY": "",
      }
    );
    console.log(data?.assets, "HERE IS THE RES.........");
    setNfts(data?.assets);
  };
  const clickNft = (obj: any) => {
    if (containsObject(obj, selectedNfts)) {
      setSelectedNfts(selectedNfts.filter((nft) => nft?.id != obj?.id));
    } else {
      setSelectedNfts([...selectedNfts, obj]);
    }
  };
  const clickUserNft = (obj: any) => {
    if (containsObject(obj, selectedUserNfts)) {
      setSelectedUserNfts(selectedUserNfts.filter((nft) => nft?.id != obj?.id));
    } else {
      setSelectedUserNfts([...selectedUserNfts, obj]);
    }
  };

  function containsObject(obj: any, list: any) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }

    return false;
  }
  const removeNft = (obj) => {
    setSelectedNfts(selectedNfts.filter((nft) => nft?.id != obj?.id));
  };
  const removeUserNft = (obj) => {
    setSelectedUserNfts(
      selectedUserNfts.filter(
        (nft) => nft?.external_data?.name != obj?.external_data?.name
      )
    );
  };

  const createOrder = async () => {
    let offerItems = [];

    let considerationItems = [];
    if (eth) {
      considerationItems = [
        {
          inputItem: {
            amount: parseEther(eth || "2000").toString(),
            // WETH
            token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          },
          amount: parseEther(eth || "2000").toString(),
          token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      ];
    }
    for (let token of selectedUserNfts) {
      offerItems.push({
        inputItem: {
          itemType: ItemType.ERC721,
          token: token?.contract_address,
          identifier: token?.token_id,
        },

        name: token?.external_data?.name,
        image_url: token?.external_data?.image,
        token_id: token?.token_id,
        address: token?.contract_address,
        collectionName: token?.contract_name,
        symbol: token?.contract_ticker_symbol,
      });
    }
    for (let token of selectedNfts) {
      considerationItems.push({
        inputItem: {
          itemType: ItemType.ERC721,
          token: token?.asset_contract?.address,
          identifier: token?.token_id,
        },
        name: token?.name,
        image_url: token?.image_preview_url,
        token_id: token?.token_id,
        address: token?.asset_contract?.address,
        collectionName: token?.asset_contract?.name,
        symbol: token?.asset_contract?.symbol,
      });
    }
    console.log(
      "THIS IS THE OFFER AND CONSIDERSATION",
      offerItems,
      considerationItems,
      selectedNfts
    );
    try {
      setLoading(true);
      createSeaportOrder({ considerationItems, offerItems });

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Create Listing"
      modalStyle={{ height: "auto", width: "90%" }}
    >
      <Loader visible={loading} />
      <StyledCreateListingModal theme_={theme}>
        <div>
          <span className="tabs">
            {tabs.map((tab, index) => (
              <span
                className={`tab ${activeTab === tab && "active"}`}
                key="index"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <div className="line"></div>
              </span>
            ))}
          </span>
          {activeTab == "Offers" && (
            <div className="offers">
              <div className="left">
                <h2>Select Nfts</h2>
                <div className="nfts">
                  {userNfts?.map((n, i) => {
                    if (i < 11) {
                      return (
                        <div
                          key={i}
                          className="nft"
                          onClick={() => clickUserNft(n)}
                        >
                          <img src={n?.external_data?.image} alt="img" />

                          <span>{n?.external_data?.name}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="right">
                <h2>Selected Nfts</h2>
                <div className="selected-nfts">
                  {selectedUserNfts?.map((n, i) => {
                    return (
                      <div
                        key={i}
                        className="nft"
                        onClick={() => removeUserNft(n)}
                      >
                        <img src={n?.external_data?.image} alt="img" />
                        <span>{n?.external_data?.name}</span>
                        <CloseIcon />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab == "Considerations" && (
            <div className="considerations">
              <div className="left">
                <h2>Select Nfts</h2>
                <div className="nfts">
                  {nfts?.map((n, i) => {
                    if (i < 11) {
                      return (
                        <div
                          key={i}
                          className="nft"
                          onClick={() => clickNft(n)}
                        >
                          <img src={n?.image_url} alt="img" />

                          <span>{n?.name}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="right">
                <h2>Selected Nfts</h2>
                <div className="selected-nfts">
                  {selectedNfts?.map((n, i) => {
                    return (
                      <div key={i} className="nft" onClick={() => removeNft(n)}>
                        <img src={n?.image_url} alt="img" />
                        <span>{n?.name}</span>
                        <CloseIcon />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="footer">
            <Input
              name="Search Contract"
              placeholder="Search Contract"
              onChange={(e) => setSearch(e.target.value)}
              required
              theme={theme}
            />{" "}
            <Input
              name="Choose Amount of WEth to list"
              placeholder="Choose Amount of Eth to list"
              onChange={(e) => setEth(e.target.value)}
              required
              theme={theme}
              type="number"
            />
            {/* <Filter
              name="Duration"
              className="border"
              options={[
                { label: "1 day", value: 86400 },
                { label: "3 days", value: 259200 },
                { label: "7 days", value: 604800 },
                { label: "1 month", value: 2592000 },
              ]}
              onChange={(e) => setDuration(e.target.value)}
              theme={theme}
              required
            /> */}
            <span>
              {" "}
              <button onClick={createOrder}>Confirm Listing</button>
            </span>
          </div>
        </div>
      </StyledCreateListingModal>
    </Modal>
  );
};
const StyledCreateListingModal = styled.div<{ theme_: boolean }>`
  padding: 2rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  -moz-box-shadow: 0 0 3px #ccc;
  -webkit-box-shadow: 0 0 3px #ccc;
  box-shadow: 0 0 3px #ccc;
  height: 30rem;
  margin-top: 1rem;
  overflow-y: scroll;
  overflow-x: hidden;

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
  .tabs {
    display: flex;
    flex-flow: row wrap;
    gap: 1rem;
    width: 100%;
    position: fixed;
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
  .considerations,
  .offers {
    display: flex;
    width: 100%;
    padding: 1rem 0rem;
    margin-top: 3rem;
    .left {
      display: flex;
      flex-flow: column wrap;
      align-items: space-between;
      height: 100%;
      width: 50%;

      .nfts {
        width: 50%;
        padding: 2rem 0rem;
        display: flex;
        gap: 1rem;
        flex-flow: row wrap;
        .nft {
          padding: 0rem;
          -moz-box-shadow: 0 0 4.5px #ccc;
          -webkit-box-shadow: 0 0 4.5px #ccc;
          box-shadow: 0 0 4.5px #ccc;
          border-radius: 0.5rem;
          cursor: pointer;
          span {
            padding: 0.8rem;
          }
          width: 8rem;
          overflow: hidden;
          img {
            width: 100%;

            object-fit: cover;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      width: 50%;
      height: 100%;
    }
    .selected-nfts {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .nft {
        cursor: pointer;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        padding: 0.4rem 1rem;
        gap: 1rem;
        img {
          width: 2rem;
        }
        -moz-box-shadow: 0 0 4.5px #ccc;
        -webkit-box-shadow: 0 0 4.5px #ccc;
        box-shadow: 0 0 4.5px #ccc;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 2%;
    display: flex;
    gap: 2rem;
  }

  position: relative;
`;

export default CreateListingModal;
