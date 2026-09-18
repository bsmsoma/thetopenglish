# The Top English: site institucional e página de captação

Site da The Top English, escola de inglês da teacher Maureen, desenvolvido pela equipe **TIzeiros** no Projeto Integrador I em TI (Ulbra) como solução do problema validado no PI05/PI06:

> A captação de novos alunos depende de indicação (~90%) e da fachada (~10%), sem canal próprio nem registro de onde vêm os interessados.

O site apresenta a escola e os cursos e oferece o formulário **“Consultar vaga no meu horário”**. Ele coleta a disponibilidade do interessado logo no primeiro contato, abre o WhatsApp da escola com a mensagem pronta e, se configurado, registra a consulta numa Planilha Google. Assim a escola passa a saber quantas pessoas chegam pelo site, por qual canal e quantas viram matrícula.

HTML, CSS e JavaScript puro: sem framework, sem build e sem dependências.

## Estrutura

```
index.html            página única: hero, cursos, como funciona, sobre, dúvidas, formulário, contato
privacidade.html      aviso de privacidade (LGPD) do formulário
404.html              página de endereço inexistente (o Netlify usa sozinho)
css/tokens.css        cores, fontes, espaçamentos (mude aqui para mudar o site todo)
css/styles.css        estilos, mobile-first
js/config.js          número do WhatsApp, endereço da planilha, versão do aviso
js/main.js            menu, formulário → WhatsApp/planilha, ?origem=, ?servico=, ?revisar
apps-script/Code.gs   script da planilha (Google Apps Script)
assets/fonts/         fonte Lexend (licença OFL em OFL.txt)
assets/img/           imagem de compartilhamento (og-image.png); logo e favicon entram aqui quando a escola enviar
COMO-ATUALIZAR.md     guia rápido para trocar textos, aviso, número e fotos
```

## Rodar no computador

```bash
cd thetopenglish
python3 -m http.server 8080
```

Abra <http://localhost:8080>. Dois cliques no `index.html` também funcionam, mas o servidor local fica mais próximo do site publicado.

**Modo revisão:** abra <http://localhost:8080/?revisar> (e `privacidade.html?revisar`). Tudo que ainda precisa ser confirmado com a escola aparece tracejado, com a explicação do que falta.

## Antes de publicar

- [x] Número do WhatsApp da escola: (63) 98136-9088, em `js/config.js`, em “Onde estamos”, nos dados para o Google e no aviso de privacidade.
- [ ] Revisar com a Maureen todos os itens do modo revisão: cidade, endereço, horário, ano de início, grafia do nome, aula experimental, turmas infantis, aulas online, Instagram.
- [ ] Preencher no `privacidade.html` o CNPJ, o endereço e o e-mail para pedidos de privacidade.
- [ ] Logo original da escola, em alta resolução ou vetor (SVG/PDF). Ele entra no lugar dos espaços “Inserir logo” (cabeçalho e imagem de compartilhamento) e serve de base para o favicon. A equipe não tinha o arquivo, então não criou um logo.
- [ ] Autorização da Maureen para publicar o nome dela, os textos e as fotos. Fotos de crianças só com autorização dos responsáveis.
- [ ] Endereço no bloco `application/ld+json` do `index.html` (dados para o Google). O telefone já está lá.
- [ ] Planilha configurada e testada (seção abaixo) e verificação em duas etapas ativada na conta Google da escola.
- [ ] Depois do primeiro deploy: `og:image` com a URL completa (`https://…/assets/img/og-image.png`). Com domínio próprio: `sitemap.xml` e a linha `Sitemap:` do `robots.txt`.
- [ ] Liberar o Google: quando a Maureen aprovar o conteúdo, apagar a linha `<meta name="robots" content="noindex">` de `index.html` e `privacidade.html`. Até lá o protótipo não aparece nas buscas.

## Planilha de interessados

Opcional, mas é ela que gera os números dos indicadores do PI06. Use a conta Google **da escola**, não a de um integrante da equipe.

1. Crie uma Planilha Google (por exemplo, “Consultas do site”).
2. Menu **Extensões → Apps Script**. Apague o conteúdo e cole o `apps-script/Code.gs`. Salve.
3. **Implantar → Nova implantação →** tipo **App da Web**. *Executar como:* Eu. *Quem pode acessar:* Qualquer pessoa. Autorize quando o Google pedir.
4. Copie a URL que termina em `/exec` e cole em `planilhaUrl`, no `js/config.js`.
5. No editor do Apps Script, escolha a função `ativarLimpezaAutomatica` e clique em **Executar** uma vez. Ela apaga todo dia as consultas com mais de 6 meses, como promete o aviso de privacidade.
6. Teste: envie o formulário do site. A aba **Interessados** aparece com a consulta, e a coluna **Status** traz a lista Novo / Contatado / Aula experimental / Matriculado / Sem horário.

Quando mudar o `Code.gs`, use **Implantar → Gerenciar implantações → Editar → Nova versão**. Assim a URL continua a mesma.

O script só acrescenta linhas. Ele não devolve dados, ignora envios de robôs (campo-armadilha e limite de 20 envios por minuto) e impede que um texto vire fórmula na planilha.

## Publicar (Netlify)

O site não tem etapa de build. O Netlify publica os arquivos do repositório como estão e publica de novo a cada push na `main`.

