import React, {FC} from 'react';
import {Input} from 'antd';
import './OscClient.css'

import {ConnectStatus} from "./ConnectStatus";

export const OscClient: FC = () => {
  return <div className="OscClient" style={{display: 'inline-block'}}>
    <image></image>
    <ConnectStatus status={false} label={'Screen'}/>
    <Input placeholder={'IP address'}/>
    <Input placeholder={'port'}/>
  </div>
}