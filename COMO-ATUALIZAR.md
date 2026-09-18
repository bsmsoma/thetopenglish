# Como atualizar o site

Guia rápido para as mudanças do dia a dia. Não é preciso saber programar: basta editar texto com cuidado.

## Como editar um arquivo

Com o site no GitHub:

1. Abra o repositório e clique no arquivo, por exemplo `index.html`.
2. Clique no lápis (**Edit this file**).
3. Use **Ctrl+F** (ou **Cmd+F** no Mac) para achar o trecho.
4. Troque só o texto entre as marcações. Não apague os `<` `>` nem as aspas.
5. Clique em **Commit changes**. Em cerca de um minuto o site é atualizado.

Na dúvida, mude uma coisa por vez e confira o site depois.

## Trocar o número do WhatsApp

Arquivo `js/config.js`, linha `whatsapp`. Use só números, com 55 + DDD + número:

```js
whatsapp: '5563912345678',
```

## Novidades e promoções (barra verde do topo)

Arquivo `index.html`. Procure por `Barra de aviso` e troque a frase:

```html
<p class="container notice__inner">Matrículas abertas para 2027. <a href="#consultar">Veja se há vaga no seu horário</a></p>
```

Para **esconder** a barra, acrescente `hidden` na linha de cima dela: `<div class="notice" hidden>`. Para mostrar de novo, apague o `hidden`.

## Mudar a descrição de um curso

Arquivo `index.html`. Procure pelo nome do curso (por exemplo, `Preparatório IELTS`) e troque o texto do parágrafo logo abaixo.

## Colocar a foto da teacher

1. Salve a foto em formato `.webp` ou `.jpg`, com até 1200 px de largura, como `assets/img/maureen.webp`.
2. No `index.html`, procure por `Foto da teacher Maureen na escola` e troque o bloco `<figure class="about__photo" …> … </figure>` inteiro por:

```html
<figure class="about__photo about__photo--img">
  <img src="assets/img/maureen.webp" alt="Teacher Maureen na sala de aula da The Top English" width="900" height="1125" loading="lazy">
</figure>
```

## Mostrar depoimentos

Só publique depoimentos reais, com autorização por escrito de quem falou (e dos responsáveis, no caso de crianças).

No `index.html`, procure por `id="depoimentos"`, apague a palavra `hidden` dessa linha e troque os textos de exemplo pelos depoimentos e nomes.

## Endereço e horário de atendimento

No `index.html`, seção `Onde estamos`. Troque também o link do botão **Como chegar** pelo link do endereço no Google Maps. No Maps, busque a escola e use **Compartilhar → Copiar link**.

## Acompanhar as consultas na planilha

Cada consulta enviada pelo site vira uma linha na aba **Interessados**. Atualize a coluna **Status** conforme o atendimento avança: Contatado, Aula experimental, Matriculado ou Sem horário. É ela que mostra quantas consultas viraram matrícula.

As consultas com mais de 6 meses são apagadas sozinhas, como diz o aviso de privacidade.

## Conferir o que falta

Abra o site com `?revisar` no fim do endereço, por exemplo `https://…/thetopenglish/?revisar`. Tudo que ainda precisa ser confirmado aparece tracejado.
