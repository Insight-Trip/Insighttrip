const listaFuncionariosContainer = document.querySelector('.lista-funcionarios');

// Nova função para gerar cards
function gerarCards(funcionarios, container) {
    container.innerHTML = "";
    funcionarios.forEach(funcionario => {
        const containerFuncionario = document.createElement('section');
        containerFuncionario.className = 'container-funcionario';
        
        containerFuncionario.innerHTML = `
            <div class="caixa-nome-funcionario">
                <img src="./imagens/pessoa.png">
                <p class="nome-funcionario">${funcionario.nome}</p>
                <p class="cargo-funcionario">${funcionario.area}</p>
            </div>
            <div class="caixa-alterar-funcionario">
                <img src="./imagens/edit.png" class="botao-icone">
                <img src="./imagens/delete.png" class="botao-icone">
            </div>
        `;
        
        container.appendChild(containerFuncionario);
    });
}

// Função filtrarFuncionarios refatorada
function filtrarFuncionarios(area) {
    fetch("../../usuarios/filtrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ area: area })
    })
    .then(resposta => resposta.json())
    .then(listaFuncionarios => {
        gerarCards(listaFuncionarios, listaFuncionariosContainer);
    });
}

// Função listarFuncionarios refatorada
function listarFuncionarios() {
    fetch("../../usuarios/listar", {
        method: "GET",
    })
    .then(resposta => resposta.json())
    .then(listaFuncionarios => {
        gerarCards(listaFuncionarios, listaFuncionariosContainer);
    })
    .catch(error => console.error("Houve um erro de retorno ao listar os funcionarios \n" + error));
}

// Função buscarFuncionario refatorada
function buscarFuncionario(char, view) {
    fetch("../../usuarios/buscar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ busca: char })
    })
    .then(resposta => resposta.json())
    .then(listaFuncionariosBuscados => {
        gerarCards(listaFuncionariosBuscados, view);
    });
}

listarFuncionarios();

const btnBuscar = document.getElementById('button_buscar');

btnBuscar.addEventListener('click', ()=>{
    const searchBar = document.getElementById('input_busca')

    searchBar.addEventListener('input', buscarFuncionario(searchBar.value, listaFuncionariosContainer));

    if(!searchBar.value || searchBar.value.trim().length === 0){
        listarFuncionarios();
    }
})

const buttonAdd = document.getElementById('buttonAdd');

buttonAdd.addEventListener('click', ()=>{
    if(sessionStorage.IS_ADM === "true"){
        window.location.href = "adicionarFuncionario.html"
    }else{
        alert("Você não tem permissão para adicionar um novo funcionario")
    }
})

    