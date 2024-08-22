import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const Header = () => {
    
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

function checkElementsInView() {
  const elements = document.querySelectorAll(".phase--r, .phase--l");

  elements.forEach((element) => {
    if (isInViewport(element)) {
      element.classList.add("in-view");
    }
  });
}


  window.addEventListener("scroll", () => {
    checkElementsInView();
  });

  window.addEventListener("load", () => {
    checkElementsInView();
  });

  return (
    <section className='about'>
      <div className='main'>
        <div className='info'>
          <p className='info__logo'>STARCHESS</p>
          <p className='info__text'>Is the ultimate chess game built on Scroll, offering the best way to challenge yourself! With monthly prizes up for grabs, climb the leaderboard and experience intense PvP or PvC matches. Play harder and reap the rewards!</p>
        </div>
        <img className='chess' src="/imgbg/about/chess.png" alt="Logo" />
      </div>
      <div className='svg'>
        <img className='rocket' src="/imgbg/about/rocket.png" alt="Rocket" />
        <div className='roadmap'>
            <div className='roadmap__line'></div>
            <div className='phases'>
                <div className='phase phase--r'>
                    <div className='dot'></div>
                    <div className='roadmap__q roadmap__q--r'>
                        <p className='q'>Q3 2024</p>
                        <p className='q-description'>Launching our alpha-version of Starchess on Scroll</p>
                    </div>
                </div>
                <div className='phase phase--l'>
                    <div className='dot'></div>
                    <div className='roadmap__q roadmap__q--l'>
                        <p className='q'>Q4 2024</p>
                        <p className='q-description q-description--l'>Implementation of functionality for making cryptocurrency-based bets and tracking results</p>
                    </div>
                </div>
                <div className='phase phase--r'>
                    <div className='dot'></div>
                    <div className='roadmap__q roadmap__q--r'>
                        <p className='q'>Q1 2025</p>
                        <p className='q-description'>Additional functionality like tournaments with various rules and rewards</p>
                    </div>
                </div>
                <div className='phase phase--l'>
                    <div className='dot'></div>
                    <div className='roadmap__q roadmap__q--l'>
                        <p className='q'>Q2 2025</p>
                        <p className='q-description q-description--l'>Introduction of a decentralized voting system for decision-making regarding project development</p>
                    </div>
                </div>
                <div className='phase phase--r'>
                    <div className='dot'></div>
                    <div className='roadmap__q roadmap__q--r'>
                        <p className='q'>Q3 2025</p>
                        <p className='q-description'>Partnerships with other blockchain projects and integration with other blockchain applications</p>
                    </div>
                </div>
                <div className='phase phase--l'>
                    <div className='dot'></div>
                </div>
            </div>
          </div>
          <div className='benefits'>
            <div className='benefit'>
              <p className='benefit__title benefit__title--pvp'>PvP</p>
              <p className='benefit__description'>Compete against real players from around the world in thrilling battles that will leave you exhilarated  upon victory.</p>
            </div>
            <div className='benefit'>
              <p className='benefit__title benefit__title--leaderboard'>LEADERBOARD</p>
              <p className='benefit__description'>Challenge yourself and the world, rise to the top-10 and claim your monthly prize! Play your way, win the game!</p>
            </div>
            <div className='benefit'>
              <p className='benefit__title benefit__title--pvc'>PvC</p>
              <p className='benefit__description'>Enhance your strategic strengths with Starchess! Enjoy intense battles through the help of our advanced  bots.</p>
            </div>
          </div>
      </div>
    </section>
  );
};

export default Header;
