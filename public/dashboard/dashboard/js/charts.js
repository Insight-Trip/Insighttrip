const EstadosDestaque = document.getElementById('EstadosDestaque');


// ... código anterior ...

// Remove o objeto parametrosTeste fixo e cria uma função para construí-lo
function construirParametros(estado) {


    const periodoClimatico = document.getElementById('periodo-climatico').value;
    const eventosSazonais = document.getElementById('eventos-sazonais').value;
    const dataInicio = document.getElementById('data-inicio').value;
    const dataFim = document.getElementById('data-fim').value;
    const origem = document.getElementById('origem').value;
    const estadoConst = estado;

    // Redireciona para a dashboard apropriada
    if (estadoConst) {
        // Salva o estado selecionado para uso na próxima página
        sessionStorage.setItem('estadoSelecionado', estadoConst);
        window.location.href = 'dashboardEstado.html';
        return; // Interrompe a execução da função
    }

    return {
        ibge: estadoConst || undefined,
        clima: periodoClimatico !== 'proximo-semestre' ? periodoClimatico : undefined,
        evento: eventosSazonais !== 'proximo-semestre' ? eventosSazonais : undefined,
        periodo: dataInicio && dataFim ? {
            inicio: dataInicio,
            fim: dataFim
        } : undefined,
        origem: origem || undefined,
        user: "gerente"
    };
}

// Adiciona o evento de click no botão de filtrar
document.querySelector('.button-filter-active').addEventListener('click', function () {
    const parametrosTeste = construirParametros();
    console.log("Parâmetros construídos:", parametrosTeste);

    // Chama a função para construir a dashboard com os novos parâmetros
    constructUrlDashboard(parametrosTeste)
        .then(() => {
            // Fecha o dropdown após aplicar o filtro
            document.querySelector('.area-filter').classList.remove('show');
            document.querySelector('.dropdown-filter').classList.remove('show');
        })
        .catch(error => {
            console.error("Erro ao atualizar dashboard:", error);
            alert("Erro ao atualizar os dados. Por favor, tente novamente.");
        });
});

function constructUrlDashboard({
    ibge,
    clima,
    evento,
    periodo,
    origem,
    user
}) {
    const url = new URL(window.location.href);
    url.pathname = 'dashboard/buscarDados';

    console.log("URL gerada:", url.toString());

    const contexto = {
        estado: ibge,
        clima: clima,
        evento: evento,
        periodo: periodo,
        origem: origem,
        user: user
    };

    return fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contexto),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Houve um erro na requisição da dashboard");
            }
            return response.json();
        })
        .then(dados => {
            console.log("Tipo dos dados:", typeof dados);
            console.log("Dados recebidos:", dados);

            // Verifica se dados é um objeto e não um array
            if (!Array.isArray(dados)) {
                // Se for um objeto, converte para array se possível
                dados = Object.values(dados);
            }

            dados.forEach(tupla => {
                console.log("Tupla individual:", tupla);
            });

            construirGraficos(contexto, dados);
            return dados;
        })
        .catch(error => {
            console.error("Erro na chamada da requisição:", error);
            throw error;
        });
}

let graficoEstadosDestaque = null;
let graficoCidadesSeguras = null;
let graficoEstacao = null;

