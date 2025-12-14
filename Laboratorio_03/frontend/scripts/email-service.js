// Email Service Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_cjljvsm',          // EmailJS Service ID
    TEMPLATE_ID_COIN_TRANSFER: 'template_wc0x76f', // Template ID for coin transfers
    TEMPLATE_ID_VANTAGEM_RESGATE: 'template_490zcob', // Template ID for advantage redemption
    PUBLIC_KEY: 'imeF22271UN2bcGWD'         // EmailJS Public Key
};

// Initialize EmailJS
(function() {
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar EmailJS:', error);
    }
})();

class EmailService {
    static async sendCoinTransferEmail(recipientName, recipientEmail, senderName, coinAmount, reason, isStudent = false) {
        const time = new Date().toLocaleString();
        
        try {
            // Validar email
            if (!recipientEmail || !recipientEmail.includes('@')) {
                throw new Error(`Email inválido: ${recipientEmail}`);
            }

            console.log('Enviando email com os dados:', {
                recipientName,
                recipientEmail,
                senderName,
                coinAmount,
                reason,
                isStudent
            });

            const templateParams = {
                to_email: recipientEmail, // Este é o campo mais importante - define para onde o email será enviado
                recipientName,  // Nome de quem recebe o email
                coinAmount,     // Quantidade de moedas
                reason,        // Motivo da transferência
                time,         // Data/hora
                title: isStudent ? `Recebimento de Moedas` : `Confirmação de Envio de Moedas`,
                message: isStudent 
                    ? `Você recebeu ${coinAmount} moedas do professor ${senderName}.`
                    : `Você enviou ${coinAmount} moedas para ${senderName}.`
            };

            console.log('Parâmetros do template:', templateParams);

            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID_COIN_TRANSFER,
                templateParams
            );
            
            console.log('Email enviado com sucesso:', response);
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }
    }

    static async sendCoinTransferNotification(data) {
        const { professorName, professorEmail, studentName, studentEmail, coinAmount, reason } = data;

        try {
            // Send notification to professor
            const professorNotification = await this.sendCoinTransferEmail(
                professorName, 
                professorEmail, 
                studentName, 
                coinAmount, 
                reason, 
                false
            );

            // Send notification to student
            const studentNotification = await this.sendCoinTransferEmail(
                studentName, 
                studentEmail, 
                professorName, 
                coinAmount, 
                reason, 
                true
            );

            if (!professorNotification.success || !studentNotification.success) {
                throw new Error('Failed to send one or more notifications');
            }

            return { success: true };
        } catch (error) {
            console.error('Error in coin transfer notification:', error);
            return { success: false, error };
        }
    }

    static async sendVantagemResgateEmail(data) {
        const { 
            alunoNome, 
            alunoEmail, 
            empresaNome, 
            empresaEmail,
            vantagemNome, 
            vantagemDescricao, 
            vantagemCusto, 
            vantagemImagem,
            codigoResgate,
            saldoAtual,
            qrCodeBase64  // Adicionar QR code em base64
        } = data;

        const dataResgate = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        try {
            console.log('Enviando emails de resgate de vantagem...', data);

            // Validar emails antes de enviar
            if (!alunoEmail || !alunoEmail.includes('@')) {
                throw new Error(`Email do aluno inválido: ${alunoEmail}`);
            }
            
            if (!empresaEmail || !empresaEmail.includes('@')) {
                throw new Error(`Email da empresa inválido: ${empresaEmail}`);
            }

            // Enviar email para o aluno
            const alunoTemplateParams = {
                to_email: alunoEmail,      // Campo principal
                email: alunoEmail,         // Alternativa 1
                user_email: alunoEmail,    // Alternativa 2
                recipient_email: alunoEmail, // Alternativa 3
                aluno_nome: alunoNome,
                vantagem_nome: vantagemNome,
                vantagem_descricao: vantagemDescricao,
                vantagem_custo: vantagemCusto,
                vantagem_imagem: vantagemImagem || '', // URL da imagem da vantagem
                empresa_nome: empresaNome,
                codigo_resgate: codigoResgate,
                data_resgate: dataResgate,
                saldo_atual: saldoAtual,
                qr_code_base64: qrCodeBase64 || '' // Adicionar QR code em base64
            };

            console.log('Enviando email para o aluno:', alunoTemplateParams);
            console.log('Template ID:', EMAILJS_CONFIG.TEMPLATE_ID_VANTAGEM_RESGATE);
            console.log('Service ID:', EMAILJS_CONFIG.SERVICE_ID);

            // Tentar enviar email para o aluno primeiro
            try {
                console.log('Tentando enviar email com emailjs.send...');
                const alunoResponse = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID_VANTAGEM_RESGATE,
                    alunoTemplateParams
                );
                console.log('Email do aluno enviado com sucesso:', alunoResponse);
            } catch (alunoError) {
                console.error('Erro detalhado ao enviar email para o aluno:', alunoError);
                console.error('Status:', alunoError.status);
                console.error('Text:', alunoError.text);
                
                // Tentar com um template de teste mais simples
                console.log('Tentando enviar com template simplificado...');
                const templateSimples = {
                    to_email: alunoEmail,
                    email: alunoEmail,
                    user_email: alunoEmail,
                    recipient_email: alunoEmail,
                    message: `Teste de email - Vantagem ${vantagemNome} resgatada por ${alunoNome}`,
                    subject: 'Teste de Resgate de Vantagem'
                };
                
                try {
                    const testeResponse = await emailjs.send(
                        EMAILJS_CONFIG.SERVICE_ID,
                        EMAILJS_CONFIG.TEMPLATE_ID_VANTAGEM_RESGATE,
                        templateSimples
                    );
                    console.log('Email teste enviado:', testeResponse);
                } catch (testeError) {
                    console.error('Erro no teste também:', testeError);
                }
                
                throw new Error(`Erro no email do aluno: ${alunoError.text || alunoError.message}`);
            }

            // Enviar email para a empresa
            const empresaTemplateParams = {
                to_email: empresaEmail,      // Campo principal
                email: empresaEmail,         // Alternativa 1
                user_email: empresaEmail,    // Alternativa 2
                recipient_email: empresaEmail, // Alternativa 3
                aluno_nome: alunoNome,
                vantagem_nome: vantagemNome,
                vantagem_descricao: vantagemDescricao,
                vantagem_custo: vantagemCusto,
                vantagem_imagem: vantagemImagem || '', // URL da imagem da vantagem
                empresa_nome: empresaNome,
                codigo_resgate: codigoResgate,
                data_resgate: dataResgate,
                saldo_atual: saldoAtual,
                qr_code_base64: qrCodeBase64 || '' // Adicionar QR code em base64
            };

            console.log('Enviando email para a empresa:', empresaTemplateParams);

            try {
                const empresaResponse = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID_VANTAGEM_RESGATE,
                    empresaTemplateParams
                );
                console.log('Email da empresa enviado com sucesso:', empresaResponse);
            } catch (empresaError) {
                console.error('Erro ao enviar email para a empresa:', empresaError);
                // Não falhar se apenas o email da empresa der erro
                console.warn('Continuando apesar do erro no email da empresa');
            }

            return { success: true };
        } catch (error) {
            console.error('Erro ao enviar emails de resgate de vantagem:', error);
            return { success: false, error };
        }
    }
}

// Example usage:
// const form = document.getElementById('contact-form');
// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = {
//         name: form.querySelector('[name="name"]').value,
//         email: form.querySelector('[name="email"]').value,
//         message: form.querySelector('[name="message"]').value
//     };
//     
//     const result = await EmailService.sendContactForm(formData);
//     if (result.success) {
//         alert('Message sent successfully!');
//         form.reset();
//     } else {
//         alert('Failed to send message. Please try again.');
//     }
// });
