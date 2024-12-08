const axios = require("axios");

// Endpoint da API Groq
const groqApiUrl = "https://api.groq.com/v1/train";

// Token de autenticação para a API Groq
const apiToken = "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";

// Função para treinar a IA com a descrição do site
async function treinarIA() {
    const descricaoSite = `
        Bem-vindo ao Chat de Suporte da Fácil AI! Nosso site oferece uma interface interativa onde os usuários podem enviar mensagens e obter respostas rápidas e brincalhonas da IA.
        O chat oferece um sistema de mensagens de "chatbubbles", onde as mensagens são enviadas de maneira fluída e a IA responde com um toque de humor.
        A IA é projetada para oferecer não apenas respostas rápidas, mas também interações leves, com mensagens que podem ser descontraídas e amigáveis.
        Funcionalidades do site:
        1. Chat de suporte interativo.
        2. Respostas rápidas e com um toque de brincadeira.
        3. Sistema de login e criação de contas.
        4. Adição e visualização de alunos, com um painel de administração para organizar alunos.
        5. Suporte a interação contínua com botões para enviar mensagens.
        6. Feedback de interação amigável e divertido.
    `;

    const payload = {
        description: descricaoSite, // A descrição detalhada do site
        type: "site_interaction",   // Definindo o tipo de interação com o site
        tone: "playful",            // Definindo o tom da IA como brincalhão
    };

    try {
        // Requisição para a API Groq para treinar a IA
        const response = await axios.post(groqApiUrl, payload, {
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json"
            }
        });

        console.log("IA treinada com sucesso!");
        console.log(response.data);  // Exibe a resposta da API
    } catch (err) {
        console.error("Erro ao treinar a IA:", err);
    }
}

// Função para enviar as mensagens do usuário para a IA
async function enviarMensagem(message) {
    try {
        const response = await axios.post(groqApiUrl, {
            message: message,
            tone: "playful"  // Garantindo que o tom da resposta seja brincalhão
        }, {
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Resposta da IA:", response.data);  // Exibe a resposta da IA
    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
}

treinarIA();  