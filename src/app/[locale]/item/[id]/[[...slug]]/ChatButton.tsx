'use client';

import React, { useState } from 'react';
import ChatWindow from '@/app/[locale]/item/[id]/[[...slug]]/ChatWindow';

type ChatButtonProps = {
  itemAbstract?: string;
};

const ChatButton: React.FC<ChatButtonProps> = ({ itemAbstract }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatWindow = () => setIsChatOpen(!isChatOpen);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <button
          className={`bg-[#e86161] text-white transition-transform transform ${isChatOpen ? 'translate-y-0' : 'translate-y-12'} rounded-lg`}
          onClick={toggleChatWindow}
          style={{
            border: 'none',
            minWidth: '300px',
            minHeight: '50px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            margin: '0 0 1rem 1rem', 
          }}
        >
          <div className="flex items-center">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8c-1.704 0-3.297-.48-4.637-1.312L3 20l1.689-3.542A7.962 7.962 0 0 1 4 12z" />
            </svg>
            <span 
              className="w-6 h-8 text-base font-medium">Chatbot</span>
          </div>
          <svg
            className={`w-10 h-10 transition-transform ${isChatOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 15l-7-7-7 7" />
          </svg>
        </button>
        <ChatWindow
          isOpen={isChatOpen}
          onClose={toggleChatWindow}
          itemAbstract={itemAbstract || 'No abstract available'}
        />
      </div>
    </>
  );
};

export default ChatButton;
