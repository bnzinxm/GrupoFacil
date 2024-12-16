import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';

// Configurando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      label: 'Desempenho dos Alunos',
      data: [85, 90, 75, 80, 95, 92],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Desempenho dos Alunos (2024)',
      font: { size: 18, weight: 'bold' },
      color: '#1F2937',
    },
    legend: {
      labels: {
        color: '#1F2937',
      },
    },
  },
  scales: {
    x: { grid: { color: '#E5E7EB' }, ticks: { color: '#1F2937' } },
    y: { grid: { color: '#E5E7EB' }, ticks: { beginAtZero: true, color: '#1F2937' } },
  },
};

const Grafico = () => (
  <div className="bg-white shadow-xl rounded-2xl p-6 col-span-2 lg:col-span-6">
    <h3 className="text-3xl font-semibold text-gray-800 mb-6">Desempenho dos Alunos</h3>
    <Line data={chartData} options={chartOptions} />
  </div>
);

const AlunoCard = ({ nome, nota, progresso }) => (
  <div className="bg-white shadow-lg p-6 rounded-xl mb-6 w-full">
    <h3 className="text-xl font-semibold text-gray-800">{nome}</h3>
    <p className="text-gray-600">Nota contínua: {nota}</p>
    <div className="mt-4">
      <div className="flex items-center">
        <div className="text-gray-600">Progresso: </div>
        <div className="w-10 h-10 ml-4">
          <div className="w-full h-full rounded-full border-4 border-blue-500 animate-spin" style={{ borderTopColor: 'green' }} />
        </div>
      </div>
    </div>
  </div>
);

const Principal = () => {
  const userName = 'Professor João';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const alunos = [
    { nome: 'Carlos Silva', nota: 8, progresso: 85 },
    { nome: 'Maria Oliveira', nota: 9, progresso: 92 },
    { nome: 'Lucas Pereira', nota: 7, progresso: 75 },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 px-8 rounded-b-2xl shadow-lg mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold">Bem-vindo, {userName}!</h1>
            <p className="text-lg text-gray-200 mt-2">Gerencie com eficiência o desempenho dos alunos e suas tarefas.</p>
          </div>
          <div className="mt-6 md:mt-0 flex space-x-4">
            <button
              onClick={toggleMenu}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-all"
            >
              Menu
            </button>
            <button
              onClick={openModal}
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="absolute top-20 left-8 bg-white shadow-lg rounded-lg w-48 z-10">
          <div className="p-4">
            <button onClick={openModal} className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded">
              Filtrar
            </button>
            <button onClick={openModal} className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded">
              Destaques
            </button>
          </div>
        </div>
      )}

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-8">
        <Grafico />

        {/* Modal para a seção de Filtrar ou Destaques */}
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto overflow-auto h-[90vh]">
          <div className="flex">
            <div className="w-1/4 bg-gray-200 p-6 rounded-xl">
              <h2 className="text-2xl font-semibold">Navegar</h2>
              <ul className="mt-6">
                <li>
                  <button onClick={() => setSelectedClass('Filtrar')} className="w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded">
                    Filtrar
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedClass('Destaques')} className="w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-100 rounded">
                    Destaques
                  </button>
                </li>
              </ul>
            </div>
            <div className="w-3/4 p-6 overflow-auto">
              {selectedClass === 'Destaques' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Destaques</h2>
                  {alunos.map((aluno, index) => (
                    <AlunoCard key={index} nome={aluno.nome} nota={aluno.nota} progresso={aluno.progresso} />
                  ))}
                </div>
              )}

              {selectedClass === 'Filtrar' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Filtrar</h2>
                  <div className="mb-6">
                    <label className="block text-gray-700">A partir de qual mês?</label>
                    <select className="w-full p-3 mt-2 bg-white border rounded">
                      <option>Jan</option>
                      <option>Fev</option>
                      <option>Mar</option>
                      <option>Abr</option>
                      <option>Mai</option>
                      <option>Jun</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700">Selecione a classe</label>
                    <select className="w-full p-3 mt-2 bg-white border rounded">
                      <option>1º Ano</option>
                      <option>2º Ano</option>
                      <option>3º Ano</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button onClick={closeModal} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold">
                      Fechar
                    </button>
                    <button onClick={closeModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>

      <footer className="bg-gray-200 py-8 mt-8 text-center rounded-t-2xl shadow-inner">
        <p className="text-gray-600 text-lg">© 2024 Grupo Fácil. Facilitando a gestão escolar.</p>
      </footer>
    </div>
  );
};

export default Principal;