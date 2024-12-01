document.addEventListener('DOMContentLoaded', function() {
    const estadoSelecionado = sessionStorage.getItem('estadoSelecionado');
    
    if (!estadoSelecionado) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Adicionar listeners para os folders
    document.querySelectorAll('.folder').forEach(folder => {
        folder.addEventListener('click', function() {
            const estado = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            
            if (!estado || estado === 'undefined') {
                // Se clicou no Brasil ou estado indefinido
                sessionStorage.removeItem('estadoSelecionado');
                window.location.href = 'dashboard.html';
            } else {
                // Se clicou em outro estado, atualiza o estado selecionado
                sessionStorage.setItem('estadoSelecionado', estado);
                // Recarrega a página com o novo estado
                location.reload();
            }
        });
    });
    
    // Atualizar o título ou outros elementos com base no estado selecionado
    atualizarInterfaceEstado(estadoSelecionado);
    
    // Carregar dados específicos do estado
    carregarDadosEstado(estadoSelecionado);
    
    // Adicionar botões de navegação
    const folderStructure = document.querySelector('.folder-structure');
    
    // Criar botões de navegação
    const scrollLeftButton = document.createElement('button');
    scrollLeftButton.innerHTML = '←';
    scrollLeftButton.className = 'scroll-button scroll-left';
    
    const scrollRightButton = document.createElement('button');
    scrollRightButton.innerHTML = '→';
    scrollRightButton.className = 'scroll-button scroll-right';
    
    // Adicionar botões ao DOM
    folderStructure.parentElement.appendChild(scrollLeftButton);
    folderStructure.parentElement.appendChild(scrollRightButton);
    
    // Função para scroll suave
    const scroll = (direction) => {
        const scrollAmount = 200;
        folderStructure.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    };
    
    // Adicionar event listeners aos botões
    scrollLeftButton.addEventListener('click', () => scroll(-1));
    scrollRightButton.addEventListener('click', () => scroll(1));
    
    // Atualizar visibilidade dos botões baseado na posição do scroll
    const updateScrollButtons = () => {
        const {scrollLeft, scrollWidth, clientWidth} = folderStructure;
        
        scrollLeftButton.style.display = scrollLeft > 0 ? 'flex' : 'none';
        scrollRightButton.style.display = 
            scrollLeft < (scrollWidth - clientWidth) ? 'flex' : 'none';
    };
    
    // Adicionar listener para atualizar botões durante scroll
    folderStructure.addEventListener('scroll', updateScrollButtons);
    
    // Checar inicialmente
    updateScrollButtons();
    
    // Adicionar controles do carrossel
    const carousel = document.querySelector('.folder-carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            carousel.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });

        nextButton.addEventListener('click', () => {
            carousel.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });

        // Atualizar visibilidade dos botões
        const updateButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            
            prevButton.style.display = scrollLeft > 0 ? 'flex' : 'none';
            nextButton.style.display = 
                scrollLeft < (scrollWidth - clientWidth - 10) ? 'flex' : 'none';
        };

        carousel.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        updateButtons(); // Checar estado inicial
    }
});

function atualizarInterfaceEstado(estadoId) {
    // Remove active class from all folders
    document.querySelectorAll('.folder').forEach(folder => {
        folder.classList.remove('active');
    });

    // Add active class to selected state
    const selectedFolder = document.querySelector(`.folder[onclick*="${estadoId}"]`);
    if (selectedFolder) {
        selectedFolder.classList.add('active');
    }

    // Mapa de IDs para nomes de estados
    const estados = {
        '35': 'São Paulo',
        '33': 'Rio de Janeiro',
        '31': 'Minas Gerais',
        // ... adicionar outros estados
    };
    
    // Atualizar título ou outros elementos da página
    document.title = `Dashboard - ${estados[estadoId] || 'Estado'}`;
}

function carregarDadosEstado(estadoId) {
    // Aqui você pode fazer uma chamada à API para carregar
    // dados específicos do estado selecionado
    // e atualizar os gráficos conforme necessário
}

// Adicionar função para voltar para dashboard nacional
function voltarParaNacional() {
    sessionStorage.removeItem('estadoSelecionado');
    window.location.href = 'dashboard.html';
}

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
