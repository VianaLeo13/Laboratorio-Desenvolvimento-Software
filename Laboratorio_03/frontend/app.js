document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (typeof AuthService !== 'undefined') {
        const role = AuthService.getRole();
        if (!role) {
            window.location.href = 'login.html';
            return;
        }
    }

    const apiUrls = {
        alunos: `${API_BASE_URL}/alunos`,
        empresas: `${API_BASE_URL}/empresas`,
        professores: `${API_BASE_URL}/professores`, // Endpoint de exemplo
    };

    const state = {
        alunos: [],
        empresas: [],
        professores: [],
        currentView: 'alunos',
        currentItemId: null,
    };

    // --- SELETORES ---
    const mainTitle = document.getElementById('main-title');
    const addBtn = document.getElementById('add-btn');
    const addBtnText = document.getElementById('add-btn-text');
    const toastContainer = document.getElementById('toast-container');
    const tabs = document.querySelectorAll('.tab-btn');
    const mainContents = {
        alunos: document.getElementById('main-content-alunos'),
        empresas: document.getElementById('main-content-empresas'),
        professores: document.getElementById('main-content-professores'),
        acoes: document.getElementById('main-content-acoes'),
    };
    const lists = {
        alunos: document.getElementById('alunos-list'),
        empresas: document.getElementById('empresas-list'),
        professores: document.getElementById('professores-list'),
    };
    const modals = {
        formAluno: document.getElementById('form-aluno-modal'),
        deleteAluno: document.getElementById('delete-aluno-confirm-modal'),
        formEmpresa: document.getElementById('form-empresa-modal'),
        deleteEmpresa: document.getElementById('delete-empresa-confirm-modal'),
        formProfessor: document.getElementById('form-professor-modal'),
        deleteProfessor: document.getElementById('delete-professor-confirm-modal'),
        detail: document.getElementById('detail-modal'),
    };
    const forms = {
        aluno: document.getElementById('aluno-form'),
        empresa: document.getElementById('empresa-form'),
        professor: document.getElementById('professor-form'),
        distributeCoins: document.getElementById('distribute-coins-form'),
    };
    const actionSelectors = {
        selectAluno: document.getElementById('select-aluno-acao'),
        selectProfessor: document.getElementById('select-professor-acao'),
        alunoView: document.getElementById('aluno-actions-view'),
        professorView: document.getElementById('professor-actions-view'),
        alunoSaldo: document.getElementById('aluno-saldo'),
        alunoExtrato: document.getElementById('aluno-extrato-list'),
        professorExtrato: document.getElementById('professor-extrato-list'),
    };

    // --- FUNÇÕES DE UTILIDADE ---
    const getSingular = (plural) => {
        const map = {
            alunos: 'aluno',
            empresas: 'empresa',
            professores: 'professor',
        };
        return map[plural];
    };
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const openModal = (modal) => modal.setAttribute('aria-hidden', 'false');
    const closeModal = (modal) => modal.setAttribute('aria-hidden', 'true');

    // --- FUNÇÕES DE API ---
    const apiCall = async (url, method, body = null) => {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            
            // Adicionar token de autenticação se disponível
            if (typeof AuthService !== 'undefined' && AuthService.isAuthenticated()) {
                const auth = AuthService.getAuth();
                if (auth && auth.token) {
                    options.headers['Authorization'] = `${auth.tipo} ${auth.token}`;
                }
            }
            
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro na operação de ${method}` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return response.status !== 204 ? await response.json() : true;
        } catch (error) {
            showToast(error.message, 'error');
            return null;
        }
    };

    const fetchData = async (entity) => {
        try {
            const url = entity === 'professores' ? apiUrls[entity] : `${apiUrls[entity]}/all`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao buscar ${entity}.`);
            state[entity] = await response.json();
        } catch (error) {
            showToast(error.message, 'error');
            state[entity] = [];
        }
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const renderCard = (item, type) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;
        let content = '';
        if (type === 'alunos') content = `<h3>${item.nome}</h3><p>${item.email}</p>`;
        else if (type === 'empresas') content = `<h3>${item.razaoSocial}</h3><p>CNPJ: ${item.cnpj}</p>`;
        else if (type === 'professores') content = `<h3>${item.nome}</h3><p>${item.departamento}</p>`;

        card.innerHTML = `
            <div class="card-content">${content}</div>
            <div class="card-actions">
                <button class="btn-icon edit-btn" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg></button>
                <button class="btn-icon delete-btn" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
            </div>`;
        return card;
    };

    const renderAll = () => {
        const view = state.currentView;
        if (!lists[view]) return;
        const list = lists[view];
        const data = state[view];
        list.innerHTML = '';
        if (!data || data.length === 0) {
            list.innerHTML = `<p>Nenhum item cadastrado.</p>`;
            return;
        }
        data.forEach(item => list.appendChild(renderCard(item, view)));
    };

    // --- NAVEGAÇÃO E VISIBILIDADE ---
    const switchView = async (view) => {
        // Verificar permissões para acessar a aba de ações
        if (view === 'acoes') {
            const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
            if (role !== 'PROFESSOR') {
                showToast('Apenas professores podem acessar esta seção.', 'error');
                window.location.href = 'vantagens.html';
                return;
            }
        }
        
        // Limpar campos da aba de ações ao sair dela
        if (state.currentView === 'acoes' && view !== 'acoes') {
            clearActionFields();
        }
        
        state.currentView = view;
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === view));
        Object.values(mainContents).forEach(content => content.classList.add('hidden'));
        mainContents[view].classList.remove('hidden');
        addBtn.classList.toggle('hidden', view === 'acoes');

        const icons = {
            alunos: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
            empresas: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
            professores: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
            acoes: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
        };
        const titles = { alunos: 'Alunos', empresas: 'Empresas', professores: 'Professores', acoes: 'Ações' };
        mainTitle.innerHTML = icons[view] + titles[view];
        if (view !== 'acoes') addBtnText.textContent = `Novo ${capitalize(getSingular(view))}`;

        if (view !== 'acoes') {
            await fetchData(view);
            renderAll();
        } else {
            await populateActionSelects();
            
            // Se for professor logado, inicializar automaticamente
            const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
            if (role === 'PROFESSOR') {
                const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
                if (userInfo && userInfo.userId) {
                    // Ocultar select de professor
                    const selectProfessorGroup = document.getElementById('select-professor-group');
                    if (selectProfessorGroup) {
                        selectProfessorGroup.style.display = 'none';
                    }
                    
                    // Preencher automaticamente com o professor logado
                    const professorId = userInfo.userId;
                    forms.distributeCoins.querySelector('#distribute-professor-id').value = professorId;
                    
                    // Popular o select de alunos
                    const alunoSelect = document.getElementById('distribute-aluno-id');
                    alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
                    state.alunos.forEach(aluno => {
                        alunoSelect.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
                    });
                    
                    // Mostrar a view de ações do professor
                    actionSelectors.professorView.classList.remove('hidden');
                    
                    // Carregar extrato do professor
                    const extrato = await apiCall(`${apiUrls.professores}/${professorId}/extrato`, 'GET');
                    renderStatementTable(actionSelectors.professorExtrato, extrato, true);
                }
            }
        }
    };

    // --- LÓGICA DE CRUD ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formId = form.getAttribute('id'); // Use getAttribute to avoid conflict with input name="id"

        let entity, entityPlural;
        if (formId === 'aluno-form') {
            entity = 'aluno';
            entityPlural = 'alunos';
        } else if (formId === 'empresa-form') {
            entity = 'empresa';
            entityPlural = 'empresas';
        } else if (formId === 'professor-form') {
            entity = 'professor';
            entityPlural = 'professores';
        } else {
            return; // Not a form we handle
        }

        const id = form.querySelector(`[name="id"]`).value;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let url, payload, result;

        if (entity === 'aluno') {
            url = id ? `${apiUrls.alunos}/update/${id}` : `${apiUrls.alunos}/cadastrar`;
            payload = { nome: data.nome, email: data.email, cpf: data.cpf, rg: data.rg, endereco: data.endereco };
            if (!id) payload.senha = data.senha;
        } else if (entity === 'empresa') {
            url = id ? `${apiUrls.empresas}/update/${id}` : `${apiUrls.empresas}/create`;
            payload = { razaoSocial: data.razaoSocial, cnpj: data.cnpj, email: data.email, telefone: data.telefone };
            if (!id) payload.senha = data.senha;
        } else if (entity === 'professor') {
            url = id ? `${apiUrls.professores}/${id}` : apiUrls.professores;
            payload = { nome: data.nome, email: data.email, cpf: data.cpf, departamento: data.departamento, instituicao: data.instituicao };
            if (!id) payload.senha = data.senha;
        }

        result = await apiCall(url, id ? 'PUT' : 'POST', payload);

        if (result) {
            closeModal(modals[`form${capitalize(entity)}`]);
            showToast(`${capitalize(entity)} ${id ? 'atualizado' : 'criado'} com sucesso!`, 'success');
            await fetchData(entityPlural);

            if (state.currentView === entityPlural) {
                renderAll();
            }
        }
    };

    const openAddModal = () => {
        const entity = getSingular(state.currentView);
        const form = forms[entity];
        form.reset();
        form.querySelector(`[name="id"]`).value = '';
        document.getElementById(`form-${entity}-title`).textContent = `Cadastrar Novo ${capitalize(entity)}`;
        document.getElementById(`${entity}-senha-group`).classList.remove('hidden');
        openModal(modals[`form${capitalize(entity)}`]);
    };

    const openEditModal = (entity, item) => {
        const form = forms[entity];
        form.reset();
        document.getElementById(`form-${entity}-title`).textContent = `Editar ${capitalize(entity)}`;
        document.getElementById(`${entity}-senha-group`).classList.add('hidden');

        for (const key in item) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = item[key];
        }
        openModal(modals[`form${capitalize(entity)}`]);
    };

    const openDeleteModal = (entity, item) => {
        state.currentItemId = item.id;
        document.getElementById(`delete-${entity}-name`).textContent = item.nome || item.razaoSocial;
        openModal(modals[`delete${capitalize(entity)}`]);
    };

    const confirmDelete = async () => {
        const entityPlural = state.currentView;
        const entitySingular = getSingular(entityPlural);
        const id = state.currentItemId;
        const url = `${apiUrls[entityPlural]}/${id}`;
        const success = await apiCall(url, 'DELETE');

        if (success) {
            closeModal(modals[`delete${capitalize(entitySingular)}`]);
            showToast(`${capitalize(entitySingular)} excluído com sucesso!`, 'success');
            state.currentItemId = null;
            await fetchData(entityPlural);
            renderAll();
        }
    };

    const showDetailModal = (entity, item) => {
        const content = document.getElementById('detail-modal-content');
        let detailsHtml = `<div class="profile-card"><div class="profile-header"><h2 class="profile-title">${item.nome || item.razaoSocial}</h2></div><div class="profile-body">`;
        const detailsMap = {
            aluno: { 'Email': 'email', 'CPF': 'cpf', 'RG': 'rg', 'Endereço': 'endereco' },
            empresa: { 'Email': 'email', 'CNPJ': 'cnpj', 'Telefone': 'telefone' },
            professor: { 'Email': 'email', 'CPF': 'cpf', 'Departamento': 'departamento', 'Instituição': 'instituicao' }
        };

        for (const [label, key] of Object.entries(detailsMap[entity])) {
            detailsHtml += `<p><strong>${label}:</strong> ${item[key] || 'N/A'}</p>`;
        }
        detailsHtml += `</div></div>`;
        content.innerHTML = detailsHtml;
        openModal(modals.detail);
    };

    // --- LÓGICA DE AÇÕES ---
    const clearActionFields = () => {
        // Limpar select de aluno e esconder view
        actionSelectors.selectAluno.value = '';
        actionSelectors.alunoView.classList.add('hidden');
        actionSelectors.alunoSaldo.textContent = 'R$ 0,00';
        actionSelectors.alunoExtrato.innerHTML = '<p>Nenhuma transação encontrada.</p>';
        
        // Limpar select de professor e esconder view
        actionSelectors.selectProfessor.value = '';
        actionSelectors.professorView.classList.add('hidden');
        actionSelectors.professorExtrato.innerHTML = '<p>Nenhum envio encontrado.</p>';
        
        // Limpar formulário de distribuição de moedas
        forms.distributeCoins.reset();
        document.getElementById('distribute-professor-id').value = '';
        
        // Limpar select de alunos no formulário
        const alunoSelect = document.getElementById('distribute-aluno-id');
        alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
    };

    const populateActionSelects = async () => {
        await Promise.all([fetchData('alunos'), fetchData('professores')]);
        const populate = (select, items, placeholder) => {
            select.innerHTML = `<option value="">${placeholder}</option>`;
            items.forEach(item => {
                select.innerHTML += `<option value="${item.id}">${item.nome || item.razaoSocial}</option>`;
            });
        };
        populate(actionSelectors.selectAluno, state.alunos, 'Selecione um aluno');
        
        // Só popular select de professor se não for professor logado
        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        if (role !== 'PROFESSOR') {
            populate(actionSelectors.selectProfessor, state.professores, 'Selecione um professor');
        }
    };

    const handleAlunoActionSelect = async ({ target }) => {
        actionSelectors.alunoView.classList.toggle('hidden', !target.value);
        if (!target.value) return;

        const id = target.value;
        
        try {
            const saldoResponse = await apiCall(`${apiUrls.alunos}/${id}/saldo`, 'GET');
            
            // Tratar diferentes formatos de resposta
            let saldoValue = null;
            
            if (saldoResponse !== null && saldoResponse !== undefined) {
                // Se for um número direto
                if (typeof saldoResponse === 'number') {
                    saldoValue = saldoResponse;
                }
                // Se for um objeto com propriedade saldo
                else if (typeof saldoResponse === 'object' && saldoResponse.saldo !== undefined) {
                    saldoValue = saldoResponse.saldo;
                }
                // Se for um objeto com outra propriedade (ex: valor, quantidade, etc)
                else if (typeof saldoResponse === 'object') {
                    // Tentar encontrar qualquer propriedade numérica
                    const numericKeys = Object.keys(saldoResponse).filter(key => 
                        typeof saldoResponse[key] === 'number'
                    );
                    if (numericKeys.length > 0) {
                        saldoValue = saldoResponse[numericKeys[0]];
                    }
                }
            }
            
            // Exibir o saldo
            if (saldoValue !== null && saldoValue !== undefined) {
                actionSelectors.alunoSaldo.textContent = `R$ ${parseFloat(saldoValue).toFixed(2)}`;
            } else {
                actionSelectors.alunoSaldo.textContent = 'R$ 0,00';
                console.warn('Formato de resposta do saldo não reconhecido:', saldoResponse);
            }
        } catch (error) {
            console.error('Erro ao buscar saldo:', error);
            actionSelectors.alunoSaldo.textContent = 'Erro ao buscar saldo.';
        }

        const extrato = await apiCall(`${apiUrls.alunos}/${id}/extrato-transacoes`, 'GET');
        renderStatementTable(actionSelectors.alunoExtrato, extrato, false);
    };

    const handleProfessorActionSelect = async ({ target }) => {
        actionSelectors.professorView.classList.toggle('hidden', !target.value);
        if (!target.value) return;

        const id = target.value;
        forms.distributeCoins.querySelector('#distribute-professor-id').value = id;
        
        // Popular o select de alunos
        const alunoSelect = document.getElementById('distribute-aluno-id');
        alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
        state.alunos.forEach(aluno => {
            alunoSelect.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
        });
        
        const extrato = await apiCall(`${apiUrls.professores}/${id}/extrato`, 'GET');
        renderStatementTable(actionSelectors.professorExtrato, extrato, true);
    };

    const handleDistributeCoins = async (e) => {
        e.preventDefault();
        
        // Obter ID do professor (do campo hidden ou do usuário logado)
        let professorId = forms.distributeCoins.querySelector('#distribute-professor-id').value;
        
        // Se não tiver ID no campo, tentar pegar do usuário logado
        if (!professorId) {
            const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
            const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
            if (role === 'PROFESSOR' && userInfo && userInfo.userId) {
                professorId = userInfo.userId;
            }
        }
        
        if (!professorId) {
            showToast('Erro: Professor não identificado', 'error');
            return;
        }
        
        const { alunoId, quantidadeMoedas, motivo } = Object.fromEntries(new FormData(forms.distributeCoins));
        
        // Buscar informações do professor e do aluno
        // Se for professor logado, tentar usar informações do AuthService, mas buscar email do state se necessário
        let professor;
        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        const userInfo = typeof AuthService !== 'undefined' ? AuthService.getUserInfo() : null;
        
        if (role === 'PROFESSOR' && userInfo) {
            // Buscar professor completo no state para ter o email
            const professorFromState = state.professores.find(p => p.id == professorId);
            if (professorFromState) {
                professor = professorFromState;
            } else {
                // Se não encontrar no state, usar informações do AuthService
                professor = {
                    id: userInfo.userId,
                    nome: userInfo.nome,
                    email: userInfo.email || ''
                };
            }
        } else {
            // Buscar no state
            professor = state.professores.find(p => p.id == professorId);
        }
        
        const aluno = state.alunos.find(a => a.id == alunoId);
        
        if (!professor || !aluno) {
            showToast('Erro: Professor ou Aluno não encontrado', 'error');
            return;
        }

        const result = await apiCall(`${apiUrls.professores}/${professorId}/distribuir_moedas`, 'POST', { 
            alunoId: parseInt(alunoId), 
            quantidadeMoedas: parseFloat(quantidadeMoedas), 
            motivo 
        });

        if (result) {
            console.log('Transação de moedas bem sucedida, enviando emails para:', {
                professor: professor.nome,
                professorEmail: professor.email,
                aluno: aluno.nome,
                alunoEmail: aluno.email
            });

            // Enviar notificações por email
            try {
                const emailResult = await EmailService.sendCoinTransferNotification({
                    professorName: professor.nome,
                    professorEmail: professor.email,
                    studentName: aluno.nome,
                    studentEmail: aluno.email,
                    coinAmount: parseFloat(quantidadeMoedas),
                    reason: motivo
                });

                console.log('Resultado do envio de email:', emailResult);

                if (emailResult.success) {
                    showToast('Moedas distribuídas e notificações enviadas com sucesso!', 'success');
                } else {
                    showToast('Moedas distribuídas, mas houve um erro ao enviar as notificações.', 'warning');
                }
            } catch (error) {
                console.error('Erro ao enviar emails:', error);
                showToast('Moedas distribuídas, mas houve um erro ao enviar as notificações: ' + error.message, 'warning');
            }

            forms.distributeCoins.reset();
            // Manter o ID do professor no campo hidden
            document.getElementById('distribute-professor-id').value = professorId;
            // Recarregar select de alunos
            const alunoSelect = document.getElementById('distribute-aluno-id');
            alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
            state.alunos.forEach(aluno => {
                alunoSelect.innerHTML += `<option value="${aluno.id}">${aluno.nome}</option>`;
            });
            const extrato = await apiCall(`${apiUrls.professores}/${professorId}/extrato`, 'GET');
            renderStatementTable(actionSelectors.professorExtrato, extrato, true);
        }
    };

    const renderStatementTable = (container, transactions, isProfessor) => {
        if (!transactions || transactions.length === 0) {
            container.innerHTML = '<p>Nenhuma transação encontrada.</p>';
            return;
        }
        const table = document.createElement('table');
        table.className = 'data-table';
        const headers = isProfessor ? ['Aluno', 'Moedas', 'Motivo', 'Data'] : ['Professor', 'Moedas', 'Motivo', 'Data'];
        table.innerHTML = `<thead><tr><th>${headers.join('</th><th>')}</th></tr></thead>`;
        const tbody = document.createElement('tbody');
        transactions.forEach(tx => {
            const targetName = isProfessor ? tx.aluno?.nome : tx.professor?.nome;
            tbody.innerHTML += `<tr>
                <td>${targetName || 'N/A'}</td>
                <td>${tx.quantidadeMoedas?.toFixed(2) || '0.00'}</td>
                <td>${tx.motivo || ''}</td>
                <td>${new Date(tx.dataHora).toLocaleString()}</td>
            </tr>`;
        });
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);
    };

    // --- INICIALIZAÇÃO ---
    const init = async () => {
        document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el.closest('.modal'))));
        tabs.forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.tab)));
        addBtn.addEventListener('click', openAddModal);

        forms.aluno.addEventListener('submit', handleFormSubmit);
        forms.empresa.addEventListener('submit', handleFormSubmit);
        forms.professor.addEventListener('submit', handleFormSubmit);
        forms.distributeCoins.addEventListener('submit', handleDistributeCoins);

        actionSelectors.selectAluno.addEventListener('change', handleAlunoActionSelect);
        actionSelectors.selectProfessor.addEventListener('change', handleProfessorActionSelect);

        document.getElementById('confirm-delete-aluno-btn').addEventListener('click', confirmDelete);
        document.getElementById('confirm-delete-empresa-btn').addEventListener('click', confirmDelete);
        document.getElementById('confirm-delete-professor-btn').addEventListener('click', confirmDelete);

        Object.keys(lists).forEach(entityPlural => {
            lists[entityPlural].addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (!card) return;
                const id = card.dataset.id;
                const entitySingular = getSingular(entityPlural);
                const item = state[entityPlural].find(i => i.id == id);
                if (!item) return;

                if (e.target.closest('.edit-btn')) {
                    openEditModal(entitySingular, item);
                } else if (e.target.closest('.delete-btn')) {
                    openDeleteModal(entitySingular, item);
                } else {
                    showDetailModal(entitySingular, item);
                }
            });
        });

        // Verificar se é professor para iniciar na view de ações
        const role = typeof AuthService !== 'undefined' ? AuthService.getRole() : null;
        const initialView = role === 'PROFESSOR' ? 'acoes' : 'alunos';
        await switchView(initialView);
        
        // Tornar switchView acessível globalmente para uso externo
        window.switchView = switchView;
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    init();
});