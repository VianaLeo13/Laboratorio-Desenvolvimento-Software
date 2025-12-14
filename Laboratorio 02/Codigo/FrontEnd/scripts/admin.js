// Módulo de administração
class AdminService {
    constructor() {
        this.clientes = [];
        this.automoveis = [];
        this.agentes = [];
        this.admins = [];
    }

    async carregarDados() {
        try {
            await Promise.all([
                this.carregarClientes(),
                this.carregarAutomoveis(),
                this.carregarAgentes(),
                this.carregarAdmins()
            ]);
        } catch (error) {
            authService.showMessage('Erro ao carregar dados administrativos: ' + error.message, 'danger');
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

    async carregarAdmins() {
        try {
            this.admins = await apiService.listarAdmins();
        } catch (error) {
            console.error('Erro ao carregar administradores:', error);
        }
    }

    // Gestão de Clientes
    renderClientes() {
        const container = document.getElementById('admin-clientes-content');
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
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Clientes (${this.clientes.length})</h4>
                <button class="btn btn-primary" onclick="adminService.showNovoClienteModal()">
                    <i class="fas fa-plus"></i> Novo Cliente
                </button>
            </div>
            <div class="row">
                ${clientesHTML}
            </div>
        `;
    }

    createClienteCard(cliente) {
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${cliente.nome}</h5>
                        <p class="card-text">
                            <strong>CPF:</strong> ${cliente.cpf}<br>
                            <strong>Email:</strong> ${cliente.email}<br>
                            <strong>Endereço:</strong> ${cliente.endereco}
                        </p>
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="adminService.editarCliente(${cliente.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="adminService.deletarCliente(${cliente.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Gestão de Automóveis
    renderAutomoveis() {
        const container = document.getElementById('admin-veiculos-content');
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

        const automoveisHTML = this.automoveis.map(automovel => this.createAutomovelCard(automovel)).join('');
        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Veículos (${this.automoveis.length})</h4>
                <button class="btn btn-success" onclick="adminService.showNovoAutomovelModal()">
                    <i class="fas fa-plus"></i> Novo Veículo
                </button>
            </div>
            <div class="row">
                ${automoveisHTML}
            </div>
        `;
    }

    createAutomovelCard(automovel) {
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${automovel.marca} ${automovel.modelo}</h5>
                        <p class="card-text">
                            <strong>Ano:</strong> ${automovel.ano}<br>
                            <strong>Placa:</strong> ${automovel.placa}<br>
                            <strong>Matrícula:</strong> ${automovel.matricula}<br>
                            <strong>Tipo:</strong> ${automovel.tipoPropriedade || 'N/A'}
                        </p>
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="adminService.editarAutomovel(${automovel.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="adminService.deletarAutomovel(${automovel.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Gestão de Agentes
    renderAgentes() {
        const container = document.getElementById('admin-agentes-content');
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

        const agentesHTML = this.agentes.map(agente => this.createAgenteCard(agente)).join('');
        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Agentes (${this.agentes.length})</h4>
                <button class="btn btn-warning" onclick="adminService.showNovoAgenteModal()">
                    <i class="fas fa-plus"></i> Novo Agente
                </button>
            </div>
            <div class="row">
                ${agentesHTML}
            </div>
        `;
    }

    createAgenteCard(agente) {
        const tipoClass = agente.tipo === 'BANCO' ? 'success' : 'info';
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${agente.nome}</h5>
                        <p class="card-text">
                            <strong>Tipo:</strong> 
                            <span class="badge bg-${tipoClass}">${agente.tipo}</span><br>
                            <strong>Email:</strong> ${agente.email}<br>
                            <strong>Status:</strong> 
                            <span class="badge bg-${agente.ativo ? 'success' : 'secondary'}">
                                ${agente.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </p>
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="adminService.editarAgente(${agente.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Métodos de CRUD para Clientes
    async criarCliente(clienteData) {
        try {
            await apiService.cadastrarCliente(clienteData);
            authService.showMessage('Cliente criado com sucesso!', 'success');
            await this.carregarClientes();
            this.renderClientes();
        } catch (error) {
            authService.showMessage('Erro ao criar cliente: ' + error.message, 'danger');
        }
    }

    async editarCliente(id) {
        // Implementar modal de edição
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
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
        } catch (error) {
            authService.showMessage('Erro ao excluir cliente: ' + error.message, 'danger');
        }
    }

    // Métodos de CRUD para Automóveis
    async criarAutomovel(automovelData) {
        try {
            await apiService.criarAutomovel(automovelData);
            authService.showMessage('Veículo criado com sucesso!', 'success');
            await this.carregarAutomoveis();
            this.renderAutomoveis();
        } catch (error) {
            authService.showMessage('Erro ao criar veículo: ' + error.message, 'danger');
        }
    }

    async editarAutomovel(id) {
        // Implementar modal de edição
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
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
        } catch (error) {
            authService.showMessage('Erro ao excluir veículo: ' + error.message, 'danger');
        }
    }

    // Métodos de CRUD para Agentes
    async criarAgente(agenteData) {
        try {
            await apiService.cadastrarAgente(agenteData);
            authService.showMessage('Agente criado com sucesso!', 'success');
            await this.carregarAgentes();
            this.renderAgentes();
        } catch (error) {
            authService.showMessage('Erro ao criar agente: ' + error.message, 'danger');
        }
    }

    async editarAgente(id) {
        // Implementar modal de edição
        authService.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
    }

    // Métodos para mostrar modais (implementação básica)
    showNovoClienteModal() {
        const nome = prompt('Nome do cliente:');
        const cpf = prompt('CPF do cliente:');
        const endereco = prompt('Endereço do cliente:');
        const email = prompt('Email do cliente:');
        const password = prompt('Senha do cliente:');

        if (nome && cpf && endereco && email && password) {
            const clienteData = {
                nome: nome.trim(),
                cpf: authService.formatCPF(cpf),
                endereco: endereco.trim(),
                email: email.trim(),
                password: password
            };

            this.criarCliente(clienteData);
        }
    }

    showNovoAutomovelModal() {
        const placa = prompt('Placa do veículo:');
        const matricula = prompt('Matrícula do veículo:');
        const ano = prompt('Ano do veículo:');
        const marca = prompt('Marca do veículo:');
        const modelo = prompt('Modelo do veículo:');
        const tipoPropriedade = prompt('Tipo de propriedade (CLIENTE/EMPRESA/BANCO):');

        if (placa && matricula && ano && marca && modelo) {
            const automovelData = {
                placa: placa.trim(),
                matricula: matricula.trim(),
                ano: parseInt(ano),
                marca: marca.trim(),
                modelo: modelo.trim(),
                tipoPropriedade: tipoPropriedade.trim() || 'CLIENTE'
            };

            this.criarAutomovel(automovelData);
        }
    }

    showNovoAgenteModal() {
        const nome = prompt('Nome do agente:');
        const email = prompt('Email do agente:');
        const password = prompt('Senha do agente:');
        const tipo = prompt('Tipo (BANCO/EMPRESA):');

        if (nome && email && password && tipo) {
            const agenteData = {
                nome: nome.trim(),
                email: email.trim(),
                password: password,
                tipo: tipo.trim().toUpperCase(),
                ativo: true
            };

            this.criarAgente(agenteData);
        }
    }
}

// Instância global do serviço de administração
window.adminService = new AdminService();
