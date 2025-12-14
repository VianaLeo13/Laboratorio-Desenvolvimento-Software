// Script específico para a página de administração
class AdminPage {
    constructor() {
        this.clientes = [];
        this.automoveis = [];
        this.agentes = [];
        this.pedidos = [];
        this.init();
    }

    async init() {
        // Verificar se o usuário é admin
        if (!authService.hasRole('ADMIN')) {
            window.location.href = 'index.html';
            return;
        }

        // Carregar dados iniciais
        await this.carregarDados();
        this.atualizarEstatisticas();
        this.renderClientes();
        this.renderAutomoveis();
        this.renderAgentes();
        this.carregarTodosPedidos();
    }

    async carregarDados() {
        try {
            await Promise.all([
                this.carregarClientes(),
                this.carregarAutomoveis(),
                this.carregarAgentes()
            ]);
        } catch (error) {
            authService.showMessage('Erro ao carregar dados: ' + error.message, 'danger');
        }
    }

    async carregarClientes() {
        try {
            this.clientes = await apiService.listarClientes();
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    async carregarAutomoveis() {
        try {
            this.automoveis = await apiService.listarAutomoveis();
        } catch (error) {
            console.error('Erro ao carregar automóveis:', error);
        }
    }

    async carregarAgentes() {
        try {
            this.agentes = await apiService.listarAgentes();
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
        }
    }

    async carregarTodosPedidos() {
        try {
            // Usar o novo endpoint que retorna todos os pedidos de uma vez
            this.pedidos = await apiService.listarTodosPedidos();
            this.renderPedidos();
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    }

    atualizarEstatisticas() {
        document.getElementById('total-clientes').textContent = this.clientes.length;
        document.getElementById('total-veiculos').textContent = this.automoveis.length;
        document.getElementById('total-agentes').textContent = this.agentes.length;
        document.getElementById('total-pedidos').textContent = this.pedidos.length;
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cadastrando...
            `;
        } else {
            button.disabled = false;
            button.innerHTML = `
                <i class="fas fa-save"></i> Cadastrar Veículo
            `;
        }
    }

    renderClientes() {
        const container = document.getElementById('clientes-list');
        if (!container) return;

        if (this.clientes.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum cliente encontrado.
                </div>
            `;
            return;
        }

        const clientesHTML = this.clientes.map(cliente => this.createClienteCard(cliente)).join('');
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Email</th>
                            <th>Endereço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.clientes.map(cliente => `
                            <tr>
                                <td>${cliente.id}</td>
                                <td>${cliente.nome}</td>
                                <td>${cliente.cpf}</td>
                                <td>${cliente.email}</td>
                                <td>${cliente.endereco}</td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-primary btn-sm" onclick="adminPage.editarCliente(${cliente.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm" onclick="adminPage.deletarCliente(${cliente.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderAutomoveis() {
        const container = document.getElementById('veiculos-list');
        if (!container) return;

        if (this.automoveis.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum veículo encontrado.
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Ano</th>
                            <th>Placa</th>
                            <th>Matrícula</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.automoveis.map(automovel => `
                            <tr>
                                <td>${automovel.id}</td>
                                <td>${automovel.marca}</td>
                                <td>${automovel.modelo}</td>
                                <td>${automovel.ano}</td>
                                <td>${automovel.placa}</td>
                                <td>${automovel.matricula}</td>
                                <td>
                                    <span class="badge bg-${this.getTipoBadgeClass(automovel.tipoPropriedade)}">
                                        ${automovel.tipoPropriedade || 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-primary btn-sm" onclick="adminPage.editarAutomovel(${automovel.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm" onclick="adminPage.deletarAutomovel(${automovel.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderAgentes() {
        const container = document.getElementById('agentes-list');
        if (!container) return;

        if (this.agentes.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum agente encontrado.
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.agentes.map(agente => `
                            <tr>
                                <td>${agente.id}</td>
                                <td>${agente.nome}</td>
                                <td>${agente.email}</td>
                                <td>
                                    <span class="badge bg-${agente.tipo === 'BANCO' ? 'success' : 'info'}">
                                        ${agente.tipo}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-${agente.ativo ? 'success' : 'secondary'}">
                                        ${agente.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-primary btn-sm" onclick="adminPage.editarAgente(${agente.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderPedidos() {
        const container = document.getElementById('pedidos-list');
        if (!container) return;

        if (this.pedidos.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum pedido encontrado.
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente ID</th>
                            <th>Veículo ID</th>
                            <th>Status</th>
                            <th>Data Criação</th>
                            <th>Contrato Crédito</th>
                            <th>Banco</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.pedidos.map(pedido => `
                            <tr>
                                <td>${pedido.id}</td>
                                <td>${pedido.clienteId}</td>
                                <td>${pedido.automovelId}</td>
                                <td>
                                    <span class="status-badge status-${pedidosService.getStatusClass(pedido.status).toLowerCase()}">
                                        ${pedidosService.getStatusText(pedido.status)}
                                    </span>
                                </td>
                                <td>${formatDate(pedido.dataCriacao)}</td>
                                <td>${pedido.possuiContratoCredito ? 'Sim' : 'Não'}</td>
                                <td>${pedido.bancoContrato || 'N/A'}</td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <button class="btn btn-outline-info btn-sm" onclick="adminPage.verDetalhesPedido(${pedido.id})">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getTipoBadgeClass(tipo) {
        const tipoMap = {
            'CLIENTE': 'primary',
            'EMPRESA': 'warning',
            'BANCO': 'success'
        };
        return tipoMap[tipo] || 'secondary';
    }

    // Métodos de CRUD para Clientes
    async criarCliente() {
        const nome = document.getElementById('cliente-nome').value;
        const cpf = document.getElementById('cliente-cpf').value;
        const endereco = document.getElementById('cliente-endereco').value;
        const email = document.getElementById('cliente-email').value;
        const senha = document.getElementById('cliente-senha').value;

        // Validações
        if (!nome.trim()) {
            authService.showMessage('Por favor, insira o nome do cliente.', 'warning');
            return;
        }

        if (!authService.validateCPF(cpf)) {
            authService.showMessage('Por favor, insira um CPF válido.', 'warning');
            return;
        }

        if (!endereco.trim()) {
            authService.showMessage('Por favor, insira o endereço do cliente.', 'warning');
            return;
        }

        if (!authService.validateEmail(email)) {
            authService.showMessage('Por favor, insira um email válido.', 'warning');
            return;
        }

        if (!authService.validatePassword(senha)) {
            authService.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }

        try {
            const clienteData = {
                nome: nome.trim(),
                cpf: authService.formatCPF(cpf),
                endereco: endereco.trim(),
                email: email.trim(),
                password: senha
            };

            await apiService.cadastrarCliente(clienteData);
            authService.showMessage('Cliente criado com sucesso!', 'success');
            
            // Fechar modal e recarregar dados
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoClienteModal'));
            modal.hide();
            
            document.getElementById('novo-cliente-form').reset();
            await this.carregarClientes();
            this.renderClientes();
            this.atualizarEstatisticas();
        } catch (error) {
            authService.showMessage('Erro ao criar cliente: ' + error.message, 'danger');
        }
    }

    async deletarCliente(id) {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) {
            return;
        }

        try {
            await apiService.deletarCliente(id);
            authService.showMessage('Cliente excluído com sucesso!', 'success');
            await this.carregarClientes();
            this.renderClientes();
            this.atualizarEstatisticas();
        } catch (error) {
            authService.showMessage('Erro ao excluir cliente: ' + error.message, 'danger');
        }
    }

    editarCliente(id) {
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
    }

    // Métodos de CRUD para Automóveis
    async criarVeiculo() {
        // Prevenir duplo envio
        const submitButton = document.querySelector('#novo-veiculo-form button[type="submit"]');
        if (submitButton && submitButton.disabled) {
            return; // Já está processando
        }

        const placa = document.getElementById('veiculo-placa').value;
        const matricula = document.getElementById('veiculo-matricula').value;
        const ano = document.getElementById('veiculo-ano').value;
        const marca = document.getElementById('veiculo-marca').value;
        const modelo = document.getElementById('veiculo-modelo').value;
        const tipo = document.getElementById('veiculo-tipo').value;

        // Validações
        if (!placa.trim()) {
            authService.showMessage('Por favor, insira a placa do veículo.', 'warning');
            return;
        }

        if (!matricula.trim()) {
            authService.showMessage('Por favor, insira a matrícula do veículo.', 'warning');
            return;
        }

        if (!ano || parseInt(ano) < 1900 || parseInt(ano) > new Date().getFullYear() + 1) {
            authService.showMessage('Por favor, insira um ano válido.', 'warning');
            return;
        }

        if (!marca.trim()) {
            authService.showMessage('Por favor, insira a marca do veículo.', 'warning');
            return;
        }

        if (!modelo.trim()) {
            authService.showMessage('Por favor, insira o modelo do veículo.', 'warning');
            return;
        }

        // Desabilitar botão e mostrar loading
        if (submitButton) {
            this.setButtonLoading(submitButton, true);
        }

        try {
            const automovelData = {
                placa: placa.trim(),
                matricula: matricula.trim(),
                ano: parseInt(ano),
                marca: marca.trim(),
                modelo: modelo.trim(),
                tipoPropriedade: tipo
            };

            await apiService.criarAutomovel(automovelData);
            authService.showMessage('Veículo criado com sucesso!', 'success');
            
            // Fechar modal e recarregar dados
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoVeiculoModal'));
            modal.hide();
            
            document.getElementById('novo-veiculo-form').reset();
            await this.carregarAutomoveis();
            this.renderAutomoveis();
            this.atualizarEstatisticas();
        } catch (error) {
            // Verificar se é erro de placa duplicada
            if (error.message.includes('Duplicate entry') && error.message.includes('placa')) {
                authService.showMessage('Esta placa já está cadastrada no sistema. Por favor, use uma placa diferente.', 'warning');
            } else {
                authService.showMessage('Erro ao criar veículo: ' + error.message, 'danger');
            }
        } finally {
            // Reabilitar botão
            if (submitButton) {
                this.setButtonLoading(submitButton, false);
            }
        }
    }

    async deletarAutomovel(id) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) {
            return;
        }

        try {
            await apiService.deletarAutomovel(id);
            authService.showMessage('Veículo excluído com sucesso!', 'success');
            await this.carregarAutomoveis();
            this.renderAutomoveis();
            this.atualizarEstatisticas();
        } catch (error) {
            authService.showMessage('Erro ao excluir veículo: ' + error.message, 'danger');
        }
    }

    editarAutomovel(id) {
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
    }

    // Métodos de CRUD para Agentes
    async criarAgente() {
        const nome = document.getElementById('agente-nome').value;
        const cnpj = document.getElementById('agente-cnpj').value;
        const endereco = document.getElementById('agente-endereco').value;
        const telefone = document.getElementById('agente-telefone').value;
        const email = document.getElementById('agente-email').value;
        const senha = document.getElementById('agente-senha').value;
        const tipo = document.getElementById('agente-tipo').value;

        // Validações
        if (!nome.trim()) {
            authService.showMessage('Por favor, insira o nome do agente.', 'warning');
            return;
        }

        if (!cnpj.trim()) {
            authService.showMessage('Por favor, insira o CNPJ.', 'warning');
            return;
        }

        if (!endereco.trim()) {
            authService.showMessage('Por favor, insira o endereço.', 'warning');
            return;
        }

        if (!telefone.trim()) {
            authService.showMessage('Por favor, insira o telefone.', 'warning');
            return;
        }

        if (!authService.validateEmail(email)) {
            authService.showMessage('Por favor, insira um email válido.', 'warning');
            return;
        }

        if (!authService.validatePassword(senha)) {
            authService.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
            return;
        }

        if (!tipo) {
            authService.showMessage('Por favor, selecione o tipo do gestor.', 'warning');
            return;
        }

        try {
            const agenteData = {
                nome: nome.trim(),
                cnpj: cnpj.trim(),
                endereco: endereco.trim(),
                telefone: telefone.trim(),
                email: email.trim(),
                password: senha,
                tipoAgente: tipo,
                ativo: true
            };

            await apiService.cadastrarAgente(agenteData);
            authService.showMessage(`Gestor ${tipo} criado com sucesso!`, 'success');
            
            // Fechar modal e recarregar dados
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoAgenteModal'));
            modal.hide();
            
            document.getElementById('novo-agente-form').reset();
            await this.carregarAgentes();
            this.renderAgentes();
            this.atualizarEstatisticas();
        } catch (error) {
            authService.showMessage('Erro ao criar gestor: ' + error.message, 'danger');
        }
    }

    editarAgente(id) {
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
    }

    verDetalhesPedido(id) {
        authService.showMessage('Funcionalidade de detalhes será implementada em breve.', 'info');
    }
}

// Funções globais para uso nos modais
function showNovoClienteModal() {
    const modal = new bootstrap.Modal(document.getElementById('novoClienteModal'));
    modal.show();
}

function showNovoVeiculoModal() {
    const modal = new bootstrap.Modal(document.getElementById('novoVeiculoModal'));
    modal.show();
}

function showNovoAgenteModal() {
    const modal = new bootstrap.Modal(document.getElementById('novoAgenteModal'));
    modal.show();
}

function criarCliente() {
    adminPage.criarCliente();
}

function criarVeiculo() {
    adminPage.criarVeiculo();
}

function criarAgente() {
    adminPage.criarAgente();
}

function carregarTodosPedidos() {
    adminPage.carregarTodosPedidos();
}

function filtrarPedidos() {
    const status = document.getElementById('filtro-status').value;
    // Implementar filtro de pedidos
    authService.showMessage('Funcionalidade de filtro será implementada em breve.', 'info');
}

// Inicializar página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.adminPage = new AdminPage();
});

// Aplicar máscaras nos formulários
document.addEventListener('DOMContentLoaded', function() {
    // Máscara de CPF
    const cpfInput = document.getElementById('cliente-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Máscara de placa
    const placaInput = document.getElementById('veiculo-placa');
    if (placaInput) {
        placaInput.addEventListener('input', function(e) {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.length > 3) {
                value = value.substring(0, 3) + '-' + value.substring(3, 7);
            }
            e.target.value = value;
        });
    }
});
