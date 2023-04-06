import React, {FC, useEffect, useState} from 'react';
import {ConnectStatus} from "./components/ConnectStatus";
import {Console} from "./components/Console";
import './App.css';
import {OscClient} from "./components/OscClient";
import {Button, Input} from 'antd';

let consoleInitial = [
  `<br/>.##..##..##..##..##..##..##..##...####...##...##..##..##.`,
  `<br/>.##..##..###.##..##.##...###.##..##..##..##...##..###.##.`,
  `<br/>.##..##..##.###..####....##.###..##..##..##.#.##..##.###.`,
  `<br/>.##..##..##..##..##.##...##..##..##..##..#######..##..##.`,
  `<br/>..####...##..##..##..##..##..##...####....##.##...##..##.`,
  `<br/><br/>For detailed instructions on how to setup and run: <a href='https://github.com/fitosegrera/unknown' target='_blank'><strong>README</strong></a><br/>`,
  `<br/>IMPORTANT: Please make sure all clients are up and running (remote-server, local-server, runwayml-(AI)). An indicator highlights the status of each client at any given time: green = connected, red = disconnected.<br/>`,
  `<br/>Once all clients are connected a [START] button will appear on the bottom-right corner of this terminal.<br/>`
];

function App() {
  const [console, setConsole] = useState<string[]>(consoleInitial);

  return (
    <div className="App">
      <div>
        <ConnectStatus status={true} label={"local-server"} />
        <ConnectStatus status={false} label={"dalle-mini-server"}/>
      </div>
      <div>
        <Console content={console.reduce((a, b) => a + b, '')} />
      </div>
      <div>
        <div style={{display: 'inline-block'}}>Auto request interval:</div>
        <div style={{display: 'inline-block'}}>
          <Input size='small' />
        </div>
        <div style={{display: 'inline-block'}}>hour(s).</div>
      </div>
      <div>
        <Button disabled={false} type="primary">Start</Button>
      </div>
      <div>
        <OscClient/>
        <OscClient/>
        <OscClient/>
        <OscClient/>
        <OscClient/>
        <OscClient/>
      </div>
      <div>
        <Button type="primary">Save</Button>
      </div>
    </div>
  );
}

export default App;
