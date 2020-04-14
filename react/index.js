import React from 'react';
import Toggle from 'react-toggle';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-toggle/style.css';

function Square(props) {
  return (
      <button 
        className={props.isHighLight ? "square2" : "square"}
        winLine={props.winLine}
        onClick={props.onClick}
      >
        {props.value}
      </button>
  );
}

function Board(props) {

  const clickSquare = useCallback((e) => {
    props.clickSquare(e.currentTarget.id);
  }, [])

  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        id={i}
        value={props.squares[i]}
        isHighLight={props.line && props.line.indexOf(i) >= 0 ? true : false}
        onClick={clickSquare}
      />
    );
  }

  const boardRow = (row) => {
    const items = [];
    for (let col = 0; col < 3; col++) {
      items.push(renderSquare(row * 3 + col))
    }
    return items
  }

  const items = [];
  for (let row = 0; row < 3; row++) {
    items.push(<div key={row} className="board-row">{boardRow(row)}</div>)
  };

  return (
    <div key="0">
      {items}
    </div>
  );
}

function GameInfo(props) {

  const jumpTo = useCallback(() => {
    props.jumpTo(props.stepNumber);
  })

  const moves = props.history.sort((a,b) => {
    if(props.sortByAscend && a.key < b.key) return -1;
    if(!props.sortByAscend && a.key > b.key) return -1;
    if(!props.sortByAscend && a.key < b.key) return 1;
    if(props.sortByAscend && a.key > b.key) return 1;
    return 0;
  }).map((step, move) => {
    let desc = step.key === 0 ?
    'Go to game start' :
    'Go to move #' + step.key + '(' + step.positions.row + ',' + step.positions.col + ')';

    return (
      <li key={step.key}>
          <button 
            className={step.key === state.stepNumber ? 'button.selected' : 'button'} 
            onClick={jumpTo}>
            {desc}
          </button>  
      </li>
    );
  });

  const status = props.winner.player ?
      'Winner: ' + props.winner.player :
      props.history.length === 10 ?
        'Draw' :
        'Next player: ' + (props.xIsNext ? 'X' : 'O');

  return (
    <div>
        <div>{status}</div>
        <label>
          <Toggle
            defaultChecked={this.state.sortByAscend}
            onChange={handleSortChanged}
          />
          <span>{state.sortByAscend ? "Asc" : "Desc"}</span>
        </label>
        <ul>{moves}</ul>
    </div>
  );
}

function Game(props) {

  const [state, setState] = useState({
    history: [{
      key: 0,
      squares: Array(9).fill(null),
      positions: {
        row: 0,
        col: 0, 
      },
    }],
    stepNumber: 0,
    xIsNext: true,
    sortByAscend: true,
  });

  const clickSquare = useCallback((id) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[state.stepNumber];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares).player || squares[id]) {
      return;
    }

    squares[id] = state.xIsNext ? 'X' : 'O';

    const oneHistory = [{
      key: history.length,
      squares: squares,
      positions: {
        row: (id / 3 | 0) + 1,
        col: (id % 3) + 1,
      },
    }]

    setState({
      history: history.concat(oneHistory),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  }, [state.history, state.stepNumber, state.xIsNext]);

  const jumpTo = useCallback((step) => {
    setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }, [state.stepNumber, state.xIsNext]);

  const handleSortChanged = useCallback(() => {
    setState({
      sortByAscend: !state.sortByAscend,
    });
  }, [state.sortByAscend]);

  const history = state.history.slice(0, state.stepNumber + 1)
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={current.squares}
          line={winner.line}
          clickSquare={clickSquare}
        />
      </div>
      <div className="game-info">
        <GameInfo
          stepNumber={state.stepNumber}
          history={history}
          sortByAscend={current.sortByAscend}
          xIsNext={current.xIsNext}
        />
      </div>
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    if (squares[a] && 
        squares[a] === squares[b] && 
        squares[a] === squares[c]) {
      return {player: squares[a], line: [a, b, c]};
    }
  }
  return {player: null, line: null};
}