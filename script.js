let musicas = JSON.parse(localStorage.getItem("musicas")) || [];
let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

function salvarDados() {
    localStorage.setItem("musicas", JSON.stringify(musicas));
    localStorage.setItem("playlists", JSON.stringify(playlists));
}

function atualizarPagina() {
    mostrarMusicas();
    mostrarFavoritas();
    mostrarPlaylists();
    atualizarEstatisticas();
    atualizarSeletores();
    mostrarInicio();
}

function adicionarMusica(nome, artista, album, genero) {
    if (nome.trim() === "" || artista.trim() === "") {
        alert("Preencha o nome da música e o artista!");
        return;
    }

    let musica = {
        id: Date.now(),
        nome: nome.trim(),
        artista: artista.trim(),
        album: album.trim(),
        genero: genero,
        favorita: false
    };

    musicas.push(musica);

    salvarDados();
    atualizarPagina();
}

function mostrarMusicas() {
    let lista = document.getElementById("lista-musicas");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    let pesquisa = document.getElementById("pesquisa");
    let filtro = document.getElementById("filtro-genero");

    let textoPesquisa = "";

    if (pesquisa) {
        textoPesquisa = pesquisa.value.toLowerCase().trim();
    }

    let generoSelecionado = "";

    if (filtro) {
        generoSelecionado = filtro.value.toLowerCase().trim();
    }

    let contador = 0;

    for (let i = 0; i < musicas.length; i++) {
        let musica = musicas[i];

        let nome = musica.nome.toLowerCase();
        let artista = musica.artista.toLowerCase();
        let genero = musica.genero.toLowerCase().trim();

        let correspondePesquisa =
            nome.includes(textoPesquisa) ||
            artista.includes(textoPesquisa);

        let correspondeGenero =
            generoSelecionado === "" ||
            generoSelecionado === "todos" ||
            genero === generoSelecionado;

        if (correspondePesquisa && correspondeGenero) {
            criarCartaoMusica(musica, lista, true);
            contador++;
        }
    }

    let contadorElemento = document.getElementById("contador-biblioteca");

    if (contadorElemento) {
        contadorElemento.textContent = contador + " músicas";
    }
}

function criarCartaoMusica(musica, lista, permitirAcoes) {
    let cartao = document.createElement("div");
    cartao.className = "cartao-musica";

    let titulo = document.createElement("h3");
    titulo.textContent = musica.nome;

    let artista = document.createElement("p");
    artista.textContent = "Artista: " + musica.artista;

    let album = document.createElement("p");
    album.textContent = "Álbum: " + musica.album;

    let genero = document.createElement("p");
    genero.textContent = "Gênero: " + musica.genero;

    cartao.appendChild(titulo);
    cartao.appendChild(artista);
    cartao.appendChild(album);
    cartao.appendChild(genero);

    if (permitirAcoes) {
        let botaoFavorito = document.createElement("button");
        botaoFavorito.className = "botao-favorito";

        if (musica.favorita) {
            botaoFavorito.textContent = "★ Favorita";
        } else {
            botaoFavorito.textContent = "☆ Favoritar";
        }

        botaoFavorito.onclick = function() {
            alternarFavorito(musica.id);
        };

        let botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "botao-excluir";

        botaoExcluir.onclick = function() {
            excluirMusica(musica.id);
        };

        cartao.appendChild(botaoFavorito);
        cartao.appendChild(botaoExcluir);
    }

    lista.appendChild(cartao);
}

function alternarFavorito(id) {
    for (let i = 0; i < musicas.length; i++) {
        if (musicas[i].id === id) {
            if (musicas[i].favorita === true) {
                musicas[i].favorita = false;
            } else {
                musicas[i].favorita = true;
            }

            break;
        }
    }

    salvarDados();
    atualizarPagina();
}

function mostrarFavoritas() {
    let lista = document.getElementById("lista-favoritas");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    for (let i = 0; i < musicas.length; i++) {
        if (musicas[i].favorita === true) {
            criarCartaoMusica(musicas[i], lista, true);
        }
    }
}

function excluirMusica(id) {
    let novaLista = [];

    for (let i = 0; i < musicas.length; i++) {
        if (musicas[i].id !== id) {
            novaLista.push(musicas[i]);
        }
    }

    musicas = novaLista;

    for (let i = 0; i < playlists.length; i++) {
        let novaListaPlaylist = [];

        for (let j = 0; j < playlists[i].musicas.length; j++) {
            if (playlists[i].musicas[j] !== id) {
                novaListaPlaylist.push(playlists[i].musicas[j]);
            }
        }

        playlists[i].musicas = novaListaPlaylist;
    }

    salvarDados();
    atualizarPagina();

    let conteudo = document.getElementById("conteudo-playlist");

    if (conteudo) {
        conteudo.innerHTML = "";
    }
}

