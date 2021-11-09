const Funcoes = {
  init() {
    Funcoes.preencheMoedasDisponiveis();
    Funcoes.adicionaFuncaoAoBotao();
  },

  combinacaoMoedas: null,
  dadosMoedaConvertida: null,

  preencheMoedasDisponiveis() {
    fetch('https://economia.awesomeapi.com.br/JSON/available')
      .then(response => response.json())
      .then(data => {
        const paraOrdenar = [];
        for (let prop in data) {
          paraOrdenar.push({ tag: prop, name: data[prop] });
        }
        const ordenado = paraOrdenar.sort(function (a, b) {
          const tagA = a.tag;
          const tagB = b.tag;

          if (tagA > tagB) {
            return 1
          }

          if (tagB > tagA) {
            return -1
          }

          return 0;
        });

        ordenado.forEach(coin => {
          document.querySelector('#moedas-origem').innerHTML += `
            <option value="${coin.tag}">${coin.tag} - ${coin.name}</option>
          `;
        })
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('main').style.display = 'flex';
      });
  },

  adicionaFuncaoAoBotao() {
    document.querySelector('.converter > button').addEventListener('click', function () {
      const selecionaCombinacaoMoedas = document.querySelector('#moedas-origem');
      Funcoes.combinacaoMoedas = selecionaCombinacaoMoedas.options[selecionaCombinacaoMoedas.selectedIndex].value;
      Funcoes.converteOsValores();
    });
  },

  converteOsValores() {
    document.querySelector('.dados-conversao').style.display = 'none';
    document.querySelector('.loading-conversao').style.display = 'flex';

    const precoInserido = document.querySelector('.valor-para > input').value;

    if (Number(precoInserido) <= 0) {
      alert('Insira um valor maior que zero!')
      document.querySelector('.loading-conversao').style.display = 'none';
      return;
    }

    fetch(`https://economia.awesomeapi.com.br/json/${Funcoes.combinacaoMoedas}`)
      .then(response => response.json())
      .then(response => {
        const titulo = document.querySelector('.dados-conversao > h3');
        titulo.innerHTML = `
      Convertendo ${response[0].name}:
      `;
        const precoCompra = document.querySelector('#preco-compra');
        const precoVenda = document.querySelector('#preco-venda');
        const precoConvertido = document.querySelector('#valor-convertido');

        precoCompra.innerHTML = `${response[0].code} ${Number(response[0].bid)}`;
        precoVenda.innerHTML = `${response[0].code} ${Number(response[0].ask)}`;
        precoConvertido.innerHTML = `${response[0].codein} ${Number(response[0].ask * Number(precoInserido))}`;

        setTimeout(() => {
          document.querySelector('.loading-conversao').style.display = 'none';
          document.querySelector('.dados-conversao').style.display = 'flex';
        }, 500);
      });
  },
}

document.addEventListener('DOMContentLoaded', function () {
  Funcoes.init();
})