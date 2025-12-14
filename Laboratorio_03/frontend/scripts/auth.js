const AUTH_STORAGE_KEY = 'auth_data';

// --- FUNÇÕES DE AUTENTICAÇÃO ---
const AuthService = {
    // Salvar dados de autenticação no localStorage
    saveAuth(data) {
        const authData = {
            token: data.token,
            tipo: data.tipo,
            role: data.role,
            userId: data.userId,
            nome: data.nome
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    },

    // Obter dados de autenticação do localStorage
    getAuth() {
        const authData = localStorage.getItem(AUTH_STORAGE_KEY);
        return authData ? JSON.parse(authData) : null;
    },

    // Verificar se o usuário está autenticado
    isAuthenticated() {
        return this.getAuth() !== null;
    },

    // Obter o token de autenticação
    getToken() {
        const auth = this.getAuth();
        return auth ? auth.token : null;
    },

    // Obter a role do usuário
    getRole() {
        const auth = this.getAuth();
        return auth ? auth.role : null;
    },

    // Obter informações do usuário
    getUserInfo() {
        return this.getAuth();
    },

    // Fazer logout
    logout() {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    // Fazer login
    async login(email, senha) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.saveAuth(data);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// --- FUNÇÕES DE CONTROLE DE ACESSO ---
const AccessControl = {
    // Permissões por role
    permissions: {
        ALUNO: ['vantagens'],
        PROFESSOR: ['vantagens', 'acoes'],
        EMPRESA: ['vantagens'] // Empresa pode ver vantagens para gerenciar
    },

    // Verificar se a role tem permissão para acessar uma página
    canAccess(page) {
        const role = AuthService.getRole();
        if (!role) return false;

        const rolePermissions = this.permissions[role] || [];
        return rolePermissions.includes(page);
    },

    // Verificar acesso e redirecionar se necessário
    checkAccess(page) {
        // Se não estiver autenticado, redirecionar para login
        if (!AuthService.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }

        // Se não tiver permissão, redirecionar para vantagens
        if (!this.canAccess(page)) {
            window.location.href = 'vantagens.html';
            return false;
        }

        return true;
    },

    // Obter páginas permitidas para a role atual
    getAllowedPages() {
        const role = AuthService.getRole();
        if (!role) return [];
        return this.permissions[role] || [];
    }
};

// --- FUNÇÃO DE API COM AUTENTICAÇÃO ---
const authenticatedApiCall = async (url, method, body = null) => {
    try {
        const token = AuthService.getToken();
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `${AuthService.getAuth().tipo} ${token}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro na operação de ${method}` }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.status !== 204 ? await response.json() : true;
    } catch (error) {
        console.error('Erro na chamada da API:', error);
        throw error;
    }
};

