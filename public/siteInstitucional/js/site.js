let posicaoDaTela = 0;

function atualizarPosicaoDaTela() {

    posicaoDaTela = window.scrollY;
}

// //Função para sombra na navbar no momento do scroll
// function adicionarSombraNaNavbar() {
//     let areaNavbar = document.querySelector('.area-navbar'); // Alterei para a div.area-navbar para preencher a tela horizontalmente
//     areaNavbar.classList.toggle('shadow', window.scrollY > 450)
// }

let endPosition = window.scrollY;

//Função para animação do nome InsightTrip da home com o scroll
function animarTextoInsightTrip() {
    const limit = endPosition;

    if(endPosition < limit){
        return;
    }

    const text = document.querySelector('#insghtTrip-TextCover');
    const scrollY = window.scrollY;

    console.log(scrollY);

    let top = parseInt(window.getComputedStyle(text).top, 10);

    if (isNaN(top)) top = 0;

    if (scrollY > endPosition) {
        if (top < 300) {
            text.style.top = `${top + 100}px`;
        }
    } else {
        if (top >= 110){
            text.style.top = `${top - 100}px`;
        }
            
    }

    console.log("Aqui está o top", top);
    console.log("Aqui está o endPosition", endPosition)

    endPosition = scrollY;

}

//Função para troca de imagens de tempos em tempos
function inicializarTrocaDeImagens(tempoTroca) {

    const imageCover = document.getElementById('imageCover');
    const textCover = document.querySelector('#insghtTrip-TextCover');
    const listaImagens = ["siteInstitucional/imagens/insightTrip.svg", "siteInstitucional/imagens/imagemIndexPraia.png", "siteInstitucional/imagens/imagemIndexMontanha.png"]
    const navbar = document.querySelector('.navbar');
    const backgroundCover = document.querySelector('.background-cover');
    const areaNavbar = document.querySelector('.area-navbar.shadow')
    const imgLogo = document.querySelector('.img-logo-img')
    let posicaoImagem = 0;
    let intervalId = null;


    function changeImage() {

        console.log("Posição da tela: " + window.scrollY)


        imageCover.classList.add('fade-out');

        console.log(listaImagens[posicaoImagem])
        console.log(posicaoImagem)

        setTimeout(() => {
            posicaoImagem = (posicaoImagem + 1) % listaImagens.length;
            imageCover.src = listaImagens[posicaoImagem];

            if (posicaoImagem == 0) {
                textCover.classList.remove('third');
                imageCover.classList.remove('third');
                navbar.classList.remove('third');
                backgroundCover.classList.remove('third');
                areaNavbar.classList.remove('third')
                try{
                    imgLogo.src = "siteInstitucional/imagens/logo/imagemLogoCidade.png"
                }
                catch{
                    console.log("Erro ao mudar imagem");
                }
            }


            if (posicaoImagem == 1) {
                textCover.classList.add('second');
                imageCover.classList.add('second');
                navbar.classList.add('second');
                areaNavbar.classList.add('second');
                try{
                    imgLogo.src = "siteInstitucional/imagens/logo/imagemLogoMontanha.png"
                }
                catch{
                    console.log("Erro ao mudar imagem")
                }
                
                
            }

            if (posicaoImagem == 2) {

                textCover.classList.remove('second');
                imageCover.classList.remove('second');
                navbar.classList.remove('second')
                areaNavbar.classList.remove('second')

                textCover.classList.add('third');
                imageCover.classList.add('third');
                navbar.classList.add('third');
                areaNavbar.classList.add('third');

                backgroundCover.classList.add('third');

                try{
                    imgLogo.src = "siteInstitucional/imagens/logo/imagemLogoNeve.png"
                }
                catch{
                    console.log("Erro ao mudar imagem")
                }
            }

            imageCover.addEventListener('load', () => {
                imageCover.classList.remove('fade-out');
                imageCover.classList.add('fade-in');

                if (imageCover)

                    setTimeout(() => {
                        imageCover.classList.remove('fade-in');
                    }, 1000);
            })
        }, 1000);

    }

    function verificarVisibilidade() {
        const rect = imageCover.getBoundingClientRect();
        const estaVisivel = rect.top < window.innerHeight && rect.bottom >= 0;

        if (estaVisivel && !intervalId) {
            intervalId = setInterval(changeImage, tempoTroca);
        } else if (!estaVisivel && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    window.addEventListener('scroll', verificarVisibilidade);
    window.addEventListener('resize', verificarVisibilidade);

    verificarVisibilidade();


}

//Função para animação de aparecimento dos elementos da página
function animarElementos() {

}



// //Chamada das funções 
// window.addEventListener('scroll', function () {
//     adicionarSombraNaNavbar();
// });

document.addEventListener('scroll', animarTextoInsightTrip);

if (window.scrollY < 500) {
    document.addEventListener('DOMContentLoaded', () => inicializarTrocaDeImagens(5000));
}

document.addEventListener('scroll', animarElementos);