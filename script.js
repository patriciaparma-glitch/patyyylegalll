// ======================================================
// CONFIGURAÇÃO DO CANVAS
// ======================================================

// Pegamos o canvas do HTML
const canvas = document.getElementById("jogo");

// Pegamos o contexto 2D para desenhar
const ctx = canvas.getContext("2d");


// ======================================================
// CONFIGURAÇÕES DO JOGO
// ======================================================

// Altura do chão
const chaoY = 250;

// Gravidade do pulo
const gravidade = 0.7;

// Força do pulo
const forcaPulo = -13;


// ======================================================
// CONFIGURAÇÕES DOS CACTOS
// ======================================================

// Velocidade inicial dos cactos
const velocidadeInicial = 5;

// Velocidade que será usada atualmente
let velocidadeCacto = velocidadeInicial;

// A cada 100 pontos, aumenta um pouco a velocidade
const aumentoVelocidade = 0.5;

// Limite para a velocidade não ficar impossível
const velocidadeMaxima = 8;


// ======================================================
// DINOSSAURO
// ======================================================

const dinossauro = {
    x: 100,
    y: chaoY - 57,

    // Velocidade vertical
    velocidadeY: 0,

    // Diz se está pulando
    pulando: false
};


// ======================================================
// LISTA DE CACTOS
// ======================================================

// Guarda todos os cactos que estão na tela
const cactos = [];


// ======================================================
// CONTROLE DO TEMPO DOS CACTOS
// ======================================================

// Tempo até aparecer o próximo cacto
let tempoProximoCacto = 1000;


// ======================================================
// PONTUAÇÃO
// ======================================================

// Pontuação começa em zero
let pontuacao = 0;

// Controle para fazer a pontuação subir com o tempo
let tempoPontuacao = 0;

// Guarda quantos pontos já usamos para aumentar a velocidade
let ultimoNivelDeVelocidade = 0;


// ======================================================
// CONTROLE DO GAME OVER
// ======================================================

// Quando for true, o jogo está parado
let jogoTerminou = false;


// ======================================================
// DESENHAR O CHÃO
// ======================================================

function desenharChao() {

    ctx.fillStyle = "#333333";

    // Desenha uma linha horizontal
    ctx.fillRect(
        0,
        chaoY,
        canvas.width,
        3
    );
}


// ======================================================
// DESENHAR O DINOSSAURO
// ======================================================

function desenharDinossauro() {

    // Cor do dinossauro
    ctx.fillStyle = "#333333";

    // Corpo
    ctx.fillRect(
        dinossauro.x,
        dinossauro.y + 15,
        30,
        35
    );

    // Cabeça
    ctx.fillRect(
        dinossauro.x + 20,
        dinossauro.y,
        25,
        25
    );

    // Pescoço
    ctx.fillRect(
        dinossauro.x + 15,
        dinossauro.y + 10,
        15,
        15
    );

    // Perna esquerda
    ctx.fillRect(
        dinossauro.x + 5,
        dinossauro.y + 45,
        8,
        12
    );

    // Perna direita
    ctx.fillRect(
        dinossauro.x + 20,
        dinossauro.y + 45,
        8,
        12
    );

    // Cauda
    ctx.fillRect(
        dinossauro.x - 10,
        dinossauro.y + 25,
        15,
        8
    );

    // Olho
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        dinossauro.x + 36,
        dinossauro.y + 6,
        4,
        4
    );
}


// ======================================================
// CRIAR UM CACTO
// ======================================================

function criarCacto() {

    // Escolhe aleatoriamente entre um cacto baixo e um alto
    const altura = Math.random() < 0.5 ? 30 : 50;

    // Largura do cacto
    const largura = 15;

    const cacto = {
        // Começa no lado direito da tela
        x: canvas.width,

        // Coloca o cacto sobre o chão
        y: chaoY - altura,

        largura: largura,
        altura: altura
    };

    // Adiciona o cacto à lista
    cactos.push(cacto);
}


// ======================================================
// DESENHAR OS CACTOS
// ======================================================

