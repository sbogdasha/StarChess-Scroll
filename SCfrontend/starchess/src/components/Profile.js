import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import { contractABI } from '../contractABI'; 
import '../styles/Profile.css';

const Profile = () => {
  const contractAddress = '0x1f0AC39E98bc6f5204F2Cc327c3dBc7dF20818BF';
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenURI, setTokenURI] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const tempProvider = new BrowserProvider(window.ethereum);
          setProvider(tempProvider);

          const accounts = await tempProvider.send('eth_requestAccounts', []);
          setAccount(accounts[0]);

          const tempSigner = await tempProvider.getSigner();
          setSigner(tempSigner);

          const tempContract = new Contract(contractAddress, contractABI, tempSigner);
          setContract(tempContract);

          const balanceBigInt = await tempContract.getMyWalletMints();
          const balance = Number(balanceBigInt.toString());
          if (balance > 0) {
            const uri = await tempContract.tokenURI(balance - 1);
            setTokenURI(uri);
          } else {
            setTokenURI(null); 
          }
        } catch (error) {
          console.error('Error connecting to contract:', error);
        }
      }
    };

    init();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);

        const tempProvider = new BrowserProvider(window.ethereum);
        setProvider(tempProvider);
        const tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
        const tempContract = new Contract(contractAddress, contractABI, tempSigner);
        setContract(tempContract);

        const balanceBigInt = await tempContract.getMyWalletMints();
        const balance = Number(balanceBigInt.toString());
        if (balance > 0) {
          const uri = await tempContract.tokenURI(balance - 1);
          setTokenURI(uri);
        } else {
          setTokenURI(null); 
        }
      } else {
        setAccount(null);
        setTokenURI(null); 
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const handleMintClick = async () => {
    if (contract && signer) {
      try {
        const balanceBigInt = await contract.getMyWalletMints();
        const balance = Number(balanceBigInt.toString());
        if (balance >= 1) {
          throw new Error('Mint limit per wallet exceeded');
        }

        const tx = await contract.mintToken({ value: parseEther('0.001') });
        await tx.wait();

        const newBalanceBigInt = await contract.getMyWalletMints();
        const newBalance = Number(newBalanceBigInt.toString());
        const uri = await contract.tokenURI(newBalance - 1);
        setTokenURI(uri);
      } catch (error) {
        console.error('Error during minting:', error);
      }
    }
  };

  const resolveIPFS = (uri) => {
    if (uri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${uri.split('ipfs://')[1]}`;
    }
    return uri;
  };

  return (
    <div className="profile-container">
      <div className="profile-picture">
        {tokenURI ? (
          <div className="nft-display">
            <img src={resolveIPFS(tokenURI)} alt="Minted NFT" />
          </div>
        ) : (
          <button className="mint-btn" onClick={handleMintClick}>Mint your profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
