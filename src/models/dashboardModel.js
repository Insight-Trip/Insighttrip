var database = require("../database/config");

function buscarDados(params) {
    console.log("Parâmetros recebidos:", params);

    let instrucaoSql = "";
    
    if (!params.estado) {
        // Query nacional (mantém a original)
        instrucaoSql = `WITH EventoSelecionado AS (
    SELECT 
        e.Nome, 
        e.DataInicio, 
        e.DataFim,
        YEAR(e.DataInicio) AS Ano
    FROM Evento e
    WHERE LOWER(e.Nome) = LOWER('${params.evento}')
),
TotalCrimes AS (
    SELECT 
        c.fkEstado, 
        COUNT(*) AS total_crimes
    FROM Crime c
    JOIN EventoSelecionado es ON YEAR(c.Data) = es.Ano
    GROUP BY c.fkEstado
),
CrimesDuranteEvento AS (
    SELECT 
        c.fkEstado, 
        COUNT(*) AS crimes_evento
    FROM Crime c
    JOIN EventoSelecionado es 
        ON YEAR(c.Data) = es.Ano 
        AND c.Data BETWEEN es.DataInicio AND es.DataFim
    GROUP BY c.fkEstado
),
TotalViagens AS (
    SELECT 
        a.fkEstado, 
        COUNT(*) AS total_viagens
    FROM Viagem v
    JOIN Aeroporto a ON v.fkAeroportoDestino = a.idAeroporto
    JOIN EventoSelecionado es ON YEAR(v.dtViagem) = es.Ano
    GROUP BY a.fkEstado
),
ViagensDuranteEvento AS (
    SELECT 
        a.fkEstado, 
        COUNT(*) AS viagens_evento
    FROM Viagem v
    JOIN Aeroporto a ON v.fkAeroportoDestino = a.idAeroporto
    JOIN EventoSelecionado es 
        ON YEAR(v.dtViagem) = es.Ano 
        AND v.dtViagem BETWEEN es.DataInicio AND es.DataFim
    GROUP BY a.fkEstado
),
TopPaisesEstrangeiros AS (
    SELECT 
        p.Nome AS pais,
        COUNT(*) AS total_voos
    FROM Viagem v
    JOIN Aeroporto a_dest ON v.fkAeroportoDestino = a_dest.idAeroporto
    JOIN Aeroporto a_orig ON v.fkAeroportoOrigem = a_orig.idAeroporto
    JOIN Pais p ON a_orig.fkPais = p.idPais
    WHERE a_dest.fkPais = (SELECT idPais FROM Pais WHERE LOWER(Nome) = 'brasil')
        AND LOWER(p.Nome) <> 'brasil'
        AND YEAR(v.dtViagem) = (SELECT Ano FROM EventoSelecionado)
        AND v.dtViagem BETWEEN (SELECT DataInicio FROM EventoSelecionado) 
                             AND (SELECT DataFim FROM EventoSelecionado)
    GROUP BY p.Nome
    ORDER BY total_voos DESC
    LIMIT 3
),
DadosEstadoJSON AS (
    SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'nome_estado', uf.Nome,
                'nome_evento', es.Nome,
                'porcentagem_crimes', IFNULL((ce.crimes_evento / tc.total_crimes) * 100, 0),
                'porcentagem_viagens', IFNULL((ve.viagens_evento / tv.total_viagens) * 100, 0)
            )
        ) AS dados_estado
    FROM UF uf
    CROSS JOIN EventoSelecionado es
    LEFT JOIN TotalCrimes tc ON tc.fkEstado = uf.CodigoIBGE
    LEFT JOIN CrimesDuranteEvento ce ON ce.fkEstado = uf.CodigoIBGE
    LEFT JOIN TotalViagens tv ON tv.fkEstado = uf.CodigoIBGE
    LEFT JOIN ViagensDuranteEvento ve ON ve.fkEstado = uf.CodigoIBGE
),
TopPaisesJSON AS (
    SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'pais', tp.pais,
                'total_voos', tp.total_voos
            )
        ) AS top_paises_estrangeiros
    FROM TopPaisesEstrangeiros tp
),
ViagensPorEstacao AS (
    SELECT
        CASE
            WHEN (MONTH(v.dtViagem) = 12 AND DAY(v.dtViagem) >= 21) 
                 OR (MONTH(v.dtViagem) IN (1, 2)) 
                 OR (MONTH(v.dtViagem) = 3 AND DAY(v.dtViagem) <= 20)
                THEN 'Verao'
            WHEN (MONTH(v.dtViagem) = 3 AND DAY(v.dtViagem) >= 21) 
                 OR (MONTH(v.dtViagem) IN (4, 5)) 
                 OR (MONTH(v.dtViagem) = 6 AND DAY(v.dtViagem) <= 20)
                THEN 'Outono'
            WHEN (MONTH(v.dtViagem) = 6 AND DAY(v.dtViagem) >= 21) 
                 OR (MONTH(v.dtViagem) IN (7, 8)) 
                 OR (MONTH(v.dtViagem) = 9 AND DAY(v.dtViagem) <= 20)
                THEN 'Inverno'
            WHEN (MONTH(v.dtViagem) = 9 AND DAY(v.dtViagem) >= 21) 
                 OR (MONTH(v.dtViagem) IN (10, 11)) 
                 OR (MONTH(v.dtViagem) = 12 AND DAY(v.dtViagem) <= 20)
                THEN 'Primavera'
            ELSE 'Desconhecida'
        END AS estacao,
        COUNT(*) AS total_viagens
    FROM Viagem v
    GROUP BY estacao
),
ViagensPorEstacaoJSON AS (
    SELECT 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'estacao', vpe.estacao,
                'totalViagens', vpe.total_viagens
            )
        ) AS total_viagens_por_estacao
    FROM ViagensPorEstacao vpe
)
SELECT 
    JSON_OBJECT(
        'dados_estado', DE.dados_estado,
        'top_paises_estrangeiros', TP.top_paises_estrangeiros,
        'total_viagens_por_estacao', VPE.total_viagens_por_estacao
    ) AS resultado
FROM DadosEstadoJSON DE
CROSS JOIN TopPaisesJSON TP
CROSS JOIN ViagensPorEstacaoJSON VPE;`;

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

function buscarDadosEstrangeiros() {

}

module.exports = {
    buscarDados
}