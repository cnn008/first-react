import { useState } from "react";
function Winner(squares,HL,cHL,n){
  const lines = [];
  for(let i=1; i<=n*n; i++){
    if(i%n>0 && i%n<=n-4){
      lines.push([i,i+1,i+2,i+3,i+4]);
    }
  }
  for(let i=1; i<=n; i++){
    if(i+4*n<=n*n){
      lines.push([i,i+n,i+2*n,i+3*n,i+4*n]);
    }
  }
  for(let i=1; i<=n*n; i++){
    if(i%n>0 && i%n<=n-4 && i+4*n+4<=n*n){
      lines.push([i,i+n+1,i+2*n+2,i+3*n+3,i+4*n+4]);
    }
  }
  for(let i=4*n; i<=n*n; i++){
    if(i%n>0 && i%n<=n-4){
      lines.push([i,i-n+1,i-2*n+2,i-3*n+3,i-4*n+4]);
    }
  }
  for(let i=0; i<lines.length; i++){
    const [x,y,z,u,v] = lines[i];
    if(!squares[x] || !squares[y] || !squares[z] || !squares[u] || !squares[v]) continue;
    if(squares[x]==squares[y] && squares[y]==squares[z] && squares[z]==squares[u] && squares[u]==squares[v]){
      if(HL[x]!==1 || HL[y]!==1 || HL[z]!==1 || HL[u]!==1 || HL[v]!==1) {
        const newHL=HL.slice();
        newHL[x]=1;
        newHL[y]=1;
        newHL[z]=1;
        newHL[u]=1;
        newHL[v]=1;
        cHL(newHL); 
      }
      return squares[x];
    }
  }
  return null;
}
function Square({value,onSquareClick,flag}) {
  return (
    <button className={flag===null ? "square" : "HLsquare"} onClick={onSquareClick}>
      {value}
    </button>
  );
}
function Board({squares,X,onPlay,HLsquares,changeHL,n}) {
  const winner=Winner(squares,HLsquares,changeHL,n);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }else if(!winner && squares.every(square => square !== null)){
    status = "Draw!";
  }else {
    status = "Next player: " + (X ? "X" : "O");
  }
  function handleClick(i){
    if(squares[i] || winner) return;
    const _squares=squares.slice();
    if(X){
      _squares[i]="X";
    }else{
      _squares[i]="O";
    }
    onPlay(_squares);
  }
  return (
    <>
      <div className="status">{status}</div>
      {Array(n).fill(null).map((_, i) => (
        <div className="board-row" key={i}>
          {Array(n).fill(null).map((_, j) => {
            const id = i*n+j;
            return (
              <Square
                value={squares[id]}
                onSquareClick={() => handleClick(id)}
                flag={HLsquares[id]}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
export default function Game() {
  let N=10;
  const [curX, setX] = useState(true);
  const [history, setHistory] = useState([Array(N*N).fill(null)]);
  const [HLsquares, setHLsquares] = useState([Array(N*N).fill(null)]);
  const currentSquares = history[history.length - 1];
  const curHL=HLsquares[0];
  function handlePlay(newsquare){
    setHistory([...history,newsquare]);
    setX(!curX);
  };
  function handleUndo() {
    setHistory((history) => history.slice(0, -1)); 
    setHLsquares([Array(N*N).fill(null)]);
    setX(!curX);
  };
  function handleReset(){
    setHistory([Array(N*N).fill(null)]);
    setX(true);
    setHLsquares([Array(N*N).fill(null)]);
  }
  function handleHL(newHL){
    setHLsquares([newHL]);
  };
  const undo_button = () => {
    return (
      <div>
        <button onClick={() => handleUndo()}>{'Undo'}</button>
      </div>
    );
  };
  const reset_button = () => {
    return (
      <div>
        <button onClick={() => handleReset()}>{'Reset'}</button>
      </div>
    );
  };
  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board 
            squares={currentSquares} 
            X={curX} 
            onPlay={handlePlay}
            HLsquares={curHL}
            changeHL={handleHL}
            n={N}
          />
        </div>
        <div className="game-info">
          <div>
            <ol>{reset_button()}</ol>
          </div>
          <div>
            {history.length===1 ? null : <ol>{undo_button()}</ol>}
          </div>
        </div>
      </div>
    </>
  );
}