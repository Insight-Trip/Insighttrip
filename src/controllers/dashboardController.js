var dashboardModel = require("../models/dashboardModel");

function construirDashboard(req, res) {
    try {
        // Adiciona logs para debug
        console.log("Requisição recebida:", req.body);

        dashboardModel.buscarDados(req.body)
            .then(function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).json({ message: "Nenhum resultado encontrado!" });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar os dados.", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
}

module.exports = {
    construirDashboard
}