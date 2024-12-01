const cidadesVisitadas = document.getElementById('cidadesVisitadas');

new Chart(cidadesVisitadas, {
    type: 'bar',
    data: {
        labels: ['São Paulo (Capital)', 'Campos de Jordão', 'Santos', 'Ilhabela', 'Ubatuba'],
        datasets: [{
            label: "Cidades",
            data: [80, 50, 30, 59, 27],
            borderWidth: 1,
            backgroundColor: ['#8BE4F0'],
            borderColor: ['#0085EA']
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        family: 'Abel',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
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
                text: 'Cidades Mais Visitadas (Janeiro a Junho)',
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


const cidadesSeguras = document.getElementById('cidadesSeguras');

new Chart(cidadesSeguras, {
    type: 'bar',
    data: {
        labels: ['Carnaval - São Paulo', 'Festival de Inverno', 'Natal'],
        datasets: [{
            label: "Eventos",
            data: [80, 95, 74],
            backgroundColor: ['#b2e2ca'],
            borderColor: ['#0B4900'],
            borderWidth: 1,
            barThickness: 20
        }]
    },
    options: {
        indexAxis: 'x',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        family: 'Abel',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
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
                text: 'Eventos com Mais Turistas',
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

const cidadesPerigosas = document.getElementById('cidadesPerigosas');

new Chart(cidadesPerigosas, {
    type: 'bar',
    data: {
        labels: ['Santos', 'Guarujá', 'Ubatuba'],
        datasets: [{
            label: "Cidades",
            data: [12, 19, 3],
            backgroundColor: ['#d0c7ff'],
            borderColor: ['#7E3FE1'],
            borderWidth: 1,
            barThickness: 20
        }]
    },
    options: {
        indexAxis: 'x',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        family: 'Abel',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
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
                text: 'Cidades em Crescimentos de Turistas',
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

const segurasVisitadas = document.getElementById('segurasVisitadas');

new Chart(segurasVisitadas, {
    type: 'bar',
    data: {
        labels: ['São Paulo (Capital)', 'Campos de Jordão', 'Santos'],
        datasets: [
            {
                label: 'Mais Visitadas',
                data: [82, 59, 30],
                backgroundColor: ['#d0c7ff'],
                borderColor: ['#7E3FE1'],
                borderWidth: 1
            },
            {
                label: 'Mais Seguras',
                data: [52, 39, 20],
                backgroundColor: ['#b2e2ca'],
                borderColor: ['#0B4900'],
                borderWidth: 1
            }
        ]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        family: 'Abel',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
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
                text: 'Mais Visitadas',
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


const proximosEventos = document.getElementById('proximosEventos');

new Chart(proximosEventos, {
    type: 'line',
    data: {
        labels: ['Ano Novo Chinês', 'Festival Lunas', 'Dia da Independência - EUA', 'Festa Junina', 'Dia dos namorados'],
        datasets: [{
            label: 'Próximos Eventos Globais',
            data: [20, 15, 30, 80, 95],
            borderWidth: 2,
            backgroundColor: ['#EB9191'],
            borderColor: ['#EB1E1A'],
            fill: true
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: {
                        family: 'Abel',
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
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
                text: 'Próximos Eventos Globais',
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


const estacao = document.getElementById('estacao');

new Chart(estacao, {
    type: 'pie',
    data: {
        labels: ['Primavera', 'Verão', 'Outono', 'Inverno'],
        datasets: [{
            label: 'Viagens por Estação do Ano',
            data: [10, 50, 10, 30],
            backgroundColor: [
                '#EB9191',
                '#8BE4F0',
                '#EBE591',
                '#b2e2ca'
            ],
            borderColor: [
                '#EB1E1A',
                '#0085EA',
                '#EBC201',
                '#0B4900'
            ],
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
