import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

import Filter from "../components/Filter";
import { NftCard } from "../components";
import AppContext from "../context/AppContext";

export default function Listings() {
  const [sortBy, setSortBy] = useState("");
  const [listings, setListings] = useState();
  const { theme, getListings } = useContext(AppContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const tempListings = await getListings();
    setListings(tempListings);
    console.log("HERE ARE THE LISTINGS OOOooooooooooo", tempListings);
  };
  return (
    <StyledListings theme_={theme}>
      <div className="main">
        <div className="header">
          <div className="left">
            <h2>Listings</h2>
          </div>
          <div className="right"></div>
        </div>

        <div className="cards">
          {listings?.map((listing: any, i) => (
            <NftCard listing={listing} key={i} />
          ))}
        </div>
      </div>
    </StyledListings>
  );
}
const StyledListings = styled(motion.div)<{ theme_: boolean }>`
  display: flex;
  flex-flow: column wrap;

  width: 100%;

  padding: 2rem 4rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .left {
      @media screen and (max-width: 900px) {
        display: none;
      }
    }
    .right {
      display: flex;
      gap: 2rem;
      .filt {
        width: 8rem;
      }
    }
  }
  .cards {
    width: 100%;
    padding: 2rem 0rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    @media screen and (max-width: 900px) {
      grid-template-columns: repeat(1, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 0.5rem;
      width: 100%;
      padding: 0rem 0rem;
    }
  }
`;

const dummyData = [
  [
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
  ],
];
