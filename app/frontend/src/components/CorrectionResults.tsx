import { RefreshCw } from "lucide-react";

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Resultado da Correção
        </h2>
        <span className="text-gray-500 text-xs md:text-sm">
          {new Date().toLocaleString('pt-BR')}
        </span>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3">
              Feedback da redação
            </h3>
            <div className="bg-gray-50 p-3 md:p-4 rounded-md border border-gray-200 h-full">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-medium text-gray-700 mb-3 md:mb-4">
              Pontuação
            </h3>
            
            <div className="mb-4 md:mb-6 flex items-center justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-6 md:border-8 border-gray-100 flex flex-col items-center justify-center">
                <span className={`text-3xl md:text-4xl font-bold ${getScoreColor(score || 0)}`}>
                  {score || 0}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  de 1000 pontos
                </span>
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