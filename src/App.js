import React, { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 10;
const TOTAL_SQUARES = BOARD_SIZE * BOARD_SIZE;

// Predefined snakes and ladders (start -> end)
const SNAKES = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const App = () => {
  const [players, setPlayers] = useState([
    { id: 1, position: 0, color: 'red' },
    { id: 2, position: 0, color: 'blue' },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [animatingSquare, setAnimatingSquare] = useState(null); // For snake/ladder animation

const rollDice = () => {
  if (winner || isRolling) return;

  setIsRolling(true);

  let rolls = 0;
  const maxRolls = 10; // how many times dice changes

  const interval = setInterval(() => {
    const randomValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(randomValue);
    rolls++;

    if (rolls >= maxRolls) {
      clearInterval(interval);
      setIsRolling(false);
      movePlayer(randomValue); // final value used
    }
  }, 100); // speed of animation (lower = faster)
};

  const movePlayer = (steps) => {
    const player = players[currentPlayer];
    let newPosition = player.position + steps;
    let isSnake = false;
    let isLadder = false;

    if (SNAKES[newPosition]) {
      isSnake = true;
      newPosition = SNAKES[newPosition];
    } else if (LADDERS[newPosition]) {
      isLadder = true;
      newPosition = LADDERS[newPosition];
    }

    newPosition = Math.min(newPosition, TOTAL_SQUARES);

    // Trigger square animation
    if (isSnake || isLadder) {
      setAnimatingSquare({ position: player.position + steps, type: isSnake ? 'snake' : 'ladder' });
      setTimeout(() => setAnimatingSquare(null), 1000);
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayer].position = newPosition;
    setPlayers(updatedPlayers);

    if (newPosition === TOTAL_SQUARES) {
      setWinner(player.id);
    } else {
      setTimeout(() => setCurrentPlayer((currentPlayer + 1) % players.length), 1000); // Delay for animation
    }
  };

  const getSquarePosition = (num) => {
    const row = Math.floor((num - 1) / BOARD_SIZE);
    const col = (num - 1) % BOARD_SIZE;
    const isEvenRow = row % 2 === 0;
    const x = isEvenRow ? col : BOARD_SIZE - 1 - col;
    const y = BOARD_SIZE - 1 - row;
    return { x, y };
  };

  const renderBoard = () => {
    const squares = [];
    for (let i = 1; i <= TOTAL_SQUARES; i++) {
      const { x, y } = getSquarePosition(i);
      const playersHere = players.filter(p => p.position === i);
      const isAnimating = animatingSquare && animatingSquare.position === i;
      squares.push(
        <div
          key={i}
          className={`square ${SNAKES[i] ? 'snake' : ''} ${LADDERS[i] ? 'ladder' : ''} ${isAnimating ? animatingSquare.type : ''}`}
          style={{
            gridColumn: x + 1,
            gridRow: y + 1,
          }}
        >
          {i}
          {playersHere.map(p => (
            <div key={p.id} className={`player ${p.color} moving`} />
          ))}
        </div>
      );
    }
    return squares;
  };

  return (
    <div className="game">
      <h1>Snake and Ladder Game</h1>
      <div className="board">{renderBoard()}</div>
      <div className="controls">
  <button onClick={rollDice} disabled={isRolling || winner}>
    {isRolling ? 'Rolling...' : 'Roll Dice'}
  </button>

  {diceValue && (
    <div className={`dice ${isRolling ? 'rolling' : ''}`}>
      🎲 {diceValue}
    </div>
  )}

  <div>
    Current Player: Player {players[currentPlayer].id} ({players[currentPlayer].color})
  </div>

  {winner && <div className="winner">Player {winner} wins!</div>}
</div>
    </div>
  );
};

export default App;