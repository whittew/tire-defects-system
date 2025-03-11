import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очистка предыдущих ошибок

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        Login: login,  // Ключи соответствуют вашему Flask API
        Password: password,
      });

      const { role } = response.data; // Получаем роль из ответа

      // Перенаправление в зависимости от роли
      if (role === 1) {
        navigate('/admin');
      } else if (role === 2) {
        navigate('/predict');
      } else {
        setError('Неизвестная роль');
      }
    } catch (err) {
      // Обработка ошибок от сервера
      if (err.response && err.response.status === 401) {
        setError('Пользователь не найден или неверный пароль');
      } else {
        setError('Ошибка сервера');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;