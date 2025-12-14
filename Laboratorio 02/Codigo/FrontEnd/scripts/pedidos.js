// Módulo de gerenciamento de pedidos
class PedidosService {
    constructor() {
        this.pedidos = [];
        this.automoveis = [];
        this.agentes = [];
    }

    async carregarPedidos() {
        try {
            if (authService.hasRole('CLIENTE')) {
                // Para clientes, carregar apenas seus pedidos
                const user = authService.getCurrentUser();
                if (!user) {
                    authService.showMessage('Usuário não autenticado. Faça login novamente.', 'danger');
                    return;
                }

                // Obter o ID do cliente da tabela usuarios
                const clienteData = await apiService.obterUsuarioLogado(user.email);
                if (!clienteData || !clienteData.id) {
                    authService.showMessage('Erro ao obter dados do cliente. Tente novamente.', 'danger');
                    return;
                }

                // Carregar pedidos específicos do cliente
                this.pedidos = await apiService.consultarPedidosPorCliente(clienteData.id);
            } else if (authService.hasRole('AGENTE')) {
                // Para agentes, carregar apenas pedidos que pode gerenciar
                const user = authService.getCurrentUser();
                if (!user || !user.id) {
                    authService.showMessage('Erro ao obter dados do agente. Tente novamente.', 'danger');
                    return;
                }

                // Carregar pedidos gerenciáveis pelo agente específico
                this.pedidos = await apiService.listarPedidosGerenciaveisPorAgente(user.id);
            } else if (authService.hasRole('ADMIN')) {
                // Para admins, carregar todos os pedidos
                this.pedidos = await apiService.listarTodosPedidos();
            }
            
            this.renderPedidos();
        } catch (error) {
            authService.showMessage('Erro ao carregar pedidos: ' + error.message, 'danger');
        }
    }

    async carregarAutomoveis() {
        try {
            this.automoveis = await apiService.listarAutomoveis();
            this.renderAutomoveisSelect();
        } catch (error) {
            authService.showMessage('Erro ao carregar veículos: ' + error.message, 'danger');
        }
    }

    async carregarAgentes() {
        try {
            console.log('Carregando agentes...');
            this.agentes = await apiService.listarAgentesAtivos();
            console.log('Agentes carregados:', this.agentes);
            console.log('Tipo de dados:', typeof this.agentes, 'Array?', Array.isArray(this.agentes));
            
            // Teste adicional: verificar se há dados
            if (!this.agentes || this.agentes.length === 0) {
                console.warn('Nenhum agente retornado do backend');
                // Tentar carregar todos os agentes para debug
                console.log('Tentando carregar todos os agentes...');
                const todosAgentes = await apiService.listarAgentes();
                console.log('Todos os agentes:', todosAgentes);
            }
            
            this.renderAgentesSelect();
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
            console.error('Detalhes do erro:', error);
            authService.showMessage('Erro ao carregar agentes: ' + error.message, 'danger');
        }
    }

