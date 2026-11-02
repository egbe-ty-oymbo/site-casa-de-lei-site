/* AGENDAMENTO DE JOGO DE BÚZIOS E PIX */

const formularioJogo = document.querySelector(".agenda-formulario");

if (formularioJogo) {
    const botaoPix = document.querySelector("#copiar-pix");
    const botaoComprovante = document.querySelector("#enviar-comprovante");
    const campoMensagem = document.querySelector("#mensagem-agenda");

    const chavePix = "11958483252";
    const numeroCasa = "5511986005002";

    

botaoPix.addEventListener("click", async function () {
    let copiou = false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(chavePix);
            copiou = true;
        }
    } catch (erro) {
        copiou = false;
    }

    if (!copiou) {
        const campoTemporario = document.createElement("textarea");
        campoTemporario.value = chavePix;
        campoTemporario.style.position = "fixed";
        campoTemporario.style.left = "-9999px";

        document.body.appendChild(campoTemporario);
        campoTemporario.select();

        try {
            copiou = document.execCommand("copy");
        } catch (erro) {
            copiou = false;
        }

        campoTemporario.remove();
    }

    if (copiou) {
        campoMensagem.textContent =
            "Chave Pix copiada! Abra o aplicativo do seu banco para pagar R$ 150,00.";
    } else {
        campoMensagem.textContent =
            "Não foi possível copiar automaticamente. Selecione e copie a chave Pix: " + chavePix;
    }
});



    botaoComprovante.addEventListener("click", function () {
        const data = document.querySelector("#data-jogo").value;
        const horario = document.querySelector("#horario-jogo").value;
        const nome = document.querySelector("#nome-jogo").value.trim();
        const whatsapp = document.querySelector("#whatsapp-jogo").value.trim();

        if (!data || !horario || !nome || !whatsapp) {
            alert("Preencha todos os campos antes de continuar.");
            return;
        }

        const dataEscolhida = new Date(data + "T12:00:00");
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (dataEscolhida < hoje) {
            alert("Escolha uma data de hoje em diante.");
            return;
        }

        const dataFormatada = data.split("-").reverse().join("/");

        const mensagem =
            "Olá! Quero solicitar um agendamento para Jogo de Búzios.\n\n" +
            "Nome: " + nome + "\n" +
            "Meu WhatsApp: " + whatsapp + "\n" +
            "Data desejada: " + dataFormatada + "\n" +
            "Horário desejado: " + horario + "\n" +
            "Atendimento presencial\n" +
            "Valor: R$ 150,00\n" +
            "Pix utilizado: " + chavePix + "\n\n" +
            "Realizei o pagamento e vou enviar o comprovante nesta conversa. Por favor, confirmem o recebimento e a disponibilidade do horário.";

        const link = "https://wa.me/" + numeroCasa +
            "?text=" + encodeURIComponent(mensagem);

        window.open(link, "_blank");
    });
}


/* ABRIR E FECHAR OS ÁLBUNS DA GALERIA */

document.querySelectorAll(".titulo-album").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const album = botao.nextElementSibling;
        const estaAberto = botao.getAttribute("aria-expanded") === "true";

        botao.setAttribute("aria-expanded", String(!estaAberto));
        album.hidden = estaAberto;

        const seta = botao.querySelector(".seta-album");
        if (seta) {
            seta.textContent = estaAberto ? "＋" : "－";
        }
    });
});

/* ABRIR E FECHAR O MENU PRINCIPAL */

const botaoMenu = document.querySelector("#botao-menu");
const menuPrincipal = document.querySelector("#menu-principal");
const iconeMenuPrincipal = document.querySelector("#icone-menu-principal");

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
        const estaFechado = menuPrincipal.classList.contains("menu-fechado");

        menuPrincipal.classList.toggle("menu-fechado");

        botaoMenu.setAttribute("aria-expanded", String(estaFechado));
        botaoMenu.setAttribute(
            "aria-label",
            estaFechado ? "Fechar menu" : "Abrir menu"
        );

        if (iconeMenuPrincipal) {
            iconeMenuPrincipal.textContent = estaFechado ? "✕" : "☰";
        }
    });

  
