import React, {useEffect, useState} from 'react';
import {ConnectStatus} from "./components/ConnectStatus";
import {Console} from "./components/Console";
import {OscClient} from "./components/OscClient";
import {Button, Input} from 'antd';
import {socket} from "./socket";
import './App.css';

let terminalInitial = [
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
  const [terminal, setTerminal] = useState<string[]>(terminalInitial);
  const [localServerConnected, setLocalServerConnected] = useState<boolean>(false);
  const [dalleConnected, setDalleConnected] = useState<boolean>(false);
  const [awaitingServer, setAwaitingServer] = useState<boolean>(false);

  // handle connection with local server
  useEffect(() => {
    function onConnect() {
      setLocalServerConnected(true);
    }

    function onDisconnect() {
      setLocalServerConnected(false);
    }

    socket.connect();
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      setLocalServerConnected(false);
    };
  }, []);

  // handle dalle server connection
  useEffect(() => {
    if (localServerConnected) {
      socket.on('dalle-status', connected => {
        setDalleConnected(connected);
      });

      socket.emit('dalle-status');
    } else {
      setDalleConnected(false);
    }

    return () => {
      socket.off('dalle-status');
    }
  }, [localServerConnected]);

  // handle events
  useEffect(() => {
    const terminalPrint = (message: string) => {
      setTerminal([...terminal, '<br/>' + message + '<br/>']);

      // set line number cached by the terminal
      if (terminal.length > 1000) {
        setTerminal(terminal.slice(1));
      }
    };

    socket.on('gui-log', (message: string) => {
      console.log('gui-log: ' + message);
      terminalPrint(message);
    });

    socket.on('get-news-data', (result: boolean, message: string) => {
      setAwaitingServer(false);
      terminalPrint(message);
    })

    return () => {
      socket.off('gui-log');
    }
  })

  return (
    <div className="App">
      <div>
        <ConnectStatus status={localServerConnected} label={"local-server"}/>
        <ConnectStatus status={dalleConnected} label={"dalle-mini-server"}/>
      </div>
      <div>
        <Console content={terminal.reduce((a, b) => a + b, '')}/>
      </div>
      <div>
        <div style={{display: 'inline-block'}}>Auto request interval:</div>
        <div style={{display: 'inline-block'}}>
          <Input size='small'/>
        </div>
        <div style={{display: 'inline-block'}}>hour(s).</div>
      </div>
      <div>
        <Button disabled={!localServerConnected || !dalleConnected || awaitingServer}
                type="primary"
                onClick={() => {
                  socket.emit('get-news-data');
                  setAwaitingServer(true);
                }}>
          Start
        </Button>
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
