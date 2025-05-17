import { RefreshCw, CirclePercent } from "lucide-react";
import { useMemo } from "react";

interface CorrectionResultsProps {
  description: string;
  score: number | null;
  competencies: number[];
  resetForm: () => void;
}

export const CorrectionResults = ({
  description,
  score,
  competencies,
  resetForm,
}: CorrectionResultsProps) => {
  const competencyLabels = [
    "Domínio da escrita formal",
    "Compreensão da proposta",
    "Seleção de argumentos",
    "Construção da argumentação",
    "Elaboração da proposta"
  ];

  const getCompetencyColor = (score: number) => {
    if (score >= 180) return "bg-green-500";
    if (score >= 140) return "bg-blue-500";
    if (score >= 100) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreColor = (totalScore: number) => {
    if (totalScore >= 800) return "text-green-600";
    if (totalScore >= 600) return "text-blue-600";
    if (totalScore >= 400) return "text-yellow-600";
    if (totalScore >= 200) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreColorFill = (totalScore: number) => {
    if (totalScore >= 800) return "#16a34a"; // green-600
    if (totalScore >= 600) return "#2563eb"; // blue-600
    if (totalScore >= 400) return "#ca8a04"; // yellow-600
    if (totalScore >= 200) return "#ea580c"; // orange-600
    return "#dc2626"; // red-600
  };

  const scoreValue = score || 0;
  const percentage = (scoreValue / 1000) * 100;
  
  // Calcular os parâmetros do círculo SVG
  const circleSize = useMemo(() => {
    return {
      size: 140,       // Tamanho total do SVG
      radius: 60,      // Raio do círculo
      strokeWidth: 8,  // Largura do traço
      center: 70       // Centro do círculo (size / 2)
    };
  }, []);

  // Calculando o perímetro do círculo
  const circumference = 2 * Math.PI * circleSize.radius;
  
  // Calculando quanto do círculo deve ser preenchido
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-center md:text-left">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Resultado da Correção
        </h2>
        <span className="text-gray-500 text-xs md:text-sm">
          {new Date().toLocaleString('pt-BR')}
        </span>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3">
              Feedback da redação
            </h3>
            <div className="bg-gray-50 p-3 md:p-4 rounded-md border border-gray-200">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
          
          <div className="text-center md:text-left mt-5 md:mt-0">
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4">
              Pontuação
            </h3>
            
            <div className="mb-4 md:mb-6 flex items-center justify-center">
              <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                {/* Círculo SVG com preenchimento dinâmico */}
                <svg width={circleSize.size} height={circleSize.size} viewBox={`0 0 ${circleSize.size} ${circleSize.size}`} className="absolute">
                  {/* Círculo base (cinza) */}
                  <circle 
                    cx={circleSize.center} 
                    cy={circleSize.center} 
                    r={circleSize.radius} 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth={circleSize.strokeWidth} 
                  />
                  
                  {/* Círculo de progresso */}
                  <circle 
                    cx={circleSize.center} 
                    cy={circleSize.center} 
                    r={circleSize.radius} 
                    fill="none" 
                    stroke={getScoreColorFill(scoreValue)}
                    strokeWidth={circleSize.strokeWidth}
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${circleSize.center} ${circleSize.center})`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Texto do score no centro do círculo */}
                <div className="z-10 flex flex-col items-center justify-center">
                  <span className={`text-3xl md:text-4xl font-bold ${getScoreColor(scoreValue)}`}>
                    {scoreValue}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500">
                    de 1000
                  </span>
                </div>
              </div>
            </div>
          
            <div className="space-y-3 md:space-y-4">
              {competencies.map((competencyScore, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-gray-700 truncate pr-2">
                      {competencyLabels[index] || `Competência ${index + 1}`}
                    </span>
                    <span className="font-medium whitespace-nowrap">{competencyScore}/200</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getCompetencyColor(competencyScore)}`}
                      style={{ width: `${(competencyScore / 200) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 md:px-6 rounded-md transition-colors text-sm md:text-base"
          >
            <RefreshCw className="h-4 w-4" />
            Nova correção
          </button>
        </div>
      </div>
    </div>
  );
};