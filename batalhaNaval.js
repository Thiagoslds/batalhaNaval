//objeto para mostrar ao jogador as interações que ocorrerem
var visao = {
  //insere a mensagem a ser mostrada para o jogador
  mostrarMensagem: function(msg) {
    var areaMensagem = document.getElementById("areaMensagem");
    areaMensagem.innerHTML = msg;
  },
  //atribui uma nova classe à célula em caso de acerto
  mostrarAcerto: function(posicao) {
    var celula = document.getElementById(posicao);
    celula.setAttribute("class", "acerto");
  },
  //atribui uma nova classe à celula em caso de erro
  mostrarErro: function(posicao) {
    var celula = document.getElementById(posicao);
    celula.setAttribute("class", "erro");
  }
};

//objeto que modela o jogo e sua estrutura
var modelo = {
  tamanhoTabuleiro: 7,
  numNavios: 3,
  naviosAfundados: 0,
  tamanhoNavio: 3,
  //array de objetos, contendo cada um array com as posições no tabuleiro
  //e o número de acertos em cada navio
  navios: [
    { posicoes: ["0", "0", "0"], acertos: ["", "", ""] },
    { posicoes: ["0", "0", "0"], acertos: ["", "", ""] },
    { posicoes: ["0", "0", "0"], acertos: ["", "", ""] }
  ],

  //Propriedade para verificar se o palpite acertou o navio ou não
  atirar: function(palpite) {
    if (this.numNavios === this.naviosAfundados) {
      alert("Acabou o jogo!");
    } else {
      //percorre cada array dos navios para verificar se o palpite está lá
      for (var i = 0; i < this.numNavios; i++) {
        var navio = this.navios[i];
        var indice = navio.posicoes.indexOf(palpite);
        if (indice >= 0) {
          navio.acertos[indice] = "acerto"; //se tiver acertado o palpite, marca como acerto
          visao.mostrarAcerto(palpite); //envia o palpite correto
          visao.mostrarMensagem("ACERTO!");
          if (this.estaAfundado(navio)) {
            //verifica se já afundou o navio
            visao.mostrarMensagem("Você afundou meu navio!");
            this.naviosAfundados++;
          }
          return true;
        }
      }
      visao.mostrarErro(palpite);
      visao.mostrarMensagem("Você errou.");
      return false;
    }
  },

  //propriedade para verificar se o navio esta afundado ou nao
  estaAfundado: function(navio) {
    for (var i = 0; i < this.tamanhoNavio; i++) {
      if (navio.acertos[i] !== "acerto") {
        return false;
      }
    }
    return true; //quando todo o vetor de acertos dos navios esta preenchido
  },

  //Função principal para gerar as posições de cada navio no tabuleiro
  gerarPosicoesNavios: function(){
    var posicoes;
    //para cada navio gerado, gera um novo conjunto de posições
    for(var i=0; i<this.numNavios; i++){
        do{
            posicoes = this.gerarNavio();
        } while(this.colisao(posicoes)); //caso dê verdade é porque colidiu, então tenta nova posição
        this.navios[i].posicoes = posicoes; //adiciona ao modelo.navios
    }
  },

  //Gera posições aleatórias para os navios, podendo ser na horizontal ou vertical
  gerarNavio: function(){
      var direcao = Math.floor(Math.random()*2);
      var linha, coluna;

      if(direcao === 1){ //horizontal
          linha = Math.floor(Math.random() * this.tamanhoTabuleiro);
          coluna = Math.floor(Math.random() * (this.tamanhoTabuleiro - this.tamanhoNavio)); //não pode ultrapassar a borda
      } else{ //vertical
        linha = Math.floor(Math.random() * (this.tamanhoTabuleiro - this.tamanhoNavio)); //aqui seria nas linhas
        coluna = Math.floor(Math.random() * this.tamanhoTabuleiro);
      }

      var novaPosicaoNavio = [];
      for(var i=0; i<this.tamanhoNavio; i++){
          if(direcao === 1){
              novaPosicaoNavio.push(linha + "" + (coluna+i)); //na horizontal, acrescenta o numero de colunas 
          }else {
              novaPosicaoNavio.push((linha+i) + "" + coluna); //vertical, sobe num de linhas
          }

      }
      return novaPosicaoNavio;
  },

  //Função para detectar se as posições geradas não irão colidir com navios existentes
  colisao: function(posicoes){
      for(var i=0; i<this.numNavios; i++){
          var navio = modelo.navios[i];
          for(var j=0; j<posicoes.length; j++){
              if(navio.posicoes.indexOf(posicoes[j]) >= 0){
                  return true;
              }
              
          }
      }
      return false;
  }
};

//Função para verificar se o número é válido e transformar a letra em número
function analisarPalpite(palpite) {
  var alfabeto = ["A", "B", "C", "D", "E", "F", "G"];

  if (palpite === null || palpite.length !== 2) {
    alert("Por favor insira apenas uma letra e um número!");
  } else {
    primeiroChar = palpite.charAt(0); //Primeiro caractere do palpite
    var linha = alfabeto.indexOf(primeiroChar); //Corresponde a letra ao número
    var coluna = palpite.charAt(1);

    if (isNaN(linha) || isNaN(coluna)) {
      alert("Este número não é válido!");
    } else if (
      linha < 0 ||
      coluna >= modelo.tamanhoTabuleiro ||
      coluna < 0 ||
      coluna >= modelo.tamanhoTabuleiro
    ) {
      alert("Número inválido!");
    } else {
      return linha + coluna; //retorna se os valores estiverem válidos
    }
  }
  return null;
}

var controlador = {
  palpites: 0,

  processarPalpite: function(palpite) {
    var posicao = analisarPalpite(palpite);
    if (posicao) {
      this.palpites++;
      var acerto = modelo.atirar(posicao);
      if (acerto && modelo.naviosAfundados === modelo.numNavios) {
        visao.mostrarMensagem(
          "Você afundou todos meus navios, em " + this.palpites + " palpites"
        );
      }
    }
  }
};

function init() {
  var botaoAtirar = document.getElementById("botaoAtirar");
  botaoAtirar.onclick = valoresBotaoAtirar;
  var entradaPalpite = document.getElementById("valorPalpite");
  entradaPalpite.onkeypress = valoresPressTeclado;

  modelo.gerarPosicoesNavios();
}

function valoresBotaoAtirar() {
  var entradaPalpite = document.getElementById("valorPalpite");
  var palpite = entradaPalpite.value;
  console.log(palpite);
  controlador.processarPalpite(palpite);
  entradaPalpite.value = "";
}

//Utilizar o enter para atirar
function valoresPressTeclado(e) {
  var botaoAtirar = document.getElementById("botaoAtirar");
  if (e.keyCode === 13) {
    botaoAtirar.click();
    return false;
  }
}

window.onload = init;
