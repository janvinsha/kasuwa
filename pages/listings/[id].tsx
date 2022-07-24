import { useState, useEffect, useContext } from "react";
import * as React from "react";
import { useRouter } from "next/router";

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
  const {
    theme,
    buyingNft,
    buyNft,
    currentAccount,
    getListing,
    getProfile,
    fulfillSeaportOrder,
  } = useContext(AppContext);
  const [share, setShare] = useState(false);
  const [text, setText] = useState("");
  const tabs = ["Description", "History"];
  const [activeTab, setActiveTab] = useState("Description");

  const [listing, setListing] = useState(dummyData);
  const offerItems = listing?.[2];
  const considerationItems = listing?.[3];
  useEffect(() => {
    getData();
    getUserProfile();
  }, []);

  const getData = async () => {
    const tempListing = await getListing(nftId);
    if (tempListing) {
      // setListing(tempListing);
    }
    console.log("listings"), listing;
  };
  const [foundUser, setFoundUser] = useState();

  const getUserProfile = async () => {
    if (currentAccount) {
      const res = await getProfile(`${listing?.[1]?.parameters?.offerer}`);
      console.log("GET PRFOILE RESPOMSE HERE", res);
      setFoundUser(res?.[0]);
    }
  };
  const fulfillOrder = async () => {
    setLoading(true);
    fulfillSeaportOrder({
      considerationItems,
      offerItems,
    });
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
              onClick={() => router.push(`/profile/${foundUser?.[0]}`)}
            >
              {" "}
              <img
                src={
                  foundUser?.length > 2
                    ? `${foundUser?.[4]}`
                    : "/images/swing.jpeg"
                }
                alt="img"
                className="nft_author_image"
              />
              <p>{foundUser?.length > 2 ? foundUser?.[2] : "Comrade"}</p>{" "}
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
const dummyData = [
  "f18bd848-0cfc-4fda-9042-751185095b61",

  {
    parameters: {
      offerer: "0x87b0B98bf74a1Fb6ad89b5bB86dA3C9C24eee1Ce",
    },
    signature:
      "0x2c500ae8b64222632be3297e9f31a6e508d4e4d4c9f7e2adbc30fc89b8b5208a6de55f5a95b19a5a1fda0491c241f8d5ad436a32f7f9a3bda6f3eee03112984e",
  },
  [
    {
      address: "0x77556b05ced56eeb8edae5a0e9cd2b4e9948534b",
      collectionName: "Buidl Name Service",
      image_url:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzAiIGhlaWdodD0iMjcwIiBmaWxsPSJub25lIj48cGF0aCBmaWxsPSJ1cmwoI0IpIiBkPSJNMCAwaDI3MHYyNzBIMHoiLz48ZGVmcz48ZmlsdGVyIGlkPSJBIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaGVpZ2h0PSIyNzAiIHdpZHRoPSIyNzAiPjxmZURyb3BTaGFkb3cgZHg9IjAiIGR5PSIxIiBzdGREZXZpYXRpb249IjIiIGZsb29kLW9wYWNpdHk9Ii4yMjUiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiLz48L2ZpbHRlcj48L2RlZnM+PHBhdGggZD0iTTcyLjg2MyA0Mi45NDljLS42NjgtLjM4Ny0xLjQyNi0uNTktMi4xOTctLjU5cy0xLjUyOS4yMDQtMi4xOTcuNTlsLTEwLjA4MSA2LjAzMi02Ljg1IDMuOTM0LTEwLjA4MSA2LjAzMmMtLjY2OC4zODctMS40MjYuNTktMi4xOTcuNTlzLTEuNTI5LS4yMDQtMi4xOTctLjU5bC04LjAxMy00LjcyMWE0LjUyIDQuNTIgMCAwIDEtMS41ODktMS42MTZjLS4zODQtLjY2NS0uNTk0LTEuNDE4LS42MDgtMi4xODd2LTkuMzFjLS4wMTMtLjc3NS4xODUtMS41MzguNTcyLTIuMjA4YTQuMjUgNC4yNSAwIDAgMSAxLjYyNS0xLjU5NWw3Ljg4NC00LjU5Yy42NjgtLjM4NyAxLjQyNi0uNTkgMi4xOTctLjU5czEuNTI5LjIwNCAyLjE5Ny41OWw3Ljg4NCA0LjU5YTQuNTIgNC41MiAwIDAgMSAxLjU4OSAxLjYxNmMuMzg0LjY2NS41OTQgMS40MTguNjA4IDIuMTg3djYuMDMybDYuODUtNC4wNjV2LTYuMDMyYy4wMTMtLjc3NS0uMTg1LTEuNTM4LS41NzItMi4yMDhhNC4yNSA0LjI1IDAgMCAwLTEuNjI1LTEuNTk1TDQxLjQ1NiAyNC41OWMtLjY2OC0uMzg3LTEuNDI2LS41OS0yLjE5Ny0uNTlzLTEuNTI5LjIwNC0yLjE5Ny41OWwtMTQuODY0IDguNjU1YTQuMjUgNC4yNSAwIDAgMC0xLjYyNSAxLjU5NWMtLjM4Ny42Ny0uNTg1IDEuNDM0LS41NzIgMi4yMDh2MTcuNDQxYy0uMDEzLjc3NS4xODUgMS41MzguNTcyIDIuMjA4YTQuMjUgNC4yNSAwIDAgMCAxLjYyNSAxLjU5NWwxNC44NjQgOC42NTVjLjY2OC4zODcgMS40MjYuNTkgMi4xOTcuNTlzMS41MjktLjIwNCAyLjE5Ny0uNTlsMTAuMDgxLTUuOTAxIDYuODUtNC4wNjUgMTAuMDgxLTUuOTAxYy42NjgtLjM4NyAxLjQyNi0uNTkgMi4xOTctLjU5czEuNTI5LjIwNCAyLjE5Ny41OWw3Ljg4NCA0LjU5YTQuNTIgNC41MiAwIDAgMSAxLjU4OSAxLjYxNmMuMzg0LjY2NS41OTQgMS40MTguNjA4IDIuMTg3djkuMzExYy4wMTMuNzc1LS4xODUgMS41MzgtLjU3MiAyLjIwOGE0LjI1IDQuMjUgMCAwIDEtMS42MjUgMS41OTVsLTcuODg0IDQuNzIxYy0uNjY4LjM4Ny0xLjQyNi41OS0yLjE5Ny41OXMtMS41MjktLjIwNC0yLjE5Ny0uNTlsLTcuODg0LTQuNTlhNC41MiA0LjUyIDAgMCAxLTEuNTg5LTEuNjE2Yy0uMzg1LS42NjUtLjU5NC0xLjQxOC0uNjA4LTIuMTg3di02LjAzMmwtNi44NSA0LjA2NXY2LjAzMmMtLjAxMy43NzUuMTg1IDEuNTM4LjU3MiAyLjIwOGE0LjI1IDQuMjUgMCAwIDAgMS42MjUgMS41OTVsMTQuODY0IDguNjU1Yy42NjguMzg3IDEuNDI2LjU5IDIuMTk3LjU5czEuNTI5LS4yMDQgMi4xOTctLjU5bDE0Ljg2NC04LjY1NWMuNjU3LS4zOTQgMS4yMDQtLjk1IDEuNTg5LTEuNjE2cy41OTQtMS40MTguNjA5LTIuMTg3VjU1LjUzOGMuMDEzLS43NzUtLjE4NS0xLjUzOC0uNTcyLTIuMjA4YTQuMjUgNC4yNSAwIDAgMC0xLjYyNS0xLjU5NWwtMTQuOTkzLTguNzg2eiIgZmlsbD0iI2ZmZiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iQiIgeDE9IjAiIHkxPSIwIiB4Mj0iMjcwIiB5Mj0iMjcwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzA5ZTFmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAzZmY4NSIgc3RvcC1vcGFjaXR5PSIuOTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGV4dCB4PSIzMi41IiB5PSIyMzEiIGZvbnQtc2l6ZT0iMjciIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNBKSIgZm9udC1mYW1pbHk9IlBsdXMgSmFrYXJ0YSBTYW5zLERlamFWdSBTYW5zLE5vdG8gQ29sb3IgRW1vamksQXBwbGUgQ29sb3IgRW1vamksc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPmthc3V3YS5idWlkbDwvdGV4dD48L3N2Zz4=",

      inputItem: {
        itemType: 2,
        token: "0x77556b05ced56eeb8edae5a0e9cd2b4e9948534b",
        identifier: "7",
      },
      name: "kasuwa.buidl",
      symbol: "BNS",
      token_id: "7",
    },
  ],
  [
    {
      amount: "2000000000000000000",
      inputItem: {
        amount: "2000000000000000000",
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      },
      token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
    {
      address: "0x3dad63203f1a62724dacb6a473fe9ae042e2ecc3",
      collectionName: "Cool cats",
      image_url:
        "https://lh3.googleusercontent.com/shLmITS0VLVaFjaCPuFHlAHFBZpfurUGztC_2dXAj1JCpFe9nBk4PHhxVe3rWQHoyBqZw94ce1uBH_etH3vqTN1I53FzAVhHzAXbCg=s250",
      inputItem: {
        itemType: 2,
        token: "0x3dad63203f1a62724dacb6a473fe9ae042e2ecc3",
        identifier: "9",
      },
      name: "Cool Cat #9",
      symbol: "COOL",
      token_id: "9",
    },
    {
      address: "0x3dad63203f1a62724dacb6a473fe9ae042e2ecc3",
      collectionName: "Cool cats",
      image_url:
        "https://lh3.googleusercontent.com/SapH0afE2WYe5KXLcgtVr-wmujPsakFQlNWME3y3xZnXaLPYe4t0xHkjNgu7gHgyeMfYJnzbM41BlmmET4-g9r3tyww88yIShCZGLg=s250",
      inputItem: {
        itemType: 2,
        token: "0x3dad63203f1a62724dacb6a473fe9ae042e2ecc3",
        identifier: "8",
      },
      name: "Cool Cat #8",
      symbol: "COOL",
      token_id: "8",
    },
  ],
];