menuPrincipal.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        menuPrincipal.classList.add("menu-fechado");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");

        if (iconeMenuPrincipal) {
            iconeMenuPrincipal.textContent = "☰";
        }

        const destino = link.getAttribute("href");

        if (destino && destino.startsWith("#")) {
            const secao = document.querySelector(destino);

            if (secao) {
                const botaoRecolhivel =
                    secao.querySelector(".titulo-recolhivel");

                if (botaoRecolhivel) {
                    const idConteudo =
                        botaoRecolhivel.getAttribute("aria-controls");

                    const conteudo =
                        document.getElementById(idConteudo);

                    if (conteudo) {
                        botaoRecolhivel.setAttribute(
                            "aria-expanded",
                            "true"
                        );

                        conteudo.hidden = false;

                        const sinal =
                            botaoRecolhivel.querySelector(
                                ".sinal-recolher"
                            );

                        if (sinal) {
                            sinal.textContent = "−";
                        }
                    }
                }
            }
        }
    });
});

}

/* ABRIR E FECHAR A HISTÓRIA */

document.querySelectorAll(".titulo-recolhivel").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const idConteudo = botao.getAttribute("aria-controls");
        const conteudo = document.getElementById(idConteudo);
        const aberto = botao.getAttribute("aria-expanded") === "true";

        botao.setAttribute("aria-expanded", String(!aberto));
        conteudo.hidden = aberto;

        const sinal = botao.querySelector(".sinal-recolher");
        sinal.textContent = aberto ? "＋" : "−";
    });
});

/* ===== CONTROLE DE MATERIAIS E LOGIN ===== */

async function verificarAcessoMateriais() {
    const { data: { user }, error } =
        await supabaseClient.auth.getUser();

    if (error || !user) {
        return null;
    }

    const { data: perfil, error: erroPerfil } =
        await supabaseClient
            .from("perfis_casa")
            .select("nome_usuario, aprovado, administrador")
            .eq("id", user.id)
            .maybeSingle();

    if (erroPerfil || !perfil || !perfil.aprovado) {
        return null;
    }

    return { user, perfil };
}

/* LISTAR MATERIAIS */

async function listarMateriaisCasa() {
    const { data, error } = await supabaseClient
        .from("materiais_casa")
        .select("id, item, quantidade, observacao, categoria, status")
        .order("id", { ascending: true });

    if (error) {
        console.error("Erro ao listar materiais:", error.message);
        return null;
    }

    return data;
}

/* ELEMENTOS DO PAINEL */

const formularioLoginMembros =
    document.getElementById("form-login-membros");

const painelAdministrativo =
    document.getElementById("painel-administrativo");

const mensagemLogin =
    document.getElementById("mensagem-login");

const mensagemMateriais =
    document.getElementById("mensagem-materiais");

const listaMateriais =
    document.getElementById("lista-materiais");

/* MOSTRAR OU OCULTAR O PAINEL */

function mostrarPainelAdministrativo(mostrar) {
    if (painelAdministrativo) {
        painelAdministrativo.hidden = !mostrar;
    }
}

/* EXIBIR A LISTA DE MATERIAIS */


