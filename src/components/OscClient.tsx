import React, {FC} from 'react';
import {Input, Form, InputNumber} from 'antd';
import './OscClient.css'
import {ConnectStatus} from "./ConnectStatus";

interface Props { id: number; ip?: string; port?: string}

export const OscClient: FC<Props> = ({id = 0, ip= "", port=""}) => {
  return <div className="OscClient" style={{display: 'inline-block'}}>
    <image></image>
    <div>
      {'Screen ' + id}
    </div>
    <Form.Item name={`ip-` + id} rules={[
      {
        required: true,
        message: 'IP address is required!'
      },
      {
        pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        message: 'Invalid IP address!'
      }
    ]}>
      <Input placeholder={'IP address'} size="small"/>
    </Form.Item>

    <Form.Item name={`port-` + id} rules={[
      {
        required: true,
        message: 'Port is required!',
      },
    ]}>
      <InputNumber min={0} max={65535} controls={false} placeholder={'port'}/>
    </Form.Item>
  </div>
}