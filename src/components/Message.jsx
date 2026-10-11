function Message({ text, own = false }) {
  return (
    <div className={`message ${own ? 'own' : ''}`}>
      {text}
    </div>
  );
}

export default Message;