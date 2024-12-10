import { jsPDF } from 'jspdf';
import PocketBase from 'pocketbase';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IData } from '@/types/csl-json';

const url = 'https://glad-drop.pockethost.io/';
const client = new PocketBase(url);

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
  itemId?: string;
  itemText?: string;
  selectedItems?: Array<{ id: string; cslData: IData; type: string }>;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  itemId,
  itemText,
  selectedItems,
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
  const userId = '111111111111111';
  const [LowExist, setLowExist] = useState(false);
  const [HighExist, setHighExist] = useState(false);
  const [item_context, setItemContext] = useState('');

  useEffect(() => {
    const fetchAbstracts = async () => {
      if (itemText) {
        setItemContext(itemText);
      } else if (selectedItems && selectedItems.length === 1) {
        let content = '';
        if (selectedItems[0].cslData.full_text) {
          content = selectedItems[0].cslData.full_text;
          const apiPath = '/api/generateAbstract/';
          try {
            const response = await fetch(apiPath, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setItemContext(data.abstract || 'No abstract available');
          } catch (error) {
            console.error('Error generating Abstract:', error);
            setItemContext('No abstract available');
          }
        } else {
          content =
            selectedItems[0].cslData.abstract || 'No abstract available';
          setItemContext(content);
        }
      } else if (selectedItems && selectedItems.length > 1) {
        const abstracts = await Promise.all(
          selectedItems.slice(0, 5).map(async (item, index) => {
            const { cslData } = item;
            const title = cslData?.title || 'No title available';
            let content = '';
            if (cslData.full_text) {
              content = cslData.full_text || 'No full_text available';
              const apiPath = '/api/generateAbstract/';
              try {
                const response = await fetch(apiPath, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ content }),
                });
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return `paper ${index + 1}: ${title}\n${data.abstract}`;
              } catch (error) {
                console.error('Error generating Abstract:', error);
                return `paper ${index + 1}: ${title}\nNo abstract available`;
              }
            } else {
              content = cslData.abstract || 'No abstract available';
            }
            return `paper ${index + 1}: ${title}\n${content}`;
          })
        );
        setItemContext(abstracts.join('\n\n'));
      }
    };
    fetchAbstracts();
  }, [itemText, selectedItems]);

  const item_id = useMemo(() => {
    if (itemId) {
      return itemId;
    } else if (selectedItems && selectedItems.length === 1) {
      return selectedItems[0].id || 'No id';
    } else if (selectedItems && selectedItems.length > 1) {
      console.log(itemId, selectedItems);
      return selectedItems
        .map((item) => {
          const content = item.id || 'No id';
          return `${content}`;
        })
        .join(',');
    }
    return '';
  }, [itemId, selectedItems]);

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

  const handleViewModeChange = (mode: 'chat' | 'context') => {
    setViewMode(mode);
  };

  useEffect(() => {
    if (viewMode === 'chat' && item_context) {
      fetchExampleQuestions(item_context).then(setExampleQuestions);
    }
  }, [viewMode, item_context]);

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

    if (updatedMessages.length == 1) {
      const data_m = {
        itemId: item_id,
        userId: userId,
        ChatMessage: updatedMessages,
        priority: selectedPriority,
      };
      await client.collection('Messages').create(data_m);
      if (selectedPriority == 'low') {
        setLowExist(true);
      } else {
        setHighExist(true);
      }
    } else {
      const record = await client
        .collection('Messages')
        .getFirstListItem(
          `userId = "${userId}" && itemId = "${item_id}" && priority="${selectedPriority}"`
        );
      if (record) {
        const data_update = {
          itemId: item_id,
          userId: userId,
          ChatMessage: updatedMessages,
          priority: selectedPriority,
        };
        await client.collection('Messages').update(record.id, data_update);
      }
    }

    setMessages(updatedMessages);
    setIsLoading(true);

    await fetchBotResponse(removePrefix(question), messages, selectedPriority);
    setIsLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
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

      if (updatedMessages.length == 1) {
        const data_m = {
          itemId: item_id,
          userId: userId,
          ChatMessage: updatedMessages,
          priority: selectedPriority,
        };
        await client.collection('Messages').create(data_m);
        if (selectedPriority == 'low') {
          setLowExist(true);
        } else {
          setHighExist(true);
        }
      } else {
        const record = await client
          .collection('Messages')
          .getFirstListItem(
            `userId = "${userId}" && itemId = "${item_id}" && priority="${selectedPriority}"`
          );
        if (record) {
          const data_update = {
            itemId: item_id,
            userId: userId,
            ChatMessage: updatedMessages,
            priority: selectedPriority,
          };
          await client.collection('Messages').update(record.id, data_update);
        }
      }

      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);

      await fetchBotResponse(input, messages, selectedPriority);

      setIsLoading(false);
    }
  };

  const handlePriorityChange = async (priority: 'low' | 'high') => {
    setSelectedPriority(priority);
    if (priority == 'low') {
      if (LowExist == true) {
        const record = await client
          .collection('Messages')
          .getFirstListItem(
            `userId = "${userId}" && itemId = "${item_id}" && priority="${priority}"`
          );
        setMessages(record.ChatMessage);
      } else {
        setMessages((prevMessages) => {
          return [...prevMessages].filter(
            (message) => message.priority == 'low'
          );
        });
      }
    } else {
      if (HighExist == true) {
        const record = await client
          .collection('Messages')
          .getFirstListItem(
            `userId = "${userId}" && itemId = "${item_id}" && priority="${priority}"`
          );
        setMessages(record.ChatMessage);
      } else {
        setMessages((prevMessages) => {
          return [...prevMessages].filter(
            (message) => message.priority == 'high'
          );
        });
      }
    }
  };

  const fetchBotResponse = async (
    question: string,
    history: ChatMessage[],
    priority: 'low' | 'high'
  ) => {
    setShowExamples(false);
    const context = item_context;
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

        // Check for Source using regex
        const sourceRegex = /(?:\n| )Source:\s*(.*)/;
        const sourceMatch = accumulatedText.match(sourceRegex);

        if (!isAnswerComplete) {
          if (!sourceMatch) {
            // Stream answer if Source is not detected
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage?.sender === 'chatbot') {
                return [
                  ...prevMessages.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + chunk },
                ];
              }
              const newMessage: ChatMessage = {
                id: uuidv4(),
                sender: 'chatbot',
                content: chunk,
                priority,
                source: [],
              };
              updatePocketBase([...prevMessages, newMessage], priority);
              return [...prevMessages, newMessage];
            });
          } else {
            // Extract answer and mark as complete
            const sourceIndex = sourceMatch.index;
            const answer = accumulatedText.substring(0, sourceIndex).trim();
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage?.sender === 'chatbot') {
                return [
                  ...prevMessages.slice(0, -1),
                  { ...lastMessage, content: answer },
                ];
              }
              const newMessage: ChatMessage = {
                id: uuidv4(),
                sender: 'chatbot',
                content: answer,
                priority,
                source: [],
              };
              updatePocketBase([...prevMessages, newMessage], priority);
              return [...prevMessages, newMessage];
            });
            isAnswerComplete = true;
          }
        }
      }

      console.log(accumulatedText);
      const sourceMatch = accumulatedText.match(/Source:\s*(.*)/);
      sourceText = sourceMatch ? sourceMatch[1] : '';
      console.log(sourceMatch, sourceText);

      const source = sourceText
        .split(/(?<=\.)\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence !== '');

      // Update messages with source
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'chatbot') {
          const updatedMessages = [
            ...prevMessages.slice(0, -1),
            {
              ...lastMessage,
              source: source,
            },
          ];
          // Update PocketBase
          updatePocketBase(updatedMessages, priority);
          return updatedMessages;
        }
        return [...prevMessages];
      });
    } catch (error) {
      console.error('Error fetching bot response:', error);
    }
  };

  // Function to update PocketBase
  const updatePocketBase = async (
    updatedMessages: ChatMessage[],
    priority: 'low' | 'high'
  ) => {
    try {
      const record = await client
        .collection('Messages')
        .getFirstListItem(
          `userId = "${userId}" && itemId = "${item_id}" && priority="${priority}"`
        );
      const data = {
        itemId: item_id,
        userId: userId,
        ChatMessage: updatedMessages,
        priority,
      };
      if (record) {
        await client.collection('Messages').update(record.id, data);
      } else {
        await client.collection('Messages').create(data);
      }
    } catch (error) {
      console.error('Error updating PocketBase:', error);
    }
  };

  const handleSourceButton = (source: string | undefined) => {
    if (source) {
      setShowTextBox(source);
    }
  };

  const handleClearMessages = async () => {
    setMessages([]);
    setLowExist(false);
    setHighExist(false);
    client.autoCancellation(false);
    await client.admins.authWithPassword('2456594919@qq.com', '1234567890');
    const records = await client.collection('Messages').getFullList({
      filter: `userId = "${userId}" && itemId = "${item_id}"`,
    });

    for (const record of records) {
      await client.collection('Messages').delete(record.id);
    }
  };

  const exportChatToPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(12);

    const marginLeft = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * marginLeft;

    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    const addNewPageIfNeeded = (requiredHeight: number) => {
      if (y + requiredHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const contextText = `Context:\n ${item_context}`;
    const contextLines = doc.splitTextToSize(contextText, contentWidth);
    const contextHeight = contextLines.length * 5;
    addNewPageIfNeeded(contextHeight);
    doc.text(contextLines, marginLeft, y);
    y += contextHeight + 5;

    const itemIdText = `Item ID: ${item_id}`;
    const itemIdLines = doc.splitTextToSize(itemIdText, contentWidth);
    const itemIdHeight = itemIdLines.length * 5;
    addNewPageIfNeeded(itemIdHeight);
    doc.text(itemIdLines, marginLeft, y);
    y += itemIdHeight + 5;

    const userIdText = `User ID: ${userId}`;
    const userIdLines = doc.splitTextToSize(userIdText, contentWidth);
    const userIdHeight = userIdLines.length * 5;
    addNewPageIfNeeded(userIdHeight);
    doc.text(userIdLines, marginLeft, y);
    y += userIdHeight + 5;

    const chatHistoryHeader = 'Chat History:';
    const headerLines = doc.splitTextToSize(chatHistoryHeader, contentWidth);
    const headerHeight = headerLines.length * 5;
    addNewPageIfNeeded(headerHeight);
    doc.text(headerLines, marginLeft, y);
    y += headerHeight + 5;

    messages.forEach((message) => {
      const sender = message.sender === 'user' ? 'You' : 'Chatbot';
      const content = `${sender}: ${message.content}`;
      const contentLines = doc.splitTextToSize(content, contentWidth);
      const contentHeight = contentLines.length * 5;
      addNewPageIfNeeded(contentHeight);
      doc.text(contentLines, marginLeft, y);
      y += contentHeight + 5;

      if (message.source && message.source.length > 0) {
        message.source.forEach((source) => {
          const sourceText = `Source: ${source}`;
          const sourceLines = doc.splitTextToSize(sourceText, contentWidth);
          const sourceHeight = sourceLines.length * 5;
          addNewPageIfNeeded(sourceHeight);
          doc.text(sourceLines, marginLeft, y);
          y += sourceHeight + 5;
        });
      }

      y += 5;
    });

    doc.save(`chat-history-${item_id}.pdf`);
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
              <p className="dark:text-gray-300">
                {item_context.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
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
              <button
                onClick={exportChatToPDF}
                className="text-white bg-[#e86161] hover:bg-[#d64949] rounded-lg transition"
              >
                {'Export Chat'}
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
