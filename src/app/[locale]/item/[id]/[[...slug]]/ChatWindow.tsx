import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  itemText: string;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  itemText,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'high'>(
    'low'
  );
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
    if (viewMode === 'chat' && itemText) {
      fetchExampleQuestions(itemText).then(setExampleQuestions);
    }
  }, [viewMode, itemText]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const fetchBotResponse = async (
    question: string,
    history: ChatMessage[],
    priority: 'low' | 'high'
  ) => {
    setShowExamples(false);
    const context = itemText;
    const formattedHistory = history
      .map(
        (msg) => `${msg.sender === 'user' ? 'user' : 'chatbot'}: ${msg.content}`
      )
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
      let accumulatedText = '';
      let isAnswerComplete = false;
      let sourceText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        if (!isAnswerComplete) {
          if (accumulatedText.indexOf(' source') == -1) {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage && lastMessage.sender === 'chatbot') {
                return [
                  ...prevMessages.slice(0, -1),
                  {
                    ...lastMessage,
                    content: lastMessage.content + chunk,
                  },
                ];
              }
              return [
                ...prevMessages,
                {
                  id: uuidv4(),
                  sender: 'chatbot',
                  content: chunk,
                  priority: selectedPriority,
                  source: [],
                },
              ];
            });
          } else {
            isAnswerComplete = true;
          }
        }
      }
      console.error(accumulatedText);
      const sourceMatch = accumulatedText.match(/source:\s*(.*)/);
      sourceText = sourceMatch ? sourceMatch[1] : '';

      const source = sourceText
        .split(/(?<=\.)\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence !== '');
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'chatbot') {
          return [
            ...prevMessages.slice(0, -1),
            {
              ...lastMessage,
              source: source,
            },
          ];
        }
        return [...prevMessages];
      });
    } catch (error) {
      console.error('Error fetching bot response:', error);
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
        priority: selectedPriority,
      };
      const updatedMessages: ChatMessage[] = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);

      await fetchBotResponse(input, messages, selectedPriority);

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
      priority: selectedPriority,
    };
    const updatedMessages: ChatMessage[] = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    await fetchBotResponse(removePrefix(question), messages, selectedPriority);
    setIsLoading(false);
  };

  const handleSourceButton = (source: string | undefined) => {
    if (source) {
      setShowTextBox(source);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-[calc(100vw-16px)] sm:max-w-lg md:max-w-xl lg:max-w-2xl h-[90vh] max-h-[100vh] transform transition-transform dark:bg-secondary-200">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-full relative">
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-2 dark:bg-gray-800">
          <span className="text-xl font-medium p-2 dark:text-white">
            {'Chatbot'}
          </span>
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-700 dark:text-gray-300">
              {'Level of Expertise:'}
            </span>
            <button
              className={`p-2 rounded-lg transition ${
                selectedPriority === 'low'
                  ? 'bg-blue-800 border-blue-900 text-white dark:bg-blue-800 dark:border-blue-900 dark:text-white'
                  : 'bg-blue-300 border-blue-400 text-gray-800 dark:bg-blue-300 dark:border-blue-400 dark:text-gray-800'
              }`}
              onClick={() => handlePriorityChange('low')}
            >
              {'Low'}
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                selectedPriority === 'high'
                  ? 'bg-red-800 border-red-900 text-white dark:bg-red-800 dark:border-red-900 dark:text-white'
                  : 'bg-red-300 border-red-400 text-gray-800 dark:bg-red-300 dark:border-red-400 dark:text-gray-800'
              }`}
              onClick={() => handlePriorityChange('high')}
            >
              {'High'}
            </button>
          </div>
          <div ref={settingsRef} className="p-1 flex items-center space-x-1">
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 p-2 rounded-lg transition dark:bg-gray-600 dark:hover:bg-gray-500"
              onClick={() => setShowSettings(!showSettings)}
            >
              {'⚙️'}
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-12 bg-white border rounded-lg p-1 w-40 z-50 dark:bg-gray-800 dark:border-gray-700">
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg mb-1 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={() => handleViewModeChange('context')}
                >
                  {'context'}
                </button>
                <button
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg mb-1 dark:hover:bg-gray-700 dark:text-gray-300"
                  onClick={handleClearMessages}
                >
                  {'Clear history'}
                </button>
              </div>
            )}
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 p-1 rounded-lg transition dark:bg-gray-600 dark:hover:bg-gray-500"
              onClick={onClose}
              aria-label="Close chat window"
            >
              {'×'}
            </button>
          </div>
        </div>
        {viewMode === 'context' && (
          <div className="absolute top-16 left-4 right-4 z-40 bg-gray-100 dark:bg-gray-900 mb-4">
            <button
              className="flex items-center text-[#e86161] border-none bg-transparent hover:bg-gray-100 text-base font-medium p-2 rounded-lg dark:hover:bg-gray-700"
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
            <div className="p-2 border rounded-lg max-h-[70vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
              <p className="dark:text-gray-300">{itemText}</p>
            </div>
          </div>
        )}
        {viewMode === 'chat' && (
          <>
            <div className="absolute top-16 left-4 right-4 z-40 bg-gray-100 dark:bg-gray-900">
              {showExamples ? (
                <div className="border-b bg-white dark:bg-gray-800">
                  <button
                    onClick={() => setShowExamples(false)}
                    className="w-full flex items-center justify-between p-1 bg-gray-200 hover:bg-gray-300 border-none text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <span className="mx-auto text-xs dark:text-gray-300">
                      {'Example Questions'}
                    </span>
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
                  <div className="border-t dark:border-gray-600 max-h-[200px] overflow-y-auto">
                    {exampleQuestions.slice(0, 5).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleExampleClick(question);
                        }}
                        className="w-full flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-sm dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowExamples(true)}
                  className="w-full flex items-center justify-between p-1 bg-gray-200 hover:bg-gray-300 border-b text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <span className="mx-auto text-xs dark:text-gray-300">
                    {'Example Questions'}
                  </span>
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
            <div className="flex flex-col h-[calc(100%-8rem)] overflow-y-auto mt-16 border p-2 rounded-lg bg-gray-100 dark:bg-gray-900">
              <div className="pt-8 pb-2">
                {messages.length === 0 ? (
                  <p className="text-center dark:text-gray-300">{''}</p>
                ) : (
                  messages.map((msg, index) => {
                    let borderColor;
                    switch (msg.priority) {
                      case 'low':
                        borderColor = 'border-gray-300 dark:border-gray-600';
                        break;
                      case 'high':
                        borderColor = 'border-red-300 dark:border-red-600';
                        break;
                      default:
                        borderColor =
                          'border-yellow-300 dark:border-yellow-600';
                    }
                    return (
                      <div
                        key={index}
                        className={`p-2 mb-2 rounded-lg max-w-xs border-1 ${borderColor} ${
                          msg.sender === 'user'
                            ? `bg-gray-100 ml-auto dark:bg-gray-700`
                            : `bg-gray-100 mr-auto dark:bg-gray-700`
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-white shadow-md dark:bg-gray-800">
                          {msg.content}
                        </div>
                        {msg.source && msg.sender === 'chatbot' && (
                          <div className="mt-2">
                            {msg.source.length > 0 ? (
                              msg.source.map((text, idx) => (
                                <button
                                  key={idx}
                                  className="text-xs text-blue-500 hover:text-blue-700 mt-2 block dark:text-blue-300"
                                  onClick={() => handleSourceButton(text)}
                                >
                                  {`[Source ${idx + 1}]`}
                                </button>
                              ))
                            ) : (
                              <p className="dark:text-gray-300">
                                {'No sources available'}
                              </p>
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
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
          <div className="fixed bottom-16 left-0 bg-white border rounded-lg shadow-lg p-4 max-w-xs max-h-[60vh] overflow-y-auto z-60 dark:bg-gray-800 dark:border-gray-700">
            <button
              onClick={() => setShowTextBox(null)}
              className="absolute top-2 right-2 text-red-500 dark:text-red-300"
            >
              {'×'}
            </button>
            <p className="z-50 dark:text-gray-300">{showTextBox}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
