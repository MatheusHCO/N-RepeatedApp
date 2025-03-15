document.getElementById('adicionarJogoBtn').addEventListener('click', async function () {
    const numerosInput = document.getElementById('numerosInput').value;

    // Verifica se o campo está vazio
    if (!numerosInput.trim()) {
        alert('Por favor, insira os números do jogo.');
        return;
    }

    // Verifica se há números válidos
    const numeros = numerosInput.split(',').map(num => num.trim());
    if (numeros.some(num => isNaN(num) || num === '')) {
        alert('Por favor, insira apenas números separados por vírgula.');
        return;
    }

    // Envia o novo jogo para o backend
    const response = await fetch('/adicionarJogo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeros: numerosInput }),
    });

    const data = await response.json();

    if (data.success) {
        // Exibe a mensagem de sucesso
        const mensagemSucesso = document.getElementById('mensagemSucesso');
        mensagemSucesso.style.display = 'block';

        // Oculta a mensagem após 3 segundos
        setTimeout(() => {
            mensagemSucesso.style.display = 'none';
        }, 3000);

        // Limpa o campo e foca nele para adicionar mais jogos
        document.getElementById('numerosInput').value = '';
        document.getElementById('numerosInput').focus();
    } else {
        alert('Erro ao adicionar o jogo.');
    }
});

document.getElementById('analisarBtn').addEventListener('click', async function () {
    // Obtém a quantidade de números a serem exibidos
    const quantidadeNumeros = document.getElementById('quantidadeNumeros').value;

    // Verifica se o campo está vazio
    if (!quantidadeNumeros.trim()) {
        alert('Por favor, informe quantos números exibir.');
        return;
    }

    // Envia a requisição para analisar os jogos
    const response = await fetch('/analisar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidadeNumeros }),
    });

    const data = await response.json();

    // Formata os resultados
    const resultadosFormatados = data.numerosRepetidos.map(entry => {
        return `N° ${entry[0]}: ${entry[1]}*`;
    });

    // Agrupa os resultados em linhas de até 5 números
    let linhas = [];
    for (let i = 0; i < resultadosFormatados.length; i += 5) {
        const linha = resultadosFormatados.slice(i, i + 5).join(', ');
        linhas.push(linha);
    }

    // Exibe os resultados
    document.getElementById('resultadoAnalise').innerHTML = linhas.join('<br>');
});

document.getElementById('limparMemoriaBtn').addEventListener('click', async function () {
    // Envia a requisição para limpar a memória
    const response = await fetch('/limparMemoria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (data.success) {
        // Exibe a mensagem de sucesso
        const mensagemLimpezaSucesso = document.getElementById('mensagemLimpezaSucesso');
        mensagemLimpezaSucesso.style.display = 'block';

        // Oculta a mensagem após 3 segundos
        setTimeout(() => {
            mensagemLimpezaSucesso.style.display = 'none';
        }, 3000);

        // Limpa os resultados exibidos
        document.getElementById('resultadoAnalise').innerHTML = '';
    } else {
        alert('Erro ao limpar a memória.');
    }
});
document.getElementById('exportarPDFBtn').addEventListener('click', function () {
    const resultadoAnalise = document.getElementById('resultadoAnalise').innerText;

    // Verifica se há resultados para exportar
    if (!resultadoAnalise.trim()) {
        alert('Nenhum resultado para exportar.');
        return;
    }

    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações do PDF
    doc.setFontSize(12);
    doc.text('Resultados da Análise de Jogos', 10, 10);
    doc.setFontSize(10);

    // Adiciona os resultados ao PDF
    const resultados = resultadoAnalise.split('\n');
    resultados.forEach((linha, index) => {
        doc.text(linha, 10, 20 + (index * 10));
    });

    // Salva o PDF
    doc.save('resultados_jogos.pdf');
});