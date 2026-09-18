/*
  The Top English: comportamento do site.
  1. Menu do celular
  2. Botões de WhatsApp com a mensagem "Vim pelo site"
  3. Formulário "Consultar vaga": valida, monta a mensagem, abre o WhatsApp
     e, se a planilha estiver configurada, registra o interessado
  4. ?servico= e ?origem= no endereço pré-preenchem o formulário
     (ex.: link da bio do Instagram com ?origem=instagram, QR code da fachada com ?origem=fachada)
  5. ?revisar no endereço destaca o conteúdo que ainda precisa ser confirmado
*/
(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var params = new URLSearchParams(window.location.search);

  var ORIGENS = {
    google: 'Google',
    instagram: 'Instagram',
    indicacao: 'Indicação',
    fachada: 'Fachada',
    qrcode: 'Fachada',
    outro: 'Outro'
  };

  function digitos(texto) {
    return String(texto || '').replace(/\D/g, '');
  }

  function linkWhatsApp(mensagem) {
    var numero = digitos(config.whatsapp);
    return numero ? 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem) : '';
  }

  // Contagem de cliques e envios, se um analytics sem cookies (Umami) for instalado.
  function registrarEvento(nome) {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(nome);
    }
  }

  document.querySelectorAll('[data-ano]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- 1. Menu do celular ---------- */

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');

  if (header && toggle) {
    var rotulo = toggle.querySelector('.sr-only');

    var definirMenu = function (aberto) {
      header.classList.toggle('is-open', aberto);
      toggle.setAttribute('aria-expanded', String(aberto));
      rotulo.textContent = aberto ? 'Fechar menu' : 'Abrir menu';
    };

    definirMenu(false);

    toggle.addEventListener('click', function () {
      var abrir = toggle.getAttribute('aria-expanded') !== 'true';
      definirMenu(abrir);
      // Os links vêm antes do botão no HTML; levar o foco até eles evita voltar com Shift+Tab.
      if (abrir) header.querySelector('.site-nav a').focus();
    });

    header.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        definirMenu(false);
      });
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && header.classList.contains('is-open')) {
        definirMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Botões de WhatsApp ---------- */

  var linkPadrao = linkWhatsApp(config.mensagemPadrao || 'Olá! Vim pelo site.');

  document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
    // Sem número configurado, o botão continua levando ao formulário.
    if (linkPadrao) {
      link.href = linkPadrao;
      link.target = '_blank';
      link.rel = 'noopener';
    }
    link.addEventListener('click', function () {
      registrarEvento('whatsapp-clique');
    });
  });

  // O botão flutuante fica escondido no hero (que já tem botão de WhatsApp)
  // e no formulário (para não cobrir o botão de envio).
  var flutuante = document.querySelector('.float-whatsapp');

  if (flutuante) {
    if ('IntersectionObserver' in window) {
      var secoesVisiveis = [];
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          var posicao = secoesVisiveis.indexOf(entrada.target);
          if (entrada.isIntersecting && posicao === -1) secoesVisiveis.push(entrada.target);
          if (!entrada.isIntersecting && posicao !== -1) secoesVisiveis.splice(posicao, 1);
        });
        flutuante.classList.toggle('is-hidden', secoesVisiveis.length > 0);
      }, { threshold: 0.1 });
      ['topo', 'consultar'].forEach(function (id) {
        var secao = document.getElementById(id);
        if (secao) observador.observe(secao);
      });
    } else {
      flutuante.classList.remove('is-hidden');
    }
  }

  /* ---------- 3. Formulário "Consultar vaga" ---------- */

  var form = document.getElementById('form-vaga');
  var concluido = document.getElementById('form-done');

  if (form && concluido) {
    var campos = form.elements;
    var campoIdade = form.querySelector('[data-idade]');
    var tentouEnviar = false;

    var marcados = function (nome) {
      return Array.prototype.map.call(
        form.querySelectorAll('input[name="' + nome + '"]:checked'),
        function (input) { return input.value; }
      );
    };

    var paraFilho = function () {
      return marcados('para')[0] === 'filho';
    };

    var formatarTelefone = function (valor) {
      var d = digitos(valor);
      if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);
      d = d.slice(0, 11);
      if (d.length > 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      if (d.length > 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      return d ? '(' + d : '';
    };

    var grupo = function (nome) {
      return form.querySelector('[data-grupo="' + nome + '"]');
    };

    var regras = [
      {
        alvo: campos.nome,
        erro: 'f-nome-erro',
        valido: function () { return campos.nome.value.trim().length >= 2; },
        mensagem: 'Informe seu nome.'
      },
      {
        alvo: campos.whatsapp,
        erro: 'f-whatsapp-erro',
        valido: function () {
          var total = digitos(campos.whatsapp.value).length;
          return total === 10 || total === 11;
        },
        mensagem: 'Informe o WhatsApp com DDD, por exemplo (63) 91234-5678.'
      },
      {
        alvo: campos.idade,
        erro: 'f-idade-erro',
        ativa: paraFilho,
        valido: function () {
          var idade = Number(campos.idade.value);
          return campos.idade.value !== '' && idade >= 2 && idade <= 17;
        },
        mensagem: 'Informe a idade da criança, de 2 a 17 anos.'
      },
      {
        alvo: campos.servico,
        erro: 'f-servico-erro',
        valido: function () { return campos.servico.value !== ''; },
        mensagem: 'Escolha um curso ou a opção “Ainda não sei”.'
      },
      {
        grupo: 'dias',
        erro: 'f-dias-erro',
        valido: function () { return marcados('dias').length > 0; },
        mensagem: 'Escolha pelo menos um dia.'
      },
      {
        grupo: 'periodos',
        erro: 'f-periodos-erro',
        valido: function () { return marcados('periodos').length > 0; },
        mensagem: 'Escolha pelo menos um período.'
      },
      {
        alvo: campos.consentimento,
        erro: 'f-consentimento-erro',
        valido: function () { return campos.consentimento.checked; },
        mensagem: 'Para enviar, autorize o uso dos dados nesta consulta.'
      }
    ];

    var regraDo = function (idErro) {
      return regras.filter(function (regra) { return regra.erro === idErro; })[0];
    };

    var mostrarErro = function (regra, invalida) {
      var aviso = document.getElementById(regra.erro);
      aviso.textContent = invalida ? regra.mensagem : '';
      aviso.hidden = !invalida;
      if (regra.grupo) {
        grupo(regra.grupo).classList.toggle('has-error', invalida);
      } else if (invalida) {
        regra.alvo.setAttribute('aria-invalid', 'true');
      } else {
        regra.alvo.removeAttribute('aria-invalid');
      }
    };

    var validar = function () {
      var primeiraInvalida = null;
      regras.forEach(function (regra) {
        var invalida = (!regra.ativa || regra.ativa()) && !regra.valido();
        mostrarErro(regra, invalida);
        if (invalida && !primeiraInvalida) primeiraInvalida = regra;
      });
      return primeiraInvalida;
    };

    var atualizarIdade = function () {
      var filho = paraFilho();
      campoIdade.hidden = !filho;
      campos.idade.required = filho;
      if (!filho) {
        campos.idade.value = '';
        mostrarErro(regraDo('f-idade-erro'), false);
      }
    };

    var escolherServico = function (valor) {
      var existe = Array.prototype.some.call(campos.servico.options, function (opcao) {
        return opcao.value === valor && !opcao.disabled;
      });
      if (existe) {
        campos.servico.value = valor;
        mostrarErro(regraDo('f-servico-erro'), false);
      }
    };

    var coletar = function () {
      var opcao = campos.servico.options[campos.servico.selectedIndex];
      return {
        nome: campos.nome.value.trim(),
        whatsapp: formatarTelefone(campos.whatsapp.value),
        para: paraFilho() ? 'Filho ou filha' : 'Para mim',
        idade: paraFilho() ? campos.idade.value.trim() : '',
        servico: opcao ? opcao.text : '',
        nivel: campos.nivel.value,
        dias: marcados('dias').join(', '),
        periodos: marcados('periodos').join(', '),
        origem: campos.origem.value,
        website: campos.website.value
      };
    };

    // WhatsApp aceita *negrito* entre asteriscos.
    var montarMensagem = function (dados) {
      var linhas = [
        'Olá, Teacher Maureen! Vim pelo site e quero consultar uma vaga.',
        '',
        '*Nome:* ' + dados.nome,
        '*Aulas para:* ' + (dados.idade ? 'meu filho ou filha, ' + dados.idade + ' anos' : 'mim'),
        '*Curso:* ' + dados.servico,
        '*Nível hoje:* ' + dados.nivel,
        '*Dias possíveis:* ' + dados.dias,
        '*Períodos:* ' + dados.periodos
      ];
      if (dados.origem) linhas.push('*Conheci a escola por:* ' + dados.origem);
      return linhas.join('\n');
    };

    // keepalive deixa o envio terminar mesmo se a pessoa sair do site para o WhatsApp.
    var registrarNaPlanilha = function (dados) {
      var url = String(config.planilhaUrl || '').trim();
      if (!url || !window.fetch) return;
      var corpo = new URLSearchParams();
      Object.keys(dados).forEach(function (chave) {
        corpo.append(chave, dados[chave]);
      });
      fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, credentials: 'omit', body: corpo })
        .catch(function () {
          // Sem conexão com a planilha: a mensagem do WhatsApp já foi aberta, então a consulta não se perde.
        });
    };

    var mostrarConcluido = function (link) {
      var reserva = concluido.querySelector('[data-done-link]');
      var avisoConfig = concluido.querySelector('[data-done-warning]');
      reserva.href = link || '#consultar';
      reserva.parentElement.hidden = !link;
      avisoConfig.hidden = Boolean(link);
      form.hidden = true;
      concluido.hidden = false;
      concluido.focus();
    };

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      tentouEnviar = true;

      var invalida = validar();
      if (invalida) {
        var foco = invalida.grupo ? grupo(invalida.grupo).querySelector('input') : invalida.alvo;
        foco.focus();
        return;
      }

      var dados = coletar();

      // Campo-armadilha preenchido: é robô. Mostra a tela final sem enviar nada.
      if (dados.website) {
        mostrarConcluido('');
        return;
      }

      var link = linkWhatsApp(montarMensagem(dados));
      // Abrir aqui, direto no clique, evita que o navegador bloqueie a nova aba.
      if (link) window.open(link, '_blank', 'noopener');
      delete dados.website;
      dados.aviso = config.versaoAviso || '';
      registrarNaPlanilha(dados);
      registrarEvento('formulario-enviado');
      mostrarConcluido(link);
    });

    // Depois da primeira tentativa, os avisos somem assim que o campo é corrigido.
    form.addEventListener('input', function () {
      if (tentouEnviar) validar();
    });

    form.addEventListener('change', function (evento) {
      if (evento.target.name === 'para') atualizarIdade();
      if (tentouEnviar) validar();
    });

    campos.whatsapp.addEventListener('input', function (evento) {
      if (evento.inputType && evento.inputType.indexOf('delete') === 0) return;
      campos.whatsapp.value = formatarTelefone(campos.whatsapp.value);
    });

    campos.whatsapp.addEventListener('blur', function () {
      campos.whatsapp.value = formatarTelefone(campos.whatsapp.value);
    });

    /* ---------- 4. ?servico= e ?origem= ---------- */

    var aplicarParametros = function () {
      if (params.has('servico')) escolherServico(params.get('servico'));
      var origem = ORIGENS[String(params.get('origem') || '').toLowerCase()];
      if (origem) campos.origem.value = origem;
    };

    concluido.querySelector('[data-form-reset]').addEventListener('click', function () {
      form.reset();
      tentouEnviar = false;
      regras.forEach(function (regra) { mostrarErro(regra, false); });
      aplicarParametros();
      atualizarIdade();
      concluido.hidden = true;
      form.hidden = false;
      campos.nome.focus();
    });

    // Os botões "Consultar vaga" dos cards escolhem o curso no formulário.
    document.querySelectorAll('[data-servico]').forEach(function (botao) {
      botao.addEventListener('click', function () {
        escolherServico(botao.getAttribute('data-servico'));
      });
    });

    aplicarParametros();
    atualizarIdade();
  }

  /* ---------- 5. Modo revisão ---------- */

  if (params.has('revisar')) {
    document.documentElement.classList.add('review-mode');
    var total = document.querySelectorAll('[data-confirmar]').length;
    var barra = document.createElement('p');
    barra.className = 'review-bar';
    barra.textContent = 'Modo revisão: ' + total + ' itens tracejados precisam ser confirmados com a escola antes de publicar.';
    document.body.insertBefore(barra, document.body.firstChild);
  }
})();