async function atualizarListaMateriais() {
    if (!listaMateriais || !mensagemMateriais) return;

    listaMateriais.replaceChildren();
    mensagemMateriais.textContent = "Carregando materiais...";

    const acesso = await verificarAcessoMateriais();

    if (!acesso) {
        mensagemMateriais.textContent =
            "Você precisa entrar com uma conta de membro aprovada.";
        mostrarPainelAdministrativo(false);
        return;
    }

    const materiais = await listarMateriaisCasa();

    if (materiais === null) {
        mensagemMateriais.textContent =
            "Não foi possível carregar os materiais.";
        return;
    }

    if (materiais.length === 0) {
        mensagemMateriais.textContent =
            "Nenhum material cadastrado ainda.";
        return;
    }

    mensagemMateriais.textContent =
        "Materiais encontrados: " + materiais.length;

    materiais.forEach(function (material) {
        const itemLista = document.createElement("article");

        const titulo = document.createElement("h4");
        titulo.textContent = material.item || "Material sem nome";

        const quantidade = document.createElement("p");
        quantidade.textContent =
            "Quantidade: " + (material.quantidade || "Não informada");

        const categoria = document.createElement("p");
        categoria.textContent =
            "Categoria: " + (material.categoria || "Não informada");

        const status = document.createElement("p");
        status.textContent =
            "Situação: " + (material.status || "Não informada");

        const observacao = document.createElement("p");
        observacao.textContent =
            "Observações: " + (material.observacao || "Nenhuma");

        itemLista.append(
            titulo,
            quantidade,
            categoria,
            status,
            observacao
        );

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", function () {
            materialEmEdicao = material.id;

            document.getElementById("material-item").value =
                material.item || "";
            document.getElementById("material-quantidade").value =
                material.quantidade || "";
            document.getElementById("material-categoria").value =
                material.categoria || "";
            document.getElementById("material-status").value =
                material.status || "Pendente";
            document.getElementById("material-observacao").value =
                material.observacao || "";

            botaoCadastrarMaterial.textContent = "Salvar alterações";

            mensagemMateriais.textContent =
                "Edite os campos acima e clique em Salvar alterações.";
        });

        itemLista.appendChild(botaoEditar);

        if (acesso.perfil.administrador) {
            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", async function () {
                const confirmar = window.confirm(
                    "Tem certeza de que deseja excluir este material?"
                );

                if (!confirmar) return;

                const acessoAtual = await verificarAcessoMateriais();

                if (!acessoAtual || !acessoAtual.perfil.administrador) {
                    mensagemMateriais.textContent =
                        "Você não tem autorização para excluir materiais.";
                    return;
                }

                const resultado = await supabaseClient
                    .from("materiais_casa")
                    .delete()
                    .eq("id", material.id)
                    .select("id");

                if (resultado.error || !resultado.data?.length) {
                    mensagemMateriais.textContent =
                        "Não foi possível excluir o material. Verifique as permissões.";
                    return;
                }

                mensagemMateriais.textContent =
                    "Material excluído com sucesso!";
                await atualizarListaMateriais();
            });

            itemLista.appendChild(botaoExcluir);
        }

        itemLista.style.borderBottom = "1px solid #ccc";
        itemLista.style.padding = "12px 0";

        listaMateriais.appendChild(itemLista);
    });
}
/* LOGIN DA ÁREA DE MEMBROS */

if (formularioLoginMembros) {
    formularioLoginMembros.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            const campoEmail =
                document.getElementById("email-membro");

            const campoSenha =
                document.getElementById("senha-membro");

            if (!campoEmail || !campoSenha || !mensagemLogin) {
                return;
            }

            mensagemLogin.textContent = "Verificando acesso...";
            mostrarPainelAdministrativo(false);

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: campoEmail.value.trim(),
                    password: campoSenha.value
                });

            if (error) {
                mensagemLogin.textContent =
                    "Não foi possível entrar. Confira o e-mail e a senha.";
                return;
            }

            const { data: perfil, error: erroPerfil } =
                await supabaseClient
                    .from("perfis_casa")
                    .select("nome_usuario, aprovado, administrador")
                    .eq("id", data.user.id)
                    .maybeSingle();

            if (erroPerfil || !perfil || !perfil.aprovado) {
                await supabaseClient.auth.signOut();

                mensagemLogin.textContent =
                    "Acesso pendente de aprovação pela administração.";
                return;
            }

          mensagemLogin.textContent =
    "Login realizado! Bem-vindo à Área de Membros da Casa de Lei.";

mostrarPainelAdministrativo(true);
await atualizarListaMateriais();
        }
    );
}

/* CADASTRAR MATERIAL */

let materialEmEdicao = null;

const botaoCadastrarMaterial =
    document.getElementById("cadastrar-material");

