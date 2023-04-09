import React, {useEffect, useState} from 'react';
import {ConnectStatus} from "./components/ConnectStatus";
import {Console} from "./components/Console";
import {OscClient} from "./components/OscClient";
import {Button, Form, Input, InputNumber} from 'antd';
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
  const [oscClients, setOscClients] = useState<any[]>([{}]);

  const [oscClientsForm] = Form.useForm();
  const [requestForm] = Form.useForm();

  const terminalPrint = (message: string) => {
    setTerminal([...terminal, '<br/>' + message + '<br/>']);

    // set line number cached by the terminal
    if (terminal.length > 1000) {
      setTerminal(terminal.slice(1));
    }
  };

  // handle connection with local server
  useEffect(() => {
    function onConnect() {
      setLocalServerConnected(true);
      requestForm.setFieldsValue({requestInterval: 3});
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

      socket.on('load-osc-config', config => {
        console.log(config);
        const oscClients = JSON.parse(config);
        setOscClients(oscClients);
        oscClients.forEach((client: any) => {
          oscClientsForm.setFieldsValue({[`ip-${client.id}`]: client.ip, [`port-${client.id}`]: client.port});
        });
      })

      socket.emit('dalle-status');
      console.log('load-osc-config');
      socket.emit('load-osc-config');
    } else {
      setDalleConnected(false);
    }

    return () => {
      socket.off('dalle-status');
      socket.off('load-osc-config');
    }
  }, [localServerConnected]);

  // handle events
  useEffect(() => {
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
      socket.off('get-news-data');
    }
  })

  const onRequestData = (value: any) => {
    socket.emit('get-news-data');
    setAwaitingServer(true);

    let hour:number = value['requestInterval']
    if (hour === undefined || hour <= 0) {
      hour = 1;
    }

    terminalPrint('Emit get-news-data in ' + hour + " hour(s).");
    setInterval(() => {
      console.log('get-news-data');
      socket.emit('get-news-data');
      terminalPrint('Emit get-news-data in ' + hour + " hour(s).");
    }, hour * 30 * 30 * 1000);
  }

  const onSaveOscConfig = (values: any) => {
    let oscConfig: any = {};
    for (let key in values) {
      let res = key.split('-');
      const configKey = res[res.length - 1];
      let secondKey = res[0];
      oscConfig[configKey] = {
        ...oscConfig[configKey],
        [secondKey]: values[key]
      }
    }

    const params = [];
    for (let v in oscConfig) {
      params.push({
        id: Number(v),
        port: oscConfig[v]["port"],
        ip: oscConfig[v]["ip"],
      })
    }
    console.log(params);
    socket.emit('save-osc-config', JSON.stringify(params));
  }

  return (
    <div className="App">
      <div>
        <ConnectStatus status={localServerConnected} label={"local-server"}/>
        <ConnectStatus status={dalleConnected} label={"dalle-mini-server"}/>
      </div>
      <div>
        <Console content={terminal.reduce((a, b) => a + b, '')}/>
      </div>
      <Form form={requestForm} onFinish={onRequestData}>
        <div style={{display: 'inline-block'}}>Auto request interval:</div>
        <Form.Item name="requestInterval" style={{display: 'inline-block'}}>
          <InputNumber  min={0} size='small'/>
        </Form.Item>
        <div style={{display: 'inline-block'}}>hour(s).</div>
        <Button disabled={!localServerConnected || !dalleConnected || awaitingServer}
                type="primary"
                htmlType="submit" >
          Start
        </Button>
      </Form>
      <Form form={oscClientsForm} onFinish={onSaveOscConfig}>
        {oscClients?.length && oscClients.map((v, i) => {
          return <OscClient key={i} id={v?.id}/>
        })}
        <div>
          <Button type="primary" htmlType="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
}

export default App;
