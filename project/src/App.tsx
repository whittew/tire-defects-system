import {useEffect, useState} from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import WarningsPanel from './components/WarningsPanel';
import { AppState, Preset } from './types';
import { DefectProbability} from "./types";
import { getInitialParametersState } from './data/parameters';
import {io, Socket} from 'socket.io-client';

function App() {
  const [state, setState] = useState<AppState>({
    parameters: getInitialParametersState(),
    loading: false,
    results: null,
    warnings: [],
    lastAnalyzed: null,
  });

  const defectNames: Record<string, string> = {
    Bubble_Prob: 'Пузыри',
    Crack_Prob: 'Трещины',
    Uneven_Prob: 'Неравномерность',
    Damage_Prob: 'Повреждения',
  };

  useEffect(() => {
    const socket: Socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socket.on('sensor_data', (data) => {
      console.log('📡 Пришли данные от сервера:', data);

      // Обновляем параметры
      const updated = { ...state.parameters };
      Object.entries(data.params).forEach(([key, value]) => {
        if (updated[key]) {
          updated[key] = {
            ...updated[key],
            value: value as number
          };
        }
      });

      setState(prev => ({
        ...prev,
        parameters: updated,
        results: data.predictions
            ? Object.entries(data.predictions).map(([key, value]) => ({
              id: key,
              name: defectNames[key] || key,
              probability: Number(value),
              description: ''
            }))
            : prev.results,
        warnings: data.warnings || prev.warnings
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleParameterChange = (id: string, value: number | '') => {
    setState(prevState => ({
      ...prevState,
      parameters: {
        ...prevState.parameters,
        [id]: {
          ...prevState.parameters[id],
          value
        }
      }
    }));
  };

  const handleAnalyze = async () => {
    setState(prevState => ({ ...prevState, loading: true }));

    try {


      const params = Object.entries(state.parameters).reduce((acc, [key, param]) => {
        acc[key] = param.value;
        return acc;
      }, {} as Record<string, number | ''>);

      console.log('Отправляем запрос с параметрами:', params);

      const response = await axios.post('http://127.0.0.1:5000/predict', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Получен ответ от сервера:', response.data);

      const { predictions, warnings } = response.data;

      const defectNames: Record<string, string> = {
        Bubble_Prob: 'Пузыри',
        Crack_Prob: 'Трещины',
        Damage_Prob: 'Повреждения',
        Normal_Prob: 'Норма',
        Uneven_Prob: 'Неравномерность',
      };

      const resultsArray: DefectProbability[] = Object.entries(predictions).map(
          ([key, value]) => ({
            id: key,
            name: defectNames[key] || key,
            probability: Number(value),
            description: '', // Можешь позже добавить описание
          })
      );

      setState(prevState => ({
        ...prevState,
        loading: false,
        results: resultsArray,
        warnings: warnings || [],
        lastAnalyzed: new Date()
      }));

    } catch (error) {
      console.error('Prediction request failed:', error);
      toast.error('Failed to get prediction. Please try again.');
      setState(prevState => ({ ...prevState, loading: false }));
    }
  };

  const handleLoadPreset = (preset: Preset) => {
    setState(prevState => {
      const updatedParameters = { ...prevState.parameters };

      Object.entries(preset.parameters).forEach(([id, value]) => {
        if (updatedParameters[id]) {
          updatedParameters[id] = {
            ...updatedParameters[id],
            value
          };
        }
      });

      return {
        ...prevState,
        parameters: updatedParameters
      };
    });
  };

  const handleExport = () => {
    if (!state.results) return;

    const content = JSON.stringify({
      parameters: state.parameters,
      results: state.results,
      warnings: state.warnings,
      timestamp: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = `defect-prediction-${new Date().toISOString().slice(0, 10)}.json`;

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Manufacturing Defect Prediction
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-full">
            <InputPanel
              parameters={state.parameters}
              loading={state.loading}
              onParameterChange={handleParameterChange}
              onAnalyze={handleAnalyze}
              onLoadPreset={handleLoadPreset}
            />
          </div>

          <div className="h-full">
            <div className="bg-white p-6 rounded-xl shadow-md h-full">
              <div className="space-y-8">
                <ResultsPanel
                  results={state.results}
                  lastAnalyzed={state.lastAnalyzed}
                  onExport={handleExport}
                />

                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Parameter Analysis</h2>
                  <WarningsPanel warnings={state.warnings} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;