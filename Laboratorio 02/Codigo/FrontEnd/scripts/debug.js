// Arquivo de debug para testar conectividade com o backend
class DebugService {
    constructor() {
        this.apiService = window.apiService;
    }

    async testBackendConnection() {
        console.log('🔍 Testando conectividade com o backend...');
        
        try {
            // Teste 1: Verificar se o backend está rodando
            console.log('📡 Testando endpoint básico...');
            const response = await fetch('http://localhost:8080/auth/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Status da resposta:', response.status);
            console.log('📋 Headers da resposta:', [...response.headers.entries()]);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Dados recebidos:', data);
                return true;
            } else {
                console.log('❌ Erro na resposta:', response.status, response.statusText);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro de conectividade:', error);
            
            if (error.message.includes('CORS')) {
                console.log('🚫 Problema de CORS detectado');
                console.log('💡 Soluções:');
                console.log('   1. Verifique se o backend está rodando');
                console.log('   2. Confirme se a configuração de CORS está correta');
                console.log('   3. Reinicie o backend após as alterações de CORS');
            } else if (error.message.includes('Failed to fetch')) {
                console.log('🔌 Problema de conexão detectado');
                console.log('💡 Soluções:');
                console.log('   1. Verifique se o backend está rodando na porta 8080');
                console.log('   2. Teste: curl http://localhost:8080/auth/usuarios');
                console.log('   3. Verifique se não há firewall bloqueando');
            }
            
            return false;
        }
    }

    async testLogin() {
        console.log('🔐 Testando login...');
        
        try {
            const testData = {
                email: 'test@test.com',
                password: '123456'
            };
            
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testData)
            });
            
            console.log('📡 Status do login:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Login funcionando:', data);
                return true;
            } else {
                const errorText = await response.text();
                console.log('❌ Erro no login:', errorText);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro no teste de login:', error);
            return false;
        }
    }

    async runFullDiagnostic() {
        console.log('🏥 Iniciando diagnóstico completo...');
        console.log('='.repeat(50));
        
        // Teste 1: Conectividade básica
        const connectionOk = await this.testBackendConnection();
        
        if (connectionOk) {
            console.log('='.repeat(50));
            // Teste 2: Login
            await this.testLogin();
        }
        
        console.log('='.repeat(50));
        console.log('🏁 Diagnóstico concluído');
        
        return connectionOk;
    }

    // Método para testar CORS especificamente
    async testCORS() {
        console.log('🌐 Testando CORS...');
        
        const testOrigins = [
            'http://localhost:8000',
            'http://localhost:3000',
            'http://127.0.0.1:8000',
            'file://'
        ];
        
        for (const origin of testOrigins) {
            try {
                console.log(`🔍 Testando origem: ${origin}`);
                
                const response = await fetch('http://localhost:8080/auth/usuarios', {
                    method: 'OPTIONS',
                    headers: {
                        'Origin': origin,
                        'Access-Control-Request-Method': 'GET',
                        'Access-Control-Request-Headers': 'Content-Type'
                    }
                });
                
                console.log(`✅ ${origin}: Status ${response.status}`);
                
                const corsHeaders = {
                    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
                };
                
                console.log(`📋 Headers CORS:`, corsHeaders);
                
            } catch (error) {
                console.log(`❌ ${origin}: Erro -`, error.message);
            }
        }
    }
}

// Instância global do serviço de debug
window.debugService = new DebugService();

// Funções globais para debug
window.testBackend = () => debugService.testBackendConnection();
window.testLogin = () => debugService.testLogin();
window.runDiagnostic = () => debugService.runFullDiagnostic();
window.testCORS = () => debugService.testCORS();

// Auto-executar diagnóstico quando carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛠️ Serviço de debug carregado');
    console.log('💡 Comandos disponíveis:');
    console.log('   - testBackend() - Testar conectividade');
    console.log('   - testLogin() - Testar login');
    console.log('   - runDiagnostic() - Diagnóstico completo');
    console.log('   - testCORS() - Testar CORS');
});