if (botaoCadastrarMaterial) {
    botaoCadastrarMaterial.addEventListener("click", async function () {
        const campoItem = document.getElementById("material-item");
        const campoQuantidade =
            document.getElementById("material-quantidade");
        const campoCategoria =
            document.getElementById("material-categoria");
        const campoStatus =
            document.getElementById("material-status");
        const campoObservacao =
            document.getElementById("material-observacao");

        if (
            !campoItem ||
            !campoQuantidade ||
            !campoCategoria ||
            !campoStatus ||
            !campoObservacao ||
            !mensagemMateriais
        ) {
            return;
        }

        const item = campoItem.value.trim();

        if (!item) {
            mensagemMateriais.textContent =
                "Informe o nome do material.";
            campoItem.focus();
            return;
        }

        mensagemMateriais.textContent = "Salvando material...";

        const resultadoAcesso = await verificarAcessoMateriais();

       if (!resultadoAcesso) {
    mensagemMateriais.textContent =
        "Você precisa entrar com uma conta de membro aprovada.";
    mostrarPainelAdministrativo(false);
    return;
}

        
        let resultadoGravacao;

        try {
            if (materialEmEdicao !== null) {
                resultadoGravacao = await supabaseClient
                    .from("materiais_casa")
                    .update({
                        item: item,
                        quantidade: campoQuantidade.value.trim(),
                        categoria: campoCategoria.value.trim(),
                        status: campoStatus.value.trim(),
                        observacao: campoObservacao.value.trim()
                    })
                    .eq("id", materialEmEdicao);
            } else {
                resultadoGravacao = await supabaseClient
                    .from("materiais_casa")
                    .insert({
                        item: item,
                        quantidade: campoQuantidade.value.trim(),
                        categoria: campoCategoria.value.trim(),
                        status: campoStatus.value.trim(),
                        observacao: campoObservacao.value.trim(),
                        autor_id: resultadoAcesso.user.id
                    });
            }
        } catch (erro) {
            console.error("Erro ao salvar material:", erro);
            mensagemMateriais.textContent =
                "Ocorreu um erro ao salvar. Tente novamente.";
            return;
        }

        if (resultadoGravacao.error) {
            console.error(
                "Erro ao salvar material:",
                resultadoGravacao.error.message
            );
            mensagemMateriais.textContent =
                "Não foi possível salvar: " +
                resultadoGravacao.error.message;
            return;
        }

        materialEmEdicao = null;

        campoItem.value = "";
        campoQuantidade.value = "";
        campoCategoria.value = "";
        campoStatus.value = "Pendente";
        campoObservacao.value = "";

        botaoCadastrarMaterial.textContent = "Cadastrar material";

        mensagemMateriais.textContent =
            "Material salvo com sucesso!";

        await atualizarListaMateriais();

    });
}

/* ATUALIZAR A LISTA */

const botaoAtualizarMateriais =
    document.getElementById("atualizar-materiais");

if (botaoAtualizarMateriais) {
    botaoAtualizarMateriais.addEventListener("click", async function () {
        await atualizarListaMateriais();
    });
}

/* SAIR DA CONTA */

const botaoSairAdministracao =
    document.getElementById("sair-administracao");

if (botaoSairAdministracao) {
    botaoSairAdministracao.addEventListener("click", async function () {
        if (mensagemLogin) {
            mensagemLogin.textContent = "Saindo da conta...";
        }

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            if (mensagemLogin) {
                mensagemLogin.textContent =
                    "Não foi possível sair. Tente novamente.";
            }
            return;
        }

        mostrarPainelAdministrativo(false);

        if (mensagemLogin) {
            mensagemLogin.textContent = "Você saiu da sua conta.";
        }

        if (formularioLoginMembros) {
            formularioLoginMembros.reset();
        }

        if (listaMateriais) {
            listaMateriais.replaceChildren();
        }

        if (mensagemMateriais) {
            mensagemMateriais.textContent = "";
        }
    });
}

