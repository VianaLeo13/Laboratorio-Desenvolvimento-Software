document.addEventListener('DOMContentLoaded', () => {

    // Carregar auth.js se disponível
    if (typeof AuthService === 'undefined') {
        const authScript = document.createElement('script');
        authScript.src = 'scripts/auth.js';
        document.head.appendChild(authScript);
    }

    // --- SELETORES ---
    const vantagemForm = document.getElementById('vantagem-form');
    const vantagensList = document.getElementById('vantagens-list');
    const toastContainer = document.getElementById('toast-container');
    const resgateModal = document.getElementById('resgate-confirm-modal');
    const resgateVantagemNome = document.getElementById('resgate-vantagem-nome');
    const resgateVantagemCusto = document.getElementById('resgate-vantagem-custo');
    const alunoSelect = document.getElementById('resgate-aluno-select');
    const confirmResgateBtn = document.getElementById('confirm-resgate-btn');
    const empresaSelect = document.getElementById('vantagem-empresa-select');

    let vantagemParaResgatarId = null;

    // Função para atualizar o saldo do aluno no header
    const updateSaldoDisplay = async () => {
        const balanceElement = document.getElementById('user-balance-amount');
        if (!balanceElement) return;

        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
        
        if (role === 'ALUNO' && userInfo && userInfo.userId) {
            try {
                const response = await fetch(`${API_BASE_URL}/alunos/${userInfo.userId}/saldo`, {
                    headers: typeof AuthService !== 'undefined' && AuthService.getToken() ? {
                        'Authorization': `Bearer ${AuthService.getToken()}`
                    } : {}
                });
                
                if (response.ok) {
                    const saldo = await response.json(); // Resposta direta do saldo como número
                    balanceElement.textContent = (saldo || 0).toFixed(2);
                }
            } catch (error) {
                console.error('Erro ao atualizar saldo:', error);
            }
        }
    };

    // Função para enviar emails de confirmação de resgate
    const enviarEmailsResgate = async (vantagemId, alunoId, vantagemResgatada) => {
        try {
            console.log('Iniciando envio de emails para resgate...', { vantagemId, alunoId });
            
            // Buscar dados da vantagem (atualizada com QR code)
            const vantagemResponse = await fetch(`${API_BASE_URL}/vantagem/view/${vantagemId}`);
            if (!vantagemResponse.ok) {
                throw new Error('Erro ao buscar dados da vantagem');
            }
            const vantagem = await vantagemResponse.json();
            
            // Usar o QR code da vantagem resgatada (retornada pelo backend) ou buscar novamente
            let qrCodeBase64 = vantagemResgatada?.qrCodeBase64 || vantagem?.qrCodeBase64 || '';
            
            // Verificar se o QR Code já tem o prefixo data:image, caso contrário adicionar
            if (qrCodeBase64 && !qrCodeBase64.startsWith('data:image')) {
                qrCodeBase64 = `data:image/png;base64,${qrCodeBase64}`;
                console.log('✅ Prefixo data:image adicionado ao QR Code');
            }
            
            console.log('=== DEBUG QR CODE ===');
            console.log('vantagemResgatada:', vantagemResgatada);
            console.log('vantagemResgatada.qrCodeBase64:', vantagemResgatada?.qrCodeBase64);
            console.log('vantagem.qrCodeBase64:', vantagem?.qrCodeBase64);
            console.log('QR Code capturado:', qrCodeBase64 ? 'Sim (tamanho: ' + qrCodeBase64.length + ')' : 'Não disponível');
            console.log('QR Code preview (primeiros 100 chars):', qrCodeBase64 ? qrCodeBase64.substring(0, 100) : 'N/A');
            console.log('Tem prefixo data:image?', qrCodeBase64.startsWith('data:image'));
            console.log('===================');

            // Buscar dados do aluno
            const alunoResponse = await fetch(`${API_BASE_URL}/alunos/view/${alunoId}`);
            if (!alunoResponse.ok) {
                throw new Error('Erro ao buscar dados do aluno');
            }
            const aluno = await alunoResponse.json();

            // Buscar saldo atual do aluno
            const saldoResponse = await fetch(`${API_BASE_URL}/alunos/${alunoId}/saldo`);
            let saldoAtual = 0;
            if (saldoResponse.ok) {
                saldoAtual = await saldoResponse.json();
            }

            // Gerar código de resgate único
            const codigoResgate = `VTG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            // Validar dados obrigatórios
            console.log('Dados brutos recebidos:');
            console.log('Aluno:', aluno);
            console.log('Vantagem:', vantagem);
            
            // Verificar se emails existem
            if (!aluno.email) {
                console.error('Email do aluno não encontrado:', aluno);
                throw new Error('Email do aluno não está disponível');
            }
            
            if (!vantagem.empresa.email) {
                console.warn('Email da empresa não encontrado, usando fallback');
            }

            // Preparar dados para o email (usando email fixo para teste)
            const emailData = {
                alunoNome: aluno.nome || 'Aluno',
                alunoEmail: aluno.email || 'leockombat@gmail.com', // Fallback com email válido
                empresaNome: vantagem.empresa.razaoSocial || 'Empresa',
                empresaEmail: vantagem.empresa.email || 'leockombat@gmail.com', // Usando email real como fallback
                vantagemNome: vantagem.nome || 'Vantagem',
                vantagemDescricao: vantagem.descricao || 'Descrição não disponível',
                vantagemCusto: vantagem.custoMoedas ? vantagem.custoMoedas.toFixed(2) : '0.00',
                vantagemImagem: vantagem.fotoUrl || '', // Adicionando a URL da imagem da vantagem
                codigoResgate: codigoResgate,
                saldoAtual: saldoAtual ? saldoAtual.toFixed(2) : '0.00',
                qrCodeBase64: qrCodeBase64 // Adicionar QR code em base64
            };

            console.log('=== DADOS PARA EMAIL ===');
            console.log('emailData completo:', emailData);
            console.log('emailData.qrCodeBase64 existe?', !!emailData.qrCodeBase64);
            console.log('emailData.qrCodeBase64 tamanho:', emailData.qrCodeBase64?.length || 0);
            console.log('emailData.qrCodeBase64 preview:', emailData.qrCodeBase64 ? emailData.qrCodeBase64.substring(0, 100) + '...' : 'VAZIO!');
            console.log('========================');

            // Verificar se EmailService está disponível
            if (typeof EmailService !== 'undefined') {
                const emailResult = await EmailService.sendVantagemResgateEmail(emailData);
                
                if (emailResult.success) {
                    console.log('Emails enviados com sucesso!');
                    showToast('📧 Emails de confirmação enviados!', 'success');
                } else {
                    console.error('Erro ao enviar emails:', emailResult.error);
                    showToast('⚠️ Resgate realizado, mas erro no envio dos emails', 'warning');
                }
            } else {
                console.warn('EmailService não disponível');
                showToast('⚠️ Serviço de email não disponível', 'warning');
            }

        } catch (error) {
            console.error('Erro no processo de envio de emails:', error);
            showToast('⚠️ Erro ao enviar emails de confirmação', 'warning');
        }
    };

    // --- FUNÇÕES DE UTILIDADE ---
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // --- FUNÇÕES DE API ---
    const apiCall = async (url, method, body = null) => {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro na operação` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.status !== 204 ? await response.json() : true;
        } catch (error) {
            showToast(error.message, 'error');
            console.error(error);
            return null;
        }
    };

    // --- RENDERIZAÇÃO E DADOS ---
    const renderVantagemCard = (vantagem) => {
        const card = document.createElement('div');
        card.className = 'vantagem-card';
        card.dataset.id = vantagem.id;

        card.innerHTML = `
            <img src="${vantagem.fotoUrl}" alt="${vantagem.nome}" class="vantagem-card-imagem">
            <div class="vantagem-card-conteudo">
                <h3 class="vantagem-card-titulo">${vantagem.nome}</h3>
                <p class="vantagem-card-descricao">${vantagem.descricao}</p>
                <p class="vantagem-card-empresa">Oferecido por: <strong>${vantagem.empresa.razaoSocial}</strong></p>
                <div class="vantagem-card-footer">
                    <span class="vantagem-card-custo">${vantagem.custoMoedas.toFixed(2)} moedas</span>
                    <button class="btn-resgatar" data-vantagem-id="${vantagem.id}" data-vantagem-nome="${vantagem.nome}" data-vantagem-custo="${vantagem.custoMoedas.toFixed(2)}">Resgatar</button>
                </div>
            </div>
        `;
        return card;
    };

    const carregarVantagens = async () => {
        const vantagens = await apiCall(`${API_BASE_URL}/vantagem/ativas`, 'GET');
        if (vantagens && vantagensList) {
            vantagensList.innerHTML = '';
            if (vantagens.length === 0) {
                vantagensList.innerHTML = '<p>Nenhuma vantagem disponível no momento.</p>';
                return;
            }
            vantagens.forEach(vantagem => {
                vantagensList.appendChild(renderVantagemCard(vantagem));
            });
        }
    };

    const carregarAlunosParaSelecao = async () => {
        alunoSelect.innerHTML = '<option value="">Carregando alunos...</option>';
        const alunos = await apiCall(`${API_BASE_URL}/alunos/all`, 'GET');
        if (alunos) {
            alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
            alunos.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.id;
                option.textContent = `${aluno.nome} (ID: ${aluno.id})`;
                alunoSelect.appendChild(option);
            });
        } else {
            alunoSelect.innerHTML = '<option value="">Não foi possível carregar os alunos</option>';
        }
    };

    const carregarEmpresas = async () => {
        if (!empresaSelect) return;
        empresaSelect.innerHTML = '<option value="">Carregando empresas...</option>';
        const empresas = await apiCall(`${API_BASE_URL}/empresas/all`, 'GET');
        if (empresas) {
            empresaSelect.innerHTML = '<option value="">Selecione uma empresa</option>';
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.id;
                option.textContent = `${empresa.razaoSocial} (ID: ${empresa.id})`;
                empresaSelect.appendChild(option);
            });
        } else {
            empresaSelect.innerHTML = '<option value="">Não foi possível carregar as empresas</option>';
        }
    };

    // --- LÓGICA DE NEGÓCIO ---

    const handleCadastroVantagem = async (e) => {
        e.preventDefault();
        const formData = new FormData(vantagemForm);
        const data = Object.fromEntries(formData.entries());
        
        data.custoMoedas = parseFloat(data.custoMoedas);
        
        // Verificar se é empresa logada
        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
        
        let idEmpresa = data.empresaId;
        
        // Se for empresa logada, usar o ID da empresa logada
        if (role === 'EMPRESA' && userInfo && userInfo.userId) {
            idEmpresa = userInfo.userId;
        }

        if (!idEmpresa) {
            showToast('Por favor, selecione uma empresa.', 'error');
            return;
        }

        const payload = {
            nome: data.nome,
            descricao: data.descricao,
            fotoUrl: data.fotoUrl,
            custoMoedas: data.custoMoedas
        };

        const result = await apiCall(`${API_BASE_URL}/vantagem/${idEmpresa}`, 'POST', payload);

        if (result) {
            showToast('Vantagem cadastrada com sucesso!', 'success');
            vantagemForm.reset();
            carregarVantagens();
            // Recarrega as empresas para limpar a seleção (se não for empresa logada)
            if (role !== 'EMPRESA') {
                carregarEmpresas();
            }
        }
    };

    const abrirModalResgate = async (target) => {
        vantagemParaResgatarId = target.dataset.vantagemId;
        const nome = target.dataset.vantagemNome;
        const custo = target.dataset.vantagemCusto;

        if (resgateVantagemNome) resgateVantagemNome.textContent = nome;
        if (resgateVantagemCusto) resgateVantagemCusto.textContent = custo;
        
        // Verificar se é aluno logado
        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
        
        if (role === 'ALUNO' && userInfo && userInfo.userId) {
            // Se for aluno, usar o ID do aluno logado
            alunoSelect.innerHTML = `<option value="${userInfo.userId}">${userInfo.nome || 'Você'}</option>`;
            alunoSelect.value = userInfo.userId;
            alunoSelect.disabled = true;
        } else {
            // Se for professor ou outro, carregar lista de alunos
            alunoSelect.disabled = false;
            await carregarAlunosParaSelecao();
        }
        
        openModal(resgateModal);
    };

    const handleResgateVantagem = async () => {
        if (!vantagemParaResgatarId) return;

        const alunoId = alunoSelect.value;
        if (!alunoId) {
            showToast('Por favor, selecione um aluno.', 'error');
            return;
        }

        // URL dinâmica baseada na URL atual da página
        const urlVantagem = window.location.href;
        
        console.log('=== CHAMADA API RESGATE ===');
        console.log('URL da vantagem (window.location.href):', urlVantagem);
        console.log('URL codificada:', encodeURIComponent(urlVantagem));

        const url = `${API_BASE_URL}/vantagem/resgatar/${vantagemParaResgatarId}/aluno/${alunoId}/${encodeURIComponent(urlVantagem)}`;
        console.log('URL completa da API:', url);
        console.log('===========================');
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro na operação' }));
                
                // Verificar se é erro de moedas insuficientes
                if (errorData.message && (
                    errorData.message.toLowerCase().includes('moedas insuficientes') ||
                    errorData.message.toLowerCase().includes('insufficient')
                )) {
                    showToast('💰 Moedas insuficientes para realizar o resgate!', 'insufficient-funds');
                } else {
                    showToast(errorData.message || 'Erro ao resgatar vantagem', 'error');
                }
                return;
            }

            const result = await response.json();
            
            console.log('=== RESPOSTA DO BACKEND (RESGATE) ===');
            console.log('Result completo:', result);
            console.log('result.qrCodeBase64 existe?', !!result.qrCodeBase64);
            console.log('result.qrCodeBase64 preview:', result.qrCodeBase64 ? result.qrCodeBase64.substring(0, 100) : 'N/A');
            console.log('=====================================');
            
            if (result) {
                showToast('🎉 Vantagem resgatada com sucesso!', 'success');
                closeModal(resgateModal);
                carregarVantagens();
                // Atualizar saldo no header
                updateSaldoDisplay();

                // Enviar emails de confirmação passando a vantagem resgatada com QR code
                await enviarEmailsResgate(vantagemParaResgatarId, alunoId, result);
            }
        } catch (error) {
            console.error('Erro no resgate:', error);
            showToast('Erro de conexão. Tente novamente.', 'error');
        }
        
        vantagemParaResgatarId = null;
    };


    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    const init = () => {
        carregarVantagens();

        if (vantagemForm) {
            // Verificar se é empresa logada
            const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
            const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
            
            if (role === 'EMPRESA' && userInfo && userInfo.userId) {
                // Se for empresa logada, preencher automaticamente e ocultar o select
                const empresaSelect = document.getElementById('vantagem-empresa-select');
                if (empresaSelect) {
                    empresaSelect.innerHTML = `<option value="${userInfo.userId}">${userInfo.nome || 'Sua Empresa'}</option>`;
                    empresaSelect.value = userInfo.userId;
                    empresaSelect.disabled = true;
                }
            } else {
                // Se não for empresa logada, carregar lista de empresas
                carregarEmpresas();
            }
            
            vantagemForm.addEventListener('submit', handleCadastroVantagem);
        }

        if (resgateModal) {
            vantagensList.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-resgatar')) {
                    abrirModalResgate(e.target);
                }
            });

            confirmResgateBtn.addEventListener('click', handleResgateVantagem);

            resgateModal.querySelectorAll('[data-close]').forEach(el => {
                el.addEventListener('click', () => closeModal(resgateModal));
            });
        }
    };

    init();
});