function criarPlaylist(nome, descricao) {
    if (nome.trim() === "") {
        alert("Digite o nome da playlist!");
        return;
    }

    let playlist = {
        id: Date.now(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        musicas: []
    };

    playlists.push(playlist);

    salvarDados();
    atualizarPagina();
}

function mostrarPlaylists() {
    let lista = document.getElementById("lista-playlists");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    for (let i = 0; i < playlists.length; i++) {
        let playlist = playlists[i];

        let cartao = document.createElement("div");
        cartao.className = "cartao-playlist";

        let titulo = document.createElement("h3");
        titulo.textContent = playlist.nome;

        let descricao = document.createElement("p");
        descricao.textContent = playlist.descricao;

        let quantidade = document.createElement("p");
        quantidade.textContent = playlist.musicas.length + " músicas";

        let botaoAbrir = document.createElement("button");
        botaoAbrir.textContent = "Abrir playlist";
        botaoAbrir.className = "botao-abrir-playlist";

        botaoAbrir.onclick = function() {
            mostrarConteudoPlaylist(playlist.id);
        };

        let botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir playlist";
        botaoExcluir.className = "botao-excluir-playlist";

        botaoExcluir.onclick = function() {
            excluirPlaylist(playlist.id);
        };

        cartao.appendChild(titulo);
        cartao.appendChild(descricao);
        cartao.appendChild(quantidade);
        cartao.appendChild(botaoAbrir);
        cartao.appendChild(botaoExcluir);

        lista.appendChild(cartao);
    }
}

function atualizarSeletores() {
    let seletorPlaylist = document.getElementById("selecionar-playlist");
    let seletorMusica = document.getElementById("selecionar-musica");

    if (seletorPlaylist) {
        seletorPlaylist.innerHTML = "";

        let opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione uma playlist";

        seletorPlaylist.appendChild(opcaoInicial);

        for (let i = 0; i < playlists.length; i++) {
            let opcao = document.createElement("option");

            opcao.value = playlists[i].id;
            opcao.textContent = playlists[i].nome;

            seletorPlaylist.appendChild(opcao);
        }
    }

    if (seletorMusica) {
        seletorMusica.innerHTML = "";

        let opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione uma música";

        seletorMusica.appendChild(opcaoInicial);

        for (let i = 0; i < musicas.length; i++) {
            let opcao = document.createElement("option");

            opcao.value = musicas[i].id;
            opcao.textContent = musicas[i].nome + " - " + musicas[i].artista;

            seletorMusica.appendChild(opcao);
        }
    }
}

function adicionarNaPlaylist(idPlaylist, idMusica) {
    let playlistEncontrada = null;

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === idPlaylist) {
            playlistEncontrada = playlists[i];
            break;
        }
    }

    if (playlistEncontrada === null) {
        alert("Playlist não encontrada!");
        return;
    }

    let musicaEncontrada = false;

    for (let i = 0; i < musicas.length; i++) {
        if (musicas[i].id === idMusica) {
            musicaEncontrada = true;
            break;
        }
    }

    if (!musicaEncontrada) {
        alert("Música não encontrada!");
        return;
    }

    let jaExiste = false;

    for (let i = 0; i < playlistEncontrada.musicas.length; i++) {
        if (playlistEncontrada.musicas[i] === idMusica) {
            jaExiste = true;
            break;
        }
    }

    if (jaExiste) {
        alert("Essa música já está na playlist!");
        return;
    }

    playlistEncontrada.musicas.push(idMusica);

    salvarDados();
    atualizarPagina();
}

function mostrarConteudoPlaylist(id) {
    let conteudo = document.getElementById("conteudo-playlist");

    if (!conteudo) {
        return;
    }

    conteudo.innerHTML = "";

    let playlistEncontrada = null;

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === id) {
            playlistEncontrada = playlists[i];
            break;
        }
    }

    if (playlistEncontrada === null) {
        return;
    }

    let titulo = document.createElement("h2");
    titulo.textContent = playlistEncontrada.nome;

    conteudo.appendChild(titulo);

    for (let i = 0; i < playlistEncontrada.musicas.length; i++) {
        let idMusica = playlistEncontrada.musicas[i];

        for (let j = 0; j < musicas.length; j++) {
            if (musicas[j].id === idMusica) {
                let cartao = document.createElement("div");
                cartao.className = "cartao-musica-playlist";

                criarCartaoMusica(musicas[j], cartao, false);

                let botaoRemover = document.createElement("button");
                botaoRemover.textContent = "Remover da playlist";
                botaoRemover.className = "botao-remover-playlist";

                botaoRemover.onclick = function() {
                    removerDaPlaylist(playlistEncontrada.id, idMusica);
                };

                cartao.appendChild(botaoRemover);
                conteudo.appendChild(cartao);

                break;
            }
        }
    }
}

