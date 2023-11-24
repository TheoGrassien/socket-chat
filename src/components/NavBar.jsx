import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const NavBar = ({ users, selectedUser, setSelectedUser }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  return (
    <div className="navbar">
      <p className="headline">Bonjour {username}</p>
      <nav>
        <ul>
          <h1 className="subtitle">Canaux</h1>
          <li
            className={selectedUser == null ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setSelectedUser();
            }}
          >
            Général
          </li>
        </ul>
        <div className="divider"></div>
        <ul>
          <h1 className="subtitle">Utilisateurs en ligne</h1>
          <ul className="user-list">
            {users.map((user) => {
              return user.connected ? (
                <li
                  key={user.userID}
                  className={
                    selectedUser?.userID == user.userID
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                >
                  {user.username}
                </li>
              ) : null;
            })}
          </ul>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