function desenharCactos() {

    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        // Cor verde do cacto
        ctx.fillStyle = "#2e8b57";

        // Tronco principal
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );

        // Os cactos altos recebem braços
        if (cacto.altura >= 50) {

            // Braço esquerdo
            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 15,
                8,
                5
            );

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 10,
                5,
                10
            );

            // Braço direito
            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 25,
                8,
                5
            );

            ctx.fillRect(
                cacto.x + cacto.largura + 3,
                cacto.y + 20,
                5,
                10
            );
        }
    }
}


// ======================================================
// DESENHAR A PONTUAÇÃO
// ======================================================

function desenharPontuacao() {

    // Converte a pontuação para texto
    // e completa com zeros até ficar com 5 dígitos.
    //
    // Exemplo:
    // 5     -> 00005
    // 25    -> 00025
    // 125   -> 00125
    // 1234  -> 01234
    const textoPontuacao = String(pontuacao).padStart(5, "0");

    // Cor da pontuação
    ctx.fillStyle = "#333333";

    // Fonte
    ctx.font = "20px Arial";

    // Alinha o texto pela direita
    ctx.textAlign = "right";

    // Desenha no canto superior direito
    ctx.fillText(
        textoPontuacao,
        canvas.width - 15,
        25
    );
}


// ======================================================
// ATUALIZAR A PONTUAÇÃO
// ======================================================

function atualizarPontuacao() {

    // Faz o tempo passar
    tempoPontuacao += 16;

    // A cada 100 milissegundos, ganha 1 ponto
    if (tempoPontuacao >= 100) {

        pontuacao++;

        // Zera o contador para começar novamente
        tempoPontuacao = 0;
    }


    // Descobre em qual grupo de 100 pontos estamos
    const nivelAtual = Math.floor(pontuacao / 100);

    // Se chegou a um novo grupo de 100 pontos...
    if (nivelAtual > ultimoNivelDeVelocidade) {

        // Aumenta um pouco a velocidade
        velocidadeCacto += aumentoVelocidade;

        // Nunca deixa passar do limite
        if (velocidadeCacto > velocidadeMaxima) {
            velocidadeCacto = velocidadeMaxima;
        }

        // Guarda o novo nível
        ultimoNivelDeVelocidade = nivelAtual;
    }
}


// ======================================================
// ATUALIZAR O DINOSSAURO
// ======================================================

function atualizarDinossauro() {

    // A gravidade aumenta a velocidade de queda
    dinossauro.velocidadeY += gravidade;

    // Atualiza a posição vertical
    dinossauro.y += dinossauro.velocidadeY;

    // Altura do dinossauro
    const alturaDoDinossauro = 57;

    // Verifica se chegou ao chão
    if (dinossauro.y + alturaDoDinossauro >= chaoY) {

        // Coloca exatamente sobre o chão
        dinossauro.y = chaoY - alturaDoDinossauro;

        // Para o movimento vertical
        dinossauro.velocidadeY = 0;

        // Diz que não está mais pulando
        dinossauro.pulando = false;
    }
}


// ======================================================
// FAZER O DINOSSAURO PULAR
// ======================================================

function pular() {

    // Só permite pular quando está no chão
    if (!dinossauro.pulando) {

        // Dá velocidade para cima
        dinossauro.velocidadeY = forcaPulo;

        // Marca que está no ar
        dinossauro.pulando = true;
    }
}


// ======================================================
// ATUALIZAR OS CACTOS
// ======================================================

function atualizarCactos() {

    // Diminui o tempo até o próximo cacto
    tempoProximoCacto -= 16;

    // Quando chega a zero, cria um novo cacto
    if (tempoProximoCacto <= 0) {

        criarCacto();

        // Escolhe um novo intervalo aleatório
        // entre 800 e 1800 milissegundos
        tempoProximoCacto =
            Math.random() * 1000 + 800;
    }


    // Percorremos de trás para frente
    // para remover os cactos com segurança
    for (let i = cactos.length - 1; i >= 0; i--) {

        const cacto = cactos[i];

        // Move o cacto para a esquerda
        cacto.x -= velocidadeCacto;

        // Se saiu completamente da tela, remove
        if (cacto.x + cacto.largura < 0) {

            cactos.splice(i, 1);
        }
    }
}


// ======================================================
// VERIFICAR COLISÃO
// ======================================================

