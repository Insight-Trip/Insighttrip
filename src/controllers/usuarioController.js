var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json({
                            id: resultadoAutenticar[0].id,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            isAdm : resultadoAutenticar[0].fkAdministrador == null,
                            senha: resultadoAutenticar[0].senha,
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarFuncionario(req, res){
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha
    const cpf = req.body.cpf
    const telefone = req.body.telefone
    const fkAdm = req.body.fkAdm
    const fkArea = req.body.fkArea;

    usuarioModel.cadastrarFuncionario(nome, cpf, email, senha, telefone, fkAdm, fkArea)
    .then(
        resultado =>{
            res.json(resultado)
        }
    )
    .catch(erro =>{
        console.log(
            "Houve um erro ao cadastrar o funcionario!\n" +
            erro.sqlMessage
        );
        res.status(500).json(erro.sqlMessage)
    })
}



function listarFuncionarios(req, res){
    usuarioModel.listarFuncionarios().then(
        function (resultado) {
            res.status(200).json(resultado)
        }
    ).catch(error => {
        console.log(error.sqlMessage)
        res.sendStatus(500).json(error.sqlMessage)
    })
}

function buscarFuncionario(req, res){
    const busca = req.body.busca

    if(busca == undefined){
        res.status(400).send("O termo de busca está indefinido!");
        return;
    }

    usuarioModel.buscarFuncionario(busca)
    .then(
        function (resultado) {
            res.status(200).json(resultado)
        }
    ).catch(error => {
        console.log(error.sqlMessage);
        res.status(500).json(error.sqlMessage);
    })
}

function listarAdministradores(req, res){
    usuarioModel.listarAdministradores().then(
        function (resultado) {
            res.status(200).json(resultado)
        }
    ).catch(error => {
        console.log(error.sqlMessage)
        res.sendStatus(500).json(error.sqlMessage)
    })
}


module.exports = {
    autenticar,
    listarFuncionarios,
    buscarFuncionario,
    listarAdministradores,
    cadastrarFuncionario
}