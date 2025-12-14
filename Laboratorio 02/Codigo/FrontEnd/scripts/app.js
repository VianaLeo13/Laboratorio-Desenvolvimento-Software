// Arquivo principal da aplicação
class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        // Configurar event listeners
        this.setupEventListeners();

        // Verificar autenticação
        if (authService.isAuthenticated()) {
            authService.updateUI();
        }

        // Mostrar página inicial
        this.showPage('home');
    }

    // Controlar visibilidade dos botões na home page baseado no estado de autenticação
    updateHomeButtonsVisibility() {
        const btnEntrar = document.getElementById('btn-entrar');
        const btnCadastrar = document.getElementById('btn-cadastrar');
        const btnCriarGestor = document.getElementById('btn-criar-gestor');
        const btnCadastrarVeiculo = document.getElementById('btn-cadastrar-veiculo');

        const user = authService.getCurrentUser();

        if (!user) {
            // Usuário deslogado - mostrar todos os botões
            if (btnEntrar) btnEntrar.style.display = 'inline-block';
            if (btnCadastrar) btnCadastrar.style.display = 'inline-block';
            if (btnCriarGestor) btnCriarGestor.style.display = 'inline-block';
            if (btnCadastrarVeiculo) btnCadastrarVeiculo.style.display = 'inline-block';
        } else if (user.role === 'CLIENTE') {
            // Usuário cliente logado - mostrar apenas entrar e cadastrar
            if (btnEntrar) btnEntrar.style.display = 'none';
            if (btnCadastrar) btnCadastrar.style.display = 'none';
            if (btnCriarGestor) btnCriarGestor.style.display = 'none';
            if (btnCadastrarVeiculo) btnCadastrarVeiculo.style.display = 'none';
        } else if (user.role === 'AGENTE') {
            // Usuário agente logado - mostrar apenas cadastrar veículo
            if (btnEntrar) btnEntrar.style.display = 'none';
            if (btnCadastrar) btnCadastrar.style.display = 'none';
            if (btnCriarGestor) btnCriarGestor.style.display = 'none';
            if (btnCadastrarVeiculo) btnCadastrarVeiculo.style.display = 'inline-block';
        } else if (user.role === 'ADMIN') {
            // Usuário admin logado - mostrar apenas cadastrar veículo
            if (btnEntrar) btnEntrar.style.display = 'none';
            if (btnCadastrar) btnCadastrar.style.display = 'none';
            if (btnCriarGestor) btnCriarGestor.style.display = 'none';
            if (btnCadastrarVeiculo) btnCadastrarVeiculo.style.display = 'inline-block';
        }
    }

    setupEventListeners() {
        // Event listeners para formulários
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        const perfilForm = document.getElementById('perfil-form');
        if (perfilForm) {
            perfilForm.addEventListener('submit', this.handlePerfilUpdate.bind(this));
        }

        const senhaForm = document.getElementById('senha-form');
        if (senhaForm) {
            senhaForm.addEventListener('submit', handleAlterarSenha);
        }
    }

    async showPage(pageName) {
        // Esconder todas as páginas
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.display = 'none';
        });

        // Mostrar página selecionada
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageName;

            // Carregar dados específicos da página
            await this.loadPageData(pageName);

            // Atualizar visibilidade dos botões na home page
            if (pageName === 'home') {
                this.updateHomeButtonsVisibility();
            }
        } else {
            console.error(`Página ${pageName} não encontrada`);
        }
    }

    async loadPageData(pageName) {
        try {
            switch (pageName) {
                case 'pedidos':
                    if (authService.isAuthenticated()) {
                        await pedidosService.carregarPedidos();
                    }
                    break;
                
                case 'avaliacao':
                    if (authService.hasRole('AGENTE') || authService.hasRole('ADMIN')) {
                        await pedidosService.carregarPedidos();
                    }
                    break;
                
                case 'admin':
                    if (authService.hasRole('ADMIN')) {
                        await adminService.carregarDados();
                        this.renderAdminDashboard();
                    }
                    break;
                
                case 'perfil':
                    if (authService.isAuthenticated()) {
                        await this.loadUserProfile();
                        // Carregar rendimentos se for cliente
                        if (authService.hasRole('CLIENTE')) {
                            const user = authService.getCurrentUser();
                            const clienteData = await apiService.obterUsuarioLogado(user.email);
                            if (clienteData && clienteData.id) {
                                await rendimentosService.carregarRendimentos(clienteData.id);
                            }
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error('Erro ao carregar dados da página:', error);
        }
    }

    async loadUserProfile() {
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                authService.showMessage('Usuário não encontrado. Faça login novamente.', 'warning');
                return;
            }

            console.log('Carregando perfil para:', user.email, 'Role:', user.role);

            // Obter dados completos do usuário
            const userData = await apiService.obterUsuarioLogado(user.email);
            
            console.log('Dados do usuário obtidos:', userData);

            if (userData) {
                // Preencher campos do formulário
                document.getElementById('perfil-nome').value = userData.nome || '';
                document.getElementById('perfil-email').value = userData.email || '';
                
                // Campos específicos por tipo de usuário
                if (userData.cpf) {
                    document.getElementById('perfil-cpf').value = userData.cpf;
                }
                if (userData.endereco) {
                    document.getElementById('perfil-endereco').value = userData.endereco;
                }
                if (userData.rg) {
                    document.getElementById('perfil-rg').value = userData.rg;
                }
                if (userData.profissao) {
                    document.getElementById('perfil-profissao').value = userData.profissao;
                }
                
                // Se for agente, mostrar campos específicos
                if (userData.tipo) {
                    const tipoField = document.getElementById('perfil-tipo');
                    if (tipoField) {
                        tipoField.value = userData.tipo;
                    }
                }
                
                // Definir função baseada no role
                const roleField = document.getElementById('perfil-role');
                if (roleField) {
                    if (user.role === 'ADMIN') {
                        roleField.value = 'Administrador';
                    } else if (user.role === 'AGENTE') {
                        roleField.value = 'Agente';
                    } else if (user.role === 'CLIENTE') {
                        roleField.value = 'Cliente';
                    } else {
                        roleField.value = user.role || 'Usuário';
                    }
                }
                
                // Status do usuário
                const statusField = document.getElementById('perfil-status');
                if (statusField) {
                    statusField.value = userData.ativo !== false ? 'Ativo' : 'Inativo';
                }
                
                authService.showMessage('Perfil carregado com sucesso!', 'success');
            } else {
                // Fallback: usar dados básicos do token
                this.loadBasicProfile(user);
                authService.showMessage('Dados básicos carregados. Algumas informações podem estar incompletas.', 'info');
            }
            
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            
            // Fallback em caso de erro
            const user = authService.getCurrentUser();
            if (user) {
                this.loadBasicProfile(user);
                authService.showMessage('Perfil carregado com dados básicos. Erro ao obter informações completas.', 'warning');
            } else {
                authService.showMessage('Erro ao carregar perfil: ' + error.message, 'danger');
            }
        }
    }

    loadBasicProfile(user) {
        document.getElementById('perfil-nome').value = user.email.split('@')[0] || '';
        document.getElementById('perfil-email').value = user.email || '';
        
        const roleField = document.getElementById('perfil-role');
        if (roleField) {
            if (user.role === 'ADMIN') {
                roleField.value = 'Administrador';
            } else if (user.role === 'AGENTE') {
                roleField.value = 'Agente';
            } else if (user.role === 'CLIENTE') {
                roleField.value = 'Cliente';
            } else {
                roleField.value = user.role || 'Usuário';
            }
        }
        
        const statusField = document.getElementById('perfil-status');
        if (statusField) {
            statusField.value = 'Ativo';
        }
    }

    async handlePerfilUpdate(event) {
        event.preventDefault();
        
        const nome = document.getElementById('perfil-nome').value;
        const endereco = document.getElementById('perfil-endereco').value;
        const email = document.getElementById('perfil-email').value;

        // Validações básicas
        if (!nome.trim()) {
            authService.showMessage('Por favor, insira seu nome.', 'warning');
            return;
        }

        if (!endereco.trim()) {
            authService.showMessage('Por favor, insira seu endereço.', 'warning');
            return;
        }

        if (!authService.validateEmail(email)) {
            authService.showMessage('Por favor, insira um email válido.', 'warning');
            return;
        }

        try {
            // Em uma implementação real, atualizaríamos os dados do usuário
            authService.showMessage('Perfil atualizado com sucesso!', 'success');
        } catch (error) {
            authService.showMessage('Erro ao atualizar perfil: ' + error.message, 'danger');
        }
    }

    renderAdminDashboard() {
        const container = document.getElementById('admin-page');
        if (!container) return;

        // Criar conteúdo dinâmico para administração
        const adminContent = `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stats-card">
                        <h3>${adminService.clientes.length}</h3>
                        <p>Clientes</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h3>${adminService.automoveis.length}</h3>
                        <p>Veículos</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h3>${adminService.agentes.length}</h3>
                        <p>Agentes</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card">
                        <h3>${adminService.admins.length}</h3>
                        <p>Administradores</p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-users"></i> Clientes</h5>
                        </div>
                        <div class="card-body" id="admin-clientes-content">
                            ${this.renderClientesPreview()}
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary w-100" onclick="app.showAdminSection('clientes')">
                                Gerenciar Clientes
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-car"></i> Veículos</h5>
                        </div>
                        <div class="card-body" id="admin-veiculos-content">
                            ${this.renderAutomoveisPreview()}
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-success w-100" onclick="app.showAdminSection('veiculos')">
                                Gerenciar Veículos
                            </button>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="fas fa-building"></i> Agentes</h5>
                        </div>
                        <div class="card-body" id="admin-agentes-content">
                            ${this.renderAgentesPreview()}
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-warning w-100" onclick="app.showAdminSection('agentes')">
                                Gerenciar Agentes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = adminContent;
    }

    renderClientesPreview() {
        if (adminService.clientes.length === 0) {
            return '<p class="text-muted">Nenhum cliente cadastrado.</p>';
        }

        const recentClientes = adminService.clientes.slice(0, 3);
        return recentClientes.map(cliente => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${cliente.nome}</span>
                <small class="text-muted">${cliente.email}</small>
            </div>
        `).join('');
    }

    renderAutomoveisPreview() {
        if (adminService.automoveis.length === 0) {
            return '<p class="text-muted">Nenhum veículo cadastrado.</p>';
        }

        const recentAutomoveis = adminService.automoveis.slice(0, 3);
        return recentAutomoveis.map(automovel => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${automovel.marca} ${automovel.modelo}</span>
                <small class="text-muted">${automovel.placa}</small>
            </div>
        `).join('');
    }

    renderAgentesPreview() {
        if (adminService.agentes.length === 0) {
            return '<p class="text-muted">Nenhum agente cadastrado.</p>';
        }

        const recentAgentes = adminService.agentes.slice(0, 3);
        return recentAgentes.map(agente => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${agente.nome}</span>
                <small class="text-muted">${agente.tipo}</small>
            </div>
        `).join('');
    }

    async showAdminSection(section) {
        const container = document.getElementById('admin-page');
        
        let content = '';
        let title = '';

        switch (section) {
            case 'clientes':
                title = 'Gerenciar Clientes';
                adminService.renderClientes();
                content = document.getElementById('admin-clientes-content').innerHTML;
                break;
            
            case 'veiculos':
                title = 'Gerenciar Veículos';
                adminService.renderAutomoveis();
                content = document.getElementById('admin-veiculos-content').innerHTML;
                break;
            
            case 'agentes':
                title = 'Gerenciar Agentes';
                adminService.renderAgentes();
                content = document.getElementById('admin-agentes-content').innerHTML;
                break;
        }

        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="fas fa-cog"></i> ${title}</h2>
                <button class="btn btn-outline-secondary" onclick="app.renderAdminDashboard()">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
            </div>
            ${content}
        `;
    }
}

// Função global para mostrar páginas
function showPage(pageName) {
    app.showPage(pageName);
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar verificação de conectividade
    await apiService.initialize();
    
    // Inicializar aplicação
    window.app = new App();
});

// Funções utilitárias globais
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Configurações globais
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080',
    APP_NAME: 'Sistema de Aluguel de Veículos',
    VERSION: '1.0.0'
};

// Exportar configurações para uso em outros módulos
window.CONFIG = CONFIG;
