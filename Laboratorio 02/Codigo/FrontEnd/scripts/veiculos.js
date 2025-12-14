// Script para cadastro de veículos
class VeiculoService {
    constructor() {
        this.veiculos = [];
        this.init();
    }

    async init() {
        // Sistema livre - qualquer um pode cadastrar veículos
        console.log('Sistema de veículos iniciado - acesso livre');

        // Configurar event listeners
        this.setupEventListeners();
        
        // Carregar veículos existentes
        await this.carregarVeiculos();
    }

    setupEventListeners() {
        // Event listener para o formulário
        const form = document.getElementById('cadastro-veiculo-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleCadastro(e));
        }

        // Event listeners para os modais
        this.setupModalEventListeners();

        // Event listener para máscaras
        this.setupMasks();
    }

    setupMasks() {
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
    }

    setupModalEventListeners() {
        // Event listener para o modal de edição (executado quando o modal é aberto)
        const editarModal = document.getElementById('editarVeiculoModal');
        if (editarModal) {
            editarModal.addEventListener('show.bs.modal', () => {
                // Máscara de placa no modal de edição
                const editPlacaInput = document.getElementById('edit-veiculo-placa');
                if (editPlacaInput) {
                    editPlacaInput.addEventListener('input', function(e) {
                        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        if (value.length > 3) {
                            value = value.substring(0, 3) + '-' + value.substring(3, 7);
                        }
                        e.target.value = value;
                    });
                }
            });
        }
    }

    async handleCadastro(event) {
        event.preventDefault();
        
        // Prevenir duplo envio
        const submitButton = event.target.querySelector('button[type="submit"]');
        if (submitButton.disabled) {
            return; // Já está processando
        }
        
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            return;
        }

        // Desabilitar botão e mostrar loading
        this.setButtonLoading(submitButton, true);

