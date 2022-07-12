import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import AppContext from "../context/AppContext";

import SearchIcon from "@mui/icons-material/Search";
interface Props {
  children: any;
}
const HeaderSearch = ({}: Props) => {
  const { theme } = useContext(AppContext);

  const router = useRouter();

  const [text, setText] = useState("");

  useEffect(() => {
    if (text.length > 0) {
      router.push(`/listings?q=${text}`);
    }
  }, [text]);
  return (
    <StyledHeaderSearch theme_={theme}>
      <div className="search">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search"
        />
        <SearchIcon className="icon" />
      </div>
    </StyledHeaderSearch>
  );
};
const StyledHeaderSearch = styled.div<{ theme_: boolean }>`
  width: 100%;
  .search {
    padding: 0.35rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 2px solid ${({ theme_ }) => (theme_ ? " #bdc1d0" : " #eeeaea")};

    .icon {
      color: #bdc1d0;
    }
    input {
      background: inherit;
      border: none;
      font-size: 1rem;
      outline: none;
      color: ${({ theme_ }) => (theme_ ? "white" : "black")};
      height: 2rem;
      width: 100%;
    }
  }
`;
export default HeaderSearch;
