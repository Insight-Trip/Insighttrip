const selectAdms = document.getElementById('select_admin')
const cadButton = document.getElementById('cadButton')
const finishButton = document.getElementById('finishButton')

fetch("/../usuarios/listarAdm", {
    method: "GET",
})
.then(resposta => resposta.json())
.then(listaAdms => {
    listaAdms.forEach(adm => {
        selectAdms.innerHTML += `<option value="${adm.idFuncionario}">${adm.Nome}</option>`
        
    });
})
.catch(error => console.error("Houve um erro de retorno ao listar os funcionarios \n" + error));

const listaFuncionarios = []
function registrar(){
    
    // Obtendo valores dos inputs
    const nome = document.getElementById('input_nome').value;
    const cpf = document.getElementById('input_cpf').value;
    const email = document.getElementById('input_email').value;
    const senha = document.getElementById('input_senha').value;
    const telefone = document.getElementById('input_telefone').value;
    const fkAdm = document.getElementById('select_admin').value;
    const fkArea = document.getElementById('select_area').value;

    if (nome == "" || cpf == "" || email == "" || senha == "" || telefone == "" || fkAdm == "" || fkArea == "") {
        alert("Preencha todos os campos!");
        return;
    }

    // Configurando o objeto com os dados do funcionário
    const dadosFuncionario = {
        nome: nome,
        cpf: cpf,
        email: email,
        senha: senha,
        telefone: telefone,
        fkAdm: fkAdm,
        fkArea: fkArea
    }

    listaFuncionarios.push(dadosFuncionario)
    console.log(listaFuncionarios)

    

}

function finalizar(){
    localStorage.setItem("funcionarios", JSON.stringify(listaFuncionarios));

    window.location.href = "confirmarCadastros.html"
}




// Corrigindo o addEventListener (removendo os parênteses da função)
cadButton.addEventListener('click', registrar);
finishButton.addEventListener('click', finalizar);
