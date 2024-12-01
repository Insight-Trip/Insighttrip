document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuSidebar = document.querySelector('.menu-sidebar');
    const navCards = document.querySelectorAll('.card-navbar');

    //Função para alternar o estado da sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('retracted');
    }

    // Event listener para o botão de toggle
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Código existente para os cards da navbar
    navCards.forEach(card => {
        card.addEventListener('click', function () {
            navCards.forEach(c => c.classList.remove('activate'));
            this.classList.add('activate');
            menuSidebar.className = 'menu-sidebar';
            const cardClass = this.classList[1].replace('navbar-card-', '');
            menuSidebar.classList.add(`select-${cardClass}`);
            console.log(cardClass)

            // Se a sidebar estiver retraída, expanda-a ao clicar em um card
            if (sidebar.classList.contains('retracted')) {
                toggleSidebar();
            }

            // Redireciona para a página correspondente após a animação
            setTimeout(() => {
                switch (cardClass) {
                    case 'funcionarios':
                        window.location.href = '../telaAdmin/telaAdmin.html';
                        break;
                    case 'ia':
                        window.location.href = '../dummont/dummont.html';
                        break;
                    case 'buscar-destinos':
                        window.location.href = '../telaProcura/telaProcura.html';
                        break;
                    case 'dashboard':
                        window.location.href = "../dashboard/dashboard.html";
                        break;
                    default:
                        console.log('Página não encontrada');
                }
            }, 300); // Aguarda 300ms para a animação completar
        });
    });


    // Iniciar com a sidebar retraída
    // sidebar.classList.add('retracted');
});