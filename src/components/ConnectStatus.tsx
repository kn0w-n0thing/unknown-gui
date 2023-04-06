import React, {FC} from 'react';
import {LinkOutlined, DisconnectOutlined} from "@ant-design/icons";

interface Props {status: boolean; label: string}

export const ConnectStatus:FC<Props> = ({status, label}) => {
  return (<div style={{display: "inline-block", margin: "20px"}}>
    {status? <LinkOutlined style={{color: 'green'}}/> : <DisconnectOutlined style={{color: 'red'}}/>}
    <span>
      {label}: {status? "connected" : "disconnected"}
    </span>
  </div>);
}

