import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white flex items-center justify-center p-6">
      {/* Adornos animados de partículas */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent opacity-20"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-50 shadow-lg"
        style={{ top: '20%', left: '10%' }}
        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.span
        className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-30 shadow-lg"
        style={{ bottom: '15%', right: '20%' }}
        animate={{ x: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />
      <motion.span
        className="absolute w-4 h-4 bg-blue-600 rounded-full opacity-40 shadow-lg"
        style={{ top: '10%', right: '15%' }}
        animate={{ y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
      />
      <motion.span
        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-50 shadow-lg"
        style={{ bottom: '10%', left: '25%' }}
        animate={{ x: [0, -25, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      <motion.span
        className="absolute w-5 h-5 bg-blue-700 rounded-full opacity-30 shadow-lg"
        style={{ top: '30%', left: '50%' }}
        animate={{ y: [0, -40, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      <motion.span
        className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-60 shadow-lg"
        style={{ bottom: '5%', right: '5%' }}
        animate={{ x: [0, 15, 0], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, delay: 3 }}
      />

      <motion.div
        className="relative z-10 max-w-lg text-center space-y-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight" style={{ color: '#1658ff' }}>
          Bem-vindo ao{' '}
          <span style={{ color: '#1658ff' }}>
            Redator AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
          Corrija suas redações do ENEM com inteligência artificial.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
          <Button
            asChild
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-101"
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-400 hover:text-white text-lg font-medium shadow-md transition-all duration-300 transform hover:scale-101"
          >
            <Link to="/register">Criar conta</Link>
          </Button>
      </div>
      </motion.div>
    </div>
  );
};

export default Index;