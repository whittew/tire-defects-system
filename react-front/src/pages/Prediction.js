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
    Heat_Rate: ''
  });
  const paramLabels = {
    Diameter: 'Диаметр',
    Temperature: 'Температура',
    Pressure: 'Давление',
    Time: 'Время',
    Thickness: 'Толщина',
    Mold_Temperature: 'Температура формы',
    Steam_Pressure: 'Давление пара',
    Heat_Rate: 'Скорость нагрева'
  };
  
  const labels = {
    Normal_Prob: 'Норма',
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
                placeholder={key}
              />
            </div>
          ))}
          <button onClick={predict}>Показать вероятность дефекта</button>
        </div>
        <div className="table-container">
          {predictions && (
            <div>
              <h2>Вероятность:</h2>
              <table border="1">
                <thead>
                  <tr>
                    <th>Дефект:</th>
                    <th>Вероятность:</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(predictions).map(([defect, prob]) => (
                    <tr key={defect}>
                      <td>{labels[defect]}</td>
                      <td>{(prob * 100).toFixed(0)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;