import { useState, useEffect } from "react";
import axios from "axios";
import Alerts from "../../../components/Alert";

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null); // { type: "success" | "error" | "alert", message: string }
  const [newAluno, setNewAluno] = useState({
    nome: "",
    idade: "",
    serie: "",
    turno: "",
  });
  const [showModal, setShowModal] = useState(false);

  // Carregar o módulo de Alertas feito por nós.
  const alerts = new Alerts();

  // Carregar alunos do backend
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const token = localStorage.getItem("token"); // Token JWT armazenado
        const response = await axios.get("http://localhost:5501/api/alunos", {
          headers: {
            Authorization: token, // Enviar o token no cabeçalho
          },
        });
        setAlunos(response.data);
        alerts.setAlertText("Aluno carregado com sucesso!");
        alerts.openAlert("showSuccess");
      } catch (error) {
        console.error("Erro ao buscar alunos:", error.response?.data || error);
        alerts.setAlertText("Falha ao carregar alunos. Verifique sua conexão e tente novamente!");
        alerts.openAlert("showError");
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  // Adicionar aluno
  const handleAddAluno = async () => {
    if (!newAluno.nome || !newAluno.idade || !newAluno.serie || !newAluno.turno) {
      alert("Preencha todos os campos!");
      alerts.setAlertText("Por favor, preencha todos os campos!");
      alerts.showAlert("showWarning");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5501/api/alunos",
        newAluno,
        {
          headers: { Authorization: token },
        }
      );
      setAlunos([...alunos, newAluno]); // Atualizar lista localmente
      setNewAluno({ nome: "", idade: "", serie: "", turno: "" });
      alerts.setAlertText("Aluno adicionado com sucesso!");
      alerts.showAlert("showSuccess");
      setShowModal(false);
      alert("Aluno adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error.response?.data || error);
      alert("Erro ao adicionar aluno!");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Lista de Alunos</h1>

      {/* Tabela de alunos */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white rounded-md shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Idade</th>
              <th className="px-4 py-2 text-left">Série</th>
              <th className="px-4 py-2 text-left">Turno</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{aluno.nome}</td>
                <td className="px-4 py-2">{aluno.idade}</td>
                <td className="px-4 py-2">{aluno.serie}</td>
                <td className="px-4 py-2">{aluno.turno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar aluno */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4">Adicionar Aluno</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nome</label>
              <input
                type="text"
                value={newAluno.nome}
                onChange={(e) => setNewAluno({ ...newAluno, nome: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Idade</label>
              <input
                type="number"
                value={newAluno.idade}
                onChange={(e) => setNewAluno({ ...newAluno, idade: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Série</label>
              <input
                type="text"
                value={newAluno.serie}
                onChange={(e) => setNewAluno({ ...newAluno, serie: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Turno</label>
              <input
                type="text"
                value={newAluno.turno}
                onChange={(e) => setNewAluno({ ...newAluno, turno: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddAluno}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                Adicionar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão para abrir o modal */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700"
      >
        Adicionar Aluno
      </button>
    </div>
  );
};

export default Alunos;