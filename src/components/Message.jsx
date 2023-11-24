const Message = ({ message }) => {
  if (message.isImage) {
    return (
      <div className="message">
        <p className="message-username">{message.username}</p>
        <img src={message.content} alt="" />
      </div>
    );
  } else {
    return (
      <div className="message">
        <p className="message-username">{message.username}</p>
        <p className="message-content">{message.content}</p>
      </div>
    );
  }
};
export default Message;
