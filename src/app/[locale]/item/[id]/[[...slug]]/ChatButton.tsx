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
            minHeight: '45px', // Ensures sufficient height for content
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
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l2 2 4-4m0 0L21 12V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7l4 4m0-4h10" />
            </svg>
            <span className="text-base font-medium">Chatbot</span>
          </div>
          {/* Up Arrow Icon */}
          <svg
            className={`w-6 h-6 transition-transform ${isChatOpen ? 'rotate-180' : 'rotate-0'}`}
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
