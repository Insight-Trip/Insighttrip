// Função para detectar e aplicar o tema
function detectionColor() {
    let theme = localStorage.getItem("theme") || "light"; // Padrão é light se não houver tema salvo

    // Se o sistema está configurado para tema escuro e nenhum tema estiver salvo
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && !localStorage.getItem("theme")) {
        theme = "dark"; // O tema vai ser escuro se for o padrão do sistema
    }

    applyTheme(theme);
}

// Função para aplicar o tema
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    // 
}

// Função para alternar o tema
function switchTheme(e) {
    const newTheme = e.target.checked ? "light" : "dark";
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

// Função para mudar o tema a partir do console
window.changeTheme = function (themeName) {
    const validThemes = ['light', 'dark', 'frio', 'sao-paulo', 'amazonas', 'tropical', 'profissional', 'github', 'notion', 'youtube', 'daltonico', 'yana', 'cactus', 'lavender-to']; // Temas válidos

    if (validThemes.includes(themeName)) {
        localStorage.setItem('theme', themeName); // Armazena a escolha no localStorage
        applyTheme(themeName); // Aplica o tema escolhido
        console.log(`Tema alterado para: ${themeName}`);
    } else {
        console.error(`Tema inválido. Escolha entre: ${validThemes.join(', ')}`);
    }
};

// Seleciona o checkbox
// const toggleSwitch = document.querySelector('#theme-switch input[type="checkbox"]');

// // Adiciona o evento de mudança ao checkbox
// toggleSwitch.addEventListener('change', switchTheme);

// Inicializa o tema
detectionColor();

// Pre-check the dark-theme checkbox if dark-theme is set
// if (document.documentElement.getAttribute("data-theme") === "light") {
//     toggleSwitch.checked = true;
// }



//Abaixo se encontra a função para injeção de parametros na url para seleção da dashboard correta






// constructUrlDashboard(parametrosTeste)