        try {
            const veiculoData = {
                placa: formData.placa,
                matricula: formData.matricula,
                ano: formData.ano,
                marca: formData.marca,
                modelo: formData.modelo,
                tipoPropriedade: formData.tipoPropriedade
            };

            const result = await apiService.cadastrarAutomovel(veiculoData);
            
            console.log('Veículo cadastrado:', result);
            
            // Mostrar mensagem de sucesso
            this.showMessage('Veículo cadastrado com sucesso!', 'success');
            
            // Limpar formulário
            this.limparFormulario();
            
            // Recarregar lista
            await this.carregarVeiculos();
            
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            
            // Verificar se é erro de placa duplicada
            if (error.message.includes('Duplicate entry') && error.message.includes('placa')) {
                this.showMessage('Esta placa já está cadastrada no sistema. Por favor, use uma placa diferente.', 'warning');
            } else {
                this.showMessage('Erro ao cadastrar veículo: ' + error.message, 'danger');
            }
        } finally {
            // Reabilitar botão
            this.setButtonLoading(submitButton, false);
        }
    }

    getFormData() {
        return {
            placa: document.getElementById('veiculo-placa').value.trim(),
            matricula: document.getElementById('veiculo-matricula').value.trim(),
            ano: parseInt(document.getElementById('veiculo-ano').value),
            marca: document.getElementById('veiculo-marca').value.trim(),
            modelo: document.getElementById('veiculo-modelo').value.trim(),
            tipoPropriedade: document.getElementById('veiculo-tipo-propriedade').value
        };
    }

    validateForm(data) {
        // Validação básica
        if (!data.placa) {
            this.showMessage('Por favor, insira a placa do veículo.', 'warning');
            return false;
        }

        if (!data.matricula) {
            this.showMessage('Por favor, insira a matrícula do veículo.', 'warning');
            return false;
        }

        if (!data.ano || data.ano < 1900 || data.ano > 2030) {
            this.showMessage('Por favor, insira um ano válido.', 'warning');
            return false;
        }

        if (!data.marca) {
            this.showMessage('Por favor, insira a marca do veículo.', 'warning');
            return false;
        }

        if (!data.modelo) {
            this.showMessage('Por favor, insira o modelo do veículo.', 'warning');
            return false;
        }

        if (!data.tipoPropriedade) {
            this.showMessage('Por favor, selecione o tipo de propriedade.', 'warning');
            return false;
        }

        return true;
    }

    async carregarVeiculos() {
        try {
            const container = document.getElementById('veiculos-list');
            if (!container) return;

            container.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-2">Carregando veículos...</p>
                </div>
            `;

            const veiculos = await apiService.listarAutomoveis();
            this.veiculos = veiculos || [];
            
            this.renderVeiculosTable();
            
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
            const container = document.getElementById('veiculos-list');
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        Erro ao carregar veículos: ${error.message}
                    </div>
                `;
            }
        }
    }

    renderVeiculosTable() {
        const container = document.getElementById('veiculos-list');
        if (!container) return;

        if (this.veiculos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-car fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">Nenhum veículo cadastrado</h5>
                    <p class="text-muted">Cadastre o primeiro veículo usando o formulário acima.</p>
                </div>
            `;
            return;
        }

        const veiculosHTML = this.veiculos.map(veiculo => this.createVeiculoCard(veiculo)).join('');
        
        container.innerHTML = `
            <div class="row">
                ${veiculosHTML}
            </div>
        `;
    }

    createVeiculoCard(veiculo) {
        const tipoClass = this.getTipoClass(veiculo.tipoPropriedade);
        const tipoIcon = this.getTipoIcon(veiculo.tipoPropriedade);
        const tipoText = this.getTipoText(veiculo.tipoPropriedade);
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card veiculo-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title">${veiculo.marca} ${veiculo.modelo}</h6>
                            <span class="badge bg-${tipoClass}">
                                <i class="${tipoIcon}"></i> ${tipoText}
                            </span>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="fas fa-id-card"></i> ${veiculo.placa}<br>
                                <i class="fas fa-file-alt"></i> ${veiculo.matricula}<br>
                                <i class="fas fa-calendar"></i> ${veiculo.ano}<br>
                            </small>
                        </p>
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="veiculoService.editarVeiculo(${veiculo.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="veiculoService.deletarVeiculo(${veiculo.id})">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTipoClass(tipo) {
        switch (tipo) {
            case 'CLIENTE': return 'success';
            case 'EMPRESA': return 'warning';
            case 'BANCO': return 'info';
            default: return 'secondary';
        }
    }

    getTipoIcon(tipo) {
        switch (tipo) {
            case 'CLIENTE': return 'fas fa-user';
            case 'EMPRESA': return 'fas fa-building';
            case 'BANCO': return 'fas fa-university';
            default: return 'fas fa-question';
        }
    }

    getTipoText(tipo) {
        switch (tipo) {
            case 'CLIENTE': return 'Cliente';
            case 'EMPRESA': return 'Empresa';
            case 'BANCO': return 'Banco';
            default: return 'Indefinido';
        }
    }

    preencherFormularioEdicao(veiculo) {
        // Preencher os campos do modal com os dados do veículo
        document.getElementById('edit-veiculo-id').value = veiculo.id;
        document.getElementById('edit-veiculo-placa').value = veiculo.placa || '';
        document.getElementById('edit-veiculo-matricula').value = veiculo.matricula || '';
        document.getElementById('edit-veiculo-ano').value = veiculo.ano || '';
        document.getElementById('edit-veiculo-marca').value = veiculo.marca || '';
        document.getElementById('edit-veiculo-modelo').value = veiculo.modelo || '';
        document.getElementById('edit-veiculo-tipo-propriedade').value = veiculo.tipoPropriedade || '';

        // Aplicar máscara na placa se necessário
        const placaInput = document.getElementById('edit-veiculo-placa');
        if (placaInput && veiculo.placa) {
            let placa = veiculo.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (placa.length > 3) {
                placa = placa.substring(0, 3) + '-' + placa.substring(3, 7);
            }
            placaInput.value = placa;
        }
    }

    async editarVeiculo(id) {
        try {
            // Buscar dados do veículo
            const veiculo = await apiService.buscarAutomovel(id);

            if (!veiculo) {
                this.showMessage('Veículo não encontrado.', 'warning');
                return;
            }

            // Preencher o formulário do modal
            this.preencherFormularioEdicao(veiculo);

            // Abrir o modal
            const modal = new bootstrap.Modal(document.getElementById('editarVeiculoModal'));
            modal.show();

        } catch (error) {
            console.error('Erro ao buscar veículo para edição:', error);
            this.showMessage('Erro ao carregar dados do veículo: ' + error.message, 'danger');
        }
    }

    async salvarEdicao() {
        try {
            // Coletar dados do formulário de edição
            const id = document.getElementById('edit-veiculo-id').value;
            const formData = {
                placa: document.getElementById('edit-veiculo-placa').value.trim(),
                matricula: document.getElementById('edit-veiculo-matricula').value.trim(),
                ano: parseInt(document.getElementById('edit-veiculo-ano').value),
                marca: document.getElementById('edit-veiculo-marca').value.trim(),
                modelo: document.getElementById('edit-veiculo-modelo').value.trim(),
                tipoPropriedade: document.getElementById('edit-veiculo-tipo-propriedade').value
            };

            // Validar dados
            if (!this.validateEditForm(formData)) {
                return;
            }

            // Desabilitar botão e mostrar loading
            const saveButton = document.getElementById('salvar-edicao-btn');
            this.setEditButtonLoading(saveButton, true);

            // Enviar dados para a API
            await apiService.atualizarAutomovel(id, formData);

            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarVeiculoModal'));
            modal.hide();

            // Mostrar mensagem de sucesso
            this.showMessage('Veículo atualizado com sucesso!', 'success');

            // Recarregar lista de veículos
            await this.carregarVeiculos();

        } catch (error) {
            console.error('Erro ao salvar edição:', error);

            // Verificar se é erro de placa duplicada
            if (error.message.includes('Duplicate entry') && error.message.includes('placa')) {
                this.showMessage('Esta placa já está cadastrada no sistema. Por favor, use uma placa diferente.', 'warning');
            } else {
                this.showMessage('Erro ao atualizar veículo: ' + error.message, 'danger');
            }
        } finally {
            // Reabilitar botão
            const saveButton = document.getElementById('salvar-edicao-btn');
            this.setEditButtonLoading(saveButton, false);
        }
    }

    validateEditForm(data) {
        // Validação básica para formulário de edição
        if (!data.placa) {
            this.showMessage('Por favor, insira a placa do veículo.', 'warning');
            return false;
        }

        if (!data.matricula) {
            this.showMessage('Por favor, insira a matrícula do veículo.', 'warning');
            return false;
        }

        if (!data.ano || data.ano < 1900 || data.ano > 2030) {
            this.showMessage('Por favor, insira um ano válido.', 'warning');
            return false;
        }

        if (!data.marca) {
            this.showMessage('Por favor, insira a marca do veículo.', 'warning');
            return false;
        }

        if (!data.modelo) {
            this.showMessage('Por favor, insira o modelo do veículo.', 'warning');
            return false;
        }

        if (!data.tipoPropriedade) {
            this.showMessage('Por favor, selecione o tipo de propriedade.', 'warning');
            return false;
        }

        return true;
    }

    setEditButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
            `;
        } else {
            button.disabled = false;
            button.innerHTML = `
                <i class="fas fa-save"></i> Salvar Alterações
            `;
        }
    }

    async deletarVeiculo(id) {
        try {
            const veiculo = this.veiculos.find(v => v.id === id);
            if (!veiculo) {
                this.showMessage('Veículo não encontrado.', 'warning');
                return;
            }

            const confirmacao = confirm(`Tem certeza que deseja excluir o veículo ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})?`);
            if (!confirmacao) return;

            await apiService.deletarAutomovel(id);
            
            this.showMessage('Veículo excluído com sucesso!', 'success');
            await this.carregarVeiculos();
            
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            this.showMessage('Erro ao excluir veículo: ' + error.message, 'danger');
        }
    }

    limparFormulario() {
        document.getElementById('cadastro-veiculo-form').reset();
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

    showMessage(message, type) {
        // Criar alerta
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
}

// Instanciar o serviço
const veiculoService = new VeiculoService();

// Funções globais
function limparFormulario() {
    veiculoService.limparFormulario();
}
