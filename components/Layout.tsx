import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Header from "./Header";

import AppContext from "../context/AppContext";

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(true);
  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme") || "true"));
  }, []);

  return (
    <StyledLayout>
      <AppContext.Provider value={{}}>
        <Header />
        {children}
      </AppContext.Provider>
    </StyledLayout>
  );
};
const StyledLayout = styled(motion.div)``;
export default Layout;
