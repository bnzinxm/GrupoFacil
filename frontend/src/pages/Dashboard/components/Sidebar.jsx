const Sidebar = ({ setCurrentControl }) => {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6 fixed">
        {/* Logo e Título */}
        <div className="flex items-center space-x-3 mb-10">
          <img src="src/assets/logo (2).png" alt="Logo" className="h-12" /> {/* Ajuste o caminho da imagem */}
          <h1 className="text-2xl font-semibold">Grupo Fácil</h1>
        </div>
  
        {/* Navegação */}
        <div className="space-y-4">
          {/* Botões de navegação */}
          <button
            onClick={() => setCurrentControl('servicos')}
            className="block text-lg font-medium text-white hover:text-blue-500 w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Serviços
          </button>
          <button
            onClick={() => setCurrentControl('agendamentos')}
            className="block text-lg font-medium text-white hover:text-blue-500 w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Agendamentos
          </button>
          <button
            onClick={() => setCurrentControl('consultas')}
            className="block text-lg font-medium text-white hover:text-blue-500 w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Consultas
          </button>
          <button
            onClick={() => setCurrentControl('cadastros')}
            className="block text-lg font-medium text-white hover:text-blue-500 w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Cadastros
          </button>
          
          <button
            onClick={() => setCurrentControl('perfil')}
            className="block text-lg font-medium text-white hover:text-blue-500 w-full text-left py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Perfil
          </button>
        </div>
      </div>
    );
  };
  
  export default Sidebar;  