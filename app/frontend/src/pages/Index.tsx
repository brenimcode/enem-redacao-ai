import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileImage, CheckCircle, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-primary-50 via-primary-100/30 to-white flex flex-col items-center justify-center p-6">
      {/* Elementos de fundo animados */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-300/30 via-transparent to-transparent opacity-20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Partículas animadas */}
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className={`absolute w-${1 + Math.floor(i % 4)} h-${1 + Math.floor(i % 4)} bg-primary-${400 + (i * 100) % 300} rounded-full opacity-${20 + (i * 10) % 60} shadow-lg`}
          style={{
            top: `${10 + (i * 10) % 80}%`,
            left: `${5 + (i * 12) % 90}%`,
          }}
          animate={{
            y: [0, (i % 2 === 0 ? -1 : 1) * (20 + i * 5), 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (15 + i * 3), 0],
            opacity: [(0.2 + (i * 0.1) % 0.6), (0.5 + (i * 0.1) % 0.5), (0.2 + (i * 0.1) % 0.6)],
          }}
          transition={{
            duration: 3 + i % 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-10">
        {/* Cabeçalho principal com animação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 bg-clip-text text-transparent">
            Redator AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
            Eleve suas redações do ENEM com feedback personalizado <span className="text-primary-600 font-bold">impulsionado por IA</span>
          </p>
        </motion.div>

        {/* Seção de recursos com ícones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-primary-100 flex flex-col items-center">
            <div className="bg-primary-100 p-3 rounded-full mb-4">
              <FileImage className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Envio Simples</h3>
            <p className="text-gray-600 mt-2">Basta fotografar ou fazer upload da sua redação manuscrita</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-primary-100 flex flex-col items-center">
            <div className="bg-primary-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Análise Precisa</h3>
            <p className="text-gray-600 mt-2">Avaliação completa de gramática, coerência e estrutura textual</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-primary-100 flex flex-col items-center">
            <div className="bg-primary-100 p-3 rounded-full mb-4">
              <MessageSquare className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Feedback Detalhado</h3>
            <p className="text-gray-600 mt-2">Receba pontuações, comentários e dicas práticas de melhoria</p>
          </div>
        </motion.div>

        {/* CTA com animação */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
          className="space-y-8 mt-8"
        >
          <p className="text-lg md:text-xl font-medium text-gray-700">
          Junte-se aos primeiros <span className="text-primary-600 font-bold">estudantes</span> a transformar suas redações com o poder do Redator AI.
        </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-lg px-8 py-6 text-lg">
              <Link to="/register">
                Começar Gratuitamente
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-medium px-8 py-6 text-lg">
              <Link to="/login">
                Acessar Minha Conta
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Experimente agora e receba feedback em menos de 60 segundos!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;