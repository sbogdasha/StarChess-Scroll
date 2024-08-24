require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        scrollSepolia: {
            url: "https://sepolia-rpc.scroll.io",
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        },
        scrollMainnet: {
            url: "https://rpc.scroll.io",
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        }
    },
    etherscan: {
        apiKey: {
            scrollSepolia: process.env.SCROLLSCAN_API_KEY,
            scrollMainnet: process.env.SCROLLSCAN_API_KEY
        },
        customChains: [
            {
                network: 'scrollSepolia',
                chainId: 534351,
                urls: {
                    apiURL: 'https://api-sepolia.scrollscan.com/api',
                    browserURL: 'https://sepolia.scrollscan.com/',
                }
            },
            {
                network: "scrollMainnet",
                chainId: 534352,
                urls: {
                    apiURL: "https://api.scrollscan.com/api",
                    browserURL: "https://scrollscan.com"
                }
            }
        ]
    }
};

