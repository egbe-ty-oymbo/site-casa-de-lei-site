
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
            "Chave Pix copiada! Abra o aplicativo do seu banco para pagar R$ 100,00.";
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
            "Valor: R$ 100,00\n" +
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

/* ABRIR E FECHAR O REGISTRO DA ASSISTÊNCIA */
(function () {
    const botaoAbrir = document.getElementById("abrir-registro-assistencia");
    const formulario = document.getElementById("formulario-registro-assistencia");

    if (!botaoAbrir || !formulario) {
        console.error("Registro da Assistência: botão ou formulário não encontrado.");
        return;
    }

    botaoAbrir.addEventListener("click", function () {
        const vaiAbrir = formulario.hidden;

        formulario.hidden = !vaiAbrir;
        botaoAbrir.setAttribute("aria-expanded", String(vaiAbrir));
        botaoAbrir.textContent = vaiAbrir
            ? "− Fechar registro da assistência"
            : "＋ Abrir registro da assistência";
    });
})();


/* SALVAR, CONSULTAR, EDITAR E EXCLUIR REGISTROS DA ASSISTÊNCIA */
(function () {
    const form = document.getElementById("form-registro-assistencia");
    const mensagem = document.getElementById("mensagem-registro-assistencia");
    const lista = document.getElementById("lista-registros-assistencia");
    const botaoAtualizar = document.getElementById("atualizar-registros-assistencia");

    if (!form || !mensagem || !lista) {
        console.error("Formulário ou lista da assistência não encontrados.");
        return;
    }

    let registroEmEdicao = null;

    // Cria o botão de cancelar edição sem alterar o HTML existente.
    const botaoCancelar = document.createElement("button");
    botaoCancelar.type = "button";
    botaoCancelar.className = "admin-botao admin-botao-secundario";
    botaoCancelar.textContent = "Cancelar edição";
    botaoCancelar.hidden = true;
    form.appendChild(botaoCancelar);

    function valoresMarcados(nome) {
        return Array.from(
            form.querySelectorAll(`input[name="${nome}"]:checked`)
        ).map(campo => campo.value);
    }

    function marcarOpcoes(nome, valores) {
        const selecionados = valores || [];

        form.querySelectorAll(`input[name="${nome}"]`).forEach(campo => {
            campo.checked = selecionados.includes(campo.value);
        });
    }

    async function obterUsuarioEAcesso() {
        const { data: { user }, error: erroUsuario } =
            await supabaseClient.auth.getUser();

        if (erroUsuario || !user) {
            return { user: null, administrador: false };
        }

        const { data: perfil, error } = await supabaseClient
            .from("perfis_casa")
            .select("aprovado, administrador")
            .eq("id", user.id)
            .maybeSingle();

        if (error || !perfil || !perfil.aprovado) {
            return { user, administrador: false };
        }

        return {
            user,
            administrador: perfil.administrador === true
        };
    }

    function limparEdicao() {
        registroEmEdicao = null;
        form.reset();
        botaoCancelar.hidden = true;

        const botaoSalvar = form.querySelector('button[type="submit"]');
        if (botaoSalvar) {
            botaoSalvar.textContent = "Salvar registro";
        }
    }

    botaoCancelar.addEventListener("click", function () {
        limparEdicao();
        mensagem.textContent = "Edição cancelada.";
    });

    function iniciarEdicao(pessoa) {
        registroEmEdicao = pessoa.id;

        document.getElementById("assistencia-data").value =
            pessoa.data_assistencia || "";

        form.elements["gira"].value = pessoa.gira || "";
        form.elements["responsavel"].value = pessoa.responsavel_recepcao || "";
        form.elements["nome"].value = pessoa.nome_completo || "";
        form.elements["email"].value = pessoa.email || "";
        form.elements["telefone"].value = pessoa.telefone || "";
        form.elements["endereco"].value = pessoa.endereco || "";
        form.elements["detalhe-origem"].value = pessoa.detalhe_origem || "";
        form.elements["frequenta-terreiro"].value =
            pessoa.frequenta_outro_terreiro || "";

        form.elements["deseja-grupo"].value =
            pessoa.deseja_grupo_assistencia ? "Sim" : "Não";

        form.elements["observacoes"].value = pessoa.observacoes || "";

        marcarOpcoes("assistencia-origem", pessoa.como_conheceu);
        marcarOpcoes("assistencia-motivo", pessoa.motivos_visita);

        const botaoSalvar = form.querySelector('button[type="submit"]');
        if (botaoSalvar) {
            botaoSalvar.textContent = "Salvar alterações";
        }

        botaoCancelar.hidden = false;
        mensagem.textContent =
            "Editando cadastro de " + (pessoa.nome_completo || "assistido") + ".";

        form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function carregarRegistros() {
        lista.textContent = "Carregando registros...";

        const { data: registros, error } = await supabaseClient
            .from("registros_assistencia")
            .select("*")
            .order("data_assistencia", { ascending: false })
            .order("criado_em", { ascending: false });

        if (error) {
            console.error("Erro ao carregar assistências:", error);
            lista.textContent =
                "Não foi possível carregar os registros. Verifique sua autorização.";
            return;
        }

        const acesso = await obterUsuarioEAcesso();
        lista.replaceChildren();

        if (!registros || registros.length === 0) {
            lista.textContent = "Ainda não há registros cadastrados.";
            return;
        }

        const grupos = {};

        registros.forEach(pessoa => {
            const data = pessoa.data_assistencia;
            if (!grupos[data]) grupos[data] = [];
            grupos[data].push(pessoa);
        });

        Object.entries(grupos).forEach(([data, pessoas]) => {
            const pasta = document.createElement("details");
            const titulo = document.createElement("summary");
            const dataFormatada = data.split("-").reverse().join("/");

            titulo.textContent =
                `📁 Assistência de ${dataFormatada} (${pessoas.length})`;

            pasta.appendChild(titulo);

            pessoas.forEach(pessoa => {
                const item = document.createElement("details");
                const nome = document.createElement("summary");
                const conteudo = document.createElement("div");

                nome.textContent = pessoa.nome_completo || "Sem nome";
                conteudo.style.whiteSpace = "pre-wrap";

                const linhas = [
                    `Gira: ${pessoa.gira || "Não informado"}`,
                    `Responsável pela recepção: ${pessoa.responsavel_recepcao || "Não informado"}`,
                    `Telefone: ${pessoa.telefone || "Não informado"}`,
                    `E-mail: ${pessoa.email || "Não informado"}`,
                    `Endereço: ${pessoa.endereco || "Não informado"}`,
                    `Origem: ${(pessoa.como_conheceu || []).join(", ") || "Não informado"}`,
                    `Detalhe da origem: ${pessoa.detalhe_origem || "Não informado"}`,
                    `Frequenta outro terreiro: ${pessoa.frequenta_outro_terreiro || "Não informado"}`,
                    `Deseja participar do grupo: ${pessoa.deseja_grupo_assistencia ? "Sim" : "Não"}`,
                    `Motivos: ${(pessoa.motivos_visita || []).join(", ") || "Não informado"}`,
                    `Observações: ${pessoa.observacoes || "Nenhuma"}`
                ];

                conteudo.textContent = linhas.join("\n");
                item.appendChild(nome);
                item.appendChild(conteudo);

                if (acesso.administrador) {
                    const botoes = document.createElement("div");
                    botoes.style.display = "flex";
                    botoes.style.gap = "8px";
                    botoes.style.flexWrap = "wrap";
                    botoes.style.marginTop = "12px";

                    const editar = document.createElement("button");
                    editar.type = "button";
                    editar.className = "admin-botao admin-botao-secundario";
                    editar.textContent = "✏️ Editar";
                    editar.addEventListener("click", function () {
                        iniciarEdicao(pessoa);
                    });

                    const excluir = document.createElement("button");
                    excluir.type = "button";
                    excluir.className = "admin-botao admin-botao-secundario";
                    excluir.textContent = "🗑️ Excluir";

                    excluir.addEventListener("click", async function () {
                        const confirmar = window.confirm(
                            `Deseja realmente excluir o cadastro de "${pessoa.nome_completo}" da assistência de ${dataFormatada}? Esta ação não pode ser desfeita.`
                        );

                        if (!confirmar) return;

                        excluir.disabled = true;
                        mensagem.textContent = "Excluindo registro...";

                        const { error } = await supabaseClient
                            .from("registros_assistencia")
                            .delete()
                            .eq("id", pessoa.id);

                        if (error) {
                            console.error("Erro ao excluir assistência:", error);
                            mensagem.textContent =
                                "Não foi possível excluir. Verifique as permissões.";
                            excluir.disabled = false;
                            return;
                        }

                        if (registroEmEdicao === pessoa.id) {
                            limparEdicao();
                        }

                        mensagem.textContent = "Registro excluído com sucesso!";
                        await carregarRegistros();
                    });

                    botoes.appendChild(editar);
                    botoes.appendChild(excluir);
                    conteudo.appendChild(botoes);
                }

                pasta.appendChild(item);
            });

            lista.appendChild(pasta);
        });
    }

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensagem.textContent = registroEmEdicao
            ? "Salvando alterações..."
            : "Salvando registro...";

        const acesso = await obterUsuarioEAcesso();
        const user = acesso.user;

        if (!user) {
            mensagem.textContent =
                "Entre na Área de Membros antes de salvar.";
            return;
        }

        if (registroEmEdicao && !acesso.administrador) {
            mensagem.textContent =
                "Somente administradores aprovados podem editar cadastros.";
            return;
        }

        if (!registroEmEdicao) {
            const { data: perfil, error: erroPerfil } = await supabaseClient
                .from("perfis_casa")
                .select("aprovado")
                .eq("id", user.id)
                .maybeSingle();

            if (erroPerfil || !perfil || !perfil.aprovado) {
                mensagem.textContent =
                    "Sua conta não tem autorização para salvar registros.";
                return;
            }
        }

        const dataAssistencia =
            document.getElementById("assistencia-data").value;

        if (!dataAssistencia) {
            mensagem.textContent = "Selecione a data da assistência.";
            return;
        }

        const registro = {
            data_assistencia: dataAssistencia,
            nome_completo: form.elements["nome"].value.trim(),
            telefone: form.elements["telefone"].value.trim(),
            email: form.elements["email"].value.trim(),
            endereco: form.elements["endereco"].value.trim(),
            responsavel_recepcao: form.elements["responsavel"].value.trim(),
            gira: form.elements["gira"].value.trim(),
            como_conheceu: valoresMarcados("assistencia-origem"),
            detalhe_origem: form.elements["detalhe-origem"].value.trim(),
            frequenta_outro_terreiro: form.elements["frequenta-terreiro"].value,
            deseja_grupo_assistencia:
                form.elements["deseja-grupo"].value === "Sim",
            motivos_visita: valoresMarcados("assistencia-motivo"),
            observacoes: form.elements["observacoes"].value.trim()
        };

        let error;

        if (registroEmEdicao) {
            const resultado = await supabaseClient
                .from("registros_assistencia")
                .update(registro)
                .eq("id", registroEmEdicao);

            error = resultado.error;
        } else {
            registro.criado_por = user.id;

            const resultado = await supabaseClient
                .from("registros_assistencia")
                .insert(registro);

            error = resultado.error;
        }

        if (error) {
            console.error("Erro ao salvar assistência:", error);
            mensagem.textContent =
                "Não foi possível salvar. Verifique as permissões do Supabase.";
            return;
        }

        const estavaEditando = registroEmEdicao !== null;
        limparEdicao();

        mensagem.textContent = estavaEditando
            ? "Alterações salvas com sucesso!"
            : "Registro salvo com sucesso!";

        await carregarRegistros();
    });

    if (botaoAtualizar) {
        botaoAtualizar.addEventListener("click", carregarRegistros);
    }

    window.carregarRegistrosAssistencia = carregarRegistros;
})();


/* RESTAURAR A SESSÃO AO ATUALIZAR A PÁGINA */

async function restaurarSessaoAdministrativa() {
    mostrarPainelAdministrativo(false);

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error || !data.session) {
        return;
    }

    const acesso = await verificarAcessoMateriais();

    if (!acesso) {
        await supabaseClient.auth.signOut();

        if (mensagemLogin) {
            mensagemLogin.textContent =
                "Sua sessão não tem autorização para acessar o painel.";
        }

        return;
    }

    mostrarPainelAdministrativo(true);

    if (mensagemLogin) {
        mensagemLogin.textContent =
            "Você continua conectado à Área de Membros da Casa de Lei.";
    }

    await atualizarListaMateriais();
}

restaurarSessaoAdministrativa();
