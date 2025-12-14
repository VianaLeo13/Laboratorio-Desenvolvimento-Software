// Script para cadastro de gestores
class GestorService {
    constructor() {
        this.gestores = [];
        this.isSubmitting = false;
        this.init();
    }

    async init() {
        // Sistema livre - qualquer um pode criar gestores
        console.log('Sistema de gestores iniciado - acesso livre');

        // Configurar event listeners
        this.setupEventListeners();
        
        // Carregar gestores existentes
        await this.carregarGestores();
    }

    setupEventListeners() {
        // Event listener para o formulário (remover listeners anteriores)
        const form = document.getElementById('cadastro-gestor-form');
        if (form) {
            form.removeEventListener('submit', this.handleCadastro.bind(this));
            form.addEventListener('submit', this.handleCadastro.bind(this));
        }

        // Event listener para mudança de tipo
        const tipoSelect = document.getElementById('gestor-tipo');
        if (tipoSelect) {
            tipoSelect.removeEventListener('change', this.handleTipoChange.bind(this));
            tipoSelect.addEventListener('change', this.handleTipoChange.bind(this));
        }

        // Event listener para máscaras
        this.setupMasks();
    }

    setupMasks() {
        // Máscara de telefone
        const telefoneInput = document.getElementById('gestor-telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    } else {
                        value = value.replace(/(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                }
                e.target.value = value;
            });
        }

        // Máscara de CNPJ
        const cnpjInput = document.getElementById('gestor-cnpj');
        if (cnpjInput) {
            cnpjInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    value = value.replace(/(\d{2})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1/$2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }
    }

    handleTipoChange(event) {
        const tipo = event.target.value;
        const agenteTipoField = document.getElementById('agente-tipo-field');
        const agenteCampos = document.getElementById('agente-campos');
        const agenteEnderecoField = document.getElementById('agente-endereco-field');
        const agenteTipoSelect = document.getElementById('gestor-agente-tipo');
        
        if (tipo === 'AGENTE') {
            agenteTipoField.style.display = 'block';
            agenteCampos.style.display = 'block';
            agenteEnderecoField.style.display = 'block';
            agenteTipoSelect.required = true;
        } else {
            agenteTipoField.style.display = 'none';
            agenteCampos.style.display = 'none';
            agenteEnderecoField.style.display = 'none';
            agenteTipoSelect.required = false;
            agenteTipoSelect.value = '';
        }
    }

    async handleCadastro(event) {
        event.preventDefault();
        
        // Evitar múltiplos envios
        if (this.isSubmitting) {
            return;
        }
        this.isSubmitting = true;
        
        const formData = this.getFormData();
        
        // Validações
        if (!this.validateForm(formData)) {
            this.isSubmitting = false;
            return;
        }

        try {
            if (formData.tipo === 'ADMIN') {
                await this.cadastrarAdmin(formData);
            } else if (formData.tipo === 'AGENTE') {
                await this.cadastrarAgente(formData);
            }
            
            this.showMessage('Gestor cadastrado com sucesso!', 'success');
            this.limparFormulario();
            await this.carregarGestores();
            
        } catch (error) {
            this.showMessage('Erro ao cadastrar gestor: ' + error.message, 'danger');
        } finally {
            this.isSubmitting = false;
        }
    }

    getFormData() {
        return {
            nome: document.getElementById('gestor-nome').value.trim(),
            email: document.getElementById('gestor-email').value.trim(),
            senha: document.getElementById('gestor-senha').value,
            confirmarSenha: document.getElementById('gestor-confirmar-senha').value,
            tipo: document.getElementById('gestor-tipo').value,
            agenteTipo: document.getElementById('gestor-agente-tipo').value,
            cnpj: document.getElementById('gestor-cnpj').value.trim(),
            telefone: document.getElementById('gestor-telefone').value.trim(),
            endereco: document.getElementById('gestor-endereco').value.trim(),
            ativo: document.getElementById('gestor-ativo').checked
        };
    }

    validateForm(data) {
        // Validação básica
        if (!data.nome) {
            this.showMessage('Por favor, insira o nome do gestor.', 'warning');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showMessage('Por favor, insira um email válido.', 'warning');
            return false;
        }

        if (!this.isValidPassword(data.senha)) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres.', 'warning');
            return false;
        }

        if (data.senha !== data.confirmarSenha) {
            this.showMessage('As senhas não coincidem.', 'warning');
            return false;
        }

        if (!data.tipo) {
            this.showMessage('Por favor, selecione o tipo de gestor.', 'warning');
            return false;
        }

        if (data.tipo === 'AGENTE' && !data.agenteTipo) {
            this.showMessage('Por favor, selecione o tipo de agente.', 'warning');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPassword(password) {
        return password && password.length >= 6;
    }

    async cadastrarAdmin(data) {
        const adminData = {
            nome: data.nome,
            email: data.email,
            ativo: data.ativo
        };

        return await apiService.cadastrarAdmin(adminData);
    }

    async cadastrarAgente(data) {
        // Não precisa mais do mapeamento, usa o valor direto do select
        const agenteData = {
            nome: data.nome,
            cnpj: data.cnpj || '',
            endereco: data.endereco || '',
            telefone: data.telefone || '',
            tipoAgente: data.agenteTipo, // Usar diretamente o valor do select
            ativo: data.ativo,
            email: data.email,
            password: data.senha
        };

        return await apiService.cadastrarAgente(agenteData);
    }

    async carregarGestores() {
        try {
            const container = document.getElementById('gestores-list');
            if (!container) return;

            // Mostrar loading
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                </div>
            `;

            // Carregar dados
            const [admins, agentes] = await Promise.all([
                apiService.listarAdmins(),
                apiService.listarAgentes()
            ]);

            this.gestores = [
                ...admins.map(admin => ({ ...admin, tipo: 'ADMIN' })),
                ...agentes.map(agente => ({ ...agente, tipo: 'AGENTE' }))
            ];

            this.renderGestores();
            
        } catch (error) {
            console.error('Erro ao carregar gestores:', error);
            authService.showMessage('Erro ao carregar gestores: ' + error.message, 'danger');
            
            const container = document.getElementById('gestores-list');
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        Erro ao carregar gestores. Tente novamente.
                    </div>
                `;
            }
        }
    }

