import React, { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; 

type ChatMessage = {
  id: string; 
  sender: 'user' | 'chatbot';
  content: string;
  priority: 'low' | 'high';
  source?: string[];
};

type ChatWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  itemAbstract: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  itemAbstract,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'high'>('low');
  const [viewMode, setViewMode] = useState<'chat' | 'context'>('chat');
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false); 
  const [showTextBox, setShowTextBox] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (viewMode === 'chat' && itemAbstract) {
      fetchExampleQuestions(itemAbstract).then(setExampleQuestions);
    }
  }, [viewMode, itemAbstract]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const fetchBotResponse = async (question: string, history: ChatMessage[], priority: 'low' | 'high') => {
    setShowExamples(false);
    const context = itemAbstract;
    const formattedHistory = history
      .map(msg => `${msg.sender === 'user' ? 'user' : 'chatbot'}: ${msg.content}`)
      .join('\n');
    const fullPrompt = `context: ${context}\n${formattedHistory}\nquestion: ${question}\npriority: ${priority}`;
    const apiPath = '/api/generateResponse/';
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `${fullPrompt}` }),
      });
      if (!response.body) {
        throw new Error('No response body');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedText = '';
  
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
        }
      }
      const parsedResponse = JSON.parse(accumulatedText);
      return {
        answer: parsedResponse.answer,
        source: parsedResponse.source,
      };
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return { answer: 'Failed to fetch response.', source: [] };
    }
  };
  
  const fetchExampleQuestions = async (context: string) => {
    const apiPath = '/api/generateQuestions/';
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.questions || [];
    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  };
  
  const handleClearMessages = () => {
    setMessages([]);
  };

  const handlePriorityChange = (priority: 'low' | 'high') => {
    setSelectedPriority(priority);
    handleClearMessages();
  };

  const handleViewModeChange = (mode: 'chat' | 'context') => {
    setViewMode(mode);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendButton();
    }
  };

  const handleSendButton = async () => {
    if (input.trim()) {
      const userMessage: ChatMessage = { 
        id: uuidv4(), 
        sender: 'user', 
        content: input, 
        priority: selectedPriority 
      };
      const updatedMessages: ChatMessage[] = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
  
      const botReply = await fetchBotResponse(
        input,
        messages,
        selectedPriority
      );
  
      const botMessage: ChatMessage = {
        id: uuidv4(),
        sender: 'chatbot',
        content: botReply.answer,
        priority: selectedPriority,
        source: botReply.source,
      };
  
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsLoading(false); 
    }
  };

  const removePrefix = (text: string) => {
    return text.replace(/^\d+\.\s*/, ''); 
  };

  const handleExampleClick = async (question: string) => {
    const userMessage: ChatMessage = { 
      id: uuidv4(), 
      sender: 'user', 
      content: removePrefix(question), 
      priority: selectedPriority 
    };
    const updatedMessages: ChatMessage[] = [...messages, userMessage];
  
    setMessages(updatedMessages);
    setIsLoading(true);
  
    const botReply = await fetchBotResponse(
      removePrefix(question),
      messages,
      selectedPriority
    );
  
    const botMessage: ChatMessage = {
      id: uuidv4(), 
      sender: 'chatbot',
      content: botReply.answer,
      priority: 'low',
      source: botReply.source,
    };
  
    setMessages(prevMessages => [...prevMessages, botMessage]);
    setIsLoading(false); 
  };
  
  const handleSourceButton = (source: string | undefined) => {
    if(source)
    {
      setShowTextBox(source);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-[750px] h-[90vh] max-h-[100vh] transform transition-transform">
      <div className="bg-white p-4 rounded-lg h-full relative">
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2">
          <span className="text-xl font-medium p-2">Chatbot</span>
          <div className="flex items-center space-x-2">
            <span className="text-base font-medium text-gray-700">
              Level of Expertise:
            </span>
            <button
              className={`p-2 rounded-lg transition ${
                selectedPriority === 'low'
                  ? 'bg-gray-300 border-gray-500'
                  : 'bg-gray-200 border-gray-300'
              }`}
              onClick={() => handlePriorityChange('low')}
            >
              {'Low'}
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                selectedPriority === 'high'
                  ? 'bg-red-200 border-red-500'
                  : 'bg-red-100 border-red-300'
              }`}
              onClick={() => handlePriorityChange('high')}
            >
              {'High'}
            </button>
          </div>
          <div ref={settingsRef} className="flex space-x-2 items-center">
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-lg transition"
              onClick={() => setShowSettings(!showSettings)}
            >
              ⚙️
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-12 bg-white border rounded-lg p-2 w-40 z-50">
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg mb-1"
                  onClick={() => handleViewModeChange('context')}
                >
                  {'context'}
                </button>
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg mb-1"
                  onClick={handleClearMessages}
                >
                  {'Clear history'}
                </button>
              </div>
            )}
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-lg transition"
              onClick={onClose}
              aria-label="Close chat window"
            >
              {'×'}
            </button>
          </div>
        </div>
        {viewMode === 'context' && (
          <div className="absolute top-16 left-4 right-4 z-40 bg-gray-100 mb-4">
               <button
                className="flex items-center text-[#e86161] border-none bg-transparent hover:bg-gray-100 text-base font-medium p-2 rounded-lg"
                onClick={() => handleViewModeChange('chat')}
                >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m7-7l-7 7 7 7"
              />
              </svg>
              {'Back to Chat'}
              </button>
            <div className="p-2 border rounded-lg h-[calc(100%-3rem)] overflow-y-auto">
              <p>{itemAbstract}</p>
            </div>
          </div>
        )}  
        {viewMode === 'chat' && (
          <>
            <div className="absolute top-16 left-4 right-4 z-40 bg-gray-100">
              {showExamples ? (
                <div className="border-b bg-white">
                  <button
                    onClick={() => setShowExamples(false)}
                    className="w-full flex items-center justify-between p-1 bg-gray-200 hover:bg-gray-300 border-none text-sm"
                  >
                    <span className="mx-auto text-xs">{'Example Questions'}</span>
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <div className="border-t">
                    {exampleQuestions.slice(0, 5).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleExampleClick(question);
                        }}
                        className="w-full flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-sm"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowExamples(true)}
                  className="w-full flex items-center justify-between p-1 bg-gray-200 hover:bg-gray-300 border-b text-sm"
                >
                  <span className="mx-auto text-xs">{'Example Questions'}</span>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto mt-16 border p-2 rounded-lg bg-gray-100">
              <div className="pt-8 pb-2">
                {messages.length === 0 ? (
                  <p className="text-center">
                    {''}
                  </p>
                ) : (
                  messages.map((msg, index) => {
                    let borderColor;
                    switch (msg.priority) {
                      case 'low':
                        borderColor = 'border-gray-300';
                        break;
                      case 'high':
                        borderColor = 'border-red-300'; 
                        break;
                      default:
                        borderColor = 'border-yellow-300'; 
                    }
                    return (
                      <div
                        key={index}
                        className={`p-2 mb-2 rounded-lg max-w-xs border-1 ${borderColor} ${
                          msg.sender === 'user'
                            ? `bg-gray-100 ml-auto`
                            : `bg-gray-100 mr-auto`
                        }`} 
                      >
                        <div className="p-2 rounded-lg bg-white shadow-md">
                          {msg.content}
                        </div>
                        {msg.source && msg.sender === 'chatbot' && (
                          <div className="mt-2">
                            {msg.source.length > 0 ? (
                              msg.source.map((text, idx) => (
                                <button
                                  key={idx}
                                  className="text-xs text-blue-500 hover:text-blue-700 mt-2 block"
                                  onClick={() => handleSourceButton(text)}
                                >
                                  [Source]
                                </button>
                              ))
                            ) : (
                              <p>No sources available</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleSendButton}
                className="text-white bg-[#e86161] hover:bg-[#d64949] p-2 rounded-lg transition"
              >
                {'Send'}
              </button>
            </div>
          </>
        )}
        {showTextBox && (
          <div className="fixed bottom-16 left-0 bg-white border rounded-lg shadow-lg p-4 max-w-xs max-h-[60vh] overflow-y-auto z-60">
            <button
              onClick={() => setShowTextBox(null)}
              className="absolute top-2 right-2 text-red-500"
            >
              {'×'}
            </button>
            <p>{showTextBox}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
