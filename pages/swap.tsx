import { useState, useEffect, useMemo, useContext } from "react";
import Image from "next/image";
import _ from "underscore";
import { TokensModal, ChainsModal, Loader, Filter } from "../components";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import styled from "styled-components";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AppContext from "../context/AppContext";
import BigNumber from "bignumber.js";
import SwingSDK, { TransferParams } from "@swing.xyz/sdk";

const sdk = new SwingSDK();

function Swap() {
  const [chains, setChains] = useState([]);
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [amount, setAmount] = useState();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);

  const [isFromChainModalActive, setFromChainModalActive] = useState(false);
  const [isToChainModalActive, setToChainModalActive] = useState(false);
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();
  const [approveStatus, setApproveStatus] = useState();
  const [swapDistribution, setSwapDistribution] = useState();

  const { theme, currentAccount, connectWallet, chainId } =
    useContext(AppContext);
  const handleTokenListToggle = (target) => {
    if (target == "from") {
      setFromModalActive(true);
    } else {
      setToModalActive(true);
    }
  };
  const handleChainListToggle = (target) => {
    if (target == "from") {
      setFromChainModalActive(true);
    } else {
      setToChainModalActive(true);
    }
  };

  // Connect to a wallet
  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    sdk.wallet.connect(provider);
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    sdk.init().then(() => {
      console.log(sdk, "SDK HERE OOOOO");
      setChains(sdk.chains);
      setFromChain(sdk.chains[0]);
      setToChain(sdk.chains[0]);
    });
  }, []);
  useEffect(() => {
    if (fromChain) setFromToken(fromChain?.tokens[0]);
  }, [fromChain]);

  useEffect(() => {
    if (toChain) setToToken(toChain?.tokens[0]);
  }, [toChain]);

  const getButtonName = () => {
    if (!currentAccount) return "Connect Wallet";
    if (Number(fromChain?.chainId) !== Number(chainId))
      return `Switch to ${fromChain?.name || "Ethereum"}`;
    return "Swap";
  };
  const onClick = async () => {
    try {
      if (!currentAccount) {
        connectWallet();
        return;
      }

      if (fromChain?.chainId !== chainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${ethers.utils.hexlify(fromChain?.chainId)}` }],
        });

        return;
      }
      if (!fromChain || !toChain || !fromToken || !toToken || !amount) {
        console.log("Please check chain and tokens");
        return;
      }

      const tokenAmount = new BigNumber(amount).times(10 ** fromToken?.decimal);

      // Setup transfer parameters
      const transferParams = {
        fromChain: fromChain?.slug,
        toChain: toChain?.slug,

        fromToken: fromToken?.symbol,
        toToken: toToken?.symbol,

        amount: tokenAmount?.toString(),

        fromUserAddress: currentAccount,
        toUserAddress: currentAccount,
      };

      // Get a quote
      setSwapping(true);
      const quote = await sdk.getQuote(transferParams);
      console.log(quote, "IT IS HERE QUOTE");

      // Select an available route from the quote
      const transferRoute = quote.routes[0].route;
      console.log(transferRoute, "IT IS HERE TRANSFER ROUTE");
      // Start a transfer
      const transfer = await sdk.transfer(transferRoute, transferParams);
      console.log(transfer, "TRANSFER STATUS");
      setSwapping(false);
    } catch (error) {
      setSwapping(false);
      alert("An error occurred, try again");
      console.log(error, "EnCOUNTERED AN ERROR");
    }
  };

  const onChangeFromChain = (id) => {
    const chain = chains.find((c) => Number(c.chainId) === Number(id));
    setFromChain(chain);
  };
  const onChangeToChain = (id) => {
    const chain = chains.find((c) => Number(c.chainId) === Number(id));
    setToChain(chain);
  };

  const onChangeFromToken = (addr) => {
    const token = fromChain?.tokens?.find((t) => t.address === addr);
    setFromToken(token);
  };
  const onChangeToToken = (addr) => {
    const token = toChain?.tokens?.find((t) => t.address === addr);
    setToToken(token);
  };

  return (
    <>
      <StyledDex theme_={theme}>
        <Loader visible={swapping} />
        <h2>Swap(Swing) Mainnet</h2>
        <div className="dex">
          <motion.div className="row-chain">
            <span>
              {" "}
              <h3>From Chain</h3>
              <button
                className="secondary-btn"
                onClick={() => handleChainListToggle("from")}
              >
                <img
                  src={
                    fromChain?.logo ||
                    "https://etherscan.io/images/main/empty-token.png"
                  }
                  alt=""
                  width="30px"
                  height="30px"
                />{" "}
                {fromChain?.slug || "ethereum"} <Arrow />
              </button>
            </span>
            <span>
              {" "}
              <h3>To Chain</h3>
              <button
                className="secondary-btn"
                onClick={() => handleChainListToggle("to")}
              >
                <img
                  src={
                    toChain?.logo ||
                    "https://etherscan.io/images/main/empty-token.png"
                  }
                  alt=""
                  width="30px"
                  height="30px"
                />
                {toChain?.slug || "etherum"} <Arrow />
              </button>
            </span>
          </motion.div>

          <motion.div className="row">
            <h3>From</h3>
            <div className="input-row">
              <div className="row-input-div">
                <input
                  type="number"
                  placeholder="0.00"
                  className="row-input"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
              </div>
              <button
                className="token-btn"
                onClick={() => handleTokenListToggle("from")}
              >
                {toToken ? (
                  <>
                    <span>{fromToken?.symbol}</span>
                  </>
                ) : (
                  <span>Select a token</span>
                )}

                <Arrow />
              </button>
            </div>
          </motion.div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1px",
            }}
          >
            <ArrowDownwardIcon />
          </div>
          <motion.div className="row">
            <h3>To</h3>
            <div className="input-row">
              <div className="row-input-div">
                {/* <Input
                  className="row-input down"
                  placeholder="0.00"
                  readOnly
                  // value={
                  //   quote
                  //     ? parseFloat(
                  //         Moralis?.Units?.FromWei(
                  //           quote?.toTokenAmount,
                  //           quote?.toToken?.decimals
                  //         )
                  //       ).toFixed(6)
                  //     : ''
                  // }
                /> */}
                {/* <h3>{toTokenAmountUsd}</h3> */}
              </div>
              <button
                className="token-btn"
                onClick={() => handleTokenListToggle("to")}
              >
                {toToken ? (
                  <>
                    <span>{toToken?.symbol}</span>
                  </>
                ) : (
                  <span>Select a token</span>
                )}

                <Arrow />
              </button>
            </div>
          </motion.div>

          <button
            type="primary"
            size="large"
            className="swap-btn"
            onClick={onClick}
          >
            {getButtonName()}
          </button>
        </div>
      </StyledDex>

      <TokensModal
        title="Select a token"
        show={isFromModalActive}
        onClose={() => setFromModalActive(false)}
        setFromToken={setFromToken}
        tokenList={fromChain?.tokens}
        handleTokenChange={onChangeFromToken}
        target="from"
      />
      <TokensModal
        title="Select a token"
        setToken={setToToken}
        onClose={() => setToModalActive(false)}
        show={isToModalActive}
        tokenList={toChain?.tokens}
        handleTokenChange={onChangeToToken}
        target="to"
      />
      <ChainsModal
        title="Select from chain"
        setChain={setFromChain}
        onClose={() => setFromChainModalActive(false)}
        show={isFromChainModalActive}
        chainList={chains}
        handleChainChange={onChangeFromChain}
        target="to"
      />
      <ChainsModal
        title="Select to chain"
        setChain={setToChain}
        onClose={() => setToChainModalActive(false)}
        show={isToChainModalActive}
        chainList={chains}
        handleChainChange={onChangeToChain}
        target="to"
      />
    </>
  );
}

const StyledDex = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 2rem 0rem;
  h2 {
    font-weight: 500;
  }
  .dex {
    width: 28rem;
    padding: 2rem 2rem 2rem 2rem;
    border-radius: 2rem;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-flow: column wrap;
    -moz-box-shadow: 0 0 3px #0592ec;
    -webkit-box-shadow: 0 0 3px #0592ec;
    box-shadow: 0 0 3px #0592ec;

    background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
    gap: 1rem;
    @media (max-width: 900px) {
      width: 100%;
    }
    .row-chain {
      display: flex;
      width: 100%;
      justify-content: center;
      gap: 1rem;
      h3 {
        font-weight: 500;
      }
      span {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
      }
    }
    .row {
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      h3 {
        font-weight: 500;
      }
      .token-btn {
        display: flex;
        align-items: center;
        gap: 0.1rem;
        outline: none;
      }
      .input-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        -moz-box-shadow: 0 0 3px #0592ec;
        -webkit-box-shadow: 0 0 3px #0592ec;
        box-shadow: 0 0 3px #0592ec;
        border-radius: 2rem;
        padding: 1rem;
        .row-input-div {
          padding: 0.5rem;
          .row-input {
            display: flex;
            background: none;
            font-size: 1.2rem;
            border: none;
            outline: none;
          }
        }
      }
    }
    .gas-texts {
      display: flex;
      gap: 1rem;
    }
    .swap-btn {
      margin-top: 0.5rem;

      padding: 0.6rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.2rem;
      border-radius: 2rem;
    }
  }
`;

export default Swap;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
