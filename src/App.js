import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

const total = logs => logs.reduce((tot, el) => tot + el[1] - el[0], 0);

const timelogs = [
  [60, 65],
  [120, 125],
  [200, 205]
];

console.log(timelogs[0][1]);
console.log('-------');

const calcCurrent = played => {
  let current = 0;
  for (let i = 0; i < timelogs.length; i++) {
    if (played > timelogs[i][1]) current += timelogs[i][1] - timelogs[i][0];
    else if (played > timelogs[i][0]){
      current += played - timelogs[i][0];
      break;
    }
  }
  return parseInt(current);
};

const calcNext = played => {
  if (played < timelogs[0][0]) {
    return timelogs[0][0];
  }
  for (let i = 0; i < timelogs.length; i++) {
    if (
      played >= timelogs[i][1] &&
      i < timelogs.length - 1 &&
      played < timelogs[i + 1][0]
    ) {
      return timelogs[i + 1][0];
    }
  }
  return -1;
};

function App() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [played, setPlayed] = useState(timelogs[0][0]);
  const [current, setCurrent] = useState(0);

  const handleProgress = ({ playedSeconds }) => {
    setPlayed(playedSeconds);

    setCurrent(calcCurrent(playedSeconds));

    const next = calcNext(playedSeconds);
    if (next === -1) return;
    ref.current.seekTo(next);
  };

  const playPause = () => {
    setPlaying(playing => !playing);
  };

  const forward = () => {
    setPlayed(played => played + 5);
  };

  const backward = () => {
    setPlayed(played => (played >= 5 ? played - 5 : 0));
  };

  return (
    <>
      <ReactPlayer
        ref={ref}
        url="https://www.youtube.com/watch?v=Rq5SEhs9lws"
        controls={true}
        playing={playing}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onProgress={handleProgress}
      />
      <button onClick={playPause}>{playing ? 'Pause' : 'Play'}</button>
      <button onClick={forward}>Forward</button>
      <button onClick={backward}>Backward</button>
      <p>{current}</p>
    </>
  );
}

export default App;

// ref.current.seekTo(100, 'seconds');
