"use strict";

// Importação de módulos necessários
const validateOptions = require("./core/validate-options");
const constantes = require("./core/constantes");
const interactable = require("./core/interactable");
const mapaUi = require("./core/mapa-ui");
const mapaIo = require("./core/mapa-io");

// Verificação se não está rodando em um ambiente Node --> Ou seja, está sempre dando false
if(!constantes.IS_NODE) { 
  // Importação do módulo 'whatwg-fetch' para suporte a fetch em browsers
  require("whatwg-fetch");
}

// Função para desenhar o mapa
let draw = (element, options) => {
  // Validando as opções passadas
  options = validateOptions(options);
  // Inicializando o DOM do elemento
  mapaUi.initDom(element);

  // Obtendo o caminho JSON e SVG para o mapa (Jsons e svgs se encontram na pasta data dentro de public)
  const pathJson = mapaIo.getPath(options, false);
  const pathSvg = mapaIo.getPath(options, true);

  // Carregando os dados do arquivo JSON e SVG simultaneamente
  Promise.all([
    options.hasOwnProperty("dataFileLoader") ? options.dataFileLoader(false, pathJson) : mapaIo.loadDataFile(false, pathJson),
    options.hasOwnProperty("dataFileLoader") ? options.dataFileLoader(true, pathSvg) : mapaIo.loadDataFile(true, pathSvg),
    options.unidadeData
  ]).then(result => {
    // Atualizando o conteúdo do container com o SVG
    element.getElementsByClassName("svg-container")[0].innerHTML = result[0];

    // Tornando os elementos do mapa interativos (Função dentro de core em src)
    interactable(element);

    // Selecionando o elemento SVG
    let svgEl = element.getElementsByClassName("svg-container")[0].getElementsByTagName("svg")[0];

    // Selecionando os caminhos (paths) do SVG
    let listPath = svgEl.getElementsByTagName("g")[0].getElementsByTagName("path");
    for (let i = 0; i < listPath.length; i++) {
      // Obtendo o código IBGE e o nome da unidade
      const codIbge = parseInt(result[1][i][constantes.codIbgeAttr[options.regiao]]);
      const nomUnidade = result[1][i][constantes.nomeUnidadeAttr[options.regiao]];

      // Filtrando os dados para encontrar a unidade correspondente ao código IBGE
      let unidadeData = result[2].filter(item => item.codIbge == codIbge || (codIbge + "").substr(0, 6) == item.codIbge);
      unidadeData = unidadeData.length > 0 ? unidadeData[0] : {};

      // Definindo estilos para o caminho
      listPath[i].style.fill = (unidadeData.hasOwnProperty("fillColor") ? unidadeData.fillColor : options.defaultFillColor);
      listPath[i].style.stroke = (unidadeData.hasOwnProperty("strokeColor") ? unidadeData.strokeColor : options.defaultStrokeColor);
      listPath[i].style.strokeWidth = (unidadeData.hasOwnProperty("strokeWidth") ? unidadeData.strokeWidth : 1);
      // Adicionando título ao caminho
      listPath[i].innerHTML = `<title>${nomUnidade}</title>`;

      // Adicionando evento de clique ao caminho
      if(options.hasOwnProperty("onClick")){
        listPath[i].onclick = (evt) => {
          evt.preventDefault();
          options.onClick({codIbge: codIbge, nomUnidade: nomUnidade});
        }
      }
    }

    // Chamando a função de callback após o desenho do mapa
    if(options.hasOwnProperty("onDrawComplete")){
      options.onDrawComplete(element, result[1]);
    }

    // Fechando o carregador após o desenho do mapa
    mapaUi.closeLoader(element);
  }).catch((e) => {
    console.error(e);
    mapaUi.closeLoader(element);
  });
};

// Exportando a função draw para uso externo
module.exports = (element, options) => {
  draw(element, options);
};
