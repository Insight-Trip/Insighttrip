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
WITH

-- 0. Obter o CódigoIBGE do Estado pelo Nome
EstadoSelecionado AS (
    SELECT 
        uf.CodigoIBGE AS codigo_estado
    FROM UF uf
    WHERE LOWER(uf.Nome) = LOWER('${params.estado}')
),

-- 1. Calcular o Total Anual de Viagens para o Estado
TotalViagensAno AS (
    SELECT 
        YEAR(v.dtViagem) AS ano,
        COUNT(*) AS total_viagens_ano
    FROM Viagem v
    JOIN Aeroporto a_dest ON v.fkAeroportoDestino = a_dest.idAeroporto
    WHERE a_dest.fkEstado = (SELECT codigo_estado FROM EstadoSelecionado)
    GROUP BY ano
),

-- 2. Calcular o Total Anual de Crimes para o Estado
TotalCrimesAno AS (
    SELECT 
        YEAR(c.Data) AS ano,
        COUNT(*) AS total_crimes_ano
    FROM Crime c
    WHERE c.fkEstado = (SELECT codigo_estado FROM EstadoSelecionado)
    GROUP BY ano
),

-- 3. Festividades no Estado com Total de Viagens e Total de Crimes durante os Eventos
Festividades AS (
    SELECT
        e.Nome AS nome_evento,
        YEAR(e.DataInicio) AS ano_evento,
        COUNT(DISTINCT v.idPassagem) AS total_viagens_evento,
        COUNT(DISTINCT c.idCrime) AS total_crimes_evento
    FROM Evento e
    JOIN EstadoHasEvento ehe ON e.idEvento = ehe.fkEvento
    JOIN EstadoSelecionado es ON ehe.fkEstado = es.codigo_estado
    JOIN Viagem v ON v.fkAeroportoDestino IN (
        SELECT a.idAeroporto 
        FROM Aeroporto a 
        WHERE a.fkEstado = es.codigo_estado
    )
    LEFT JOIN Crime c ON c.fkEstado = es.codigo_estado 
        AND c.Data BETWEEN e.DataInicio AND e.DataFim
    WHERE v.dtViagem BETWEEN e.DataInicio AND e.DataFim
    GROUP BY e.Nome, ano_evento
),

-- 4. Calcular as Porcentagens de Viagens e Crimes durante os Eventos
FestividadesComPercentuais AS (
    SELECT
        f.nome_evento,
        -- Calcula a porcentagem de viagens
        ROUND(
            (f.total_viagens_evento / IFNULL(tv.total_viagens_ano, 1)) * 100,
            2
        ) AS porcentagem_viagens,
        -- Calcula a porcentagem de crimes
        ROUND(
            (f.total_crimes_evento / IFNULL(tc.total_crimes_ano, 1)) * 100,
            2
        ) AS porcentagem_crimes
    FROM Festividades f
    LEFT JOIN TotalViagensAno tv ON f.ano_evento = tv.ano
    LEFT JOIN TotalCrimesAno tc ON f.ano_evento = tc.ano
),

-- 5. Paises Estrangeiros com Viagens para o Estado (Ordenado e Limitado a 3)
PaisesEstrangeiros AS (
    SELECT
        LOWER(p.Nome) AS pais,
        COUNT(DISTINCT v.idPassagem) AS total_viagens
    FROM Viagem v
    JOIN Aeroporto a_dest ON v.fkAeroportoDestino = a_dest.idAeroporto
    JOIN Aeroporto a_orig ON v.fkAeroportoOrigem = a_orig.idAeroporto
    JOIN Pais p ON a_orig.fkPais = p.idPais
    WHERE a_dest.fkEstado = (SELECT codigo_estado FROM EstadoSelecionado)
      AND LOWER(p.Nome) <> 'brasil'
    GROUP BY p.Nome
    ORDER BY total_viagens DESC
    LIMIT 3
),

-- 6. Viagens por Estação do Ano para o Estado
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
    JOIN Aeroporto a_dest ON v.fkAeroportoDestino = a_dest.idAeroporto
    WHERE a_dest.fkEstado = (SELECT codigo_estado FROM EstadoSelecionado)
    GROUP BY estacao
),

-- 7. Montagem do JSON para Festividades (Incluindo porcentagens)
FestividadesJSON AS (
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'nome_evento', fc.nome_evento,
            'porcentagem_viagens', fc.porcentagem_viagens,
            'porcentagem_crimes', fc.porcentagem_crimes
        )
    ) AS festividades
    FROM FestividadesComPercentuais fc
),

-- 8. Montagem do JSON para Paises Estrangeiros
PaisesEstrangeirosJSON AS (
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'pais', p.pais,
            'total_viagens', p.total_viagens
        )
    ) AS paises_estrangeiros
    FROM PaisesEstrangeiros p
),

-- 9. Montagem do JSON para Viagens por Estação
ViagensPorEstacaoJSON AS (
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'estacao', v.estacao,
            'total_viagens', v.total_viagens
        )
    ) AS viagens_por_estacao
    FROM ViagensPorEstacao v
)

-- 10. Combinação Final dos JSONs
SELECT 
    JSON_OBJECT(
        'festividades', COALESCE(f.festividades, JSON_ARRAY()),
        'paises_estrangeiros', COALESCE(p.paises_estrangeiros, JSON_ARRAY()),
        'viagens_por_estacao', COALESCE(v.viagens_por_estacao, JSON_ARRAY())
    ) AS resultado
FROM FestividadesJSON f
CROSS JOIN PaisesEstrangeirosJSON p
CROSS JOIN ViagensPorEstacaoJSON v;`;
    }

    console.log("Executando a instrução SQL:", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosEstrangeiros() {

}

module.exports = {
    buscarDados
}