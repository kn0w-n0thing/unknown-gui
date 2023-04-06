import {io} from 'socket.io-client';

// TODO: read url from config file
const LOCAL_HOST_URL: string = 'http://localhost:4000';

export const socket = io(LOCAL_HOST_URL, {
  autoConnect: false
});