import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Web3Provider } from '@ethersproject/providers';

const Header = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed');
        return;
      }

      // Request access to MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      // Connect to the MetaMask provider
      const ethersProvider = new Web3Provider(window.ethereum); // Create Web3Provider instance
      setProvider(ethersProvider);

      // Set user address and connection status
      setAddress(userAddress);
      setIsConnected(true);
    } catch (error) {
      alert(error.message);
    }
  };

  // Persist connection on reload
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress('');
          setIsConnected(false);
        }
      });
    }
  }, []);

  return (
    <AppBar position="relative" className="header">
      <Toolbar className="header__content">
        <Typography variant="h6" component="div">
          <Link to="/">
            <img src="/imgbg/logo/starchess.png" alt="Logo" />
          </Link>
        </Typography>
        <div className="pages">
          <Button className="pages__btn" color="inherit">
            <Link to="/">ABOUT</Link>
          </Button>
          <Button className="pages__btn" color="inherit">
            <Link to="/leaderboard">LEADERBOARD</Link>
          </Button>
          <Button className="pages__btn" color="inherit">
            <Link to="/pvp">PvP</Link>
          </Button>
          <Button className="pages__btn" color="inherit">
            <Link to="/pvc">PvC</Link>
          </Button>
          <Button className="pages__btn" color="inherit">
            <Link to="/profile">PROFILE</Link>
          </Button>
        </div>
        <Grid className="connect" container>
          {
            isConnected ?
            <Button className="connect__btn" color="inherit">{address.slice(0, 5)}...{address.slice(-4)}</Button> :
            <Button className="connect__btn" color="inherit" onClick={connectWallet}>Connect wallet</Button>
          }
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
