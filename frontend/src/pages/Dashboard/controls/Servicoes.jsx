// controls/Servicos.js

import React from 'react';

const Servicos = () => {
  // Lista de serviços com descrição e preços
  const servicos = [
    {
      id: 1,
      nome: 'Geração de Provas com Gabarito',
      descricao:
        'Crie provas de múltipla escolha com gabarito de maneira automática. Personalize as perguntas e opções.',
      preco: 'Gratuito (até 10 questões)',
    },
    {
      id: 2,
      nome: 'Geração de Mapeamento de Conteúdo',
      descricao:
        'Organize seus tópicos de conteúdo em mapas mentais visuais para facilitar o aprendizado e revisão.',
      preco: 'Gratuito (básico), Pago (versão avançada)',
    },
    {
      id: 3,
      nome: 'Gerenciamento de Notas Automatizado',
      descricao:
        'Calcule automaticamente as médias das notas de seus alunos. Ideal para professores gerenciarem turmas pequenas.',
      preco: 'Gratuito (até 50 alunos)',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Título da página */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Seus Serviços</h1>
        <p className="text-lg text-gray-600 mt-2">Aqui estão as utilidades que você pode utilizar.</p>
      </div>

      {/* Lista de Cards de Serviços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map((servico) => (
          <div
            key={servico.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 hover:shadow-lg transition-all duration-200"
          >
            {/* Nome do serviço */}
            <h3 className="text-xl font-semibold text-gray-800">{servico.nome}</h3>
            {/* Descrição do serviço */}
            <p className="text-gray-600">{servico.descricao}</p>
            {/* Preço do serviço */}
            <div className="text-lg font-medium text-gray-800">{servico.preco}</div>
            {/* Botão para ação, pode ser para mais detalhes ou iniciar o serviço */}
            <div className="flex justify-center mt-auto">
              <button
                onClick={() => alert(`Iniciar serviço: ${servico.nome}`)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Iniciar Serviço
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão para adquirir mais serviços */}
      <div className="text-center mt-12">
        <button
          onClick={() => alert('Redirecionar para adquirir mais serviços')}
          className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Adquirir Mais Serviços
        </button>
      </div>
    </div>
  );
};

export default Servicos;