    renderPedidos() {
        const container = document.getElementById('pedidos-list');
        const avaliacaoContainer = document.getElementById('pedidos-avaliacao');
        
        if (!container && !avaliacaoContainer) return;

        const targetContainer = authService.hasRole('CLIENTE') ? container : avaliacaoContainer;
        
        if (this.pedidos.length === 0) {
            targetContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum pedido encontrado.
                </div>
            `;
            return;
        }

        const pedidosHTML = this.pedidos.map(pedido => this.createPedidoCard(pedido)).join('');
        targetContainer.innerHTML = pedidosHTML;
    }

    createPedidoCard(pedido) {
        const statusClass = this.getStatusClass(pedido.status);
        const statusText = this.getStatusText(pedido.status);
        const dataCriacao = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR');
        
        let actionsHTML = '';
        
        if (authService.hasRole('CLIENTE')) {
            // Ações para clientes
            if (pedido.status === 'PENDENTE') {
                actionsHTML = `
                    <button class="btn btn-warning btn-sm" onclick="pedidosService.modificarPedido(${pedido.id})">
                        <i class="fas fa-edit"></i> Modificar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="pedidosService.cancelarPedido(${pedido.id})">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                `;
            } else if (pedido.status === 'CONTRATADO') {
                actionsHTML = `
                    <button class="btn btn-info btn-sm" onclick="pedidosService.verContrato(${pedido.id})">
                        <i class="fas fa-file-contract"></i> Ver Contrato
                    </button>
                `;
            } else {
                actionsHTML = `
                    <button class="btn btn-outline-secondary btn-sm" disabled title="Apenas pedidos pendentes podem ser modificados">
                        <i class="fas fa-ban"></i> Não Editável
                    </button>
                `;
            }
        } else if (authService.hasRole('AGENTE') || authService.hasRole('ADMIN')) {
            // Ações para agentes
            if (pedido.status === 'PENDENTE') {
                actionsHTML = `
                    <button class="btn btn-success btn-sm" onclick="pedidosService.mostrarConfirmacaoFinanceira(${pedido.id}, true)">
                        <i class="fas fa-check"></i> Aprovar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="pedidosService.mostrarConfirmacaoFinanceira(${pedido.id}, false)">
                        <i class="fas fa-times"></i> Rejeitar
                    </button>
                `;
            } else if (pedido.status === 'APROVADO') {
                actionsHTML = `
                    <button class="btn btn-primary btn-sm" onclick="pedidosService.executarContrato(${pedido.id})">
                        <i class="fas fa-file-contract"></i> Executar Contrato
                    </button>
                `;
            } else if (pedido.status === 'CONTRATADO') {
                actionsHTML = `
                    <button class="btn btn-info btn-sm" onclick="pedidosService.verContrato(${pedido.id})">
                        <i class="fas fa-file-contract"></i> Ver Contrato
                    </button>
                `;
            }
        }

        const cardHTML = `
            <div class="card pedido-card ${statusClass.toLowerCase()}">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h5 class="card-title">
                                Pedido #${pedido.id}
                                <span class="status-badge status-${statusClass.toLowerCase()}">${statusText}</span>
                            </h5>
                            <p class="card-text">
                                <strong>Cliente ID:</strong> ${pedido.clienteId}<br>
                                <strong>Veículo ID:</strong> ${pedido.automovelId}<br>
                                <strong>Data de Criação:</strong> ${dataCriacao}<br>
                                ${pedido.possuiContratoCredito ? `<strong>Contrato de Crédito:</strong> Sim<br>` : ''}
                                ${pedido.bancoContrato ? `<strong>Banco:</strong> ${pedido.bancoContrato}<br>` : ''}
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="btn-group-vertical" role="group">
                                ${actionsHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Carregar rendas do cliente após criar o card
        this.carregarRendasCliente(pedido.id, pedido.clienteId);

        return cardHTML;
    }

    getStatusClass(status) {
        const statusMap = {
            'PENDENTE': 'pendente',
            'APROVADO': 'aprovado',
            'REJEITADO': 'rejeitado',
            'CONTRATADO': 'contratado',
            'CANCELADO': 'cancelado'
        };
        return statusMap[status] || 'pendente';
    }

    getStatusText(status) {
        const statusMap = {
            'PENDENTE': 'Pendente',
            'APROVADO': 'Aprovado',
            'REJEITADO': 'Rejeitado',
            'CONTRATADO': 'Contratado',
            'CANCELADO': 'Cancelado'
        };
        return statusMap[status] || 'Pendente';
    }

    async carregarRendasCliente(pedidoId, clienteId) {
        const elementId = `rendas-cliente-${pedidoId}`;
        const rendasElement = document.getElementById(elementId);

        if (!rendasElement) {
            console.warn(`Elemento ${elementId} não encontrado`);
            return;
        }

        // Evitar múltiplas requisições simultâneas para o mesmo elemento
        if (rendasElement.dataset.loading === 'true') {
            console.log(`Já carregando rendas para ${elementId}`);
            return;
        }

        rendasElement.dataset.loading = 'true';
        rendasElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando rendas...';

        try {
            const rendas = await apiService.listarRendimentosPorCliente(clienteId);

            if (rendas && rendas.length > 0) {
                const rendasHTML = rendas.map(renda => {
                    const valorFormatado = parseFloat(renda.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                    return `<div class="renda-item">
                        <strong>${renda.entidadeEmpregadora}:</strong> ${valorFormatado}
                    </div>`;
                }).join('');

                rendasElement.innerHTML = rendasHTML;
            } else {
                rendasElement.innerHTML = '<span class="text-warning">Nenhuma renda cadastrada</span>';
            }
        } catch (error) {
            console.error('Erro ao carregar rendas do cliente:', error);
            rendasElement.innerHTML = '<span class="text-danger">Erro ao carregar rendas</span>';
        } finally {
            rendasElement.dataset.loading = 'false';
        }
    }

    renderAutomoveisSelect() {
        const select = document.getElementById('pedido-automovel');
        if (!select) return;

        select.innerHTML = '<option value="">Selecione um veículo</option>';
        this.automoveis.forEach(automovel => {
            const option = document.createElement('option');
            option.value = automovel.id;
            option.textContent = `${automovel.marca} ${automovel.modelo} - ${automovel.ano} (${automovel.placa})`;
            select.appendChild(option);
        });
    }

    renderAgentesSelect() {
        const select = document.getElementById('pedido-banco');
        if (!select) {
            console.warn('Elemento pedido-banco não encontrado');
            return;
        }

        select.innerHTML = '<option value="">Selecione um banco</option>';
        
        console.log('Renderizando agentes:', this.agentes);
        
        let bancosEncontrados = 0;
        this.agentes.forEach(agente => {
            console.log('Verificando agente:', agente.nome, 'tipo:', agente.tipoAgente);
            if (agente.tipoAgente === 'BANCO' || agente.tipoAgente === 'EMPRESA_FINANCEIRA') {
                const option = document.createElement('option');
                option.value = agente.id;
                option.textContent = agente.nome + ' (' + agente.tipoAgente + ')';
                select.appendChild(option);
                bancosEncontrados++;
                console.log('Agente financeiro adicionado:', agente.nome);
            }
        });
        
        console.log(`Total de bancos encontrados: ${bancosEncontrados}`);
        
        if (bancosEncontrados === 0) {
            console.warn('Nenhum banco encontrado nos agentes');
        }
    }

    async criarPedido() {
        const automovelId = document.getElementById('pedido-automovel').value;
        const possuiContratoCredito = document.getElementById('pedido-contrato-credito').checked;
        const bancoContrato = document.getElementById('pedido-banco').value;

        if (!automovelId) {
            authService.showMessage('Por favor, selecione um veículo.', 'warning');
            return;
        }

        if (possuiContratoCredito && !bancoContrato) {
            authService.showMessage('Por favor, selecione um banco para o contrato de crédito.', 'warning');
            return;
        }

        try {
            // Obter o ID do cliente da tabela usuarios
            const user = authService.getCurrentUser();
            if (!user) {
                authService.showMessage('Usuário não autenticado. Faça login novamente.', 'danger');
                return;
            }

            const clienteData = await apiService.obterUsuarioLogado(user.email);
            if (!clienteData || !clienteData.id) {
                authService.showMessage('Erro ao obter dados do cliente. Tente novamente.', 'danger');
                return;
            }

            const pedidoData = {
                clienteId: clienteData.id, // Usar o ID correto da tabela usuarios
                automovelId: parseInt(automovelId),
                possuiContratoCredito: possuiContratoCredito,
                bancoContrato: bancoContrato || null,
                dataCriacao: new Date().toISOString()
            };

            await apiService.criarPedido(pedidoData);
            authService.showMessage('Pedido criado com sucesso!', 'success');
            
            // Fechar modal e recarregar lista
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoPedidoModal'));
            modal.hide();
            
            // Limpar formulário
            document.getElementById('novo-pedido-form').reset();
            document.getElementById('banco-field').style.display = 'none';
            
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao criar pedido: ' + error.message, 'danger');
        }
    }

    async modificarPedido(id) {
        // Buscar dados do pedido
        const pedido = this.pedidos.find(p => p.id === id);
        if (!pedido) {
            authService.showMessage('Pedido não encontrado.', 'danger');
            return;
        }

        // Verificar se pode modificar (não pode estar contratado)
        if (pedido.status === 'CONTRATADO') {
            authService.showMessage('Não é possível modificar pedidos já contratados.', 'warning');
            return;
        }

        // Verificar se pode modificar (apenas pedidos pendentes para clientes)
        if (authService.hasRole('CLIENTE') && pedido.status !== 'PENDENTE') {
            authService.showMessage('Só é possível modificar pedidos pendentes.', 'warning');
            return;
        }

        // Chamar a função existente de edição
        showEditarPedidoModal(id);
    }

    async verContrato(pedidoId) {
        try {
            // Buscar dados do contrato
            const contrato = await apiService.buscarContratoPorPedido(pedidoId);
            if (!contrato) {
                authService.showMessage('Contrato não encontrado para este pedido.', 'warning');
                return;
            }

            // Buscar dados adicionais do pedido
            const pedido = await apiService.consultarPedido(pedidoId);
            
            // Exibir modal com dados do contrato
            showContratoModal(contrato, pedido);
        } catch (error) {
            authService.showMessage('Erro ao carregar dados do contrato: ' + error.message, 'danger');
        }
    }

    async cancelarPedido(id) {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
            return;
        }

        try {
            await apiService.cancelarPedido(id);
            authService.showMessage('Pedido cancelado com sucesso!', 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao cancelar pedido: ' + error.message, 'danger');
        }
    }

    async mostrarConfirmacaoFinanceira(pedidoId, aprovado) {
        try {
            // Buscar dados do pedido
            const pedido = await apiService.consultarPedido(pedidoId);
            if (!pedido) {
                authService.showMessage('Pedido não encontrado.', 'danger');
                return;
            }

            // Buscar dados do cliente
            const cliente = await apiService.obterClientePorId(pedido.clienteId);
            if (!cliente) {
                authService.showMessage('Cliente não encontrado.', 'danger');
                return;
            }

            // Buscar rendas do cliente
            const rendas = await apiService.listarRendimentosPorCliente(pedido.clienteId);

            // Preencher modal
            document.getElementById('pedido-id-confirmacao').textContent = pedidoId;
            document.getElementById('cliente-nome-confirmacao').textContent = cliente.nome || 'N/A';
            document.getElementById('cliente-cpf-confirmacao').textContent = cliente.cpf || 'N/A';
            document.getElementById('cliente-rg-confirmacao').textContent = cliente.rg || 'N/A';
            document.getElementById('cliente-profissao-confirmacao').textContent = cliente.profissao || 'N/A';

            // Exibir rendas
            const rendasContainer = document.getElementById('rendas-confirmacao');
            if (rendas && rendas.length > 0) {
                const totalRenda = rendas.reduce((total, renda) => total + parseFloat(renda.valor), 0);
                const rendasHTML = rendas.map(renda => {
                    const valorFormatado = parseFloat(renda.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                    return `<div class="renda-item">
                        <strong>${renda.entidadeEmpregadora}:</strong> ${valorFormatado}
                    </div>`;
                }).join('');

                rendasContainer.innerHTML = `
                    ${rendasHTML}
                    <hr>
                    <div class="text-success">
                        <strong>Total de Rendas:</strong> ${totalRenda.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </div>
                `;

                // Análise financeira (removida conforme solicitado)
                document.getElementById('analise-financeira').innerHTML = '';
            } else {
                rendasContainer.innerHTML = '<div class="text-warning">Cliente não possui rendas cadastradas.</div>';
                document.getElementById('analise-financeira').innerHTML = '';
            }

            // Configurar botões do modal
            document.getElementById('btn-aprovar-confirmacao').onclick = () => this.confirmarAvaliacao(pedidoId, true);
            document.getElementById('btn-rejeitar-confirmacao').onclick = () => this.confirmarAvaliacao(pedidoId, false);

            // Armazenar dados para uso posterior
            this.pedidoAtual = { id: pedidoId, aprovado, cliente, rendas };

            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('confirmacaoFinanceiraModal'));
            modal.show();

        } catch (error) {
            authService.showMessage('Erro ao carregar dados para análise: ' + error.message, 'danger');
        }
    }

    async confirmarAvaliacao(pedidoId, aprovado) {
        const observacoes = document.getElementById('observacoes-confirmacao').value.trim();

        try {
            const agenteId = 1; // Em uma implementação real, isso viria do token
            await apiService.avaliarPedido(pedidoId, agenteId, aprovado, observacoes);

            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmacaoFinanceiraModal'));
            modal.hide();

            const status = aprovado ? 'aprovado' : 'rejeitado';
            authService.showMessage(`Pedido ${status} com sucesso!`, 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao avaliar pedido: ' + error.message, 'danger');
        }
    }

    async executarContrato(id) {
        const valorMensal = prompt('Valor mensal do contrato:');
        const prazoMeses = prompt('Prazo em meses:');

        if (!valorMensal || !prazoMeses) {
            authService.showMessage('Por favor, preencha todos os campos.', 'warning');
            return;
        }

        try {
            const agenteId = 1; // Em uma implementação real, isso viria do token
            await apiService.executarContrato(id, agenteId, parseFloat(valorMensal), parseInt(prazoMeses));
            authService.showMessage('Contrato executado com sucesso!', 'success');
            await this.carregarPedidos();
        } catch (error) {
            authService.showMessage('Erro ao executar contrato: ' + error.message, 'danger');
        }
    }
}

// Instância global do serviço de pedidos
window.pedidosService = new PedidosService();

// Funções globais para uso nos formulários
function showNovoPedidoModal() {
    if (!authService.isAuthenticated()) {
        authService.showMessage('Por favor, faça login para criar um pedido.', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('novoPedidoModal'));
    modal.show();
    
    // Carregar dados necessários
    pedidosService.carregarAutomoveis();
    pedidosService.carregarAgentes();
}

function criarPedido() {
    pedidosService.criarPedido();
}

async function showEditarPedidoModal(pedidoId) {
    // Buscar dados do pedido
    const pedido = pedidosService.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        authService.showMessage('Pedido não encontrado.', 'danger');
        return;
    }

    // Verificar se pode editar baseado no papel do usuário
    if (authService.hasRole('CLIENTE')) {
        // Clientes só podem editar pedidos pendentes
        if (pedido.status !== 'PENDENTE') {
            authService.showMessage('Só é possível editar pedidos pendentes.', 'warning');
            return;
        }
    } else {
        // Gestores podem editar pedidos pendentes ou em análise
        if (pedido.status !== 'PENDENTE' && pedido.status !== 'ANALISE_FINANCEIRA') {
            authService.showMessage('Só é possível editar pedidos pendentes ou em análise.', 'warning');
            return;
        }
    }

    // Verificar se não está contratado
    if (pedido.status === 'CONTRATADO') {
        authService.showMessage('Não é possível modificar pedidos já contratados.', 'warning');
        return;
    }

    // Preencher formulário
    document.getElementById('edit-pedido-id').value = pedido.id;
    document.getElementById('edit-pedido-automovel').value = pedido.automovelId;
    document.getElementById('edit-pedido-contrato-credito').checked = pedido.possuiContratoCredito || false;
    document.getElementById('edit-pedido-banco').value = pedido.bancoContrato || '';

    // Mostrar/esconder campo banco
    const bancoField = document.getElementById('edit-banco-field');
    bancoField.style.display = pedido.possuiContratoCredito ? 'block' : 'none';

    // Carregar dados necessários e renderizar options
    await pedidosService.carregarAutomoveis();
    await pedidosService.carregarAgentes();
    
    // Renderizar veículos no modal de edição
    renderVeiculosEditar();
    renderAgentesEditar();

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('editarPedidoModal'));
    modal.show();
}

async function atualizarPedido() {
    const pedidoId = document.getElementById('edit-pedido-id').value;
    const automovelId = document.getElementById('edit-pedido-automovel').value;
    const possuiContratoCredito = document.getElementById('edit-pedido-contrato-credito').checked;
    const bancoContrato = document.getElementById('edit-pedido-banco').value;

    if (!automovelId) {
        authService.showMessage('Por favor, selecione um veículo.', 'warning');
        return;
    }

    if (possuiContratoCredito && !bancoContrato) {
        authService.showMessage('Por favor, selecione um banco para o contrato de crédito.', 'warning');
        return;
    }

    try {
        const pedidoData = {
            automovelId: parseInt(automovelId),
            possuiContratoCredito: possuiContratoCredito,
            bancoContrato: bancoContrato || null
        };

        await apiService.atualizarDetalhesPedido(pedidoId, pedidoData);
        authService.showMessage('Pedido atualizado com sucesso!', 'success');

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarPedidoModal'));
        modal.hide();

        // Recarregar lista
        await pedidosService.carregarPedidos();
    } catch (error) {
        authService.showMessage('Erro ao atualizar pedido: ' + error.message, 'danger');
    }
}

function showModificarPedidoModal(pedidoId) {
    // Buscar dados do pedido
    const pedido = pedidosService.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        authService.showMessage('Pedido não encontrado.', 'danger');
        return;
    }

    // Verificar se pode modificar (não deve estar contratado)
    if (pedido.status === 'CONTRATADO') {
        authService.showMessage('Não é possível modificar pedidos já contratados.', 'warning');
        return;
    }

    // Preencher formulário
    document.getElementById('mod-pedido-id').value = pedido.id;
    document.getElementById('mod-pedido-automovel').value = pedido.automovelId;
    document.getElementById('mod-pedido-status').value = pedido.status;
    document.getElementById('mod-pedido-contrato-credito').checked = pedido.possuiContratoCredito || false;
    document.getElementById('mod-pedido-banco').value = pedido.bancoContrato || '';

    // Mostrar/esconder campo banco
    const bancoField = document.getElementById('mod-banco-field');
    bancoField.style.display = pedido.possuiContratoCredito ? 'block' : 'none';

    // Carregar dados necessários
    pedidosService.carregarAutomoveis();
    pedidosService.carregarAgentes();

    // Renderizar agentes no modal de modificação
    renderAgentesModificar();

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modificarPedidoModal'));
    modal.show();
}

function renderAgentesModificar() {
    const select = document.getElementById('mod-pedido-banco');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione</option>';
    
    pedidosService.agentes.forEach(agente => {
        if (agente.tipoAgente === 'BANCO' || agente.tipoAgente === 'EMPRESA_FINANCEIRA') {
            const option = document.createElement('option');
            option.value = agente.id;
            option.textContent = agente.nome + ' (' + agente.tipoAgente + ')';
            select.appendChild(option);
        }
    });
}

function renderVeiculosEditar() {
    const select = document.getElementById('edit-pedido-automovel');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um veículo</option>';
    
    pedidosService.automoveis.forEach(automovel => {
        const option = document.createElement('option');
        option.value = automovel.id;
        option.textContent = `${automovel.marca} ${automovel.modelo} (${automovel.placa})`;
        select.appendChild(option);
    });
}

function renderAgentesEditar() {
    const select = document.getElementById('edit-pedido-banco');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione um banco ou empresa financeira</option>';
    
    pedidosService.agentes.forEach(agente => {
        if (agente.tipoAgente === 'BANCO' || agente.tipoAgente === 'EMPRESA_FINANCEIRA') {
            const option = document.createElement('option');
            option.value = agente.id;
            option.textContent = agente.nome + ' (' + agente.tipoAgente + ')';
            select.appendChild(option);
        }
    });
}

async function modificarPedidoCompleto() {
    const pedidoId = document.getElementById('mod-pedido-id').value;
    const automovelId = document.getElementById('mod-pedido-automovel').value;
    const status = document.getElementById('mod-pedido-status').value;
    const possuiContratoCredito = document.getElementById('mod-pedido-contrato-credito').checked;
    const bancoContrato = document.getElementById('mod-pedido-banco').value;

    if (!automovelId) {
        authService.showMessage('Por favor, selecione um veículo.', 'warning');
        return;
    }

    if (possuiContratoCredito && !bancoContrato) {
        authService.showMessage('Por favor, selecione um banco/empresa financeira para o contrato de crédito.', 'warning');
        return;
    }

    try {
        const user = authService.getCurrentUser();
        const gestorId = user && user.id ? user.id : null;

        const pedidoData = {
            automovelId: parseInt(automovelId),
            status: status,
            possuiContratoCredito: possuiContratoCredito,
            bancoContrato: bancoContrato || null
        };

        await apiService.modificarPedidoCompleto(pedidoId, pedidoData, gestorId);
        authService.showMessage('Pedido modificado com sucesso!', 'success');

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modificarPedidoModal'));
        modal.hide();

        // Recarregar lista
        await pedidosService.carregarPedidos();
    } catch (error) {
        authService.showMessage('Erro ao modificar pedido: ' + error.message, 'danger');
    }
}

// Mostrar/ocultar campo de banco baseado no checkbox
document.addEventListener('DOMContentLoaded', function() {
    const contratoCreditoCheckbox = document.getElementById('pedido-contrato-credito');
    const bancoField = document.getElementById('banco-field');
    
    if (contratoCreditoCheckbox && bancoField) {
        contratoCreditoCheckbox.addEventListener('change', function() {
            bancoField.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Para o modal de edição
    const editContratoCreditoCheckbox = document.getElementById('edit-pedido-contrato-credito');
    const editBancoField = document.getElementById('edit-banco-field');
    
    if (editContratoCreditoCheckbox && editBancoField) {
        editContratoCreditoCheckbox.addEventListener('change', function() {
            editBancoField.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Para o modal de modificação completa
    const modContratoCreditoCheckbox = document.getElementById('mod-pedido-contrato-credito');
    const modBancoField = document.getElementById('mod-banco-field');
    
    if (modContratoCreditoCheckbox && modBancoField) {
        modContratoCreditoCheckbox.addEventListener('change', function() {
            modBancoField.style.display = this.checked ? 'block' : 'none';
        });
    }
});

function showContratoModal(contrato, pedido) {
    // Preencher dados do contrato
    document.getElementById('contrato-numero').textContent = contrato.numeroContrato;
    document.getElementById('contrato-status').innerHTML = `<span class="badge bg-success">${contrato.status}</span>`;
    document.getElementById('contrato-valor').textContent = `R$ ${parseFloat(contrato.valorMensal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('contrato-prazo').textContent = `${contrato.prazoMeses} meses`;
    
    // Formatar datas
    const dataInicio = new Date(contrato.dataInicio).toLocaleDateString('pt-BR');
    const dataFim = new Date(contrato.dataFim).toLocaleDateString('pt-BR');
    document.getElementById('contrato-inicio').textContent = dataInicio;
    document.getElementById('contrato-fim').textContent = dataFim;
    
    // Formatar observações com quebras de linha
    const observacoes = contrato.observacoes || 'Sem observações';
    const observacoesFormatadas = observacoes.replace(/\n/g, '<br>');
    document.getElementById('contrato-observacoes').innerHTML = observacoesFormatadas;

    // Buscar e preencher dados do cliente, veículo e agente
    preencherDadosAdicionais(pedido);

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('contratoModal'));
    modal.show();
}

async function preencherDadosAdicionais(pedido) {
    try {
        // Buscar dados do cliente
        const cliente = await apiService.obterClientePorId(pedido.clienteId);
        if (cliente) {
            document.getElementById('cliente-nome').textContent = cliente.nome;
            document.getElementById('cliente-cpf').textContent = cliente.cpf;
            document.getElementById('cliente-email').textContent = cliente.email;
        }

        // Buscar dados do veículo
        const veiculo = await apiService.obterAutomovelPorId(pedido.automovelId);
        if (veiculo) {
            document.getElementById('veiculo-modelo').textContent = `${veiculo.marca} ${veiculo.modelo}`;
            document.getElementById('veiculo-placa').textContent = veiculo.placa;
            document.getElementById('veiculo-ano').textContent = veiculo.ano;
        }

        // Buscar dados do agente
        if (pedido.agenteId) {
            const agente = await apiService.obterAgentePorId(pedido.agenteId);
            if (agente) {
                document.getElementById('agente-nome').textContent = agente.nome;
                document.getElementById('agente-tipo').textContent = agente.tipoAgente;
                document.getElementById('agente-email').textContent = agente.email;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados adicionais:', error);
    }
}

function imprimirContrato() {
    // Implementar funcionalidade de impressão
    authService.showMessage('Funcionalidade de impressão será implementada em breve.', 'info');
}
