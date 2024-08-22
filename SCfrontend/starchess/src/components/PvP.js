import { useState, useMemo, useCallback, useEffect } from "react";
import { Container, TextField } from "@mui/material";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Game from "./Game.js";
import socket from '../socket.js';
import InitGame from "./InitGame.js";
import CustomDialog from "./CustomDialog";
import Grid from '@mui/material/Grid'; // Import Material-UI Grid

function PvP() {
  const [username, setUsername] = useState("");
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers("");
  }, []);

  useEffect(() => {
    // const username = prompt("Username");
    // setUsername(username);
    // socket.emit("username", username);

    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });
  }, []);

  // Game component returned jsx
  return (
    <Container>
      {room ? (
        <Game
        room={room}
        orientation={orientation}
        username={username}
        players={players}
        // the cleanup function will be used by Game to reset the state when a game is over
        cleanup={cleanup}
      /> ) : (
        <InitGame
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
      <CustomDialog // <- 5
         open={!usernameSubmitted} // leave open if username has not been selected
         title="Pick a username" // Title of dialog
         contentText="Please select a username" // content text of dialog
         handleContinue={() => { // fired when continue is clicked
           if (!username) return; // if username hasn't been entered, do nothing
           socket.emit("username", username); // emit a websocket event called "username" with the username as data
           setUsernameSubmitted(true); // indicate that username has been submitted
         }}
         >
         <TextField // Input
           autoFocus // automatically set focus on input (make it active).
           margin="dense"
           id="username"
           label="Username"
           name="username"
           value={username}
           required
           onChange={(e) => setUsername(e.target.value)} // update username state with value
           type="text"
           fullWidth
           variant="standard"
         />
       </CustomDialog>
    </Container>
  );
}

export default PvP;