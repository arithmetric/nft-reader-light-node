import axios from 'axios';
import ethers from 'ethers';

// Define the contract's functions that will be used.
const abi = [
  'function tokenURI(uint256 tokenId) view returns (string)',
];

// Set the address of the contract, defaults to Otherside.
const contractAddress = process.argv[2] || '0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258';

// Set the token ID to check, defaults to 1.
const tokenId = process.argv[3] || '1';

const runner = async () => {
  console.log(`Fetching metadata for token ${tokenId} on contract ${contractAddress}...`);

  // Connect to the local Ethereum node.
  const provider = new ethers.providers.JsonRpcProvider();

  // Get the number of the latest block on the local node.
  const num = await provider.getBlockNumber();
  console.log(`Connected to Ethereum node with latest block: ${num}`);

  // Make the contract functions available for use here.
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Get the token's metadata.
  const tokenURI = await contract.tokenURI(tokenId);

  let tokenData;
  if (tokenURI.match(/data:application\/json;base64,/)) {
    // Handle Base64-encoded JSON
    const tokenParts = tokenURI.match(/data:application\/json;base64,(.*)/);
    const tokenJson = Buffer.from(tokenParts[1], 'base64').toString();
    tokenData = JSON.parse(tokenJson);
  } else if (tokenURI.match(/^data:text\/plain;charset=utf-8,/)) {
    // Handle plain text metadata (for Autoglyphs)
    const tokenParts = tokenURI.match(/data:text\/plain;charset=utf-8,(.*)/);
    [, tokenData] = tokenParts;
  } else if (tokenURI.match(/ipfs:\/\//)) {
    // Handle fetching JSON from IPFS
    const tokenUriParts = tokenURI.match(/ipfs:\/\/(.*)/);
    const tokenUriHttp = `https://ipfs.io/ipfs/${tokenUriParts[1]}`;
    const tokenRes = await axios.get(tokenUriHttp);
    tokenData = tokenRes.data;
  } else if (tokenURI.match(/https?:\/\//)) {
    // Handle fetching JSON from HTTP(S)
    const tokenRes = await axios.get(tokenURI);
    tokenData = tokenRes.data;
  }
  console.log(`Retrieved data for token ${tokenId}:\n`, tokenData);
};

runner()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((err) => {
    console.log('An error occurred:', err);
    process.exit(1);
  });
