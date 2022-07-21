import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.style}
      key={props.num}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, color) {
    let style = {
      backgroundColor: color,
    };
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={style}
        num={i}
      />
    );
  }

  render() {
    let matrix = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    let winner = calculateWinner(this.props.squares);
    let a, b, c;
    if (winner) {
      a = winner.a;
      b = winner.b;
      c = winner.c;
    }
    let rows = matrix.map((i, n) => {
      let cols = i.map((j) => {
        if (winner && (a == j || b == j || c == j))
          return this.renderSquare(j, "green");
        else return this.renderSquare(j, "white");
      });
      return (
        <div className="board-row" key={n}>
          {cols}
        </div>
      );
    });

    return rows;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastMove: "",
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      orderIsAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    let row = Math.floor(i / 3) + 1;
    let col = (i % 3) + 1;

    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastMove: "(" + row + "," + col + ")",
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = <></>;
    for (let i = 0; i < history.length; i++) {
      const desc = i
        ? "Go to move #" + i + " " + history[i].lastMove
        : "Go to game start";
      let moves1 = (
        <li key={i}>
          <button onClick={() => this.jumpTo(i)}>
            {i == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
      if (this.state.orderIsAsc) {
        moves = (
          <>
            {moves}
            {moves1}
          </>
        );
      } else {
        moves = (
          <>
            {moves1}
            {moves}
          </>
        );
      }
    }

    /*const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + step.lastMove
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });*/

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      if (this.state.stepNumber == 9) {
        status = "Game Draw";
      } else status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    let button = (
      <button
        onClick={() => {
          this.setState({
            orderIsAsc: !this.state.orderIsAsc,
          });
        }}
      >
        {this.state.orderIsAsc ? "Desc" : "Asc"}
      </button>
    );

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{button}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        a: a,
        b: b,
        c: c,
      };
    }
  }
  return null;
}
