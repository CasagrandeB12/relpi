const lupaDePesquisa = document.querySelector(".pesquisar__btn");
const barraDePesquisa = document.querySelector(".pesquisar__input");
const cards = document.querySelectorAll(".card_servicos_itens");

lupaDePesquisa.addEventListener("click", filtrarPesquisa);
barraDePesquisa.addEventListener("keypress", function(event) {
    if (event.key === "Enter") 
    {
        event.preventDefault();
        filtrarPesquisa();
    }
});

function filtrarPesquisa() {
    const valorFiltro = barraDePesquisa.value.toLowerCase();

    if (barraDePesquisa.value != "") {
        cards.forEach(card => {
            const nome = normalizeString(card.getAttribute("name").toLowerCase());

            if (!nome.includes(valorFiltro)) {
                card.style.display = "none";
            } else {
                card.style.display = "block";
            }
        });
    } else {
        cards.forEach(card => {
            card.style.display = "block";
        });
    }
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const botaoCategoria = document.querySelectorAll(".superior__item");

botaoCategoria.forEach((botao) => {
    let nomeCategoria = botao.getAttribute("name");
    botao.addEventListener("click", () => filtrarCategorias(nomeCategoria));
})

function filtrarCategorias(filtro) {
    let algumVideoExibido = false;

    cards.forEach(card => {
        let categoria = card.getAttribute("name").toLowerCase(); // Converta para minúsculas para garantir a correspondência correta

        if (filtro === 'tudo' || categoria.includes(filtro.toLowerCase())) {
            card.style.display = "block";
            algumVideoExibido = true;
        } else {
            card.style.display = "none";
        }
    });

    if (!algumVideoExibido) {
        alert("Nenhum vídeo encontrado para o filtro especificado.");
    }
}

async function fetchPessoas() {
    try {
        const response = await fetch('http://localhost:8080/pessoas/todos');
        const pessoas = await response.json();
        return pessoas;
    } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
    }
}

async function fetchProfissionais() {
    try {
        const response = await fetch('http://localhost:8080/profissional/todos');
        const profissionais = await response.json();
        return profissionais;
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
    }
}

async function updateProfissionaisSection() {
    const profissionais = await fetchProfissionais();

    const section = document.querySelector('.servicos_itens');
    section.innerHTML = ''; // Limpa a seção antes de adicionar os profissionais

    profissionais.forEach(profissional => {
        const div = document.createElement('div');
        div.classList.add('card_servicos_itens');

        div.innerHTML = `
            <h3 class="banner__servicos">${profissional.pessoas.nome}</h3>
            <p class="banner__servicos">${profissional.servico.nome}</p>
            <a href="tulio.html" class="btn">Ver mais</a>
        `;

        section.appendChild(div);
    });
}

fetchPessoas();
fetchProfissionais();
updateProfissionaisSection();