function removerDaPlaylist(idPlaylist, idMusica) {
    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === idPlaylist) {
            let novaLista = [];

            for (let j = 0; j < playlists[i].musicas.length; j++) {
                if (playlists[i].musicas[j] !== idMusica) {
                    novaLista.push(playlists[i].musicas[j]);
                }
            }

            playlists[i].musicas = novaLista;

            break;
        }
    }

    salvarDados();
    atualizarPagina();
    mostrarConteudoPlaylist(idPlaylist);
}

function excluirPlaylist(id) {
    let novaLista = [];

    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].id !== id) {
            novaLista.push(playlists[i]);
        }
    }

    playlists = novaLista;

    salvarDados();
    atualizarPagina();

    let conteudo = document.getElementById("conteudo-playlist");

    if (conteudo) {
        conteudo.innerHTML = "";
    }
}

function atualizarEstatisticas() {
    let totalMusicas = document.getElementById("total-musicas");
    let totalPlaylists = document.getElementById("total-playlists");
    let totalFavoritas = document.getElementById("total-favoritas");

    let favoritas = 0;

    for (let i = 0; i < musicas.length; i++) {
        if (musicas[i].favorita === true) {
            favoritas++;
        }
    }

    if (totalMusicas) {
        totalMusicas.textContent = musicas.length;
    }

    if (totalPlaylists) {
        totalPlaylists.textContent = playlists.length;
    }

    if (totalFavoritas) {
        totalFavoritas.textContent = favoritas;
    }
}

function mostrarInicio() {
    let lista = document.getElementById("musicas-inicio");

    if (lista) {
        lista.innerHTML = "";

        for (let i = 0; i < musicas.length; i++) {
            if (i < 4) {
                criarCartaoMusica(musicas[i], lista, false);
            }
        }
    }

    let listaPlaylists = document.getElementById("playlists-inicio");

    if (listaPlaylists) {
        listaPlaylists.innerHTML = "";

        for (let i = 0; i < playlists.length; i++) {
            if (i < 3) {
                let item = document.createElement("p");
                item.textContent = playlists[i].nome;

                listaPlaylists.appendChild(item);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let formularioMusica = document.getElementById("form-musica");

    if (formularioMusica) {
        formularioMusica.addEventListener("submit", function(evento) {
            evento.preventDefault();

            let nome = document.getElementById("nome-musica").value;
            let artista = document.getElementById("artista-musica").value;
            let album = document.getElementById("album-musica").value;
            let genero = document.getElementById("genero-musica").value;

            adicionarMusica(nome, artista, album, genero);

            formularioMusica.reset();
        });
    }

    let formularioPlaylist = document.getElementById("form-playlist");

    if (formularioPlaylist) {
        formularioPlaylist.addEventListener("submit", function(evento) {
            evento.preventDefault();

            let nome = document.getElementById("nome-playlist").value;
            let descricao = document.getElementById("descricao-playlist").value;

            criarPlaylist(nome, descricao);

            formularioPlaylist.reset();
        });
    }

    let formularioAdicionar = document.getElementById("form-adicionar-playlist");

    if (formularioAdicionar) {
        formularioAdicionar.addEventListener("submit", function(evento) {
            evento.preventDefault();

            let idPlaylist = Number(
                document.getElementById("selecionar-playlist").value
            );

            let idMusica = Number(
                document.getElementById("selecionar-musica").value
            );

            if (!idPlaylist || !idMusica) {
                alert("Selecione uma playlist e uma música!");
                return;
            }

            adicionarNaPlaylist(idPlaylist, idMusica);
        });
    }

    let campoPesquisa = document.getElementById("pesquisa");

    if (campoPesquisa) {
        campoPesquisa.addEventListener("input", function() {
            mostrarMusicas();
        });
    }

    let campoFiltro = document.getElementById("filtro-genero");

    if (campoFiltro) {
        campoFiltro.addEventListener("change", function() {
            mostrarMusicas();
        });
    }

    atualizarPagina();
});