/* REGISTRO DA ASSISTÊNCIA — PRIMEIRA VEZ E ASSISTÊNCIA FIXA */
(function () {
    const lista = document.getElementById("lista-registros-assistencia");
    const botaoAtualizar = document.getElementById("atualizar-registros-assistencia");
    const formPrimeiraVez = document.getElementById("form-registro-assistencia");
    const mensagemPrimeiraVez = document.getElementById("mensagem-registro-assistencia");
    const botaoAbrirPrimeiraVez = document.getElementById("abrir-registro-assistencia");
    const formularioPrimeiraVez = document.getElementById("formulario-registro-assistencia");

    const formFixa = document.getElementById("form-assistencia-fixa");
    const botaoAbrirFixa = document.getElementById("abrir-assistencia-fixa");
    const formularioFixa = document.getElementById("formulario-assistencia-fixa");
    const listaNomesFixa = document.getElementById("lista-nomes-assistencia-fixa");
    const botaoAdicionarFixa = document.getElementById("adicionar-pessoa-assistencia-fixa");
    const mensagemFixa = document.getElementById("mensagem-assistencia-fixa");

    if (!lista || !formPrimeiraVez || !mensagemPrimeiraVez || !formFixa ||
        !botaoAbrirFixa || !formularioFixa || !listaNomesFixa ||
        !botaoAdicionarFixa || !mensagemFixa) {
        console.error("Assistência: confira os elementos do formulário no index.html.");
        return;
    }

    let registroEmEdicao = null;

    async function obterAcesso() {
        const { data: { user }, error: erroUsuario } =
            await supabaseClient.auth.getUser();
        if (erroUsuario || !user) return null;

        const { data: perfil, error } = await supabaseClient
            .from("perfis_casa")
            .select("aprovado, administrador")
            .eq("id", user.id)
            .maybeSingle();

        if (error || !perfil || !perfil.aprovado) return null;
        return { user, administrador: perfil.administrador === true };
    }

    function dataExibicao(data) {
        return data ? data.split("-").reverse().join("/") : "Sem data registrada";
    }

    function criarBotao(texto, acao) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "admin-botao admin-botao-secundario";
        botao.textContent = texto;
        botao.addEventListener("click", acao);
        return botao;
    }

    function valorCampo(nome) {
        const campo = formPrimeiraVez.elements[nome];
        return campo ? campo.value.trim() : "";
    }

    function valoresMarcados(nome) {
        return Array.from(formPrimeiraVez.querySelectorAll(
            `input[name="${nome}"]:checked`
        )).map(campo => campo.value);
    }

    function marcarOpcoes(nome, valores) {
        const marcados = Array.isArray(valores) ? valores : [];
        formPrimeiraVez.querySelectorAll(`input[name="${nome}"]`).forEach(campo => {
            campo.checked = marcados.includes(campo.value);
        });
    }

    function limparEdicaoPrimeiraVez() {
        registroEmEdicao = null;
        formPrimeiraVez.reset();
        const salvar = formPrimeiraVez.querySelector('button[type="submit"]');
        if (salvar) salvar.textContent = "Salvar registro";
        const cancelar = document.getElementById("cancelar-edicao-assistencia");
        if (cancelar) cancelar.hidden = true;
    }

    function iniciarEdicaoPrimeiraVez(pessoa) {
        registroEmEdicao = pessoa.id;
        formPrimeiraVez.elements["data_assistencia"].value = pessoa.data_assistencia || "";
        formPrimeiraVez.elements["gira"].value = pessoa.gira || "";
        formPrimeiraVez.elements["responsavel"].value = pessoa.responsavel_recepcao || "";
        formPrimeiraVez.elements["nome"].value = pessoa.nome_completo || "";
        formPrimeiraVez.elements["email"].value = pessoa.email || "";
        formPrimeiraVez.elements["telefone"].value = pessoa.telefone || "";
        formPrimeiraVez.elements["endereco"].value = pessoa.endereco || "";
        formPrimeiraVez.elements["detalhe-origem"].value = pessoa.origem_detalhes || "";
        formPrimeiraVez.elements["frequenta-terreiro"].value = pessoa.frequenta_terreiro || "";
        formPrimeiraVez.elements["deseja-grupo"].value = pessoa.deseja_grupo_assistencia || "";
        formPrimeiraVez.elements["motivo-outro"].value = pessoa.motivo_outro || "";
        formPrimeiraVez.elements["observacoes"].value = pessoa.observacoes || "";
        marcarOpcoes("assistencia-origem", pessoa.origem);
        marcarOpcoes("assistencia-motivo", pessoa.motivos_visita);

        formularioPrimeiraVez.hidden = false;
        if (botaoAbrirPrimeiraVez) {
            botaoAbrirPrimeiraVez.textContent = "− Fechar cadastro de primeira vez";
            botaoAbrirPrimeiraVez.setAttribute("aria-expanded", "true");
        }
        const salvar = formPrimeiraVez.querySelector('button[type="submit"]');
        if (salvar) salvar.textContent = "Salvar alterações";
        const cancelar = document.getElementById("cancelar-edicao-assistencia");
        if (cancelar) cancelar.hidden = false;
        mensagemPrimeiraVez.textContent = `Editando cadastro de ${pessoa.nome_completo || "visitante"}.`;
        formPrimeiraVez.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function criarPastaRegistros(titulo, pessoas, tipo, acesso) {
        const pasta = document.createElement("details");
        const resumo = document.createElement("summary");
        resumo.textContent = `${tipo === "fixa" ? "📂" : "📁"} ${titulo} (${pessoas.length})`;
        pasta.appendChild(resumo);

        pessoas.forEach(pessoa => {
            if (tipo === "primeira") {
                const item = document.createElement("details");
                const nome = document.createElement("summary");
                nome.textContent = pessoa.nome_completo || "Visitante sem nome";
                const conteudo = document.createElement("div");
                conteudo.style.whiteSpace = "pre-wrap";
                const linhas = [
                    `Gira: ${pessoa.gira || "—"}`,
                    `Responsável pela recepção: ${pessoa.responsavel_recepcao || "—"}`,
                    `Telefone: ${pessoa.telefone || "—"}`,
                    `E-mail: ${pessoa.email || "—"}`,
                    `Endereço: ${pessoa.endereco || "—"}`,
                    `Como conheceu a casa: ${(pessoa.origem || []).join(", ") || "—"}`,
                    `Detalhes da origem: ${pessoa.origem_detalhes || "—"}`,
                    `Frequenta outro terreiro: ${pessoa.frequenta_terreiro || "—"}`,
                    `Deseja participar do grupo: ${pessoa.deseja_grupo_assistencia || "—"}`,
                    `Motivos da visita: ${(pessoa.motivos_visita || []).join(", ") || "—"}`,
                    `Outro motivo: ${pessoa.motivo_outro || "—"}`,
                    `Observações: ${pessoa.observacoes || "—"}`
                ];
                conteudo.textContent = linhas.join("\n");
                if (acesso.administrador) {
                    const acoes = document.createElement("div");
                    acoes.style.display = "flex";
                    acoes.style.gap = "8px";
                    acoes.style.flexWrap = "wrap";
                    acoes.style.marginTop = "10px";
                    acoes.append(
                        criarBotao("✏️ Editar", () => iniciarEdicaoPrimeiraVez(pessoa)),
                        criarBotao("🗑️ Excluir", async () => {
                            if (!confirm(`Excluir o cadastro de ${pessoa.nome_completo || "visitante"}?`)) return;
                            const { error } = await supabaseClient
                                .from("registros_assistencia")
                                .delete().eq("id", pessoa.id);
                            if (error) {
                                mensagemPrimeiraVez.textContent = "Não foi possível excluir. Verifique as permissões do Supabase.";
                                console.error(error);
                                return;
                            }
                            if (registroEmEdicao === pessoa.id) limparEdicaoPrimeiraVez();
                            mensagemPrimeiraVez.textContent = "Cadastro excluído.";
                            await carregarRegistrosAssistencia();
                        })
                    );
                    conteudo.appendChild(acoes);
                }
                item.append(nome, conteudo);
                pasta.appendChild(item);
            } else {
                const item = document.createElement("div");
                item.style.padding = "9px 0";
                item.style.borderBottom = "1px solid #ddd";
                const nome = document.createElement("strong");
                nome.textContent = pessoa.nome_completo || "Nome não informado";
                item.appendChild(nome);
                if (acesso.administrador) {
                    const acoes = document.createElement("div");
                    acoes.style.display = "flex";
                    acoes.style.gap = "8px";
                    acoes.style.flexWrap = "wrap";
                    acoes.style.marginTop = "8px";
                    acoes.append(
                        criarBotao("✏️ Editar", async () => {
                            const novoNome = prompt("Edite o nome completo:", pessoa.nome_completo || "");
                            if (novoNome === null) return;
                            if (!novoNome.trim()) { alert("Informe um nome válido."); return; }
                            const { error } = await supabaseClient
                                .from("registros_assistencia_fixa")
                                .update({ nome_completo: novoNome.trim() }).eq("id", pessoa.id);
                            if (error) {
                                mensagemFixa.textContent = "Não foi possível editar o nome.";
                                console.error(error);
                                return;
                            }
                            mensagemFixa.textContent = "Nome atualizado.";
                            await carregarRegistrosAssistencia();
                        }),
                        criarBotao("🗑️ Excluir", async () => {
                            if (!confirm(`Excluir a presença de ${pessoa.nome_completo || "esta pessoa"}?`)) return;
                            const { error } = await supabaseClient
                                .from("registros_assistencia_fixa")
                                .delete().eq("id", pessoa.id);
                            if (error) {
                                mensagemFixa.textContent = "Não foi possível excluir a presença.";
                                console.error(error);
                                return;
                            }
                            mensagemFixa.textContent = "Presença excluída.";
                            await carregarRegistrosAssistencia();
                        })
                    );
                    item.appendChild(acoes);
                }
                pasta.appendChild(item);
            }
        });
        return pasta;
    }

    async function carregarRegistrosAssistencia() {
        if (!lista) return;
        lista.textContent = "Carregando registros...";
        const acesso = await obterAcesso();
        if (!acesso) {
            lista.textContent = "Entre com uma conta aprovada para consultar os registros.";
            return;
        }

        const [primeira, fixa] = await Promise.all([
            supabaseClient
                .from("registros_assistencia")
                .select("*")
                .order("data_assistencia", { ascending: false }),

            supabaseClient
                .from("registros_assistencia_fixa")
                .select("id, data_assistencia, nome_completo, criado_por, criado_em")
                .order("data_assistencia", { ascending: false })
                .order("criado_em", { ascending: false })
        ]);

        if (primeira.error) console.error("Erro ao consultar primeira vez:", primeira.error);
        if (fixa.error) console.error("Erro ao consultar assistência fixa:", fixa.error);
        lista.replaceChildren();
        if (primeira.error && fixa.error) {
            lista.textContent = "Não foi possível carregar os registros. Confira as permissões e as tabelas no Supabase.";
            return;
        }

        const grupos = new Map();
        (primeira.data || []).forEach(pessoa => {
            const data = pessoa.data_assistencia || "sem-data";
            if (!grupos.has(data)) grupos.set(data, { primeira: [], fixa: [] });
            grupos.get(data).primeira.push(pessoa);
        });
        (fixa.data || []).forEach(pessoa => {
            const data = pessoa.data_assistencia || "sem-data";
            if (!grupos.has(data)) grupos.set(data, { primeira: [], fixa: [] });
            grupos.get(data).fixa.push(pessoa);
        });

        if (grupos.size === 0) {
            lista.textContent = "Nenhum registro encontrado.";
            return;
        }

        grupos.forEach((valor, data) => {
            const tituloPasta = dataExibicao(data);
            
            const containerData = document.createElement("details");
            const resumoData = document.createElement("summary");
            resumoData.textContent = `📅 ${tituloPasta} (${valor.primeira.length + valor.fixa.length} pessoas)`;
            containerData.appendChild(resumoData);

            if (valor.primeira.length > 0) {
                containerData.appendChild(criarPastaRegistros("Primeira vez", valor.primeira, "primeira", acesso));
            }
            if (valor.fixa.length > 0) {
                containerData.appendChild(criarPastaRegistros("Assistência fixa", valor.fixa, "fixa", acesso));
            }

            lista.appendChild(containerData);
        });
    }

    if (botaoAtualizar) {
        botaoAtualizar.addEventListener("click", carregarRegistrosAssistencia);
    }

    formPrimeiraVez.addEventListener("submit", async function (e) {
        e.preventDefault();
        const acesso = await obterAcesso();
        if (!acesso) {
            mensagemPrimeiraVez.textContent = "Você precisa estar logado para salvar.";
            return;
        }

        const dados = {
            data_assistencia: valorCampo("data_assistencia"),
            gira: valorCampo("gira"),
            responsavel_recepcao: valorCampo("responsavel"),
            nome_completo: valorCampo("nome"),
            email: valorCampo("email"),
            telefone: valorCampo("telefone"),
            endereco: valorCampo("endereco"),
            origem: valoresMarcados("assistencia-origem"),
            origem_detalhes: valorCampo("detalhe-origem"),
            frequenta_terreiro: valorCampo("frequenta-terreiro"),
            deseja_grupo_assistencia: valorCampo("deseja-grupo"),
            motivos_visita: valoresMarcados("assistencia-motivo"),
            motivo_outro: valorCampo("motivo-outro"),
            observacoes: valorCampo("observacoes")
        };

        if (!dados.data_assistencia || !dados.gira || !dados.responsavel_recepcao || !dados.nome_completo || !dados.frequenta_terreiro || !dados.deseja_grupo) {
            mensagemPrimeiraVez.textContent = "Preencha todos os campos obrigatórios (*).";
            return;
        }

        mensagemPrimeiraVez.textContent = "Salvando registro...";

        let resultado;
        if (registroEmEdicao) {
            resultado = await supabaseClient
                .from("registros_assistencia")
                .update(dados)
                .eq("id", registroEmEdicao);
        } else {
            resultado = await supabaseClient
                .from("registros_assistencia")
                .insert([dados]);
        }

        if (resultado.error) {
            mensagemPrimeiraVez.textContent = "Erro ao salvar: " + resultado.error.message;
            console.error(resultado.error);
            return;
        }

        mensagemPrimeiraVez.textContent = "Registro salvo com sucesso!";
        limparEdicaoPrimeiraVez();
        await carregarRegistrosAssistencia();
    });

    if (botaoAbrirPrimeiraVez && formularioPrimeiraVez) {
        botaoAbrirPrimeiraVez.addEventListener("click", function () {
            const oculto = formularioPrimeiraVez.hidden;
            formularioPrimeiraVez.hidden = !oculto;
            botaoAbrirPrimeiraVez.setAttribute("aria-expanded", String(oculto));
            botaoAbrirPrimeiraVez.textContent = oculto ? "− Fechar cadastro de primeira vez" : "＋ Registrar assistência de primeira vez";
        });
    }

    if (botaoAbrirFixa && formularioFixa) {
        botaoAbrirFixa.addEventListener("click", function () {
            const oculto = formularioFixa.hidden;
            formularioFixa.hidden = !oculto;
            botaoAbrirFixa.setAttribute("aria-expanded", String(oculto));
            botaoAbrirFixa.textContent = oculto ? "− Fechar assistência fixa" : "＋ Registrar assistência fixa";
        });
    }

    if (botaoAdicionarFixa && listaNomesFixa) {
        botaoAdicionarFixa.addEventListener("click", function () {
            const novoCampo = document.createElement("div");
            novoCampo.className = "campo-nome-assistencia-fixa";
            novoCampo.style.marginTop = "10px";
            novoCampo.innerHTML = `<input type="text" name="nomes-assistencia-fixa" placeholder="Nome completo" required>`;
            listaNomesFixa.appendChild(novoCampo);
        });
    }

    formFixa.addEventListener("submit", async function (e) {
        e.preventDefault();
        const acesso = await obterAcesso();
        if (!acesso) {
            mensagemFixa.textContent = "Você precisa estar logado para salvar.";
            return;
        }

        const dataGira = document.getElementById("assistencia-fixa-data").value;
        const inputsNomes = formFixa.querySelectorAll('input[name="nomes-assistencia-fixa"]');

        if (!dataGira) {
            mensagemFixa.textContent = "Informe a data da gira.";
            return;
        }

        const registros = [];
        inputsNomes.forEach(input => {
            const nomeVal = input.value.trim();
            if (nomeVal) {
                registros.push({
                    data_assistencia: dataGira,
                    nome_completo: nomeVal,
                    criado_por: acesso.user.id
                });
            }
        });

        if (registros.length === 0) {
            mensagemFixa.textContent = "Adicione pelo menos um nome.";
            return;
        }

        mensagemFixa.textContent = "Salvando presenças...";

        const { error } = await supabaseClient
            .from("registros_assistencia_fixa")
            .insert(registros);

        if (error) {
            mensagemFixa.textContent = "Erro ao salvar presenças: " + error.message;
            console.error(error);
            return;
        }

        mensagemFixa.textContent = "Presenças salvas com sucesso!";
        formFixa.reset();
        
        while (listaNomesFixa.children.length > 1) {
            listaNomesFixa.removeChild(listaNomesFixa.lastChild);
        }

        await carregarRegistrosAssistencia();
    });

    carregarRegistrosAssistencia();
})();
