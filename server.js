const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Lista para armazenar os jogos
let jogos = [];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para adicionar jogos manualmente
app.post('/adicionarJogo', (req, res) => {
    const { numeros } = req.body;

    // Converte a string de números em um array
    const novoJogo = numeros.split(',').map(num => parseInt(num.trim(), 10));

    // Adiciona o novo jogo à lista
    jogos.push(novoJogo);

    res.json({ success: true });
});

// Rota para analisar os jogos
app.post('/analisar', (req, res) => {
    const { quantidadeNumeros } = req.body;

    // Converte a quantidade de números para um número inteiro
    const quantidade = parseInt(quantidadeNumeros, 10);

    // Analisa a frequência dos números e retorna apenas os N mais repetidos
    const numerosRepetidos = analisarFrequencia(jogos, quantidade);

    res.json({ numerosRepetidos });
});

// Rota para limpar a memória
app.post('/limparMemoria', (req, res) => {
    jogos = []; // Limpa a lista de jogos
    res.json({ success: true });
});

// Função para analisar a frequência dos números
function analisarFrequencia(jogos, quantidade) {
    const frequencia = {};

    jogos.forEach(jogo => {
        jogo.forEach(numero => {
            if (frequencia[numero]) {
                frequencia[numero]++;
            } else {
                frequencia[numero] = 1;
            }
        });
    });

    // Filtra os números que se repetiram mais de uma vez
    const numerosRepetidos = Object.entries(frequencia)
        .filter(entry => entry[1] > 1) // Filtra números com frequência > 1
        .sort((a, b) => b[1] - a[1]); // Ordena em ordem decrescente de frequência

    // Retorna apenas os N números mais repetidos
    return numerosRepetidos.slice(0, quantidade);
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});