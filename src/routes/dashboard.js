var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// Rota para buscar dados da dashboard
router.post("/buscarDados", function (req, res) {
    dashboardController.construirDashboard(req, res);
});

module.exports = router;
