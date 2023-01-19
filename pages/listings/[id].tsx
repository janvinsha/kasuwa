import { useState, useEffect, useContext } from "react";
import * as React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ScrollContainer from "react-indiana-drag-scroll";
import { motion } from "framer-motion";
import styled from "styled-components";

import { NftCard, Loader } from "../../components";
import AppContext from "../../context/AppContext";
import { formatEther } from "ethers/lib/utils";

export default function ListingDetails() {
  const router = useRouter();
  const { pathname } = router;
  const { id: nftId } = router.query;

  const [loading, setLoading] = useState(false);
  const { theme, getListing, getProfile, fulfillSeaportOrder } =
    useContext(AppContext);
  const [order, setOrder] = useState();
  const [offerItems, setOfferItems] = useState([]);
  const [considerationItems, setConsiderationItems] = useState([]);
  const [foundUser, setFoundUser] = useState();

  useEffect(() => {
    getData();
  }, [nftId]);

  const getData = async () => {
    if (nftId) {
      let tempListing = await getListing(nftId);
      tempListing = tempListing?.[0];
      console.log("listing is here", tempListing);

      let { data: orderData } = await axios.get(`${tempListing?.orderJson}`);
      let { data: offersData } = await axios.get(`${tempListing?.offers}`);
      let { data: considerationsData } = await axios.get(
        `${tempListing?.considerations}`
      );

      console.log(
        orderData,
        offersData,
        considerationsData,
        "TRYING TO GET THE DATA FRO IPFS"
      );

      setOrder(orderData);
      setOfferItems(offersData);
      setConsiderationItems(considerationsData);

      const res = await getProfile(`${orderData?.parameters?.offerer}`);
      console.log(
        "GET PRFOILE RESPOMSE HERE NFT CARD...................",
        res?.[0]
      );
      setFoundUser(res?.[0]);
    }
  };

  const fulfillOrder = async () => {
    setLoading(true);
    fulfillSeaportOrder(order);
    setLoading(false);
  };
  return (
    <StyledListingDetails theme_={theme}>
      <Loader visible={loading} />
      <div className="listing">
        <h2>Offer</h2>
        <ScrollContainer className="scroll-container" horizontal>
          {offerItems?.map((offerItem: any, i) => (
            <div className="offer" key={i}>
              {offerItem?.image_url && (
                <img
                  src={offerItem?.image_url || "/images/swing.jpeg"}
                  alt="ig"
                />
              )}
              <h3>{offerItem?.name}</h3>
            </div>
          ))}
        </ScrollContainer>

        <span>
          <h2>For</h2>
        </span>

        <ScrollContainer className="scroll-container" horizontal={true}>
          {considerationItems?.map((considerationItem: any, i) => (
            <div className="consideration" key={i}>
              {considerationItem?.image_url && (
                <img
                  src={considerationItem?.image_url || "/images/swing.jpeg"}
                  alt="ig"
                />
              )}
              <h3>
                {considerationItem?.name
                  ? considerationItem?.name
                  : `WEth ${formatEther(considerationItem?.amount || "200")}`}
              </h3>
            </div>
          ))}
        </ScrollContainer>

        <div className="nft-desc">
          <span className="nft_sale">
            <span
              className="nft_author"
              onClick={() => router.push(`/profile/${foundUser?.id}`)}
            >
              {" "}
              <img
                src={foundUser ? `${foundUser?.dp}` : "/images/swing.jpeg"}
                alt="img"
                className="nft_author_image"
              />
              <p>{foundUser?.handle || "Comrade"}</p>{" "}
            </span>{" "}
            <div className="fulfillBtn">
              <button onClick={fulfillOrder}>Fulfill Order</button>
            </div>
          </span>
        </div>
      </div>
    </StyledListingDetails>
  );
}
const StyledListingDetails = styled(motion.div)<{ theme_: boolean }>`
  min-height: 81vh;
  display: flex;
  flex-flow: column wrap;

  padding: 4rem 8rem;
  gap: 1.5rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 0rem;
  }
  .listing {
    width: 80%;
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
    background: ${({ theme_ }) =>
      theme_ ? "rgb(23, 24, 24,0.9)" : "rgb(248, 248, 248,0.9)"};
    background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};

    overflow: hidden;
    img {
      height: 15rem;
      width: 100%;
      object-fit: cover;
    }

    display: flex;
    flex-flow: column wrap;
    width: 100%;

    .scroll-container {
      display: flex;
      flex-direction: row;
      width: 100%;

      -moz-box-shadow: 0 0 4.5px #ccc;
      -webkit-box-shadow: 0 0 4.5px #ccc;
      box-shadow: 0 0 4.5px #ccc;
      padding: 1rem;
      gap: 1rem;
      border-radius: 0.5rem;
      width: 100%;
      overflow-x: scroll;
    }
    .offer,
    .consideration {
      display: flex;
      flex-direction: column;
      -moz-box-shadow: 0 0 4.5px #ccc;
      -webkit-box-shadow: 0 0 4.5px #ccc;
      box-shadow: 0 0 4.5px #ccc;
      overflow: hidden;
      border-radius: 0.5rem;
      min-height: 5rem;
      width: 10rem;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      h3 {
        padding: 0.5rem;
      }
      img {
        width: 10rem;
        height: 5rem;
        object-fit: cover;
      }
    }

    .nft-desc {
      display: flex;
      flex-flow: column wrap;

      gap: 0.5rem;

      .nft_title,
      .nft_sale {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 0.5rem;
        align-items: center;
        .nft_author {
          cursor: pointer;
        }
        .nft_author_image {
          width: 2rem;
          height: 2rem;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .nft_title {
        h3 {
          font-weight: 500;
        }
        p {
          color: #0592ec;
        }
      }
      .nft_sale {
        padding: 1rem 0rem;
        .nft_author {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
      }
    }
  }
`;
