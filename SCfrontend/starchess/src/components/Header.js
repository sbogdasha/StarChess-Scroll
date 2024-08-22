import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const ethersProvider = new Web3Provider(window.ethereum); 
      setProvider(ethersProvider);

      setAddress(userAddress);
      setIsConnected(true);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      } else {
        setAddress('');
        setIsConnected(false);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
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
