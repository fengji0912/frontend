import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

type ChatMessage = {
  sender: 'user' | 'bot';
  content: string;
  priority: 'low' | 'mid' | 'high';
};

type ChatWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  itemAbstract: string;
};

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-300 border-gray-500',
  mid: 'bg-yellow-200 border-yellow-500',
  high: 'bg-red-200 border-red-500',
};

const extractFirstFiveWords = (text: string): string[] => {
  const words = text.split(/\s+/);
  return words.slice(0, 5);
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  itemAbstract,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<
    'low' | 'mid' | 'high'
  >('mid');
  const [viewMode, setViewMode] = useState<'chat' | 'text'>('chat');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const fetchBotResponse = async (prompt: string) => {
    const apiPath = '/api/generateResponse/';
    console.log(`Requesting API path: ${apiPath}`);
    console.log(`Request body: ${JSON.stringify({ prompt })}`);
  
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Bot response:', data);
      return data.text || 'No response generated.';
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Failed to fetch response.';
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', content: input, priority: selectedPriority },
      ]);
      setInput('');

      const botReply = await fetchBotResponse(
        `${input}\nPriority: ${selectedPriority}`
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', content: botReply, priority: 'low' },
      ]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handlePriorityChange = (priority: 'low' | 'mid' | 'high') => {
    setSelectedPriority(priority);
  };

  const handleViewModeChange = (mode: 'chat' | 'text') => {
    setViewMode(mode);
  };

  const handleButtonClick = async (word: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: word, priority: selectedPriority },
    ]);

    const botReply = await fetchBotResponse(
      `${word}\nPriority: ${selectedPriority}`
    );
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'bot', content: botReply, priority: 'low' },
    ]);
  };

  if (!isOpen) return null;

  const firstFiveWords = extractFirstFiveWords(itemAbstract);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="relative bg-gradient-to-r from-blue-200 to-blue-400 p-6 rounded-lg shadow-lg w-192 h-120 max-w-full max-h-full">
        <div className="absolute top-4 right-4 flex space-x-3">
          <button
            className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition"
            onClick={handleClearMessages}
            aria-label="Clear messages"
          >
            {'Clear'}
          </button>
          <button
            className="text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-full transition"
            onClick={onClose}
            aria-label="Close chat window"
          >
            {'×'}
          </button>
        </div>
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-4">
            <button
              className={`p-2 rounded-lg border-2 transition ${
                viewMode === 'chat'
                  ? 'border-blue-500 bg-blue-200 text-blue-800'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
              onClick={() => handleViewModeChange('chat')}
            >
              {'Chat'}
            </button>
            <button
              className={`p-2 rounded-lg border-2 transition ${
                viewMode === 'text'
                  ? 'border-green-500 bg-green-200 text-green-800'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
              onClick={() => handleViewModeChange('text')}
            >
              {'Text'}
            </button>
          </div>
        </div>
        {viewMode === 'chat' && (
          <>
            <div className="mb-4 flex justify-center space-x-4">
              <button
                className={`p-2 rounded-lg border-2 transition ${
                  selectedPriority === 'low'
                    ? 'border-gray-500 bg-gray-300 text-gray-700'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
                onClick={() => handlePriorityChange('low')}
              >
                {'Low'}
              </button>
              <button
                className={`p-2 rounded-lg border-2 transition ${
                  selectedPriority === 'mid'
                    ? 'border-yellow-500 bg-yellow-200 text-yellow-800'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
                onClick={() => handlePriorityChange('mid')}
              >
                {'Mid'}
              </button>
              <button
                className={`p-2 rounded-lg border-2 transition ${
                  selectedPriority === 'high'
                    ? 'border-red-500 bg-red-200 text-red-800'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
                onClick={() => handlePriorityChange('high')}
              >
                {'High'}
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {'Chat Window'}
            </h2>
            <div className="h-80 overflow-y-auto bg-white p-4 rounded-lg shadow-inner">
              <div className="mb-4 flex flex-wrap gap-2">
                {firstFiveWords.map((word, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleButtonClick(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                  {'No messages yet.'}
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 mb-2 rounded-lg max-w-xs border-2 ${
                      msg.sender === 'user'
                        ? `text-right ml-auto ${priorityStyles[msg.priority]}`
                        : `text-left mr-auto ${priorityStyles[msg.priority]}`
                    }`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
            </div>
            <div className="flex mt-4">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="flex-1 border border-gray-300 p-3 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={'Type your message...'}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-3 rounded-r-lg shadow-lg hover:bg-blue-600 transition"
              >
                {'Send'}
              </button>
            </div>
          </>
        )}
        {viewMode === 'text' && (
          <div className="h-80 overflow-y-auto bg-white p-6 rounded-lg shadow-inner">
            <pre className="text-gray-800 whitespace-pre-wrap">
              {itemAbstract}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
