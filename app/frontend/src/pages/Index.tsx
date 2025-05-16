import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { color } from "d3-color";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-md w-full text-center space-y-8"> 
        <div className="space-y-4">
          <h1 className="text-5xl">
            Bem-vindo ao <strong style={{color: "#1658ff"}} >Redator AI</strong>
          </h1>
          <p className="text-gl text-gray-700">
            Corrija suas redações com a ajuda da Inteligência Artificial.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Link to="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;