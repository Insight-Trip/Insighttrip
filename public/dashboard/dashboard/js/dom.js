const mapAcess = document.getElementById('mapAcess');

// Controle do carrossel
let scrollPosition = 0;
const carousel = document.querySelector('.folder-carousel');
const itemWidth = 80; // Largura aproximada de cada item + gap
const scrollAmount = itemWidth * 3; // Rola 3 items por vez

function moveCarousel(direction) {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    scrollPosition += direction * scrollAmount;
    
    // Limita o scroll
    if (scrollPosition < 0) scrollPosition = 0;
    if (scrollPosition > maxScroll) scrollPosition = maxScroll;
    
    carousel.style.transform = `translateX(-${scrollPosition}px)`;
}

// Adiciona navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveCarousel(-1);
    if (e.key === 'ArrowRight') moveCarousel(1);
});

// Marca o estado selecionado
function updateSelectedState() {
    const estadoSelecionado = sessionStorage.getItem('estadoSelecionado');
    document.querySelectorAll('.folder').forEach(folder => {
        folder.classList.remove('selected');
        const estado = folder.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (estado === estadoSelecionado) {
            folder.classList.add('selected');
        }
        if (!estadoSelecionado && folder.textContent === 'Brasil') {
            folder.classList.add('selected');
        }
    });
}

// Atualiza estado selecionado quando a página carrega
document.addEventListener('DOMContentLoaded', updateSelectedState);

mapAcess.addEventListener('click', () => {
    window.location.href = "../mapa/mapaData.html";
});