function construirGraficos(contexto, dados) {
    console.log("Iniciando construirGraficos com:", { contexto, dados });

    // Destroi os gráficos existentes antes de criar novos
    if (graficoEstadosDestaque) graficoEstadosDestaque.destroy();
    if (graficoCidadesSeguras) graficoCidadesSeguras.destroy();
    if (graficoEstacao) graficoEstacao.destroy();

    console.log(contexto.estado)
    // Verifica se é visualização estadual ou nacional
    if (contexto.estado) {
        alert(contexto.estado)
        // Modifica a estrutura do HTML para o layout estadual
    } else {
        // Manter a lógica original para visualização nacional
        let graficoBarrasEstadosDemandaSeguranca = false;
        let graficoBarrasLateraisDemandaEstrangeira = false;
        let graficoPizzaDemandaEventos = false;

        if (!contexto.estado) {
            graficoBarrasLateraisDemandaEstrangeira = true;
            graficoPizzaDemandaEventos = true;
            sessionStorage.STATE_CONTEXT = false;
            if (contexto.evento) {
                graficoBarrasEstadosDemandaSeguranca = true;
            }
        }

        console.log('Gráficos ativados:', {
            graficoBarrasEstadosDemandaSeguranca,
            graficoBarrasLateraisDemandaEstrangeira,
            graficoPizzaDemandaEventos
        });

        // Verifica se os elementos do DOM existem antes de criar os gráficos
        if (graficoBarrasEstadosDemandaSeguranca && !EstadosDestaque) {
            console.error('Elemento EstadosDestaque não encontrado no DOM');
            return;
        }

        if (graficoBarrasLateraisDemandaEstrangeira && !document.getElementById('cidadesSeguras')) {
            console.error('Elemento cidadesSeguras não encontrado no DOM');
            return;
        }

        if (graficoPizzaDemandaEventos && !document.getElementById('estacao')) {
            console.error('Elemento estacao não encontrado no DOM');
            return;
        }

        if (graficoBarrasEstadosDemandaSeguranca && dados.length > 0) {
            // Processando dados para o gráfico demanda segurança
            const estados = [];
            const totalViagens = [];
            const totalCrimes = [];

            // Corrigindo o caminho para acessar os dados
            const dadosEstado = dados[1][0].resultado.dados_estado;

            dadosEstado.forEach(tupla => {
                console.log("Tupla para extração:", tupla);
                estados.push(tupla.nome_estado); // Nome do estado
                totalViagens.push(tupla.porcentagem_viagens); // % de viagens
                totalCrimes.push(tupla.porcentagem_crimes); // % de crimes
            });

            console.log("Estados:", estados);
            console.log("Total de Viagens:", totalViagens);
            console.log("Total de Crimes:", totalCrimes);

            graficoEstadosDestaque = new Chart(EstadosDestaque, {
                type: 'bar',
                data: {
                    labels: estados,
                    datasets: [
                        {
                            label: 'Total de Viagens',
                            data: totalViagens,
                            backgroundColor: ['#d0c7ff'],
                            borderColor: ['#7E3FE1'],
                            borderWidth: 1
                        },
                        {
                            label: 'Indice de crimes',
                            data: totalCrimes,
                            backgroundColor: ['#b2e2ca'],
                            borderColor: ['#0B4900'],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: false,
                    indexAxis: 'x',
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Estados em Destaque (${contexto.evento})`,
                            position: 'top',
                            font: {
                                size: 14,
                                family: 'Abel',
                                weight: 'normal'
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    }
                }
            });
        } else {
            alert("Sem dados para demanda e segurança!")
        }

        if (graficoBarrasLateraisDemandaEstrangeira && dados.length > 0) {
            const cidadesSeguras = document.getElementById('cidadesSeguras');
        
            // Extraindo os dados de países estrangeiros
            const topPaises = dados[1][0].resultado.top_paises_estrangeiros;
        
            // Preparando os arrays para o gráfico
            const labels = [];
            const data = [];
            const backgroundColors = [];
            const borderColors = [];
        
            // Populando os dados
            topPaises.forEach(pais => {
                labels.push(pais.pais);
                data.push(pais.total_voos);
                backgroundColors.push('#8BE4F0'); // Cor de fundo
                borderColors.push('#0085EA'); // Cor da borda
            });
        
            // Criando o gráfico
            graficoCidadesSeguras = new Chart(cidadesSeguras, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Maior Tendência Estrangeira',
                        data: data,
                        borderWidth: 1,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { 
                                    family: 'Abel',
                                    size: 14
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Maior tendência de Origens Estrangeiras',
                            position: 'top',
                            font: {
                                size: 14,
                                family: 'Abel',
                                weight: 'normal'
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        intersect: false,
                    },
                }
            });
        }
        

        if (graficoPizzaDemandaEventos && dados.length > 0) {
            const estacao = document.getElementById('estacao');
        
            // Extraindo os dados de viagens por estação
            const viagensPorEstacao = dados[1][0].resultado.total_viagens_por_estacao;
        
            // Preparando os arrays para o gráfico
            const labels = [];
            const data = [];
            const backgroundColors = ['#EB9191', '#8BE4F0', '#EBE591', '#b2e2ca'];
            const borderColors = ['#EB1E1A', '#0085EA', '#EBC201', '#0B4900'];
        
            // Populando os arrays
            viagensPorEstacao.forEach((item, index) => {
                labels.push(item.estacao);
                data.push(item.totalViagens);
            });
        
            // Criando o gráfico
            graficoEstacao = new Chart(estacao, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Viagens por Estação do Ano',
                        data: data,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Viagens por Estação do Ano',
                            position: 'top',
                            font: {
                                size: 14,
                                family: 'Abel',
                                weight: 'normal'
                            }
                        },
                        legend: {
                            position: 'right',
                            labels: {
                                font: {
                                    family: 'Abel',
                                    size: 14
                                }
                            }
                        }
                    }
                }
            });
        }
        

    }

}

const parametrosTeste = {
    ibge: undefined,
    clima: undefined,
    evento: "carnaval",
    periodo: undefined,
    user: "gerente"
};

constructUrlDashboard(parametrosTeste);