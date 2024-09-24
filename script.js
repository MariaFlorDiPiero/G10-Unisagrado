// Perguntas do Quiz
const quizData = [
    {
        question: "Qual é 2 + 2?",
        options: ["3", "4", "5"],
        correct: 1,
    },
    {
        question: "Qual é 3 x 3?",
        options: ["6", "7", "9"],
        correct: 2,
    }
];

let currentQuestion = 0;
let correctAnswers = []; // Array para armazenar perguntas corretas

// Função para carregar a pergunta atual
function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    const quizContainer = document.getElementById('quiz-container');
    
    quizContainer.innerHTML = `
        <h2>${currentQuiz.question}</h2>
        <form id="quizForm">
            ${currentQuiz.options.map((option, index) => `
                <label class="quiz-option">
                    <input type="radio" name="quizOption" value="${index}" onclick="selectAnswer(${index})">
                    <span class="custom-radio"></span> ${option}
                </label>
            `).join('')}
        </form>
    `;

    // Esconder o botão "Próxima Pergunta" até que o usuário responda
    document.getElementById('nextButton').style.display = 'none';

    // Se for a última pergunta, mudar o texto do botão
    if (currentQuestion === quizData.length - 1) {
        document.getElementById('nextButton').textContent = 'Enviar';
    } else {
        document.getElementById('nextButton').textContent = 'Próxima Pergunta';
    }
}

// Função para processar a resposta selecionada
function selectAnswer(selected) {
    const currentQuiz = quizData[currentQuestion];
    const correto = selected === currentQuiz.correct;

    // Salvar a pergunta correta com a resposta
    if (correto) {
        correctAnswers.push({
            question: currentQuiz.question,
            answer: currentQuiz.options[currentQuiz.correct], // Armazenar a resposta correta
            correct: true
        });
    }

    // Dados da resposta a serem enviados ao servidor
    const respostaData = {
        pergunta: currentQuiz.question,
        resposta: currentQuiz.options[selected],
        correto: correto
    };

    // Enviar dados para o servidor usando fetch
    fetch('http://localhost:8080/api/respostas/salvar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(respostaData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta salva com sucesso:', data);
    })
    .catch(error => console.error('Erro ao salvar resposta:', error));

    // Mostrar o botão "Próxima Pergunta" após a resposta
    document.getElementById('nextButton').style.display = 'block';
}

// Função para carregar a próxima pergunta ou mostrar o resultado
document.getElementById('nextButton').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

// Função para mostrar o resultado final
function showResult() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
    <div class="quiz-result">
        <h2>Quiz Finalizado!</h2>
        <p>Você acertou ${correctAnswers.length} de ${quizData.length} perguntas.</p>
        <p>Você acertou as seguintes perguntas:</p>
        <ul>
            ${correctAnswers.map(answer => `<li>${answer.question} (${answer.answer})</li>`).join('')}
        </ul>
    </div>
    `;
    document.getElementById('nextButton').style.display = 'none';
}

// Carregar a primeira pergunta ao abrir a página
window.onload = loadQuestion;
