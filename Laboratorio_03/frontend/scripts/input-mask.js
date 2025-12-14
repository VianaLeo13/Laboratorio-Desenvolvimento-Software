// Função para aplicar máscara em tempo real
function applyInputMask(input, mask) {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formatted = '';
        let maskIndex = 0;
        let valueIndex = 0;

        while (maskIndex < mask.length && valueIndex < value.length) {
            if (mask[maskIndex] === '0') {
                formatted += value[valueIndex];
                valueIndex++;
            } else {
                formatted += mask[maskIndex];
            }
            maskIndex++;
        }

        e.target.value = formatted;
    });
}

// Função para inicializar as máscaras em todos os campos
function initializeMasks() {
    // Máscara para CPF
    document.querySelectorAll('.cpf-input input').forEach(input => {
        applyInputMask(input, '000.000.000-00');
    });

    // Máscara para CNPJ
    document.querySelectorAll('.cnpj-input input').forEach(input => {
        applyInputMask(input, '00.000.000/0000-00');
    });

    // Máscara para RG
    document.querySelectorAll('.rg-input input').forEach(input => {
        applyInputMask(input, '00.000.000-0');
    });

    // Máscara para telefone
    document.querySelectorAll('.phone-input input').forEach(input => {
        applyInputMask(input, '(00) 00000-0000');
    });
}

// Inicializa as máscaras quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeMasks);

// Função para validar email em tempo real
function validateEmail(input) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input.value);
    
    if (isValid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
}

// Adiciona validação de email em tempo real
document.querySelectorAll('.email-input input').forEach(input => {
    input.addEventListener('input', (e) => validateEmail(e.target));
});

// Função para limitar caracteres especiais em campos de texto
function limitSpecialChars(input) {
    input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, '');
}

// Aplica limitação de caracteres especiais em campos de texto simples
document.querySelectorAll('input[type="text"]:not([class*="formatted-input"])').forEach(input => {
    input.addEventListener('input', (e) => limitSpecialChars(e.target));
});
