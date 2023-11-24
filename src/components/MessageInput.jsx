import { useState } from 'react';
import { socket } from '@/utils/socket';

const MessageInput = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    if (selectedUser) {
      console.log('message :', message);
      socket.emit('private message', {
        content: message,
        to: selectedUser.userID,
      });

      // do this because react doesnt re-render otherwise
      const _selectedUser = { ...selectedUser };

      _selectedUser.messages.push({
        content: message,
        // fromSelf: true,
        username: localStorage.getItem('username'),
        from: socket.userID,
      });

      // change the reference to trigger a render
      setSelectedUser(_selectedUser);
    } else {
      console.log('message :', message);
      socket.emit('message', { content: message });
    }

    // Reset input
    setMessage('');
  };

  return (
    <div>
      <p className="is-typing">is typing...</p>
      <form action="" onSubmit={onSubmit} className="input-message-container">
        <input
          type="text"
          value={message}
          name="message"
          id="message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Envoyer un message"
          className="input-message"
        />
      </form>
    </div>
  );
};

export default MessageInput;
