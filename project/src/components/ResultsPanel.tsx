import React from 'react';
import { DefectProbability } from '../types';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import { Download } from 'lucide-react';

interface ResultsPanelProps {
  results: DefectProbability[] | null;
  lastAnalyzed: Date | null;
  onExport: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  lastAnalyzed,
  onExport
}) => {
  if (!results) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col justify-center items-center text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
            <Download className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-500">No Results Yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter vulcanization parameters and click "Analyze" to see defect predictions.
          </p>
        </div>
      </div>
    );
  }
  
  // Group defects by severity
  const highRisk = results.filter(d => d.probability >= 75);
  const mediumRisk = results.filter(d => d.probability >= 25 && d.probability < 75);
  const lowRisk = results.filter(d => d.probability < 25);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
        {lastAnalyzed && (
          <span className="text-xs text-gray-500">
            Last analyzed: {lastAnalyzed.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map(defect => (
              <tr key={defect.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <span 
                      className={`
                        h-2 w-2 rounded-full mr-2
                        ${defect.probability >= 75 ? 'bg-red-500' : 
                          defect.probability >= 25 ? 'bg-yellow-500' : 
                          'bg-green-500'}
                      `}
                    />
                    {defect.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div className="max-w-md">
                    <ProgressBar 
                      value={defect.probability} 
                      colorScale={true}
                      animated={true}
                      size="sm"
                    />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <span 
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${defect.probability >= 75 ? 'bg-red-100 text-red-800' : 
                        defect.probability >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}
                    `}
                  >
                    {defect.probability}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {highRisk.length > 0 && (
            <div className="px-3 py-1.5 bg-red-100 text-red-800 rounded-md text-sm font-medium">
              High Risk: {highRisk.length}
            </div>
          )}
          {mediumRisk.length > 0 && (
            <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
              Medium Risk: {mediumRisk.length}
            </div>
          )}
          {lowRisk.length > 0 && (
            <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              Low Risk: {lowRisk.length}
            </div>
          )}
        </div>

        <Button
          onClick={onExport}
          variant="outline"
          className="w-full"
          icon={<Download className="w-5 h-5" />}
        >
          Export Analysis Report
        </Button>
      </div>
    </div>
  );
};

export default ResultsPanel;