1. Em [app.netlify.com](https://app.netlify.com), vá em **Add new site → Import an existing project → GitHub** e autorize o acesso ao `bsmsoma/thetopenglish`. O repositório pode continuar privado.
2. *Branch to deploy:* `main`. *Build command:* vazio. *Publish directory:* vazio (raiz do repositório).
3. Clique em **Deploy**. Depois, em **Site configuration → Change site name**, escolha o endereço, por exemplo `thetopenglish.netlify.app`.
4. Troque o `og:image` do `index.html` pela URL completa da imagem nesse endereço.

Também dá para publicar pela linha de comando: `npm install -g netlify-cli`, `netlify login` e, na pasta do projeto, `netlify deploy --prod --dir .`.

A página 404 e o modo revisão (`?revisar`) funcionam no Netlify sem nenhum ajuste.

Para o site definitivo da escola:

- **Domínio:** registre no Registro.br, no CPF ou CNPJ da escola (cerca de R$ 40 por ano), e ligue em **Domain management**, no Netlify.
- **Plano:** confiram os limites e os termos do plano gratuito do Netlify na hora de publicar.
- **Portabilidade:** como o site é só HTML, CSS e JS, ele muda de hospedagem sem alteração nenhuma.
- **Regra da disciplina:** não prometer à escola hospedagem gratuita permanente nem manutenção depois do semestre.

## Medir resultados (indicadores do PI06)

Use sempre estes links ao divulgar o site. Eles preenchem sozinhos o campo “Como conheceu” do formulário:

| Onde divulgar | Link |
|---|---|
| Bio do Instagram | `…/?origem=instagram` |
| QR code na fachada ou na placa | `…/?origem=fachada` |
| Perfil da Empresa no Google (campo site) | `…/?origem=google` |
| Post sobre um curso | `…/?servico=ielts#consultar` |

Valores de `servico`: `regular`, `infantil`, `passages`, `individual`, `reforco`, `ielts`, `toefl`, `nao-sei`.

Com isso, cada indicador tem uma fonte:

- **Contatos vindos do site:** linhas da planilha. As mensagens de WhatsApp também começam com “Vim pelo site”.
- **Origem:** coluna “Como conheceu”.
- **Compatibilidade de horário e matrículas:** coluna “Status”, preenchida pela escola. Uma tabela dinâmica por *Como conheceu* × *Status* responde a pergunta do PI03: quantos contatos viram matrícula.
- **Visitas (opcional):** um contador sem cookies, como o Umami Cloud. O site já dispara os eventos `whatsapp-clique` e `formulario-enviado`. Ao instalar, atualize a seção de cookies do aviso de privacidade.

## Privacidade (LGPD): resumo para a equipe

| Dado | Para quê | Onde fica | Por quanto tempo |
|---|---|---|---|
| Nome, WhatsApp | Responder à consulta | WhatsApp e planilha da escola | 6 meses (limpeza automática) |
| Para quem, idade da criança, curso, nível, dias, períodos | Verificar turma e horário compatíveis | Idem | Idem |
| Como conheceu (opcional) | Contagem interna de canais | Planilha | Idem |
| Versão do aviso aceita | Prova do consentimento (art. 8º) | Planilha | Idem |

- **Base legal:** consentimento (art. 7º, I). Para a idade da criança, o consentimento específico e em destaque do responsável (art. 14). A caixa de autorização não vem marcada e tem link para o aviso.
- **Minimização:** o formulário não pede o nome da criança, documentos nem endereço. O site não usa cookies, e as fontes ficam no próprio site.
- **Encarregado:** agentes de tratamento de pequeno porte, como o MEI, são dispensados de indicar encarregado (Resolução CD/ANPD nº 2/2022). Mesmo assim, precisam de um canal para o titular, que é o WhatsApp e o e-mail informados no aviso.
- **Pedidos de exclusão ou acesso:** apagar ou enviar a linha da planilha e a conversa do WhatsApp, respondendo em até 15 dias.
- **Incidente**, como a planilha compartilhada por engano:
  1. remover o compartilhamento na hora;
  2. avaliar o risco;
  3. se houver risco ou dano relevante, comunicar a ANPD e as pessoas afetadas (Resolução CD/ANPD nº 15/2024).
- **Ao mudar o aviso:** atualize a data no `privacidade.html` e o `versaoAviso` no `js/config.js`.

## Qualidade e testes feitos

- **Contraste:** todos os pares de cor usados passam no WCAG AA (valores em `css/tokens.css`).
- **Acessibilidade:**
  - foco visível;
  - navegação por teclado;
  - link "Pular para o conteúdo";
  - erros do formulário ligados aos campos (`aria-describedby`, `aria-invalid`);
  - animação desligada para quem prefere menos movimento.
- **Layout:** conferido em 375 px e 1440 px, sem rolagem horizontal.
- **Formulário (teste no navegador):**
  - erros e foco no primeiro campo inválido;
  - máscara de telefone;
  - campo de idade para crianças;
  - `?servico=` e `?origem=`;
  - mensagem montada para o WhatsApp;
  - envio para a planilha com `keepalive` e sem cookies;
  - tela de concluído e nova consulta.
- **Apps Script** (testado com os serviços do Google simulados):
  - gravação das 13 colunas;
  - campo-armadilha;
  - bloqueio de fórmulas;
  - limite por minuto;
  - limpeza após 6 meses;
  - gatilho único.

## Créditos

- Equipe TIzeiros (Ulbra): Bárbara Serhena, Brunno Mota, Lucas Cardoso, Matheus Pagel, Pedro Arthur e Vitor Silva Cabral.
- Fonte [Lexend](https://www.lexend.com), SIL Open Font License 1.1 (`assets/fonts/OFL.txt`).
