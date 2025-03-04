import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Опционально для стилей

function App() {
  // Состояние для параметров
  const [params, setParams] = useState({
    Diameter: '',
    Temperature: '',
    Pressure: '',
    Time: '',
    Thickness: '',
    Mold_Temperature: '',
    Steam_Pressure: '',
    Heat_Rate: ''
  });

  // Состояние для предсказаний
  const [predictions, setPredictions] = useState(null);

  // Обработка изменения ввода
  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  // Функция запроса к Flask
  const predict = async () => {
    try {
      console.log('Отправляем запрос с параметрами:', params); // Проверка входных данных
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        Diameter: parseFloat(params.Diameter) || 0,
        Temperature: parseFloat(params.Temperature) || 0,
        Pressure: parseFloat(params.Pressure) || 0,
        Time: parseFloat(params.Time) || 0,
        Thickness: parseFloat(params.Thickness) || 0, 
        Mold_Temperature: parseFloat(params.Mold_Temperature) || 0,
        Steam_Pressure: parseFloat(params.Steam_Pressure) || 0,
        Heat_Rate: parseFloat(params.Heat_Rate) || 0
      });
      console.log('Получен ответ:', response.data); // Проверка ответа
      setPredictions(response.data);
    } catch (error) {
      console.error('Ошибка запроса:', error); // Вывод ошибки
    }
  };

  // Реалтайм через polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.values(params).some(val => val !== '')) { // Запрос только если есть данные
        predict();
      }
    }, 5000); // Каждые 5 секунд
    return () => clearInterval(interval); // Очистка при выходе
  }, [params]);

  return (
    <div className="App">
      <h1>Tire Defect Prediction</h1>
      <div>
        <h2>Input Parameters</h2>
        {Object.keys(params).map((key) => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="number"
              name={key}
              value={params[key]}
              onChange={handleChange}
              placeholder={key}
            />
          </div>
        ))}
        <button onClick={predict}>Predict Now</button>
      </div>
      {predictions && (
        <div>
          <h2>Predictions</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Defect</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(predictions).map(([defect, prob]) => (
                <tr key={defect}>
                  <td>{defect}</td>
                  <td>{(prob * 100).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;