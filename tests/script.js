const axios = require("axios");
const readline_sync = require("readline-sync");
const { LocalStorage } = require('node-localstorage');

// Criando uma instância do localStorage para salvar o token
const localStorage = new LocalStorage('./scratch');

const name_or_email = "";
const rawPassword = "";

// Função para fazer login
async function login() {
    try {
        let email_or_username = readline_sync.question("Digite o nome de usuário: ");
        let password = readline_sync.question("Digite sua senha: ");

        // Requisição para o login
        const loginResponse = await axios.post("http://localhost:5501/api/login", {
            email_or_username: email_or_username,
            password: password, // Corrigido para o nome correto da chave
        });

        const token = loginResponse.data.token;

        if (token) {
            localStorage.setItem("token", token);  // Armazenando o token no localStorage
            console.log("Logado com sucesso!");
        } else {
            console.error("Não foi possível obter o token, verifique as credenciais e tente novamente!");
        }
    } catch (err) {
        console.error("Erro no login: ", err);
    }
}

async function createAccount() {
    try {
        const name = readline_sync.question("Digite o nome de usuário: ");
        const email = readline_sync.question("Digite o seu e-mail: ");
        const password = readline_sync.question("Digite a sua senhna: ");
        const confirmPassword = readline_sync.question();

        if (!confirmPassword === password) {
            console.error("As senhas não coincidem!");
        }
        else {
            const regResponse = await axios.post("http://localhost:5501/api/register", {
                name: name,
                email: email,
                password: password
            });

            if (regResponse.status === 200) {
                console.log("Usuário criado com sucesso!");
                console.warn("\n======================================================\n");
                menu();
            }
            else {
                console.error("Não foi possível criar a conta!");
                console.warn("\n======================================================\n");
                menu();
            }
        }
    }
    catch (err) {
        console.error(err);
    }
}

// Função para obter alunos
async function getAlunos() {
    const token = localStorage.getItem("token");  // Recuperando o token do localStorage

    if (token) {
        try {
            // Requisição para obter alunos com o token
            const alunosResponse = await axios.get("http://localhost:5501/api/alunos", {
                headers: {
                    Authorization: `${token}`  // Usando o token no cabeçalho
                }
            });

            if (alunosResponse.status === 200) {
                console.log("Alunos obtidos com sucesso:", alunosResponse.data); // Exibe os dados dos alunos
            } else {
                console.error("Erro ao obter os alunos:", alunosResponse.statusText);
            }
        } catch (err) {
            console.error("Erro na requisição de alunos:", err);
        }
    } else {
        console.error("Token não encontrado. Você precisa se autenticar primeiro.");
    }
}

async function criarAluno(alunoNome, alunoIdade, alunoSerie, alunoTurno) {
    try {
        // const loginRes = await axios.post("http://localhost:5501/api/login", {
        //     email_or_username: name_or_email,
        //     password: rawPassword
        // });

        const token = localStorage.getItem("token");

        if (token) {
            console.log("Token obtido, tentando se comunicar com a api: /api/alunos");
            console.warn("Token: "+token);
        }

        const alunosResponse = await axios.post("http://localhost:5501/api/alunos", {
            nome: alunoNome,
            idade: alunoIdade,
            serie: alunoSerie,
            turno: alunoTurno,
        }, {
            headers: {
                Authorization: `${token}`
            }
        });
        
        if (alunosResponse.status === 201) {
            console.log("Aluno adicionado com sucesso!");
        }
        else {
            console.error("Não foi possível adicionar o aluno!");
            console.error(alunosResponse.data);
        }
    }
    catch (err) {
        console.error("Não foi possível criar o aluno!");
        console.error(err);
    }
}

function menu() {
    console.log("Oque deseja fazer?");
    console.log("1. Login.");
    console.log("2. Criar conta.");
    console.log("3. Adicionar Aluno.");
    console.log("4. Visualizar Alunos.");

    const escolha = readline_sync.question("> ");

    if (isNaN(escolha)) {
        console.warn("Por favor, digite um número de 1 - 4 de acordo com a ação que desejas.");
        escolha = readline_sync.question("> ");
    }

    if (escolha === "1") {
        login();
    }
    else if (escolha === "2") {
        createAccount();
    }
    else if (escolha === "3") {
        const nome = readline_sync.question("Digite o nome: ");
        const idade = readline_sync.questionInt("Digite a idade: ");
        const serie = readline_sync.questionInt("Digite a série: ");
        const turno = readline_sync.question("Digite o turno: ");

        criarAluno(nome, idade, serie, turno);
    }
    else if (escolha === "4") {
        getAlunos();
    }
}

menu();