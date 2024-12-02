const listaFuncionarios = JSON.parse(localStorage.getItem("funcionarios"));
console.log(listaFuncionarios)

document.addEventListener('DOMContentLoaded', function() {
    const listContent = document.querySelector('.list-content');
    const searchInput = document.querySelector('.search-input');

    // Função para renderizar lista de funcionários
    function renderizarFuncionarios(funcionarios) {
        

        listContent.innerHTML = '';
        funcionarios.forEach(func => {
            let cargo = "";

            switch (func.fkArea) {
                case "1":
                    cargo = "macro"
                    break;
                case "2":
                    cargo = "marketing"
                    break;
                case "3": 
                    cargo = "vendas"
                
            }
            
            const employeeItem = document.createElement('div');
            employeeItem.className = 'employee-item';
            employeeItem.innerHTML = `
                <h4>${func.nome}</h4>
                <p>${cargo} - ${func.email}</p>
            `;
            
            employeeItem.addEventListener('click', () => preencherFormulario(func));
            listContent.appendChild(employeeItem);
        });
    }

    // Função para preencher o formulário com os dados do funcionário
    function preencherFormulario(funcionario) {
        document.getElementById('edit_nome').value = funcionario.nome;
        document.getElementById('edit_cpf').value = funcionario.cpf;
        document.getElementById('edit_telefone').value = funcionario.telefone;
        document.getElementById('edit_email').value = funcionario.email;
        // Limpa a senha por segurança
        document.getElementById('edit_senha').value = '';
        
        // Remove a seleção anterior e adiciona ao item atual
        document.querySelectorAll('.employee-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    }

    // Evento de busca
    searchInput.addEventListener('input', (e) => {
        const busca = e.target.value.toLowerCase();
        const funcionariosFiltrados = mockFuncionarios.filter(func => 
            func.nome.toLowerCase().includes(busca) || 
            func.cargo.toLowerCase().includes(busca)
        );
        renderizarFuncionarios(funcionariosFiltrados);
    });

    // Renderiza a lista inicial
        renderizarFuncionarios(listaFuncionarios);
});



const btnCad = document.getElementById('btnSave')

function cadastrar() {
    listaFuncionarios.forEach(funcionario => {
        fetch("/../usuarios/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        })
            .then(resposta => {
                if (resposta.ok) {
                    alert("Funcionário cadastrado com sucesso!");
                    window.location.href = "adicionarFuncionario.html";
                } else {
                    throw new Error("Erro ao cadastrar funcionário");
                }
            })
            .catch(erro => {
                console.error(erro);
                alert("Erro ao cadastrar funcionário");
            });
    })

    listaFuncionarios = [];
}

btnCad.addEventListener('click', cadastrar)
