// Módulo de gerenciamento de rendimentos
class RendimentosService {
    constructor() {
        this.rendimentos = [];
    }

    async carregarRendimentos(clienteId) {
        try {
            this.rendimentos = await apiService.listarRendimentosPorCliente(clienteId);
            this.renderRendimentos();
        } catch (error) {
            console.error('Erro ao carregar rendimentos:', error);
            authService.showMessage('Erro ao carregar rendimentos: ' + error.message, 'danger');
        }
    }

    renderRendimentos() {
        const container = document.getElementById('rendimentos-list');
        if (!container) return;

        if (this.rendimentos.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum rendimento cadastrado.</p>';
            return;
        }

        const html = this.rendimentos.map(rendimento => `
            <div class="border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${rendimento.entidadeEmpregadora}</h6>
                        <p class="mb-0 text-success">
                            <strong>R$ ${rendimento.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                        </p>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="editarRendimento(${rendimento.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deletarRendimento(${rendimento.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    async criarRendimento() {
        const empresa = document.getElementById('rendimento-empresa').value;
        const valor = parseFloat(document.getElementById('rendimento-valor').value);

        if (!empresa || !valor) {
            authService.showMessage('Por favor, preencha todos os campos.', 'warning');
            return;
        }

        try {
            const user = authService.getCurrentUser();
            const clienteData = await apiService.obterUsuarioLogado(user.email);

            const rendimentoData = {
                entidadeEmpregadora: empresa,
                valor: valor,
                clienteId: clienteData.id
            };

            await apiService.criarRendimento(rendimentoData);
            authService.showMessage('Rendimento adicionado com sucesso!', 'success');

            // Fechar modal e recarregar lista
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoRendimentoModal'));
            modal.hide();
            document.getElementById('novo-rendimento-form').reset();

            // Recarregar rendimentos
            await this.carregarRendimentos(clienteData.id);
        } catch (error) {
            authService.showMessage('Erro ao adicionar rendimento: ' + error.message, 'danger');
        }
    }

    async deletarRendimento(id) {
        if (!confirm('Tem certeza que deseja excluir este rendimento?')) {
            return;
        }

        try {
            await apiService.deletarRendimento(id);
            authService.showMessage('Rendimento excluído com sucesso!', 'success');

            // Recarregar rendimentos
            const user = authService.getCurrentUser();
            const clienteData = await apiService.obterUsuarioLogado(user.email);
            await this.carregarRendimentos(clienteData.id);
        } catch (error) {
            authService.showMessage('Erro ao excluir rendimento: ' + error.message, 'danger');
        }
    }
}

// Instância global do serviço de rendimentos
window.rendimentosService = new RendimentosService();

// Funções globais
function showNovoRendimentoModal() {
    if (!authService.isAuthenticated()) {
        authService.showMessage('Por favor, faça login para adicionar rendimentos.', 'warning');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('novoRendimentoModal'));
    modal.show();
}

function criarRendimento() {
    rendimentosService.criarRendimento();
}

function deletarRendimento(id) {
    rendimentosService.deletarRendimento(id);
}

function editarRendimento(id) {
    // Implementar edição de rendimento
    authService.showMessage('Funcionalidade de edição em desenvolvimento.', 'info');
}
