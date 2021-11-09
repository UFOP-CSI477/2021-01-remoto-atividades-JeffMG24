const Funcoes = {
  init() {
    console.log('init')
    Funcoes.adicionaFuncoesCalculadora();
  },

  operacaoEscolhida: '',

  adicionaFuncoesCalculadora() {
    const botoesCalculadora = document.querySelectorAll('.botoes > button');

    botoesCalculadora.forEach(botao => {
      botao.addEventListener('click', Funcoes.calcular);
    })
  },

  calcular(evento) {
    const botaoClicado = evento.target.value;
    const input = document.querySelector('#input-resultado');
    const calculo = document.querySelector('span#calculo');
    const resultado = document.querySelector('span#resultado');

    switch (botaoClicado) {
      case 'c':
        input.value = '';
        resultado.innerHTML = '';
        Funcoes.operacaoEscolhida = '';
        calculo.innerHTML = '';
        return;
        break;
      case '=':
        const igual = Funcoes.operacaoEscolhida;
        calculo.innerHTML = Funcoes.operacaoEscolhida;
        input.value = '';
        resultado.innerHTML = eval(igual);
        Funcoes.operacaoEscolhida = '';
        return;
        break;
      case '<':
        input.value = input.value.slice(0, -1);
        Funcoes.operacaoEscolhida = input.value;
        return;
        break;
    }

    Funcoes.operacaoEscolhida += botaoClicado;
    input.value += botaoClicado;
  },
}

document.addEventListener('DOMContentLoaded', function () {
  Funcoes.init();
})