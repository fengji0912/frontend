'use client'; // Marking as a client-side component

import React, { useState } from 'react';

import ChatWindow from '@/app/[locale]/item/[id]/[[...slug]]/ChatWindow';

type ChatButtonProps = {
  itemAbstract?: string; // Allow undefined
};

const ChatButton: React.FC<ChatButtonProps> = ({ itemAbstract }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChatWindow = () => setIsChatOpen(true);
  const closeChatWindow = () => setIsChatOpen(false);

  return (
    <>
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none"
          aria-label="Chat with us"
          onClick={openChatWindow}
        >
          {'Chat'} {/* Wrapped "Chat" in curly braces to fix ESLint error */}
        </button>
      </div>
      <ChatWindow
        isOpen={isChatOpen}
        onClose={closeChatWindow}
        itemAbstract={itemAbstract || 'No abstract available'}
      />
    </>
  );
};

export default ChatButton;
