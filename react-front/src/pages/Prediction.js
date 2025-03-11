import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Опционально для стилей

function Predict() {
  // Состояние для параметров
  const [params, setParams] = useState({
    Diameter: '',
    Temperature: '',
    Pressure: '',
    Time: '',
    Thickness: '',
    Mold_Temperature: '',
    Steam_Pressure: '',
    Heat_Rate: '',
  });
  const paramLabels = {
    Diameter: 'Диаметр покрышки (Дюймы)',
    Temperature: 'Температура вулканизации (°C)',
    Pressure: 'Давление капсулы (Бар)',
    Time: 'Время вулканизации (мин)',
    Thickness: 'Толщина резины (мм)',
    Mold_Temperature: 'Температура формы (°C)',
    Steam_Pressure: 'Давление пара (Бар)',
    Heat_Rate: 'Скорость нагрева (°C/мин)'
  };
  
  const labels = {
    // Normal_Prob: 'Норма',
    Bubble_Prob: 'Пузыри',
    Crack_Prob: 'Трещины',
    Uneven_Prob: 'Неравномерность',
    Damage_Prob: 'Повреждения'
  };
  

  // Состояние для предсказаний
  const [predictions, setPredictions] = useState(null);

  // Обработка изменения ввода
  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  // Функция запроса к Flask
  const predict = async () => {
    // Проверяем, заполнены ли все поля
    const hasEmptyFields = Object.values(params).some(value => value.trim() === "");
    
    if (hasEmptyFields) {
      alert("Заполните все поля перед отправкой!");
      return; // Прерываем выполнение функции
    }
  
    try {
      console.log('Отправляем запрос с параметрами:', params);
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        Diameter: parseFloat(params.Diameter),
        Temperature: parseFloat(params.Temperature),
        Pressure: parseFloat(params.Pressure),
        Time: parseFloat(params.Time),
        Thickness: parseFloat(params.Thickness),
        Mold_Temperature: parseFloat(params.Mold_Temperature),
        Steam_Pressure: parseFloat(params.Steam_Pressure),
        Heat_Rate: parseFloat(params.Heat_Rate),
      });
      
      console.log('Получен ответ:', response.data);
      setPredictions(response.data);
    } catch (error) {
      console.error('Ошибка запроса:', error);
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
      <h1>Прогнозирование дефектов</h1>
      <div className="form-container">
        <div className="inputs-container">
          <h2>Вводимые параметры:</h2>
          {Object.keys(params).map((key) => (
            <div className="input-group" key={key}>
              <label>{paramLabels[key]}: </label>
              <input
                type="number"
                name={key}
                value={params[key]}
                onChange={handleChange}
                onKeyDown={(e) => {
                  // Отменяем ввод с клавиш стрелок и других символов
                  if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "." || e.key === "e" || e.key === "E") {
                    e.preventDefault(); // Останавливаем действие клавиши
                  }
                }}
                onInput={(e) => {
                  // Очищаем любые символы, кроме чисел
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                // placeholder={key}
              />
            </div>
          ))}
          <button onClick={predict}>Показать вероятность дефекта</button>
        </div>
        <div className="table-container">
          <h2>Вероятность:</h2>
          <table border="1">
            <thead>
              <tr>
                <th className="skr_l_u">Дефект:</th>
                <th className="skr_r_u">Вероятность:</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(labels).map((defect) => (
                <tr key={defect}>
                  <td>{labels[defect]}</td>
                  <td>{predictions ? `${(predictions[defect] * 100).toFixed(0)} %` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="margin-block">
            <h2>Предположительно проблемные параметры:</h2>
                <ul className="issues-list">
                  {predictions && predictions.Issues && predictions.Issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
          </div>
        </div>
        

      </div>
    </div>
  );
}

export default Predict;