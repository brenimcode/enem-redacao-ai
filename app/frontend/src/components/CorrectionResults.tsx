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
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Resultado da Correção
        </h2>
        <span className="text-gray-500 text-sm">
          {new Date().toLocaleString('pt-BR')}
        </span>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Feedback da redação
            </h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Pontuação
            </h3>
            
            <div className="mb-6 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-gray-100 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score || 0)}`}>
                  {score || 0}
                </span>
                <span className="text-gray-500 text-sm">
                  de 1000 pontos
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {competencies.map((competencyScore, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{competencyLabels[index] || `Competência ${index + 1}`}</span>
                    <span className="font-medium">{competencyScore}/200</span>
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
      
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-6 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Nova correção
          </button>
        </div>
      </div>
    </div>
  );
};