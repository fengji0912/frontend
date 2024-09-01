import React, { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react';

type ChatMessage = {
  sender: 'user' | 'chatbot';
  content: string;
  priority: 'low' | 'mid' | 'high';
  usedText?: string;
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
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'mid' | 'high'>('mid');
  const [viewMode, setViewMode] = useState<'chat' | 'text'>('chat');
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false); // For showing/hiding example questions
  const [showTextBox, setShowTextBox] = useState<string | null>(null); // For showing/hiding the used text
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
        setShowSettings(false); // 点击设置按钮之外的任何地方，关闭下拉列表
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsRef]);
  
  useEffect(() => {
    // Scroll to the bottom whenever messages change
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

  const fetchBotResponse = async (
    prompt: string, 
    history: ChatMessage[]
  ) => {
    const context = itemAbstract;
  
    const formattedHistory = history
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.content}`)
      .join('\n');
  
    const fullPrompt = `Context: ${context}\n${formattedHistory}\nUser: ${prompt}`;
  
    const apiPath = '/api/generateResponse/';
    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // Ensure data contains the expected properties
      return {
        text: data.text || 'Failed to fetch response.',
        usedText: data.usedText || []
      };
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return {
        text: 'Failed to fetch response.',
        usedText: []
      };
    }
  };      

  const fetchExampleQuestions = async (text: string) => {
    const apiPath = '/api/generateQuestions/';

    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: ChatMessage = { 
        sender: 'user', 
        content: input, 
        priority: selectedPriority 
      };
      const updatedMessages: ChatMessage[] = [...messages, userMessage];
      
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true); // Show loading indicator
  
      const botReply = await fetchBotResponse(
        input,
        updatedMessages
      );
  
      const botMessage: ChatMessage = {
        sender: 'chatbot',
        content: botReply.text,
        priority: 'low',
        usedText: botReply.usedText,
      };
  
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsLoading(false); // Hide loading indicator
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
    if (mode === 'chat') {
      setShowExamples(true); // Show examples when switching to chat mode
    }
  };

  const handleButtonClick = async (word: string) => {
    const userMessage: ChatMessage = { 
      sender: 'user', 
      content: word, 
      priority: selectedPriority 
    };
    const updatedMessages: ChatMessage[] = [...messages, userMessage];
  
    setMessages(updatedMessages);
  
    const botReply = await fetchBotResponse(
      word,
      updatedMessages
    );
  
    const botMessage: ChatMessage = {
      sender: 'chatbot',
      content: botReply.text,
      priority: 'low',
      usedText: botReply.usedText,
    };
  
    setMessages(prevMessages => [...prevMessages, botMessage]);
    setShowExamples(false);
  };

  const handleUsedTextButton = (text: string | undefined) => {
    if(text)
    {
      setShowTextBox(text); // Display the used text in the popup
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 w-full max-w-[750px] h-[90vh] max-h-[100vh] transform transition-transform">
      <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-y-auto relative">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 border rounded-lg shadow-lg z-20">
            <div className="loader"></div> {/* Custom loader */}
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <div ref={settingsRef} className="flex space-x-2">
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-lg transition"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
            >
              ⚙️
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-8 bg-white border rounded-lg shadow-lg p-2 w-40 z-50">
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg mb-1"
                  onClick={() => handleViewModeChange('text')}
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
        <div className="mb-4 flex justify-between">
          <div className="flex space-x-2">
            <button
              className={`p-2 rounded-lg border-2 transition ${
                viewMode === 'chat'
                  ? 'border-[#e86161] bg-[#fddcdc] text-[#e86161]'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
              onClick={() => handleViewModeChange('chat')}
            >
              {'Chat'}
            </button>
          </div>
          <div className="flex space-x-2">
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
                selectedPriority === 'mid'
                  ? 'bg-yellow-200 border-yellow-500'
                  : 'bg-yellow-100 border-yellow-300'
              }`}
              onClick={() => handlePriorityChange('mid')}
            >
              {'Mid'}
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
        </div>
        {viewMode === 'chat' && (
          <>
<div className="absolute top-50 left-4 right-4 z-40 bg-gray-100">
    {showExamples ? (
      <div className="border-b bg-white">
        <button
          onClick={() => setShowExamples(false)}
          className="w-full flex items-center justify-between p-1 bg-gray-200 hover:bg-gray-300 border-none text-sm"
          aria-label="Hide example questions"
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
                handleButtonClick(question);
                setShowExamples(false); // 点击后收起下拉列表
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
        aria-label="Show example questions"
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
<div className="relative flex flex-col h-3/5 overflow-y-auto mb-4 border p-2 rounded-lg bg-gray-100">

  {/* 消息列表部分，增加顶部填充避免与示例问题重叠 */}
  <div className="pt-12 pb-2"> {/* 确保消息区域避开示例问题的高度 */}
    {messages.length === 0 ? (
      <p className="text-gray-500 text-center">
        {''}
      </p>
    ) : (
      messages.map((msg, index) => (
        <div
          key={index}
          className={`p-2 mb-2 rounded-lg max-w-xs border-2 ${
            msg.sender === 'user'
              ? 'bg-blue-100 border-blue-300 ml-auto'
              : 'bg-gray-100 border-gray-300 mr-auto'
          }`}
        >
          <div className="p-2 border rounded-lg bg-white shadow-md">
            {msg.content}
          </div>
          {msg.usedText && msg.sender === 'chatbot' && (
            <button
              className="text-xs text-blue-500 hover:text-blue-700 mt-2 block"
              onClick={() => handleUsedTextButton(msg.usedText)}
            >
              [Source]
            </button>
          )}
        </div>
      ))
    )}
    <div ref={messagesEndRef} />
  </div>
</div>

            <div className="relative flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="text-white bg-[#e86161] hover:bg-[#d64949] p-2 rounded-lg transition"
              >
                {'Send'}
              </button>
            </div>
          </>
        )}
        {viewMode === 'text' && (
          <div className="p-2 border rounded-lg h-4/5 overflow-y-auto">
            <p>{itemAbstract}</p>
          </div>
        )}
      </div>
      {/* Render the popup text box if `showTextBox` is not null */}
      {showTextBox && (
        <div className="fixed bottom-16 left-0 bg-white border rounded-lg shadow-lg p-4 max-w-xs max-h-[60vh] overflow-y-auto z-60">
          <button
            onClick={() => setShowTextBox(null)}
            className="absolute top-2 right-2 text-red-500"
            aria-label="Close popup"
          >
            {'×'}
          </button>
          <p>{showTextBox}</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
