import ethers from 'ethers';

// Define the contract's functions that will be used.
const abi = [
  'function ownerOf(uint256 tokenId) view returns (address)',
];

// Set the address of the contract, defaults to Autoglyphs.
const contractAddress = process.argv[2] || '0xd4e4078ca3495de5b1d4db434bebc5a986197782';

// Set the token ID to check, defaults to 1.
const tokenId = process.argv[3] || '1';

const runner = async () => {
  console.log(`Checking owner of token ${tokenId} on contract ${contractAddress}...`);

  // Connect to the local Ethereum node.
  const provider = new ethers.providers.JsonRpcProvider();

  // Get the number of the latest block on the local node.
  const num = await provider.getBlockNumber();
  console.log(`Connected to Ethereum node with latest block: ${num}`);

  // Make the contract functions available for use here.
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Check the owner of the given token.
  const ownerOf = await contract.ownerOf(tokenId);
  console.log(`Token ${tokenId} is owned by: ${ownerOf}`);
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
