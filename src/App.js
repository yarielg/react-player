import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import { ButtonGroup, Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';
import './App.css';

const timelogs = [
  [60, 75],
  [120, 140],
  [200, 215]
];

const total = timelogs.reduce((tot, el) => tot + el[1] - el[0], 0);

const calcCurrent = played => {
  let current = 0;
  for (let i = 0; i < timelogs.length; i++) {
    if (played > timelogs[i][1]) current += timelogs[i][1] - timelogs[i][0];
    else if (played > timelogs[i][0]) {
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
    } else if (played >= timelogs[i][0] && played <= timelogs[i][1]) {
      return -1;
    }
  }
  return -2;
};

const calcPlayedFromCurrent = current => {
  if (current <= 0) return timelogs[0][0];
  for (let i = 0; i < timelogs.length; i++) {
    if (current >= timelogs[i][1] - timelogs[i][0]) {
      current -= timelogs[i][1] - timelogs[i][0];
    } else {
      return timelogs[i][0] + current;
    }
  }
  return timelogs[0][0];
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
    if (next === -2) {
      ref.current.seekTo(timelogs[0][0]);
      setPlaying(false);
      return;
    }
    ref.current.seekTo(next);
  };

  const playPause = () => {
    setPlaying(playing => !playing);
  };

  const forward = () => {
    gotoPlayedFromCurrent(current + 5);
  };

  const backward = () => {
    // ref.current.seekTo(calcPlayedFromCurrent(current - 5));
    gotoPlayedFromCurrent(current - 5);
  };

  const gotoPlayedFromCurrent = value =>
    ref.current.seekTo(calcPlayedFromCurrent(value));

  const changeValue = e => {
    gotoPlayedFromCurrent(e.target.value);
  };

  return (
    <div className="outer">
      <div className="inner">
        <ReactPlayer
          ref={ref}
          url="https://www.youtube.com/watch?v=LKaXY4IdZ40"
          controls={true}
          playing={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onProgress={handleProgress}
        />
      </div>

      <ButtonGroup className="mt-3">
        <Button onClick={backward}>Backward</Button>
        <Button onClick={playPause}>{playing ? 'Pause' : 'Play'}</Button>
        <Button onClick={forward}>Forward</Button>
      </ButtonGroup>

      <h1>{current}</h1>
      <p>{JSON.stringify(timelogs)}</p>

      <div>
        <ProgressBar now={(current / total) * 100} label={`${current}s`} />
      </div>
      <ReactBootstrapSlider
        value={current}
        change={changeValue}
        // slideStop={changeValue}
        step={1}
        max={total}
        min={0}
      />
    </div>
  );
}

export default App;

// ref.current.seekTo(100, 'seconds');
