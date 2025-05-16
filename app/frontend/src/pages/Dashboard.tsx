import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/SideBar";
import { UploadArea } from "@/components/UploadArea";
import { CorrectionResults } from "@/components/CorrectionResults";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Competency {
  score: number;
  description: string;
}

interface CorrectionData {
  description: string;
  score: number;
  competencies: number[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [competencies, setCompetencies] = useState<number[]>([]);
  const [username, setUsername] = useState<string>("");
  const [tema, setTema] = useState<string>("");
  const [textosMotivadores, setTextosMotivadores] = useState<string>("");


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/login");
      return;
    }
    
    setUsername(storedUsername);
  }, [navigate]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem da redação.");
      return;
    }

    if (!tema.trim()) {
      toast.error("Por favor, informe o tema da redação.");
      return;
    }

    if (!textosMotivadores.trim()) {
      toast.error("Por favor, informe os textos motivadores.");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("tema", tema);
      formData.append("textos_motivadores", textosMotivadores);


      const token = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType");

      if (!token || !tokenType) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch("http://localhost:8000/redacao", {
        method: "POST",
        headers: {
          "Authorization": `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data: CorrectionData = await response.json();

      setDescription(data.description);
      setScore(data.score);
      setCompetencies(data.competencies);
      
      toast.success("Redação corrigida com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar redação:", err);
      toast.error("Erro ao processar redação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setDescription("");
    setScore(null);
    setCompetencies([]);
    setTema("");
    setTextosMotivadores("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <header className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Correção de Redação</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{username}</span>
            <button 
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("tokenType");
                localStorage.removeItem("username");
                navigate("/");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Sair
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              {username ? username[0].toUpperCase() : "U"}
            </div>
          </div>
        </header>
        
        <main className="p-8">
          {loading && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-4">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                <p className="text-lg">Analisando sua redação...</p>
              </div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Bem-vindo(a), {username}!
              </h2>
              <p className="text-gray-600">
                Envie a imagem da sua redação abaixo para receber uma correção detalhada.
              </p>
            </div>
            
            {!description ? (
              <UploadArea 
                preview={preview} 
                selectedFile={selectedFile} 
                handleFileChange={handleFileChange} 
                handleSubmit={handleSubmit} 
                resetForm={resetForm}
                loading={loading}
                tema={tema}
                setTema={setTema}
                textosMotivadores={textosMotivadores}
                setTextosMotivadores={setTextosMotivadores}
              />
            ) : (
              <CorrectionResults
                description={description}
                score={score}
                competencies={competencies}
                resetForm={resetForm}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;