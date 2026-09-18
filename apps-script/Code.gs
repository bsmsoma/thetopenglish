/**
 * The Top English: recebe o formulário "Consultar vaga" do site e grava na planilha da escola.
 *
 * Instalação (passo a passo completo no README.md, seção "Planilha de interessados"):
 * 1. Na conta Google da escola, crie uma Planilha Google.
 * 2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 * 3. Implantar > Nova implantação > App da Web.
 *    Executar como: Eu. Quem pode acessar: Qualquer pessoa.
 * 4. Copie a URL terminada em /exec para planilhaUrl, em js/config.js.
 * 5. Rode uma vez a função ativarLimpezaAutomatica (apaga consultas com mais de 6 meses,
 *    como promete o aviso de privacidade).
 *
 * Segurança: este script só acrescenta linhas. Ele não devolve nenhum dado da planilha
 * e não registra dados pessoais nos logs.
 */

const ABA = 'Interessados';
const DIAS_DE_GUARDA = 180; // prazo informado em privacidade.html
const MAX_ENVIOS_POR_MINUTO = 20; // freio contra robôs
const STATUS = ['Novo', 'Contatado', 'Aula experimental', 'Matriculado', 'Sem horário'];

// [título da coluna, campo enviado pelo site]. Status e Observações são preenchidos pela escola.
const COLUNAS = [
  ['Data', null],
  ['Nome', 'nome'],
  ['WhatsApp', 'whatsapp'],
  ['Aulas para', 'para'],
  ['Idade da criança', 'idade'],
  ['Curso', 'servico'],
  ['Nível', 'nivel'],
  ['Dias', 'dias'],
  ['Períodos', 'periodos'],
  ['Como conheceu', 'origem'],
  ['Aviso de privacidade aceito', 'aviso'],
  ['Status', null],
  ['Observações', null]
];

function doPost(e) {
  const dados = (e && e.parameter) || {};

  // Campo-armadilha preenchido, envio incompleto ou excesso de envios: ignora sem avisar.
  if (dados.website || !dados.nome || !dados.whatsapp || !dados.aviso || excedeuLimite_()) {
    return resposta_();
  }

  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    const linha = COLUNAS.map(function (coluna) {
      if (coluna[0] === 'Data') return new Date();
      if (coluna[0] === 'Status') return 'Novo';
      return coluna[1] ? limpar_(dados[coluna[1]]) : '';
    });
    obterAba_().appendRow(linha);
  } finally {
    trava.releaseLock();
  }

  return resposta_();
}

/** Apaga as consultas com mais de DIAS_DE_GUARDA dias. Roda sozinha depois de ativarLimpezaAutomatica. */
function apagarConsultasAntigas() {
  const aba = obterAba_();
  const total = aba.getLastRow() - 1;
  if (total < 1) return;

  const limite = Date.now() - DIAS_DE_GUARDA * 24 * 60 * 60 * 1000;
  const datas = aba.getRange(2, 1, total, 1).getValues();

  // De baixo para cima, para a numeração das linhas não mudar durante a exclusão.
  for (let i = datas.length - 1; i >= 0; i--) {
    const data = datas[i][0];
    if (data instanceof Date && data.getTime() < limite) {
      aba.deleteRow(i + 2);
    }
  }
}

/** Rode uma vez: agenda a limpeza para todos os dias, de madrugada. */
function ativarLimpezaAutomatica() {
  const jaExiste = ScriptApp.getProjectTriggers().some(function (gatilho) {
    return gatilho.getHandlerFunction() === 'apagarConsultasAntigas';
  });
  if (!jaExiste) {
    ScriptApp.newTrigger('apagarConsultasAntigas').timeBased().everyDays(1).atHour(3).create();
  }
}

function obterAba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (aba) return aba;

  aba = planilha.insertSheet(ABA);
  aba.appendRow(COLUNAS.map(function (coluna) { return coluna[0]; }));
  aba.setFrozenRows(1);
  aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');

  const colunaStatus = COLUNAS.findIndex(function (coluna) { return coluna[0] === 'Status'; }) + 1;
  const regra = SpreadsheetApp.newDataValidation().requireValueInList(STATUS, true).build();
  aba.getRange(2, colunaStatus, aba.getMaxRows() - 1, 1).setDataValidation(regra);
  return aba;
}

// Limita o tamanho e impede que um texto começando com =, +, - ou @ vire fórmula na planilha.
function limpar_(valor) {
  const texto = String(valor || '').slice(0, 200).trim();
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function excedeuLimite_() {
  const cache = CacheService.getScriptCache();
  const chave = 'envios-' + Math.floor(Date.now() / 60000);
  const total = Number(cache.get(chave) || 0) + 1;
  cache.put(chave, String(total), 120);
  return total > MAX_ENVIOS_POR_MINUTO;
}

function resposta_() {
  return ContentService.createTextOutput('ok');
}
