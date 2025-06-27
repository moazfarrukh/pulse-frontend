// constants/socketEvents.ts
const SocketEvents = {
  // Connection events
  ON_CONNECT: 'connect',
  ON_DISCONNECT: 'disconnect',
  
  ON_ERROR: 'error',
  
  // Chat room events
  ON_JOIN_CHAT: 'chat:join',
  ON_LEAVE_CHAT: 'chat:leave',
  ON_USER_JOINED: 'user:joined',
  ON_USER_LEFT: 'user:left',
  
  // Message events
  ON_MESSAGE: 'message:new',
  ON_MESSAGE_SEND: 'message:send',
  ON_MESSAGE_EDIT: 'message:edit',
  ON_MESSAGE_DELETE: 'message:delete',
  
  // Typing events
  ON_TYPING_START: 'typing:start',
  ON_TYPING_STOP: 'typing:stop',
  
  ON_PRESENCE_UPDATE: 'presence:update',

  // Chat list events
  ON_CHATS_LIST: 'chats:list',
} as const;

export default SocketEvents;