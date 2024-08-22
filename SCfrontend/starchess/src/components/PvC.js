import React, { useState, useMemo, useEffect } from 'react';
import '../styles/PvC.css'
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Button from '@mui/material/Button'; // Import Material-UI Button
import Grid from '@mui/material/Grid'; // Import Material-UI Grid

class Engine {
  constructor() {
    this.stockfish = new Worker("./stockfish.js");
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

        callback({ bestMove });
      });
    };
    // Init engine
    this.sendMessage("uci");
    this.sendMessage("isready");
  }

  evaluatePosition(fen, depth = 12) {
    if (depth > 24) depth = 24;

    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {
    this.sendMessage("stop"); // Run when changing positions
  }
  quit() {
    this.sendMessage("quit"); // Good to run this before unmounting.
  }

  sendMessage(message) {
    this.stockfish.postMessage(message);
  }
  isComputerTurn(game) {
    return (
      !game.game_over() && // The game is not over
      !game.in_draw() &&   // The game is not in a draw
      game.turn() === 'b'  // It's the computer's turn (black side)
    );
  }
}

const ChessGame = () => {
    const levels = {
      "Hard": 12,
    };
    const engine = useMemo(() => new Engine(), []);
    const game = useMemo(() => new Chess(), []);
  
    const [gamePosition, setGamePosition] = useState(game.fen());
    const [stockfishLevel, setStockfishLevel] = useState(2);

    const pieces = [
      "wP",
      "wN",
      "wB",
      "wR",
      "wQ",
      "wK",
      "bP",
      "bN",
      "bB",
      "bR",
      "bQ",
      "bK",
    ];
    
    const customPieces = useMemo(() => {
      const pieceComponents = {};
      pieces.forEach((piece) => {
        pieceComponents[piece] = ({ squareWidth }) => (
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              backgroundImage: `url(/imgbg/pieces/${piece}.png)`,
              backgroundSize: "100%",
            }}
          />
        );
      });
      return pieceComponents;
    }, []);
  
    function findBestMove() {
      if (engine.isComputerTurn(game)) {
        engine.evaluatePosition(game.fen(), stockfishLevel);
  
        engine.onMessage(({ bestMove }) => {
          if (bestMove) {
            game.move({
              from: bestMove.substring(0, 2),
              to: bestMove.substring(2, 4),
              promotion: bestMove.substring(4, 5),
            });
  
            setGamePosition(game.fen());
          }
        });
      }
    }
  
    function onDrop(sourceSquare, targetSquare, piece) {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1]?.toLowerCase() ?? "q",
      });
      setGamePosition(game.fen());
  
      // illegal move
      if (move === null) return false;
  
      // exit if the game is over
      if (game.game_over() || game.in_draw()) return false;
  
      findBestMove(); // Trigger computer's move
  
      return true;
    }
  
    useEffect(() => {
      if (engine.isComputerTurn(game)) {
        setTimeout(findBestMove, 300); // Only call findBestMove when it's the computer's turn
      }
    }, [gamePosition]);

    return (
      <div className='pvc'>
        <Grid  className='chessboard'  >   
          <Chessboard
            id="PlayVsStockfish"
            className="chessboard"
            position={gamePosition}
            onPieceDrop={onDrop}
            customBoardStyle={{
              width: "100%",
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customDarkSquareStyle={{ backgroundColor: "#CECEDA" }}
            customLightSquareStyle={{ backgroundColor: "#FAFAFA" }}
            customPieces={customPieces}
          />
        </Grid>
      </div>
    );
};

export default ChessGame;
