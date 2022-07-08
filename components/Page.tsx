import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Page = ({ children }) => {
  return <StyledPage>{children}</StyledPage>;
};

const StyledPage = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  padding: 3rem;
`;

export default Page;
