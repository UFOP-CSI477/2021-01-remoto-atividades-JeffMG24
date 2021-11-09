const Funcoes = {
  init() {
    Funcoes.iniciaSaldoAleatorio();
    Funcoes.mensagemHistoricoVazio();
    Funcoes.controlaBotaoProximo();
    Funcoes.controlaChavePix();
    Funcoes.controlaBotaoFinalizar();
    Funcoes.controlaBotoesEnviarReceber();
  },

  valorTransferencia: 0,
  saldoAleatorio: (Math.random() * (150000 - 1) + 1).toFixed(2),

  iniciaSaldoAleatorio() {
    const elementoSaldo = document.querySelector('#saldo-disponivel')
    elementoSaldo.innerHTML = 'R$ ' + Funcoes.saldoAleatorio;
  },

  mensagemHistoricoVazio() {
    const historico = document.querySelector('.historico-lista');

    if (historico.children.length > 0) {
      document.querySelector('#historico-vazio').style.display = 'none';
    } else {
      document.querySelector('#historico-vazio').style.display = 'flex';
    }
  },

  controlaBotaoProximo() {
    const input = document.querySelector('.valor-transferencia input');
    const botaoProximo = document.querySelector('.button-acao-proximo');

    input.addEventListener('input', function (e) {
      Funcoes.valorTransferencia = Number(e.target.value);
    })

    botaoProximo.addEventListener('click', function () {
      if (Funcoes.valorTransferencia <= 0) {
        alert('Insira uma quantia válida antes de continuar!')
      } else if (Funcoes.saldoAleatorio < Funcoes.valorTransferencia) {
        alert('Você não tem saldo suficiente!')
      } else {
        document.querySelector('.pessoa-escolha').style.display = 'flex';
        document.querySelector('.pessoa-envio').style.display = 'flex';
        document.querySelector('#valor-enviado').innerHTML = `
          Você está enviando <strong>R$ ${Funcoes.valorTransferencia}</strong>
        `;
        document.querySelector('#saldo-final-enviado').innerHTML = `
          Seu saldo final será <strong>R$ ${(Funcoes.saldoAleatorio - Funcoes.valorTransferencia).toFixed(2)}</strong>
        `;
      }
    })
  },

  controlaBotoesEnviarReceber() {
    document.getElementById('pessoa-enviar').addEventListener('click', function () {
      // document.querySelector('.pessoa-envio').style.display = 'flex';
      document.querySelector('.pessoa-receber').style.display = 'none';
      document.querySelector('.valor-transferencia').style.display = 'flex';
    });
    document.getElementById('pessoa-receber').addEventListener('click', function () {
      // document.querySelector('.pessoa-envio').style.display = 'none';
      document.querySelector('.pessoa-receber').style.display = 'flex';
      document.querySelector('.valor-transferencia').style.display = 'none';
    });
  },

  controlaChavePix() {
    const botoes = document.querySelectorAll('.botao-pix');
    const inputChave = document.querySelector('#pessoa-envio-input input');
    inputChave.placeholder = 'CPF'
    inputChave.type = 'number';

    botoes.forEach(botao => {
      botao.addEventListener('click', function () {
        switch (botao.getAttribute('id')) {
          case 'button-cpf':
            inputChave.placeholder = 'CPF'
            inputChave.type = 'number';
            inputChave.value = '';
            break;
          case 'button-cnpj':
            inputChave.placeholder = 'CNPJ'
            inputChave.type = 'number';
            inputChave.value = '';
            break;
          case 'button-email':
            inputChave.placeholder = 'E-mail'
            inputChave.type = 'email';
            inputChave.value = '';
            break;
          case 'button-celular':
            inputChave.placeholder = 'Celular'
            inputChave.type = 'number';
            inputChave.value = '';
            break;
          case 'button-aleatoria':
            inputChave.placeholder = 'Chave aleatória'
            inputChave.type = 'text';
            inputChave.value = '';
            break;
        }
      })
    })
  },

  controlaBotaoFinalizar() {
    const finalizar = document.querySelector('#button-finalizar');
    const confirmarRecebimento = document.querySelector('.pessoa-receber button');
    const inputChavePix = document.querySelector('#pessoa-envio-input input');
    let inputChave = null;

    inputChavePix.addEventListener('input', function (e) {
      inputChave = e.target.value;
    });

    confirmarRecebimento.addEventListener('click', function () {
      document.querySelector('.resumo').style.display = 'flex';
      document.querySelector('.resumo > div:last-child').style.display = 'none';
      document.querySelector('.resumo > div > span').innerHTML = `
        <span>Você confirmou o recebimento do PIX!</span>
      `;
      document.querySelector('.resumo').style.display = 'flex';

      setTimeout(() => {
        document.querySelector('.pessoa-escolha').style.display = 'flex';
        document.querySelector('span#historico-vazio').style.display = 'none';
        document.querySelector('#pessoa-envio-input input').value = '';
        document.querySelector('.pessoa-receber').style.display = 'none';
        document.querySelector('.pessoa-envio').style.display = 'none';
        document.querySelector('.resumo-envio').style.display = 'none';
        document.querySelector('.resumo').style.display = 'none';
      }, 1000);

      const elemento = document.querySelector('.historico-lista');

      const data = new Date().toLocaleDateString('pt-BR');
      const hora = `${new Date().getHours()}:${new Date().getMinutes()}`;

      const dados = `
            <li class="historico-item">
              <span>[+] Nova Transferência Recebida</span>
              <span><strong id="tipo-transf">${data}</strong> às <strong id="hora-transf">${hora}</strong></span>
            </li>
        `;

      elemento.innerHTML += dados;
    });

    finalizar.addEventListener('click', function () {
      if (Funcoes.valorTransferencia <= 0) {
        alert('Você precisa inserir um valor válido!')
        return;
      }

      if (document.querySelector('#chave-pix').type == 'email' && !document.querySelector('#chave-pix').value.includes('@')) {
        alert('Chave inválida. Verifique o e-mail inserido!');
        return;
      }

      if (!inputChave) {
        alert('Insira uma chave válida!')
        return;
      } else if (inputChave.length < 10) {
        alert('A chave inserida não é válida!')
        return;
      } else {
        document.querySelector('#valor-transferido').innerHTML = 'R$ ' + Funcoes.valorTransferencia;
        document.querySelector('.resumo').style.display = 'flex';
        const novoSaldo = Funcoes.saldoAleatorio - Funcoes.valorTransferencia;
        Funcoes.saldoAleatorio = novoSaldo;
        document.querySelector('#saldo-pos-transferido').innerHTML = 'R$ ' + novoSaldo.toFixed(2);
        document.querySelector('#saldo-disponivel').innerHTML = 'R$ ' + novoSaldo.toFixed(2);

        fetch('https://brasilapi.com.br/api/banks/v1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(response => {
            const bancoAleatorio = (Math.random() * (315 - 0) + 0).toFixed(0);
            document.querySelector('#dados-banco').innerHTML = response[bancoAleatorio].fullName;
            Funcoes.cadastraHistorico();
          })

        setTimeout(() => {
          document.querySelector('span#historico-vazio').style.display = 'none';
          document.querySelector('#pessoa-envio-input input').value = '';
          document.querySelector('.pessoa-escolha').style.display = 'flex';
          document.querySelector('.valor-transferencia').style.display = 'none';
          document.querySelector('.pessoa-envio').style.display = 'none';
          document.querySelector('.pessoa-receber').style.display = 'none';
          document.querySelector('.resumo').style.display = 'none';
          document.querySelector('#valor-enviado').innerHTML = '';
          document.querySelector('#saldo-final-enviado').innerHTML = '';
        }, 1000);
      }
    })
  },

  cadastraHistorico() {
    const elemento = document.querySelector('.historico-lista');

    const data = new Date().toLocaleDateString('pt-BR');
    const hora = `${new Date().getHours()}:${new Date().getMinutes()}`;

    const dados = `
        <li class="historico-item">
          <span>[-] Nova Transferência Enviada</span>
          <span>no valor de <strong id="valor-transf">R$ ${Funcoes.valorTransferencia}</strong></span>
          <span><strong id="tipo-transf">${data}</strong> às <strong id="hora-transf">${hora}</strong></span>
        </li>
    `;

    elemento.innerHTML += dados;

    Funcoes.valorTransferencia = 0;
    document.querySelector('.valor-transferencia input').value = '';
    document.querySelector('#pessoa-envio-input input').value = '';
    document.querySelector('#dados-banco').innerHTML = '';
    document.querySelector('.pessoa-envio').style.display = 'none';

    setTimeout(() => {
      document.querySelector('.resumo').style.display = 'none';
    }, 2000);
  },


}

document.addEventListener('DOMContentLoaded', function () {
  Funcoes.init();
})