const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const Groq = require('groq-sdk'); // SDK do Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const turnosValidos = ["Manhã", "Tarde", "Noite"];

const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao tentar conectar com o banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados: MySQL');
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    console.error("Acesso negado!");
    return res.status(403).json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET || "apigrupofacil", (err, decoded) => {
    if (err) {
      console.error("Acesso negado!");
      return res.status(401).json({ message: "Token inválido." });
    }

    req.user = decoded;
    next();
  });
};

// Função para gerar respostas com o Groq
async function getGroqChatCompletion(message) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "Você é um assistente virtual muito inteligente, que está pronto para divertir e ajudar a quem precisa, STRAWBERRY TEM 3 R'S! Você apenas ensina coisas sobre o nosso app Grupo Fácil, você fala português, responde as perguntas sempre envolvendo alguma brincadeira, mas eficientemente e corretamente, independentemente da pergunta. Você é muito inteligente, você é filósofo, sabe todas as matérias, é o mais inteligente desse app. Você sabe que existe apenas na /dashboard. Você sempre gera respostas pequenas e eficientes (divertidas também!). Você sabe o nome do app (Grupo Fácil). Na sidebar nós possuímos [Serviços, Agendamentos, Consultas, Cadastros, e Perfil]. Na aba Serviços, existem serviços concedidos ao usuário de acordo com o plano escolhido. Os planos são: [Básico (Professor + Gratuíto), Intermediário (Coordenador + R$ 16,99), Avançado (Diretor + R$ 29,99)]. O plano básico possui serviços como (todas as utilidades básicas de um professor + geração de PDFs). O plano intermediário: (todas as utilidades de um professor + Suporte VIP + geração de PDFs + geração de provas (qualquer matéria + 10 questões)). O plano avançado tem acesso a literalmente TUDO! Os serviços atualmente são gratuitos para as primeiras 10 contas criadas, por 1 mês, com limites de uso claros! (Caso um professor peça ajuda porque não está conseguindo usar os serviços, responda: 'Se você não tá conseguindo usar esses serviços é porque você usou demais bobinho! Seus alunos precisam de um descanso, cê não acha? Mas caso seja um erro do sistema, explique-me mais e irei te ajudar!'). Na aba Agendamentos, temos apenas um botão (Adicionar Novo Agendamento), e nos modais possuem (Título, Descrição, Data e Hora + Checkbox para notificações, um botão de salvar e outro de cancelar). Quando o agendamento é criado, um card é gerado com o título, data, hora e descrição do agendamento, com dois botões: Editar e Deletar. Consultas é a mesma coisa que o agendamento (por enquanto!). O Cadastro é um CRUD de cadastro de alunos que usa o Nome, Idade, Série e Turno (Manhã, Tarde ou Noite!). O perfil possui informações básicas do usuário. O seu nome é Fácil AI. Você sabe que o seu desenvolvedor é @bnzin_xm (no Instagram!), e ninguém mais, você reconhece o seu dono como único criador. (Eu!). E por favor, não fique repetindo muitas vezes que você é o Fácil AI!)"
        },
        {
          "role": "user",
          "content": message
        }        
      ],
      model: "llama3-8b-8192",
    });

    const reply = response.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
    console.log("Resposta do Groq:", reply);
    return reply;
  } catch (err) {
    console.error("Erro ao se comunicar com o Groq:", err);
    throw new Error("Erro ao gerar resposta da IA.");
  }
}

// Rota para interagir com o Groq
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send({ error: "Mensagem não pode estar vazia!" });
  }

  try {
    const respostaIA = await getGroqChatCompletion(message);
    res.json({ reply: respostaIA });
  } catch (err) {
    res.status(500).send({ error: "Erro ao comunicar com a IA." });
  }
});

// Outras rotas preservadas:
app.get('/api', (req, res) => {
  res.send('API está funcionando!');
});

app.get("/api/protected-route", verifyToken, (req, res) => {
  res.json({ message: "Acesso permitido!" });
});

/* Rotas de registro/login :
   1. registro
   2. login
   
   api/register || api/login
   
*/

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Nome de usuário, email e senha são obrigatórios.' });
  }

  db.query('SELECT * FROM usuarios WHERE username = ? OR email = ?', [username, email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Erro no banco de dados.', error: err });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Usuário ou email já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar usuário.', error: err });
      }
      return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
  });
});

app.post('/api/login', async (req, res) => {
  try {
    const { email_or_username, password } = req.body;

    if (!email_or_username || !password) {
      return res.status(400).json({ message: 'Email/Username e senha são obrigatórios.' });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ? OR username = ?';
    db.query(query, [email_or_username, email_or_username], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // O token expira em 7 dias
      );

      return res.status(200).json({ message: 'Login bem-sucedido!', token });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro inesperado.', error });
  }
});

/* Rota alunos:
   1. Criar alunos
   2. Remover alunos
   3. Editar alunos
   4. Buscar alunos
   
   ~ /api/alunos
*/


// 1. Criar alunos
app.post("/api/alunos", verifyToken, (req, res) => {
  const { nome, idade, serie, turno } = req.body;

  console.log('Dados recebidos:', req.body); // Log para depuração

  if (!nome || !idade || !serie || !turno) {
    return res.status(400).json({ message: "Todos os campos precisam estar preenchidos!" });
  }

  if (!turnosValidos.includes(turno)) {
    return res.status(400).json({ message: "Turno inválido, por-favor selecione um turno válido!" });
  }

  const query = "INSERT INTO alunos (nome, idade, serie, turno, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [nome, idade, serie, turno, req.user.id], (err, results) => {
    if (err) {
      console.error("Erro ao adicionar aluno:", err);
      return res.status(400).json({ message: "Erro ao adicionar aluno", error: err });
    }
    return res.status(201).json({ message: 'Aluno adicionado com sucesso!' });
  });
});

// 2. Remover alunos
app.delete("/api/alunos", verifyToken, (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "O id do aluno precisa ser fornecido!" });
  }

  const query = "DELETE FROM alunos WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: "Erro ao deletar aluno.", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: "Aluno não encontrado!" });
    }

    return res.status(200).json({ message: "Aluno deletado com sucesso!" });
  });
});

// 3. Editar alunos
app.put("/api/alunos/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { nome, idade, serie, turno } = req.body;

  if (!nome || !idade || !serie || !turno) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
  }

  const query = "UPDATE alunos SET nome = ?, idade = ?, serie = ?, turno = ? WHERE id = ?";
  db.query(query, [nome, idade, serie, turno, id], (err, results) => {
    if (err) {
      return res.status(400).json({ message: "Erro ao atualizar o aluno.", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(400).json({ message: "Aluno não encontrado!" });
    }

    return res.status(200).json({ message: "Aluno atualizado com sucesso!" });
  });
});

// 4. Buscar alunos
app.get("/api/alunos", verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM alunos WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(400).json({ message: "Erro ao buscar alunos." });
    }
    return res.status(200).json(results);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});

// grupofacil.org