function verificarColisao() {

    // Criamos um retângulo imaginário em volta do dinossauro
    const dinossauroEsquerda = dinossauro.x - 10;
    const dinossauroDireita = dinossauro.x + 45;
    const dinossauroTopo = dinossauro.y;
    const dinossauroBaixo = dinossauro.y + 57;

    // Verifica cada cacto
    for (let i = 0; i < cactos.length; i++) {

        const cacto = cactos[i];

        // Limites do cacto
        const cactoEsquerda = cacto.x;
        const cactoDireita = cacto.x + cacto.largura;
        const cactoTopo = cacto.y;
        const cactoBaixo = cacto.y + cacto.altura;

        // Verifica se os dois retângulos se sobrepõem
        const bateu =
            dinossauroDireita > cactoEsquerda &&
            dinossauroEsquerda < cactoDireita &&
            dinossauroBaixo > cactoTopo &&
            dinossauroTopo < cactoBaixo;

        // Se houve colisão, termina o jogo
        if (bateu) {

            jogoTerminou = true;

            return;
        }
    }
}


// ======================================================
// MOSTRAR GAME OVER
// ======================================================

function desenharGameOver() {

    // Coloca um fundo claro por cima do jogo
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Texto principal
    ctx.fillStyle = "#333333";

    ctx.textAlign = "center";

    ctx.font = "bold 40px Arial";

    ctx.fillText(
        "Game Over",
        canvas.width / 2,
        140
    );

    // Mostra a pontuação final
    ctx.font = "22px Arial";

    const textoFinal = String(pontuacao).padStart(5, "0");

    ctx.fillText(
        "Pontuação: " + textoFinal,
        canvas.width / 2,
        175
    );

    // Mensagem para reiniciar
    ctx.font = "20px Arial";

    ctx.fillText(
        "Aperta espaço para jogar de novo",
        canvas.width / 2,
        210
    );
}


// ======================================================
// REINICIAR O JOGO
// ======================================================

function reiniciarJogo() {

    // Coloca o dinossauro na posição inicial
    dinossauro.x = 100;
    dinossauro.y = chaoY - 57;

    // Zera a velocidade vertical
    dinossauro.velocidadeY = 0;

    // Diz que não está pulando
    dinossauro.pulando = false;


    // Apaga todos os cactos
    cactos.length = 0;


    // Cria um novo intervalo para o primeiro cacto
    tempoProximoCacto =
        Math.random() * 1000 + 800;


    // Zera a pontuação
    pontuacao = 0;

    // Zera o contador do tempo da pontuação
    tempoPontuacao = 0;

    // Volta a velocidade para o começo
    velocidadeCacto = velocidadeInicial;

    // Volta o nível da velocidade para zero
    ultimoNivelDeVelocidade = 0;


    // Libera o jogo
    jogoTerminou = false;
}


// ======================================================
// TECLADO
// ======================================================

document.addEventListener("keydown", function(evento) {

    // Se o jogo terminou e apertar Espaço,
    // reinicia tudo
    if (jogoTerminou && evento.code === "Space") {

        evento.preventDefault();

        reiniciarJogo();

        return;
    }


    // Durante o jogo, Espaço ou seta para cima fazem pular
    if (
        !jogoTerminou &&
        (
            evento.code === "Space" ||
            evento.code === "ArrowUp"
        )
    ) {

        evento.preventDefault();

        pular();
    }
});


// ======================================================
// DESENHAR O JOGO
// ======================================================

function desenhar() {

    // Limpa a tela
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Desenha o chão
    desenharChao();

    // Desenha o dinossauro
    desenharDinossauro();

    // Desenha os cactos
    desenharCactos();

    // Desenha a pontuação
    desenharPontuacao();

    // Se o jogo terminou, mostra Game Over
    if (jogoTerminou) {

        desenharGameOver();
    }
}


// ======================================================
// LOOP PRINCIPAL
// ======================================================

function loop() {

    // Só atualiza o jogo enquanto ele estiver rodando
    if (!jogoTerminou) {

        // Atualiza o dinossauro
        atualizarDinossauro();

        // Atualiza os cactos
        atualizarCactos();

        // Atualiza a pontuação
        atualizarPontuacao();

        // Verifica colisões
        verificarColisao();
    }

    // Desenha tudo
    desenhar();

    // Continua o loop
    requestAnimationFrame(loop);
}


// ======================================================
// INICIAR O JOGO
// ======================================================

// Faz o primeiro desenho
desenhar();

// Começa o loop principal
loop();

