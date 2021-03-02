import React from 'react';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // 1. Jeśli jest wygrywająca kombinacja (czyli funkcja calcWin zwraca not null)
    // 2. jeśli squares[i] nie jest nullem --> na początku w stanie jest nullem, aż do kliknięcia, wtedy zamienia się w 'X' lub 'O' i ponowne kliknięcie w to pole powoduje wyjście z metody handleClick (jak wszystkie są kliknięte to nie da sie dalej kliknąć i tak samo nie da się kliknąc dwa razy w to samo!)
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  
  jumpTo(step) {
    // setState forces React to re-render component
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  
  restartGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    });
  }
  
  isGameOver(current_squares) {
    let count = 0;
    for(let i = 0; i < current_squares.length; i++) {
      if(current_squares[i] === null) {
        count++;
      }
    }
    // If there's a winner or every square is filled
    if(calculateWinner(current_squares) || count === 0) {
      return true
    } else {
      return false
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)
    
    const moves  = history.map((step, index) => {
      // If index is not equal 0 (so there were some moves) then return "Move to beginning" 
      // Else if no moves were made, then return "Move to step..."
      // Assigning value to desc using ternary operator
      const desc = index ?
        "Move to step #" + index :
        "Move to the beginning"
      return(
        // Kolejność ruchów w naszej grze nigdy nie będzie zmieniana, nigdy też ruchy nie będą dodawane lub usuwane ze środka tej listy
        // Można więc na ez użyć indeksu elementu jako klucza
         <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
         </li>
      )
    })
    
    let status;
    // If there is a winner ('X' or 'O', not null)
    if (winner) {
      status = "Winner: " + winner;
    } else {
      // if X is next then return X, else return O
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        {this.isGameOver(current.squares) 
         && 
         <button 
           className="restart-btn" 
           onClick={() => this.restartGame()}
         >
              Restart the game!
         </button>}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Maybe to do:
// dodaj potem zmianę wyglądu kwadracików po kliknięciach
// rozwiń styl na ładniejszy
// do tego dodaj inne funkcjonalności

export default Game;
