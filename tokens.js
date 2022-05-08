import ethers from 'ethers';

// Define the contract's functions that will be used.
const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
];

// Set the address of the contract, defaults to Autoglyphs.
const contractAddress = process.argv[2] || '0xd4e4078ca3495de5b1d4db434bebc5a986197782';

// Set the address of the user/wallet to check, defaults to an Autoglyphs owner.
const userAddress = process.argv[3] || '0x8088D74111a2368f5b7F0064A581D3bb72e6527e';

const runner = async () => {
  console.log(`Listing tokens on contract ${contractAddress} owned by ${userAddress}...`);

  // Connect to the local Ethereum node.
  const provider = new ethers.providers.JsonRpcProvider();

  // Get the number of the latest block on the local node.
  const num = await provider.getBlockNumber();
  console.log(`Connected to Ethereum node with latest block: ${num}`);

  // Make the contract functions available for use here.
  const contract = new ethers.Contract(contractAddress, abi, provider);

  // Check how many tokens the user's wallet has.
  const balance = await contract.balanceOf(userAddress);
  console.log(`Account ${userAddress} has ${balance} token(s).`);

  // For each token the user has, get the token ID.
  const tokenIds = await Promise.all(
    Array.from(Array(balance.toNumber()))
      .map((val, index) => contract.tokenOfOwnerByIndex(userAddress, index)),
  );
  if (tokenIds.length) {
    console.log(`Account ${userAddress} owns tokens: ${tokenIds.sort((a, b) => a - b).join(', ')}`);
  }
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
