import { Pen, History, BookText, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-600">Redator AI</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium"
            >
              <Pen className="h-5 w-5" />
              <span>Correção</span>
            </a>
          </li>
          <li>
            <a 
              href="*" 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <History className="h-5 w-5" />
              <span>Histórico</span>
            </a>
          </li>
          <li>
            <a 
              href="*" 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <BookText className="h-5 w-5" />
              <span>Exemplos</span>
            </a>
          </li>
          <li>
            <a 
              href="*" 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </a>
          </li>
        </ul>
        
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
