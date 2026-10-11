import { useState } from 'react';
import Message from './Message';
import { sendMessage } from '../api/apiGreen';

function ChatWindow({ chat, credentials, incomingMessages = [] }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const messageText = text.trim();

    if (!messageText || !chat || sending) return;

    setSending(true);
    setError('');

    try {
      const result = await sendMessage(
        credentials,
        chat.chatId,
        messageText
      );

      setMessages((prev) => [
        ...prev,
        {
            id: result.idMessage || crypto.randomUUID(),
            chatId: String(chat.chatId),
            text: messageText,
            own: true,
        },
        ]);

      setText('');
    } catch (err) {
      setError(err.message || 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  }

  if (!chat) {
    return (
      <div className="empty-chat">
        <h2>Добро пожаловать в MAX</h2>
        <p>Выбери чат слева, чтобы начать переписку</p>
      </div>
    );
  }

  return (
    <section className="chat-window">
      <header className="chat-header">
        <h2>{chat.name}</h2>
      </header>

      <div className="messages">

        {[
        ...messages.filter(
            (message) => message.chatId === String(chat.chatId)
        ),
        ...incomingMessages.filter(
            (message) => message.chatId === String(chat.chatId)
        ),
        ]
        .map((message) => (
            <Message
            key={message.id}
            text={message.text}
            own={message.own}
            />
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Написать сообщение..."
          disabled={sending}
        />

        <button
          type="submit"
          disabled={sending || !text.trim()}
        >
          {sending ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </section>
  );
}

export default ChatWindow;