import { useState } from 'react';

function Login({ onConnect }) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!idInstance.trim() || !apiTokenInstance.trim()) {
      alert('Заполни оба поля');
      return;
    }

    onConnect({
    apiUrl: 'https://3100.api.green-api.com',
    idInstance: idInstance.trim(),
    apiTokenInstance: apiTokenInstance.trim(),
    });
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>MAX web</h1>
        <p>Подключение через GREEN-API</p>

        <label htmlFor="idInstance">ID инстанса</label>
            <input
            id="idInstance"
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            placeholder="idInstance"
            required
            />

        <label htmlFor="apiTokenInstance">API-токен</label>
            <input
            id="apiTokenInstance"
            type="password"
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            placeholder="apiTokenInstance"
            required
            />

        <button type="submit">Подключиться</button>
      </form>
    </div>
  );
}

export default Login;