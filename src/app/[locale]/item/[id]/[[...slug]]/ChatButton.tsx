'use client'; // Marking as a client-side component

import React, { useState } from 'react';
import ChatWindow from '@/app/[locale]/item/[id]/[[...slug]]/ChatWindow';

type ChatButtonProps = {
  itemAbstract?: string; // Allow undefined
};

const ChatButton: React.FC<ChatButtonProps> = ({ itemAbstract }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatWindow = () => setIsChatOpen(!isChatOpen);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <button
          className={`flex items-center p-4 px-6 bg-[#e86161] text-white shadow-lg transition-transform transform ${isChatOpen ? 'translate-y-0' : 'translate-y-12'} rounded-lg`}
          aria-label="Toggle chat"
          onClick={toggleChatWindow}
          style={{
            border: 'none',
            boxShadow: isChatOpen ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 6px 12px rgba(0, 0, 0, 0.3)',
            minWidth: '300px', // Ensures sufficient width for content
            minHeight: '50px', // Ensures sufficient height for content
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Space out icon, text, and arrow
            padding: '0 16px',
            margin: '0 0 1rem 1rem', // Ensures button is not too close to the edges
          }}
        >
          {/* WeChat-like Icon and Chatbot Text Together */}
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
          {/* Up Arrow Icon */}
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
