// Módulo de autenticação
class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Verificar se há um usuário logado ao carregar a página
        const userData = localStorage.getItem('user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }

        // Atualizar visibilidade dos botões na home page
        if (window.app && window.app.updateHomeButtonsVisibility) {
            window.app.updateHomeButtonsVisibility();
        }
    }

    async login(email, password) {
        try {
            const response = await apiService.login(email, password);
            this.currentUser = {
                email: response.username,
                role: response.role
            };

            this.updateUI();
            // Atualizar visibilidade dos botões na home page
            if (window.app && window.app.updateHomeButtonsVisibility) {
                window.app.updateHomeButtonsVisibility();
            }
            this.showMessage('Login realizado com sucesso!', 'success');
            return true;
        } catch (error) {
            this.showMessage('Erro ao fazer login: ' + error.message, 'danger');
            return false;
        }
    }

    async loginAgente(email, password) {
        try {
            const response = await apiService.loginAgente(email, password);
            this.currentUser = {
                email: response.email,
                role: 'AGENTE',
                id: response.id,
                nome: response.nome,
                tipoAgente: response.tipoAgente
            };

            this.updateUI();
            // Atualizar visibilidade dos botões na home page
            if (window.app && window.app.updateHomeButtonsVisibility) {
                window.app.updateHomeButtonsVisibility();
            }
            this.showMessage(`Login realizado com sucesso! Bem-vindo, ${response.nome}`, 'success');
            return true;
        } catch (error) {
            this.showMessage('Erro ao fazer login: ' + error.message, 'danger');
            return false;
        }
    }

    async register(clienteData) {
        try {
            await apiService.cadastrarCliente(clienteData);
            this.showMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
            return true;
        } catch (error) {
            this.showMessage('Erro ao cadastrar: ' + error.message, 'danger');
            return false;
        }
    }

    async registerComRendimento(clienteData) {
        try {
            await apiService.cadastrarClienteComRendimento(clienteData);
            let mensagem = 'Cadastro realizado com sucesso!';
            if (clienteData.empresa && clienteData.salario) {
                mensagem += ' Rendimento inicial também foi cadastrado.';
            }
            mensagem += ' Faça login para continuar.';
            this.showMessage(mensagem, 'success');
            return true;
        } catch (error) {
            this.showMessage('Erro ao cadastrar: ' + error.message, 'danger');
            return false;
        }
    }

    async alterarSenha(email, novaSenha) {
        try {
            await apiService.alterarSenha(email, novaSenha);
            this.showMessage('Senha alterada com sucesso!', 'success');
            return true;
        } catch (error) {
            this.showMessage('Erro ao alterar senha: ' + error.message, 'danger');
            return false;
        }
    }

    logout() {
        apiService.logout();
        this.currentUser = null;
        this.updateUI();
        // Atualizar visibilidade dos botões na home page
        if (window.app && window.app.updateHomeButtonsVisibility) {
            window.app.updateHomeButtonsVisibility();
        }
        this.showMessage('Logout realizado com sucesso!', 'info');
        showPage('home');
    }

    updateUI() {
        const navLogin = document.getElementById('nav-login');
        const navUser = document.getElementById('nav-user');
        const navPedidos = document.getElementById('nav-pedidos');
        const navAvaliacao = document.getElementById('nav-avaliacao');
        const navAdmin = document.getElementById('nav-admin');
        const userName = document.getElementById('user-name');

        if (this.currentUser) {
            // Usuário logado
            if (navLogin) navLogin.style.display = 'none';
            if (navUser) navUser.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.email;

            // Mostrar menus baseado no tipo de usuário
            const navGestor = document.getElementById('nav-gestor');
            const quickAccess = document.getElementById('quick-access');
            
            if (this.currentUser.role === 'CLIENTE') {
                navPedidos.style.display = 'block';
                navAvaliacao.style.display = 'none';
                navAdmin.style.display = 'none';
                navGestor.style.display = 'none';
                if (quickAccess) quickAccess.style.display = 'none';
            } else if (this.currentUser.role === 'AGENTE') {
                navPedidos.style.display = 'none';
                navAvaliacao.style.display = 'block';
                navAdmin.style.display = 'none';
                navGestor.style.display = 'none';
                if (quickAccess) quickAccess.style.display = 'none';
            } else if (this.currentUser.role === 'ADMIN') {
                navPedidos.style.display = 'none';
                navAvaliacao.style.display = 'block';
                navAdmin.style.display = 'block';
                navGestor.style.display = 'block';
                if (quickAccess) quickAccess.style.display = 'block';
            }
        } else {
            // Usuário não logado
            if (navLogin) navLogin.style.display = 'block';
            if (navUser) navUser.style.display = 'none';
            if (navPedidos) navPedidos.style.display = 'none';
            if (navAvaliacao) navAvaliacao.style.display = 'none';
            if (navAdmin) navAdmin.style.display = 'none';
            const navGestor = document.getElementById('nav-gestor');
            if (navGestor) navGestor.style.display = 'none';
            const quickAccess = document.getElementById('quick-access');
            if (quickAccess) quickAccess.style.display = 'none';
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    showMessage(message, type = 'info') {
        // Criar elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Inserir no topo da página
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Métodos para validação de formulários
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateCPF(cpf) {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação do algoritmo do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    validatePassword(password) {
        // Senha deve ter pelo menos 6 caracteres
        return password.length >= 6;
    }

    formatCPF(cpf) {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/[^\d]/g, '');
        
        // Aplica máscara
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
}

// Instância global do serviço de autenticação
window.authService = new AuthService();

// Funções globais para uso nos formulários
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isAgente = document.getElementById('login-agente').checked;
    
    if (!authService.validateEmail(email)) {
        authService.showMessage('Por favor, insira um email válido.', 'warning');
        return;
    }
    
    if (!authService.validatePassword(password)) {
        authService.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    
    let success;
    if (isAgente) {
        success = await authService.loginAgente(email, password);
    } else {
        success = await authService.login(email, password);
    }
    
    if (success) {
        showPage('home');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const nome = document.getElementById('reg-nome').value;
    const cpf = document.getElementById('reg-cpf').value;
    const endereco = document.getElementById('reg-endereco').value;
    const rg = document.getElementById('reg-rg').value;
    const profissao = document.getElementById('reg-profissao').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const empresa = document.getElementById('reg-empresa').value;
    const salario = document.getElementById('reg-salario').value;
    
    // Validações obrigatórias
    if (!nome.trim()) {
        authService.showMessage('Por favor, insira seu nome completo.', 'warning');
        return;
    }
    
    if (!authService.validateCPF(cpf)) {
        authService.showMessage('Por favor, insira um CPF válido.', 'warning');
        return;
    }
    
    if (!endereco.trim()) {
        authService.showMessage('Por favor, insira seu endereço.', 'warning');
        return;
    }
    
    if (!rg.trim()) {
        authService.showMessage('Por favor, insira seu RG.', 'warning');
        return;
    }
    
    if (!profissao.trim()) {
        authService.showMessage('Por favor, insira sua profissão.', 'warning');
        return;
    }
    
    if (!authService.validateEmail(email)) {
        authService.showMessage('Por favor, insira um email válido.', 'warning');
        return;
    }
    
    if (!authService.validatePassword(password)) {
        authService.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    
    const clienteData = {
        nome: nome.trim(),
        cpf: authService.formatCPF(cpf),
        endereco: endereco.trim(),
        rg: rg.trim(),
        profissao: profissao.trim(),
        email: email.trim(),
        password: password
    };
    
    // Adicionar rendimento se foi fornecido
    if (empresa.trim() && salario && parseFloat(salario) > 0) {
        clienteData.empresa = empresa.trim();
        clienteData.salario = parseFloat(salario);
    }
    
    const success = await authService.registerComRendimento(clienteData);
    if (success) {
        showPage('login');
        // Limpar formulário
        document.getElementById('register-form').reset();
    }
}

async function handleAlterarSenha(event) {
    event.preventDefault();
    
    const email = authService.getCurrentUser().email;
    const novaSenha = document.getElementById('nova-senha').value;
    
    if (!authService.validatePassword(novaSenha)) {
        authService.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    
    const success = await authService.alterarSenha(email, novaSenha);
    if (success) {
        document.getElementById('senha-form').reset();
    }
}

function logout() {
    authService.logout();
}

// Aplicar máscara de CPF
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('reg-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
});
