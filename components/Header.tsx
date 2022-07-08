import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Header = () => {
  return (
    <StyledHeader>
      <h1>KASUWA</h1>
    </StyledHeader>
  );
};

const StyledHeader = styled(motion.div)``;

export default Header;
