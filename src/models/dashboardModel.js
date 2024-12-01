var database = require("../database/config");

function buscarDados(params) {
    console.log("Parâmetros recebidos:", params);

    let instrucaoSql = "";
    
    if (!params.estado) {
        // Query nacional (mantém a original)
        instrucaoSql = `
        SELECT 
            uf.nome AS categoria,
            COUNT(v.idPassagem) AS total_viagens,
            SUM(v.QtdPassageirosPagos) AS total_pagos,
            SUM(v.QtdPassageirosGratis) AS total_gratis,
            ev.Nome AS evento,
            ev.DataInicio,
            ev.DataFim,
            SUM(c.qtdOcorrencia) AS total_crimes,
            CASE 
                WHEN MONTH(v.dtViagem) IN (12, 1, 2) THEN 'Verão'
                WHEN MONTH(v.dtViagem) IN (3, 4, 5) THEN 'Outono'
                WHEN MONTH(v.dtViagem) IN (6, 7, 8) THEN 'Inverno'
                WHEN MONTH(v.dtViagem) IN (9, 10, 11) THEN 'Primavera'
            END AS estacao_ano
        FROM viagem AS v
        JOIN aeroporto AS a ON v.fkAeroportoDestino = a.idAeroporto
        JOIN uf ON a.fkEstado = uf.CodigoIBGE
        LEFT JOIN estadohasevento AS ee ON uf.CodigoIBGE = ee.fkEstado
        LEFT JOIN evento AS ev ON ee.fkEvento = ev.idEvento
        LEFT JOIN crime AS c ON c.fkEstado = uf.CodigoIBGE 
        WHERE 1=1
        ${params.evento ? `AND ev.Nome = '${params.evento}'` : ''}
        ${params.clima ? `AND CASE 
            WHEN MONTH(v.dtViagem) IN (12, 1, 2) THEN 'Verão'
            WHEN MONTH(v.dtViagem) IN (3, 4, 5) THEN 'Outono'
            WHEN MONTH(v.dtViagem) IN (6, 7, 8) THEN 'Inverno'
            WHEN MONTH(v.dtViagem) IN (9, 10, 11) THEN 'Primavera'
        END = '${params.clima}'` : ''}
        ${params.periodo ? `AND v.dtViagem BETWEEN '${params.periodo.inicio}' AND '${params.periodo.fim}'` : ''}
        GROUP BY uf.nome, ev.Nome, ev.DataInicio, ev.DataFim, estacao_ano

        UNION ALL

        SELECT 
            p.Nome AS categoria,
            COUNT(*) AS total_viagens,
            NULL AS total_pagos,
            NULL AS total_gratis,
            NULL AS evento,
            NULL AS DataInicio,
            NULL AS DataFim,
            NULL AS total_crimes,
            NULL AS estacao_ano
        FROM Viagem AS v
        JOIN Aeroporto AS ao ON v.fkAeroportoOrigem = ao.idAeroporto
        JOIN Pais AS p ON ao.fkPais = p.idPais
        WHERE p.idPais != 1
        ${params.origem ? `AND p.Nome = '${params.origem}'` : ''}
        GROUP BY p.Nome
        ORDER BY total_viagens DESC
        LIMIT 3;`;
    } else {
        // Query estadual (dados específicos do estado)
        instrucaoSql = `
        SELECT 
            a.NomeAeroporto AS categoria,
            COUNT(v.idPassagem) AS total_viagens,
            SUM(v.QtdPassageirosPagos) AS total_pagos,
            SUM(v.QtdPassageirosGratis) AS total_gratis,
            ev.Nome AS evento,
            ev.DataInicio,
            ev.DataFim,
            c.qtdOcorrencia AS total_crimes,
            CASE 
                WHEN MONTH(v.dtViagem) IN (12, 1, 2) THEN 'Verão'
                WHEN MONTH(v.dtViagem) IN (3, 4, 5) THEN 'Outono'
                WHEN MONTH(v.dtViagem) IN (6, 7, 8) THEN 'Inverno'
                WHEN MONTH(v.dtViagem) IN (9, 10, 11) THEN 'Primavera'
            END AS estacao_ano
        FROM viagem v
        JOIN aeroporto a ON v.fkAeroportoDestino = a.idAeroporto
        JOIN uf ON a.fkEstado = uf.CodigoIBGE
        LEFT JOIN estadohasevento ee ON uf.CodigoIBGE = ee.fkEstado
        LEFT JOIN evento ev ON ee.fkEvento = ev.idEvento
        LEFT JOIN crime c ON c.fkEstado = uf.CodigoIBGE
        WHERE uf.CodigoIBGE = ${params.estado}
        ${params.evento ? `AND ev.Nome = '${params.evento}'` : ''}
        ${params.clima ? `AND CASE 
            WHEN MONTH(v.dtViagem) IN (12, 1, 2) THEN 'Verão'
            WHEN MONTH(v.dtViagem) IN (3, 4, 5) THEN 'Outono'
            WHEN MONTH(v.dtViagem) IN (6, 7, 8) THEN 'Inverno'
            WHEN MONTH(v.dtViagem) IN (9, 10, 11) THEN 'Primavera'
        END = '${params.clima}'` : ''}
        ${params.periodo ? `AND v.dtViagem BETWEEN '${params.periodo.inicio}' AND '${params.periodo.fim}'` : ''}
        GROUP BY 
            a.NomeAeroporto, 
            ev.Nome, 
            ev.DataInicio, 
            ev.DataFim, 
            c.qtdOcorrencia,
            estacao_ano
        ORDER BY total_viagens DESC
        LIMIT 5;

        SELECT 
            ev.Nome AS evento,
            COUNT(v.idPassagem) AS total_viagens
        FROM evento ev
        JOIN estadohasevento ee ON ev.idEvento = ee.fkEvento
        JOIN viagem v ON v.dtViagem BETWEEN ev.DataInicio AND ev.DataFim
        JOIN aeroporto a ON v.fkAeroportoDestino = a.idAeroporto
        WHERE a.fkEstado = ${params.estado}
        GROUP BY ev.Nome
        ORDER BY total_viagens DESC
        LIMIT 3;

        SELECT 
            CASE 
                WHEN MONTH(v.dtViagem) IN (12, 1, 2) THEN 'Verão'
                WHEN MONTH(v.dtViagem) IN (3, 4, 5) THEN 'Outono'
                WHEN MONTH(v.dtViagem) IN (6, 7, 8) THEN 'Inverno'
                WHEN MONTH(v.dtViagem) IN (9, 10, 11) THEN 'Primavera'
            END AS estacao,
            COUNT(*) as total_viagens
        FROM viagem v
        JOIN aeroporto a ON v.fkAeroportoDestino = a.idAeroporto
        WHERE a.fkEstado = ${params.estado}
        GROUP BY estacao;`;
    }

    console.log("Executando a instrução SQL:", instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDados
}