var dashboardModel = require("../models/dashboardModel.js");

async function construirDashboard(req, res) {
    try {
        const { estado, clima, evento, periodo, user } = req.body;

        // Validação dos parâmetros recebidos
        if (!estado && !clima && !evento && !periodo && !user) {
            res.status(400).send("Nenhum parâmetro foi fornecido para construir a dashboard");
            return;
        }

        const parametros = {
            estado,
            clima,
            evento,
            periodo,
            user
        };

        console.log("Parâmetros recebidos:", parametros);

        // Chamada ao modelo para buscar os dados
        const resultado = await dashboardModel.buscarDados(parametros);

        if (resultado && resultado.length > 0) {
            res.status(200).json({
                mensagem: "Dados da dashboard recuperados com sucesso",
                dados: resultado,
                parametros
            });
        } else {
            res.status(404).json({
                mensagem: "Nenhum dado encontrado para os parâmetros fornecidos",
                parametros
            });
        }
    } catch (erro) {
        console.log("Erro ao buscar dados da dashboard:", {
            mensagem: erro.message,
            sqlMessage: erro.sqlMessage,
            stack: erro.stack
        });
        
        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: erro.sqlMessage || erro.message
        });
    }
}

module.exports = {
    construirDashboard
}