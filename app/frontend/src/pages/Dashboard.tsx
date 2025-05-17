import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/SideBar";
import { UploadArea } from "@/components/UploadArea";
import { CorrectionResults } from "@/components/CorrectionResults";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      const totalScore = data.competencies.reduce((sum, value) => sum + value, 0);

      setDescription(data.description);
      setScore(totalScore);
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
    <div className="relative flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Decorative background particles */}
            <motion.div
        className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full opacity-30 filter blur-xl hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-teal-200 to-blue-300 rounded-full opacity-20 filter blur-2xl hidden md:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.span
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-50 shadow-lg hidden md:block"
        style={{ bottom: '10%', left: '25%' }}
        animate={{ x: [0, -25, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      <motion.span
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-50 shadow-lg hidden md:block"
        style={{ top: '15%', right: '20%' }}
        animate={{ x: [0, 25, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, delay: 3 }}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar with responsive classes */}
      <div className={`md:relative fixed inset-y-0 left-0 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 relative z-10">
        <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-white border-b border-gray-200">
          {/* Mobile menu button */}
          <button 
            className="text-gray-600 hover:text-gray-900 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 ml-4 md:ml-0">Correção de Redação</h1>
          
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-gray-600 hidden sm:inline">{username}</span>
            
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
              {username ? username[0].toUpperCase() : "U"}
            </div>
          </div>
        </header>
        
        <main className="p-4 md:p-8">
          {loading && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl flex items-center gap-3 md:gap-4">
                <Loader2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600 animate-spin" />
                <p className="text-base md:text-lg">Analisando sua redação...</p>
              </div>
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                Bem-vindo(a), {username}!
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Envie a imagem da sua redação abaixo para receber uma correção detalhada.
              </p>
            </motion.div>
            
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
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <CorrectionResults
                  description={description}
                  score={score}
                  competencies={competencies}
                  resetForm={resetForm}
                />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;