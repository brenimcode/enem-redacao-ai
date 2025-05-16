import { useState, DragEvent } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface UploadAreaProps {
  preview: string | null;
  selectedFile: File | null;
  handleFileChange: (file: File | null) => void;
  handleSubmit: () => void;
  resetForm: () => void;
  loading: boolean;
  tema: string;
  setTema: (tema: string) => void;
  textosMotivadores: string;
  setTextosMotivadores: (textos: string) => void;
}

export const UploadArea = ({
  preview,
  selectedFile,
  handleFileChange,
  handleSubmit,
  resetForm,
  loading,
  tema,
  setTema,
  textosMotivadores,
  setTextosMotivadores,
}: UploadAreaProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileType = file.type;
      
      if (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/jpg") {
        handleFileChange(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6 space-y-4">
        <div>
          <Label htmlFor="tema" className="text-gray-700">Tema da Redação</Label>
          <Input 
            id="tema" 
            value={tema} 
            onChange={(e) => setTema(e.target.value)} 
            placeholder="Digite o tema da redação" 
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="textos-motivadores" className="text-gray-700">Textos Motivadores</Label>
          <Textarea 
            id="textos-motivadores" 
            value={textosMotivadores} 
            onChange={(e) => setTextosMotivadores(e.target.value)} 
            placeholder="Insira os textos motivadores relacionados ao tema" 
            className="mt-1 min-h-[120px]"
          />
        </div>
      </div>
      
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 transition-all
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
          ${preview ? "bg-gray-50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!preview ? (
          <div className="flex flex-col items-center">
            <Upload className="h-16 w-16 text-blue-500 mb-4" />
            <p className="text-gray-700 text-lg font-medium mb-2">
              Arraste a imagem da sua redação aqui
            </p>
            <p className="text-gray-500 mb-4">ou</p>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors">
              Selecione um arquivo
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
            <p className="text-gray-400 text-sm mt-4">
              Formatos aceitos: JPG, PNG, JPEG
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img 
              src={preview} 
              alt="Preview da redação" 
              className="max-h-64 object-contain mb-4" 
            />
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                {selectedFile?.name}
              </span>
              <button
                onClick={resetForm}
                className="text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading || !tema.trim() || !textosMotivadores.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Enviar para correção
          </button>
        </div>
      )}
    </div>
  );
};