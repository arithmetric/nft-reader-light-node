# Reading NFT Data with an Ethereum Light Node

This repository demonstrates a technique for reading NFT data, including
token ownership and metadata, from your own Ethereum node.

The goal is showing how NFT data can be accessed without relying on a
third-party service, like OpenSea or Infura.

Starting with the prerequisites listed below, I am able to start an Ethereum
node in a Docker container, let it sync to the current state of the blockchain,
and run scripts to fetch NFT data in under *25 minutes* and with less than
*500 MB* of storage (about 1.5 GB may be used during the sync).

## Prerequisites

This guide assumes you are able to:
- [Run a Docker container with Docker Compose](https://docs.docker.com/compose/install/)
- [Run a Node.js script](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (preferably with [nvm](https://github.com/nvm-sh/nvm))

## Step 1: Start an Ethereum node

This repository includes a `docker-compose.yml` file that runs an Ethereum
node in "light" mode and with the HTTP API exposed for use by scripts.

To start Ethereum, run `docker-compose up` in this repository.

As Ethereum starts up and connects to the network, you will see a lot of
diagnostic messages. Generally you can ignore these and wait 20-30 minutes
for the node to sync. Then continue to step 2 below.

### Why use a "light" node?

There are [three types](https://ethereum.org/en/developers/docs/nodes-and-clients/#node-types)
of Ethereum nodes. For this use case, I recommend using a light node, because
it can be started and stopped easily, and it uses the least amount of CPU and
storage. It does not have a full copy of the blockchain, so it must remain
connected to other Ethereum nodes ("peers") to retrieve NFT data as shown below.

### Notes on the diagnostic messages from the Ethereum node

While running, the Ethereum node outputs diagnostic messages. Once the node is
fully synced, you will most often see two types of messages like the following:

```
INFO [05-08|14:41:15.555] Looking for peers                        peercount=2 tried=4  static=0
INFO [05-08|14:41:20.009] Imported new block headers               count=1   elapsed=5.163ms   number=14,736,674 hash=bdda88..110517 age=1m8s
```

The `Looking for peers` message reports on your node's ability to connect to
other nodes ("peers"). Your node stays in sync with the global Ethereum network
by connecting with peers and exchanging data. The number after `peercount`
reports the number of peers with which your node is connected.

The `Imported new block headers` message means your node has updated its copy
of the blockchain. The number after the label `number` is the latest block
that your node has received. You can compare this with the latest block reported
on websites like [Etherscan](https://etherscan.io/) to confirm your node is in
sync with the global network.

## Step 2: Run the scripts

Now that you have an Ethereum node running, you can use the included scripts
to check the ownership of a token, list the tokens owned by an account, and
get the metadata for a token.

If you use `nvm`, then run `nvm` in the repository root to load Node.js v16.

Then run `npm i` to install the dependencies for the scripts.

### Use `owner.js` to check what account owns a token

Run `node owner.js` to check what account owns a token.

By default, this checks the owner of token 1 in the Autoglyphs collection.
The following is an example of the output:

```
Checking owner of token 1 on contract 0xd4e4078ca3495de5b1d4db434bebc5a986197782...
Connected to Ethereum node with latest block: 14731742
Token 1 is owned by: 0x8088D74111a2368f5b7F0064A581D3bb72e6527e
Done!
```

This script uses the `ownerOf` function from an NFT contract to get the owner
of a specific token. This function is part of the ERC721 standard, so should be
supported by nearly all NFTs. (A notable exception is Cryptopunks, one of the
first NFTs, which preceded the ERC721 standard.)

You can check any token on any contract by running with the arguments:
`node owner.js <contract address> <token ID>`

You will see an error message if the contract address is not a compatible NFT
contract or if the token ID does not exist.

### Use `tokens.js` to list the tokens owned by an account

Run `node tokens.js` to list the IDs of tokens owned by an account.

By default, this lists the tokens owned by an original collector of Autoglyphs.
The following is an example of the output:

```
Listing tokens on contract 0xd4e4078ca3495de5b1d4db434bebc5a986197782 owned by
0x8088D74111a2368f5b7F0064A581D3bb72e6527e...
Connected to Ethereum node with latest block: 14731958
Account 0x8088D74111a2368f5b7F0064A581D3bb72e6527e has 93 tokens.
Account 0x8088D74111a2368f5b7F0064A581D3bb72e6527e owns tokens: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 39, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 68, 69, 71, 73, 76, 78, 79, 80, 81, 82, 83, 88, 89, 90, 91, 95, 96, 99, 100, 102, 105, 106, 107, 109, 110, 111, 112, 114, 115, 116, 117, 119, 120, 123, 124, 125, 127, 128
Done!
```

This script uses the `tokenOfOwnerByIndex` function to iterate through the
tokens owned by a given account. This function is part of an optional extension
of the ERC721 standard, so it is not supported by all contracts.

You can try using the script with any account and any contract by running with
the arguments:
`node tokens.js <contract address> <account address>`

You will see an error message if the contract address does not support this
function.

### Use `metadata.js` to get the metadata for a token

Run the script `node metadata.js` to fetch the metadata for a token, including
its name and image.

By default, this gets the metadata for a token from the Otherside collection.
The following is an example of the output:

```
Fetching metadata for token 1 on contract 0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258...
Connected to Ethereum node with latest block: 14731961
Retrieved data for token 1:
 {
  attributes: [
    { trait_type: 'Category', value: 'Volcanic' },
    { trait_type: 'Sediment', value: 'Biogenic Swamp' },
    { trait_type: 'Sediment Tier', value: 2, display_type: 'number' },
    { trait_type: 'Environment', value: 'Obsidian' },
    {
      trait_type: 'Environment Tier',
      value: 1,
      display_type: 'number'
    },
    { trait_type: 'Western Resource', value: 'Brimstone' },
    {
      trait_type: 'Western Resource Tier',
      value: 3,
      display_type: 'number'
    },
    { trait_type: 'Northern Resource', value: 'Abyssia' },
    {
      trait_type: 'Northern Resource Tier',
      value: 3,
      display_type: 'number'
    },
    { trait_type: 'Plot', value: 1, display_type: 'number' }
  ],
  image: 'https://assets.otherside.xyz/otherdeeds/871079decce602d36188f532fe6623a15d8c6817ecd3bcd9b0c3a2933bb51c3b.jpg'
}
Done!
```

This script uses the `tokenURI` function to get the URI of the token metadata
and then fetches that URI. The conventions for the data returned by the
function are flexible, and this script implements a few of the most common
formats (JSON or text data stored on chain, on IPFS, or over HTTP/S).

You can get the metadata for any token on any contract by running with the
arguments:
`node metadata.js <contract address> <token ID>`
