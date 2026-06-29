import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});

export default socket;
