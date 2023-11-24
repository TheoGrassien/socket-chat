'use client';

import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import { useRouter } from 'next/router';

import MessageInput from '@/components/MessageInput';
import Message from '@/components/Message';
import Commands from '@/components/Commands';
import Notification from '@/components/Notification';
import NavBar from '@/components/NavBar';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  const { push } = useRouter();

  const messagesContainer = useRef();

  const onSession = ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem('sessionID', sessionID);
    // save the ID of the user
    socket.userID = userID;
  };

  const onMessage = (message) => {
    console.log('message received :', message);
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const getInitMessages = (initMessages) => {
    setMessages(initMessages);
  };

  const getInitUsers = (_users) => {
    console.log('getInitUsers', _users);

    setUsers(_users);
  };

  const scrollToBottom = () => {
    messagesContainer.current.scrollTop =
      messagesContainer.current.scrollHeight;
  };

  const onConnectError = (err) => {
    console.log(err);
    localStorage.clear();
    push('/login');
  };

  const onError = (error) => {
    setError(error);
  };

  const onUserConnect = (_user) => {
    setUsers((prev) => [...prev, _user]);
  };

  const onUserDisconnect = (userID) => {
    setUsers((prev) => prev.filter((user) => user.userID != userID));
  };

  const onPrivateMessage = ({ content, from, to, username }) => {
    // console.log('private message received :', { content, from, to, username });
    const userMessageIndex = users.findIndex((_user) => _user.userID == from);
    const userMessaging = users.find((_user) => _user.userID == from);

    if (!userMessaging) return;

    userMessaging.messages.push({
      content,
      from,
      to,
      username: username,
    });

    //  if (userMessaging.userID !== selectedUser?.userID) {
    //    userMessaging.hasNewMessages = true;
    //  }

    const _users = [...users];
    _users[userMessaging] = userMessaging;

    setUsers(_users);
  };

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');

    // session is already defined
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      // first time connecting and has already visited login page
    } else if (localStorage.getItem('username')) {
      const username = localStorage.getItem('username');
      socket.auth = { username };
      socket.connect();
    } else {
      push('/login');
    }

    socket.on('session', onSession);
    socket.on('message', onMessage);
    socket.on('messages', getInitMessages);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onConnectError);
    socket.on('error', onError);

    return () => {
      socket.off('session', onSession);
      socket.off('message', onMessage);
      socket.off('messages', getInitMessages);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onConnectError);
      socket.off('error', onError);
      socket.off('user connected', onUserConnect);
      socket.off('user disconnected', onUserDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('users', getInitUsers);

    return () => {
      socket.off('users', getInitUsers);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('user connected', onUserConnect);
    socket.on('user disconnected', onUserDisconnect);

    return () => {
      socket.off('user connected', onUserConnect);
      socket.off('user disconnected', onUserDisconnect);
    };
  }, [users]);

  useEffect(() => {
    socket.on('private message', onPrivateMessage);

    return () => {
      socket.off('private message', onPrivateMessage);
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="container">
      <NavBar
        users={users}
        setSelectedUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      <div className="chat">
        <header>
          {selectedUser ? (
            <h1 className="headline">
              Messages privés avec {selectedUser.username}
            </h1>
          ) : (
            <h1 className="headline">Général</h1>
          )}
        </header>
        <div ref={messagesContainer} className="messages-container">
          {selectedUser
            ? selectedUser.messages.map((message, index) => (
                <Message message={message} key={index} />
              ))
            : messages.map((message, index) => (
                <Message message={message} key={index} />
              ))}
        </div>
        <MessageInput
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      {error && (
        <Notification
          title="Une erreur est survenue"
          content={error.error}
          onClose={() => setError(null)}
        />
      )}
      <Commands />
    </div>
  );
};

export default Home;
