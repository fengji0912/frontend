import React, { ChangeEvent, KeyboardEvent, useState, useEffect } from 'react';

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

const priorityStyles: Record<string, string> = {
  low: 'bg-gray-300 border-gray-500',
  mid: 'bg-yellow-200 border-yellow-500',
  high: 'bg-red-200 border-red-500',
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <div className="flex space-x-2">
            <button
              className="text-white bg-[#e86161] hover:bg-[#d64949] p-2 rounded-lg transition"
              onClick={handleClearMessages}
              aria-label="Clear messages"
            >
              {'Clear'}
            </button>
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
            <button
              className={`p-2 rounded-lg border-2 transition ${
                viewMode === 'text'
                  ? 'border-[#e86161] bg-[#fddcdc] text-[#e86161]'
                  : 'border-gray-300 bg-white text-gray-500'
              }`}
              onClick={() => handleViewModeChange('text')}
            >
              {'Text'}
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
            <div className="h-3/5 overflow-y-auto mb-4 border p-2 rounded-lg bg-gray-100 relative">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                  {'No messages yet.'}
                </p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-2 rounded-lg max-w-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-100 ml-auto'
                        : 'bg-gray-100 mr-auto'
                    }`}
                  >
                    {msg.content}
                    {msg.usedText && msg.sender === 'chatbot' && (
                      <button
                        className="text-xs text-blue-500 hover:text-blue-700"
                        onClick={() => handleUsedTextButton(msg.usedText)}
                      >
                        [Popup]
                      </button>
                    )}
                  </div>
                ))
              )}
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
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="absolute right-2 top-2 bg-gray-200 hover:bg-gray-300 rounded p-1"
                  aria-label="Toggle example questions"
                >
                  {'Example Questions ⬆⬇'}
                </button>
                {showExamples && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-2 max-h-32 overflow-y-auto w-full">
                    {exampleQuestions.slice(0, 5).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleButtonClick(question)}
                        className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded-lg mb-1"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
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
