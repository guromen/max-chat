function Chat({ chats = [], activeChat, onSelectChat }) {
  if (chats.length === 0) {
    return <p className="empty-chats">Нет чатов</p>;
  }

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <button
          key={chat.chatId}
          type="button"
          className={`chat-item ${activeChat?.chatId === chat.chatId ? 'active' : ''}`}
          onClick={() => onSelectChat(chat)}
        >
          <span className="chat-name">{chat.name || chat.chatId}</span>
          {chat.unreadCount > 0 && (<span className="unread-count">{chat.unreadCount}</span>)}
        </button>
      ))}
    </div>
  );
}

export default Chat;
