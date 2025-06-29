import { useCallback, useRef } from 'react';
import SocketEvents from '@/constants/socketEvents';
import useSocket from './useSocket';

interface UseTypingIndicatorProps {
  chatId: string | null;
  socket: ReturnType<typeof useSocket>;
}

export const useTypingIndicator = ({ chatId, socket }: UseTypingIndicatorProps) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const startTyping = useCallback(() => {
    if (!socket || !chatId) return;

    // Only emit if we're not already typing
    if (!isTypingRef.current) {
      socket.emit(SocketEvents.ON_TYPING_START, { chat_id: chatId });
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [socket, chatId]);

  const stopTyping = useCallback(() => {
    if (!socket || !chatId || !isTypingRef.current) return;

    socket.emit(SocketEvents.ON_TYPING_STOP, { chat_id: chatId });
    isTypingRef.current = false;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, chatId]);

  const handleInputChange = useCallback((value: string) => {
    if (value.trim().length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  }, [startTyping, stopTyping]);

  const handleMessageSent = useCallback(() => {
    stopTyping();
  }, [stopTyping]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      stopTyping();
    }
  }, [stopTyping]);

  return {
    handleInputChange,
    handleMessageSent,
    cleanup,
    startTyping,
    stopTyping
  };
};