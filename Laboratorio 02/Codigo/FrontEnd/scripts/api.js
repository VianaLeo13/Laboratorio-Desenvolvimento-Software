// Módulo de API para comunicação com o backend
class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:8080';
        this.token = localStorage.getItem('token');
        this.isBackendOnline = false;
    }

    // Verificar se o backend está online
    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/auth/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.isBackendOnline = response.ok;
            return this.isBackendOnline;
        } catch (error) {
            this.isBackendOnline = false;
            return false;
        }
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Adicionar token de autenticação se disponível
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (jsonError) {
                    // Se não conseguir fazer parse do JSON, usar o texto da resposta
                    try {
                        const errorText = await response.text();
                        errorMessage = errorText || errorMessage;
                    } catch (textError) {
                        // Se não conseguir nem o texto, usar a mensagem padrão
                        console.warn('Não foi possível obter detalhes do erro:', textError);
                    }
                }
                throw new Error(errorMessage);
            }

            // Se a resposta não tem conteúdo, retornar null
            if (response.status === 204 || response.status === 205) {
                return null;
            }

            // Verificar se há conteúdo para fazer parse
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Se não é JSON, retornar o texto
                const text = await response.text();
                return text || null;
            }

            // Tentar fazer parse do JSON
            try {
                const jsonData = await response.json();
                return jsonData;
            } catch (jsonError) {
                console.warn('Erro ao fazer parse do JSON:', jsonError);
                // Se falhar o parse, tentar retornar o texto
                const text = await response.text();
                return text || null;
            }
        } catch (error) {
            console.error('API Error:', error);
            // Melhorar mensagens de erro
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Verificar se é problema de CORS ou conectividade
                if (error.message.includes('CORS') || error.message.includes('blocked')) {
                    throw new Error('Erro de CORS. Verifique se o backend está configurado corretamente.');
                } else if (error.message.includes('Failed to fetch')) {
                    throw new Error('Erro de conexão. Verifique se o backend está rodando na porta 8080.');
                } else {
                    throw new Error('Erro de conexão com o servidor. Verifique se o backend está rodando.');
                }
            }
            throw error;
        }
    }

    // Métodos de autenticação
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        this.token = response.token;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify({
            email: response.username,
            role: response.role
        }));
        
        return response;
    }

    async loginAgente(email, password) {
        const response = await this.request('/agentes/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Para agentes, não temos token JWT, então vamos simular
        this.token = 'agente_' + response.id;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify({
            email: response.email,
            role: 'AGENTE',
            id: response.id,
            nome: response.nome,
            tipoAgente: response.tipoAgente
        }));
        
        return response;
    }

    async alterarSenha(email, password) {
        return await this.request('/auth/alterar-senha', {
            method: 'PUT',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // Métodos de cliente
    async cadastrarCliente(clienteData) {
        return await this.request('/cliente/cadastrar', {
            method: 'POST',
            body: JSON.stringify(clienteData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async cadastrarClienteComRendimento(clienteData) {
        return await this.request('/cliente/cadastrar-com-rendimento', {
            method: 'POST',
            body: JSON.stringify(clienteData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async listarClientes() {
        return await this.request('/cliente/listar');
    }

    async obterCliente(id) {
        return await this.request(`/cliente/${id}`);
    }

    async atualizarCliente(id, clienteData) {
        return await this.request(`/cliente/atualizar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(clienteData)
        });
    }

    async deletarCliente(id) {
        return await this.request(`/cliente/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos de pedidos
    async criarPedido(pedidoData) {
        return await this.request('/pedidos/criar', {
            method: 'POST',
            body: JSON.stringify(pedidoData)
        });
    }

    async consultarPedido(id) {
        return await this.request(`/pedidos/${id}`);
    }

    async consultarPedidosPorCliente(clienteId) {
        return await this.request(`/pedidos/cliente/${clienteId}`);
    }

    async modificarPedido(id, pedidoData) {
        return await this.request(`/pedidos/${id}/modificar`, {
            method: 'PUT',
            body: JSON.stringify(pedidoData)
        });
    }

    async cancelarPedido(id) {
        return await this.request(`/pedidos/${id}/cancelar`, {
            method: 'PUT'
        });
    }

    async avaliarPedido(id, agenteId, aprovado, observacoes = '') {
        const params = new URLSearchParams({
            agenteId: agenteId,
            aprovado: aprovado,
            observacoes: observacoes
        });
        
        return await this.request(`/pedidos/${id}/avaliar?${params}`, {
            method: 'PUT'
        });
    }

    async executarContrato(id, agenteId, valorMensal, prazoMeses) {
        const params = new URLSearchParams({
            agenteId: agenteId,
            valorMensal: valorMensal,
            prazoMeses: prazoMeses
        });
        
        return await this.request(`/pedidos/${id}/executar-contrato?${params}`, {
            method: 'POST'
        });
    }

    async listarPedidosPorStatus(status) {
        return await this.request(`/pedidos/status/${status}`);
    }

    async listarPedidosGerenciaveisPorAgente(agenteId) {
        return await this.request(`/pedidos/agente/${agenteId}/gerenciaveis`);
    }

    async listarPedidosPorAgente(agenteId) {
        return await this.request(`/pedidos/agente/${agenteId}`);
    }

    async listarTodosPedidos() {
        return await this.request(`/pedidos/todos`);
    }

    async atualizarDetalhesPedido(id, pedidoData) {
        return await this.request(`/pedidos/${id}/atualizar-detalhes`, {
            method: 'PUT',
            body: JSON.stringify(pedidoData)
        });
    }

    async modificarPedidoCompleto(id, pedidoData, gestorId) {
        const params = gestorId ? `?gestorId=${gestorId}` : '';
        return await this.request(`/pedidos/${id}/modificar-completo${params}`, {
            method: 'PUT',
            body: JSON.stringify(pedidoData)
        });
    }

    // Métodos de rendimentos
    async criarRendimento(rendimentoData) {
        return await this.request('/rendimentos/criar', {
            method: 'POST',
            body: JSON.stringify(rendimentoData)
        });
    }

    async listarRendimentosPorCliente(clienteId) {
        return await this.request(`/rendimentos/cliente/${clienteId}`);
    }

    async atualizarRendimento(id, rendimentoData) {
        return await this.request(`/rendimentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(rendimentoData)
        });
    }

    async deletarRendimento(id) {
        return await this.request(`/rendimentos/${id}`, {
            method: 'DELETE'
        });
    }

    async debugRendimentos() {
        return await this.request('/rendimentos/debug');
    }

    async buscarContratoPorPedido(pedidoId) {
        return await this.request(`/pedidos/${pedidoId}/contrato`);
    }

    async obterClientePorId(clienteId) {
        return await this.request(`/cliente/${clienteId}`);
    }

    async obterAutomovelPorId(automovelId) {
        return await this.request(`/automoveis/${automovelId}`);
    }

    async obterAgentePorId(agenteId) {
        return await this.request(`/agentes/${agenteId}`);
    }

    // Métodos de automóveis
    async criarAutomovel(automovelData) {
        return await this.request('/automoveis/cadastrar', {
            method: 'POST',
            body: JSON.stringify(automovelData)
        });
    }

    async listarAutomoveis() {
        return await this.request('/automoveis/listar');
    }

    async obterAutomovel(id) {
        return await this.request(`/automoveis/${id}`);
    }

    async atualizarAutomovel(id, automovelData) {
        return await this.request(`/automoveis/${id}/atualizar`, {
            method: 'PUT',
            body: JSON.stringify(automovelData)
        });
    }

    async deletarAutomovel(id) {
        return await this.request(`/automoveis/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos de agentes
    async cadastrarAgente(agenteData) {
        return await this.request('/agentes/cadastrar', {
            method: 'POST',
            body: JSON.stringify(agenteData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async listarAgentes() {
        return await this.request('/agentes/listar');
    }

    async listarAgentesAtivos() {
        console.log('Fazendo requisição para /agentes/ativos');
        const result = await this.request('/agentes/ativos');
        console.log('Resposta do endpoint /agentes/ativos:', result);
        return result;
    }

    async listarAgentesPorTipo(tipo) {
        return await this.request(`/agentes/tipo/${tipo}`);
    }

    async obterAgente(id) {
        return await this.request(`/agentes/${id}`);
    }

    async deletarAgente(id) {
        return await this.request(`/agentes/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos de administradores
    async cadastrarAdmin(adminData) {
        return await this.request('/admins/cadastrar', {
            method: 'POST',
            body: JSON.stringify(adminData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async listarAdmins() {
        return await this.request('/admins/listar');
    }

    async obterAdmin(id) {
        return await this.request(`/admins/${id}`);
    }

    async atualizarAdmin(id, adminData) {
        return await this.request(`/admins/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adminData)
        });
    }

    async deletarAdmin(id) {
        return await this.request(`/admins/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos de veículos
    async cadastrarAutomovel(data) {
        return await this.request('/automoveis/cadastrar', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async listarAutomoveis() {
        return await this.request('/automoveis/listar');
    }

    async buscarAutomovel(id) {
        return await this.request(`/automoveis/${id}`);
    }

    async atualizarAutomovel(id, data) {
        return await this.request(`/automoveis/${id}/atualizar`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async deletarAutomovel(id) {
        return await this.request(`/automoveis/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos utilitários
    async listarUsuarios() {
        return await this.request('/auth/usuarios');
    }

    async obterUsuarioLogado(email) {
        try {
            const user = authService.getCurrentUser();
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Baseado no tipo de usuário, buscar nos endpoints específicos
            if (user.role === 'CLIENTE') {
                // Buscar na tabela clientes (que é referenciada pelos pedidos)
                const clientes = await this.listarClientes();
                const cliente = clientes.find(c => c.email === email);
                return cliente;
            } else if (user.role === 'AGENTE') {
                const agentes = await this.listarAgentes();
                const agente = agentes.find(a => a.email === email);
                return agente;
            } else if (user.role === 'ADMIN') {
                const admins = await this.listarAdmins();
                const admin = admins.find(a => a.email === email);
                return admin;
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao obter usuário logado:', error);
            // Retornar dados básicos do token em caso de erro
            const user = authService.getCurrentUser();
            return {
                nome: user.email.split('@')[0],
                email: user.email,
                role: user.role,
                ativo: true
            };
        }
    }

    // Verificar se o usuário está autenticado
    isAuthenticated() {
        return !!this.token;
    }

    // Obter dados do usuário atual
    getCurrentUser() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Inicializar verificação de conectividade
    async initialize() {
        try {
            await this.checkBackendStatus();
            if (!this.isBackendOnline) {
                console.warn('Backend não está acessível. Algumas funcionalidades podem não funcionar.');
            }
        } catch (error) {
            console.warn('Erro ao verificar conectividade com o backend:', error);
        }
    }
}

// Instância global da API
window.apiService = new ApiService();
