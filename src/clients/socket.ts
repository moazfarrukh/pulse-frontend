import { io, Socket } from 'socket.io-client';

export function createSocketClient(userId?: number): Socket {
  return io('http://localhost:5000', {
    withCredentials: true,
    auth: { userId },
  });
}
