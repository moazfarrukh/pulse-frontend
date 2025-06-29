// hooks/useSocket.ts
import { useEffect } from "react";
import { createSocketClient } from "@/clients/socket";
import SocketEvents from "@/constants/socketEvents";
import { usePresenceStore, useUserStore } from "@/store";
import { PresenceUpdatePayload } from "@/types/Socket";
import { useQueryClient } from "@tanstack/react-query";

// Global socket cache to ensure only one socket per user
let globalSocket: ReturnType<typeof createSocketClient> | null = null;
let globalUserId: number | undefined = undefined;

export default function useSocket() {
  const { currentUser: user } = useUserStore();
  const { addActiveUser ,removeActiveUser} = usePresenceStore();

  const queryClient = useQueryClient();
  useEffect(() => {
    // Disconnect previous socket if user changes
    if (globalSocket && globalUserId !== user?.id) {
      globalSocket.disconnect();
      globalSocket = null;
      globalUserId = undefined;
    }
    if (user && (!globalSocket || globalUserId !== user.id)) {
      globalSocket = createSocketClient(user.id);
      globalUserId = user.id;
      const handleConnect = () => {
        console.log("Socket connected:", globalSocket?.id);
      };
      const handleDisconnect = () => {
        console.log("Socket disconnected");
      };
      const handlePresenceUpdate = (data:PresenceUpdatePayload) => {
        if(data.status=== "online") {
            addActiveUser(String(data.user_id));
        } else {  
           removeActiveUser(String(data.user_id));
        }
      };
      globalSocket.on(SocketEvents.ON_PRESENCE_UPDATE, handlePresenceUpdate);
      globalSocket.on(SocketEvents.ON_CREATE_CHAT, () => {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      });
      globalSocket.on(SocketEvents.ON_CONNECT, handleConnect);
      globalSocket.on(SocketEvents.ON_DISCONNECT, handleDisconnect);
      return () => {
        globalSocket?.off(SocketEvents.ON_CONNECT, handleConnect);
        globalSocket?.off(SocketEvents.ON_DISCONNECT, handleDisconnect);
        globalSocket?.off(SocketEvents.ON_PRESENCE_UPDATE, handlePresenceUpdate);
        globalSocket?.disconnect();
        globalSocket = null;
        globalUserId = undefined;
      };
    }
    return () => {};
  }, [user?.id]);

  return globalSocket;
}
