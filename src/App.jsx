import { useEffect, useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import ChatWindow from './components/ChatWindow';
import { receiveNotification, deleteNotification, getChats } from './api/apiGreen';
import './index.css';

function App() {
  const [credentials, setCredentials] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsError, setChatsError] = useState('');

  useEffect(() => {
    if (!credentials) return;

    let stopped = false;

    async function pollMessages() {
      while (!stopped) {
        try {
          const notification = await receiveNotification(credentials);

          if (stopped) break;
          if (!notification) continue;

          const body = notification.body;
          console.log('Уведомление GREEN-API:', body);

          const messageData = body?.messageData;
          const senderData = body?.senderData;

          const messageTypes = [
            'incomingMessageReceived',
            'outgoingMessageReceived',
            'outgoingAPIMessageReceived',
          ];

          const text =
            messageData?.textMessageData?.textMessage ??
            messageData?.extendedTextMessageData?.text ??
            messageData?.extendedTextMessageData?.textMessage;

          if (
            messageTypes.includes(body?.typeWebhook) &&
            typeof text === 'string' &&
            senderData?.chatId
          ) {
            const newMessage = {
              id: body.idMessage,
              chatId: String(senderData.chatId),
              text,
              own: body.typeWebhook !== 'incomingMessageReceived',
              senderName: senderData.senderName || senderData.chatName || '',
            };

            setIncomingMessages((previous) => {
              if (previous.some((item) => item.id === newMessage.id)) {
                return previous;
              }

              return [...previous, newMessage];
            });

            setChats((previousChats) => {
              const chatId = String(senderData.chatId);

              const exists = previousChats.some(
                (chat) => String(chat.chatId) === chatId
              );

              if (exists) return previousChats;

              return [
                {
                  chatId,
                  name:
                    senderData.chatName ||
                    senderData.senderName ||
                    chatId,
                  type: senderData.chatType || 'user',
                  unreadCount: 1,
                },
                ...previousChats,
              ];
            });
          }

          await deleteNotification(
            credentials,
            notification.receiptId
          );
        } catch (error) {
          if (!stopped) {
            console.error('Ошибка получения сообщений:', error);

            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        }
      }
    }

    pollMessages();

    return () => {
      stopped = true;
    };
  }, [credentials]);


useEffect(() => {
  if (!credentials) return;

  let cancelled = false;

  async function loadChats() {
    setChatsLoading(true);
    setChatsError('');

    try {
      const data = await getChats(credentials);

      if (cancelled) return;

      if (!Array.isArray(data)) {
        throw new Error('GREEN-API вернул спсиок в неверном формате');
      }

      setChats(data);

      setActiveChat((currentChat) => {
        if (!currentChat) {
          return data[0] ?? null;
        }

        return (
          data.find((chat) => chat.chatId === currentChat.chatId) ??
          data[0] ??
          null
        );
      });
    } catch (error) {
      if (!cancelled) {
        console.error('Не удалось загрузить чаты:', error);
        setChatsError(error.message || 'Не удалось загрузить чаты');
      }
    } finally {
      if (!cancelled) {
        setChatsLoading(false);
      }
    }
  }

  loadChats();

  return () => {
    cancelled = true;
  };
}, [credentials]);


  async function handleGetChats() {
    try {
      const chats = await getChats(credentials);
      console.log('Список чатов GREEN-API:', chats);
    } catch (error) {
      console.error('Не удалось получить чаты:', error);
    }
  }

  if (!credentials) {
    return <Login onConnect={setCredentials} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>MAX</h2>

        <button onClick={handleGetChats}>
          Получить список чатов
        </button>

        {chatsLoading && <p>Загружаем чаты...</p>}

        {chatsError && (<p className="error-message">{chatsError}</p>)}

        <Chat
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
        />
      </aside>

      <main className="chat-area">
        <ChatWindow
          chat={activeChat}
          credentials={credentials}
          incomingMessages={incomingMessages}
        />
      </main>
    </div>
  );
}

export default App;