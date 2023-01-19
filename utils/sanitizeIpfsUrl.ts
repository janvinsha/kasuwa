const IPFS_GATEWAY = "https://kasuwa.infura-ipfs.io";
const sanitizeIpfsUrl = (url: string) => {
  const gateway = `${IPFS_GATEWAY}/ipfs`;
  if (!url) return url;

  return url
    ?.replace("https://ipfs.io", gateway)
    .replace("https://ipfs.io/ipfs", gateway)
    .replace("https://ipfs.infura.io/ipfs", gateway)
    .replace("ipfs://", gateway);
};

export default sanitizeIpfsUrl;