    renderGestores() {
        const container = document.getElementById('gestores-list');
        if (!container) return;

        if (this.gestores.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Nenhum gestor cadastrado ainda.
                </div>
            `;
            return;
        }

        const gestoresHTML = this.gestores.map(gestor => this.createGestorCard(gestor)).join('');
        container.innerHTML = `
            <div class="row">
                ${gestoresHTML}
            </div>
        `;
    }

    createGestorCard(gestor) {
        // Determinar o tipo baseado nos dados do gestor
        let gestorTipo = 'ADMIN'; // padrão
        if (gestor.tipoAgente) {
            gestorTipo = 'AGENTE';
        }
        
        const tipoClass = gestorTipo === 'ADMIN' ? 'danger' : 'warning';
        const tipoIcon = gestorTipo === 'ADMIN' ? 'fas fa-user-shield' : 'fas fa-building';
        const tipoText = gestorTipo === 'ADMIN' ? 'Administrador' : 'Agente';
        
                            // <button class="btn btn-outline-primary btn-sm" onclick="gestorService.editarGestor(${gestor.id}, '${gestorTipo}')">
                               // <i class="fas fa-edit"></i> Editar
                            // </button>

        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title">${gestor.nome}</h6>
                            <span class="badge bg-${tipoClass}">
                                <i class="${tipoIcon}"></i> ${tipoText}
                            </span>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="fas fa-envelope"></i> ${gestor.email || 'N/A'}<br>
                                ${gestor.telefone ? `<i class="fas fa-phone"></i> ${gestor.telefone}<br>` : ''}
                                ${gestor.cnpj ? `<i class="fas fa-building"></i> ${gestor.cnpj}<br>` : ''}
                                ${gestor.tipoAgente ? `<i class="fas fa-tag"></i> ${gestor.tipoAgente}<br>` : ''}
                                <span class="badge bg-${gestor.ativo ? 'success' : 'secondary'}">
                                    ${gestor.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                            </small>
                        </p>
                        <div class="btn-group w-100" role="group">
                            
                            <button class="btn btn-outline-danger btn-sm" onclick="gestorService.deletarGestor(${gestor.id}, '${gestorTipo}')">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    editarGestor(id, tipo) {
        this.showMessage('Funcionalidade de edição será implementada em breve.', 'info');
    }

    async deletarGestor(id, tipo) {
        try {
            const gestor = this.gestores.find(g => g.id === id);
            if (!gestor) {
                this.showMessage('Gestor não encontrado.', 'warning');
                return;
            }

            const confirmacao = confirm(`Tem certeza que deseja excluir o gestor ${gestor.nome}? Esta ação não pode ser desfeita.`);
            if (!confirmacao) return;

            if (tipo === 'ADMIN') {
                await apiService.deletarAdmin(id);
            } else if (tipo === 'AGENTE') {
                try {
                    await apiService.deletarAgente(id);
                } catch (error) {
                    this.showMessage('Erro ao excluir agente: ' + error.message, 'danger');
                    return;
                }
            }

            this.showMessage('Gestor excluído com sucesso!', 'success');
            await this.carregarGestores();
            
        } catch (error) {
            console.error('Erro ao excluir gestor:', error);
            this.showMessage('Erro ao excluir gestor: ' + error.message, 'danger');
        }
    }

    async showConfirmacao(titulo, mensagem) {
        return new Promise((resolve) => {
            const modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
            const tituloElement = document.querySelector('#confirmacaoModal .modal-title');
            const textoElement = document.getElementById('confirmacao-texto');
            const botaoElement = document.getElementById('confirmacao-botao');

            tituloElement.textContent = titulo;
            textoElement.textContent = mensagem;
            botaoElement.textContent = 'Confirmar';

            // Remover event listeners anteriores
            botaoElement.replaceWith(botaoElement.cloneNode(true));
            const novoBotao = document.getElementById('confirmacao-botao');

            novoBotao.addEventListener('click', () => {
                modal.hide();
                resolve(true);
            });

            modal._element.addEventListener('hidden.bs.modal', () => {
                resolve(false);
            });

            modal.show();
        });
    }

    limparFormulario() {
        document.getElementById('cadastro-gestor-form').reset();
        document.getElementById('agente-tipo-field').style.display = 'none';
        document.getElementById('agente-campos').style.display = 'none';
        document.getElementById('agente-endereco-field').style.display = 'none';
        document.getElementById('gestor-agente-tipo').required = false;
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
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Funções globais
function limparFormulario() {
    gestorService.limparFormulario();
}

function carregarGestores() {
    gestorService.carregarGestores();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.gestorService = new GestorService();
});
