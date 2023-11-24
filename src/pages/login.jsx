'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';
import Input from '@/components/Input';

const Login = () => {
  const { push } = useRouter();

  const [username, setUsername] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('username :', username);

    localStorage.setItem('username', username);

    push('/');
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <h1>Connexion</h1>
        <form action="" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </div>
    </main>
  );
};

export default Login;
