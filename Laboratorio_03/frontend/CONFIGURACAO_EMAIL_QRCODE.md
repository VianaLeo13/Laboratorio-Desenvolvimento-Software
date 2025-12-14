# Configuração do Template EmailJS com QR Code

## 📧 Como configurar o template no EmailJS para exibir o QR Code

### 1. Acesse seu Dashboard do EmailJS
- Vá para [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
- Faça login na sua conta

### 2. Navegue até o Template de Resgate de Vantagem
- No menu lateral, clique em **Email Templates**
- Procure pelo template com ID: `template_490zcob`
- Clique para editar

### 3. Adicione o QR Code ao Template

#### Opção 1: QR Code como Imagem Inline (Recomendado)
Adicione este código HTML no corpo do seu template onde você quer que o QR Code apareça:

```html
<div style="text-align: center; margin: 30px 0;">
    <h3 style="color: #FFB800; margin-bottom: 15px;">🎫 Seu Código de Resgate</h3>
    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
        Use este QR Code para validar seu resgate na empresa parceira
    </p>
    
    {{#if qr_code_base64}}
    <div style="background: white; padding: 20px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img src="{{qr_code_base64}}" 
             alt="QR Code de Resgate" 
             style="max-width: 250px; height: auto; border: 3px solid #FFB800; border-radius: 8px;">
    </div>
    {{/if}}
    
    <p style="margin-top: 20px; font-size: 16px; font-weight: bold; color: #333;">
        Código: <span style="color: #FFB800;">{{codigo_resgate}}</span>
    </p>
</div>
```

#### Opção 2: Template Completo com QR Code

Aqui está um exemplo de template completo e bonito:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #FFB800, #FFD700);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 10px;
        }
        .qr-code {
            background: white;
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .qr-code img {
            max-width: 250px;
            height: auto;
            border: 3px solid #FFB800;
            border-radius: 8px;
        }
        .info-box {
            background: #f0f8ff;
            padding: 20px;
            border-left: 4px solid #FFB800;
            margin: 20px 0;
        }
        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Vantagem Resgatada!</h1>
            <p>Sistema de Moeda Estudantil</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p>Olá <strong>{{aluno_nome}}</strong>,</p>
            
            <p>Parabéns! Você resgatou com sucesso a seguinte vantagem:</p>
            
            <!-- Vantagem Info -->
            <div class="info-box">
                <h2 style="margin-top: 0; color: #FFB800;">{{vantagem_nome}}</h2>
                <p><strong>Descrição:</strong> {{vantagem_descricao}}</p>
                <p><strong>Custo:</strong> {{vantagem_custo}} moedas</p>
                <p><strong>Empresa:</strong> {{empresa_nome}}</p>
                <p><strong>Data do Resgate:</strong> {{data_resgate}}</p>
            </div>
            
            <!-- QR Code Section -->
            {{#if qr_code_base64}}
            <div class="qr-section">
                <h3 style="color: #FFB800; margin-bottom: 10px;">🎫 Seu Código de Resgate</h3>
                <p style="font-size: 14px; color: #666;">
                    Apresente este QR Code na empresa para validar seu resgate
                </p>
                
                <div class="qr-code">
                    <img src="{{qr_code_base64}}" alt="QR Code de Resgate">
                </div>
                
                <p style="margin-top: 15px; font-size: 16px; font-weight: bold;">
                    Código: <span style="color: #FFB800;">{{codigo_resgate}}</span>
                </p>
            </div>
            {{/if}}
            
            <!-- Saldo Atual -->
            <div class="info-box">
                <p style="margin: 0;">
                    <strong>💰 Seu saldo atual:</strong> 
                    <span style="color: #FFB800; font-size: 18px; font-weight: bold;">
                        {{saldo_atual}} moedas
                    </span>
                </p>
            </div>
            
            <p style="margin-top: 30px;">
                Obrigado por usar nosso sistema de moedas estudantis!
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Este é um email automático. Por favor, não responda.</p>
            <p>&copy; 2024 Sistema de Moeda Estudantil - PUC Minas</p>
        </div>
    </div>
</body>
</html>
```

### 4. Variáveis Disponíveis no Template

Certifique-se de que seu template aceita estas variáveis:

- `{{to_email}}` - Email do destinatário
- `{{aluno_nome}}` - Nome do aluno
- `{{vantagem_nome}}` - Nome da vantagem
- `{{vantagem_descricao}}` - Descrição da vantagem
- `{{vantagem_custo}}` - Custo em moedas
- `{{vantagem_imagem}}` - URL da imagem da vantagem
- `{{empresa_nome}}` - Nome da empresa
- `{{codigo_resgate}}` - Código único de resgate
- `{{data_resgate}}` - Data e hora do resgate
- `{{saldo_atual}}` - Saldo atual do aluno
- `{{qr_code_base64}}` - **QR Code em Base64** (formato: `data:image/png;base64,iVBORw...`)
- `{{qr_code_base64}}` - **QR Code em Base64** (formato: `data:image/png;base64,iVBORw...`)

### 5. Importante sobre o QR Code Base64

O QR Code vem no formato completo Base64 com o prefixo `data:image/png;base64,`, então você pode usá-lo diretamente no atributo `src` da tag `<img>`:

```html
<img src="{{qr_code_base64}}" alt="QR Code">
```

**Não é necessário adicionar o prefixo manualmente!**

### 6. Teste o Template

1. Após editar o template, clique em **Test It** no EmailJS
2. Preencha as variáveis de teste, incluindo um QR code de exemplo
3. Para testar com QR code, use: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`
4. Envie o email de teste

### 7. Template para Empresa

Crie também uma versão para a empresa que inclua:
- Nome do aluno que resgatou
- Dados da vantagem
- QR Code para validação
- Código de resgate

### 8. Troubleshooting

**QR Code não aparece?**
- Verifique se o backend está gerando o QR code corretamente
- Confirme que o formato Base64 está completo (com `data:image/png;base64,`)
- Teste com um QR code de exemplo primeiro

**Email não chega?**
- Verifique o console do navegador para erros
- Confirme que os emails estão corretos
- Verifique a caixa de spam

**QR Code muito pequeno?**
- Ajuste o `max-width` da tag `<img>`
- Recomendado: entre 200px e 300px

## 📱 Como funciona

1. **Aluno resgata vantagem** → O frontend chama o endpoint `/vantagem/resgatar/{vantagemId}/aluno/{alunoId}/{urlVantagem}`
2. **Backend gera QR Code** → O serviço `vantagemService.resgatarVantagem()` cria o QR code em Base64
3. **QR Code retornado** → O objeto `Vantagem` retorna com o campo `qrCodeBase64` preenchido
4. **Email enviado** → O EmailJS recebe o `qrCodeBase64` e exibe a imagem no email

## ✅ Resultado Final

O aluno e a empresa receberão um email bonito contendo:
- ✉️ Informações da vantagem resgatada
- 📱 QR Code visível como imagem
- 🔢 Código de resgate em texto
- 💰 Saldo atualizado (apenas para aluno)

---

**Última atualização:** 14 de dezembro de 2025
