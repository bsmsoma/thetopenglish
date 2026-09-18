/*
  The Top English: configurações do site.
  É o único arquivo que precisa mudar para trocar o número do WhatsApp
  ou ligar a planilha de interessados. Passo a passo em COMO-ATUALIZAR.md.
*/
window.SITE_CONFIG = {
  // WhatsApp da escola: só números, com 55 + DDD + número. Exemplo: '5563912345678'.
  // [CONFIRMAR] com a escola antes de publicar. Enquanto estiver vazio,
  // os botões de WhatsApp levam ao formulário.
  whatsapp: '',

  // Endereço do Web App do Google Apps Script (apps-script/Code.gs), terminado em /exec.
  // Vazio: o formulário funciona só com o WhatsApp, sem registrar na planilha.
  planilhaUrl: '',

  // Mensagem dos botões "Falar no WhatsApp". O "Vim pelo site" mostra à escola de onde veio o contato.
  mensagemPadrao: 'Olá, Teacher Maureen! Vim pelo site e gostaria de informações sobre as aulas.',

  // Data da versão atual de privacidade.html. Vai para a planilha junto com cada consulta,
  // como registro de qual aviso a pessoa aceitou (LGPD, art. 8º). Atualize ao mudar o aviso.
  versaoAviso: '2026-09-18'
};
