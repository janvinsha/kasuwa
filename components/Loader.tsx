import React from "react";

import styled from "styled-components";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import loaderData from "../public/animations/loader.json";

function Loader({ visible = false }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (!visible) return null;
  return (
    <StyledContainer data-testid="container">
      <Lottie options={defaultOptions} height={200} width={200} />
    </StyledContainer>
  );
}

const StyledContainer = styled(motion.div)`
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
`;

export default Loader;
