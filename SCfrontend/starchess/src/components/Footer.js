import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <div className='footer'>
      <Link to="/">
        <img src="/imgbg/logo/Logo_footer.png" alt="Logo" />
      </Link>
      <div className='footer__content'>
        <div className='socials'>
          <IconButton className='icon-div' color="inherit" href="https://github.com/sbogdasha/StarChess-Scroll">
            <GitHubIcon className='icon-svg' />
          </IconButton>
          <IconButton className='icon-div' color="inherit" href="https://twitter.com">
            <TwitterIcon className='icon-svg' />
          </IconButton>
        </div>
        <p className='copy'>Copyright © 2024</p>
      </div>
    </div>
  );
};

export default Footer;
 