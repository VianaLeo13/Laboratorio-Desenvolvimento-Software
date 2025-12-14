# Documentação da API - Sistema de Aluguel

## Visão Geral
Sistema de aluguel de automóveis implementado com Spring Boot, seguindo o diagrama de caso de uso fornecido.

## Endpoints Implementados

### 🔐 Autenticação (`/auth`)
- `POST /auth/login` - Realizar login no sistema
- `POST /auth/cadastrar` - Cadastrar novo usuário
- `GET /auth/usuarios` - Listar usuários (admin)

### 👤 Cliente (`/cliente`)
- `POST /cliente/cadastrar` - Cadastrar novo cliente
- `GET /cliente/listar` - Listar todos os clientes
- `GET /cliente/{id}` - Buscar cliente por ID
- `PUT /cliente/atualizar/{id}` - Atualizar cliente
- `DELETE /cliente/{id}` - Deletar cliente

### 🚗 Automóveis (`/automoveis`)
- `POST /automoveis/cadastrar` - Cadastrar novo automóvel
- `GET /automoveis/listar` - Listar todos os automóveis
- `GET /automoveis/{id}` - Buscar automóvel por ID
- `PUT /automoveis/{id}/atualizar` - Atualizar automóvel
- `DELETE /automoveis/{id}` - Deletar automóvel

### 🏢 Agentes (`/agentes`)
- `POST /agentes/cadastrar` - Cadastrar novo agente (banco/empresa)
- `GET /agentes/listar` - Listar todos os agentes
- `GET /agentes/ativos` - Listar agentes ativos
- `GET /agentes/tipo/{tipo}` - Listar agentes por tipo
- `GET /agentes/{id}` - Buscar agente por ID

### 📋 Pedidos de Aluguel (`/pedidos`)
- `POST /pedidos/criar` - **HS01**: Introduzir pedido de aluguel
- `GET /pedidos/{id}` - Consultar pedido específico
- `GET /pedidos/cliente/{clienteId}` - **HS02**: Consultar pedidos do cliente
- `PUT /pedidos/{id}/modificar` - Modificar pedido
- `PUT /pedidos/{id}/cancelar` - Cancelar pedido
- `PUT /pedidos/{id}/avaliar` - Avaliar pedido (agentes)
- `POST /pedidos/{id}/executar-contrato` - Executar contrato de aluguel
- `GET /pedidos/status/{status}` - Listar pedidos por status

## Funcionalidades Implementadas

### ✅ História de Usuário HS01 - Introduzir Pedido de Aluguel
- ✅ Cadastro de novo pedido de aluguel
- ✅ Associação de contrato de crédito
- ✅ Consulta de status do pedido
- ✅ Modificação/cancelamento de pedidos
- ✅ Avaliação automática/por agentes
- ✅ Autenticação obrigatória

### ✅ História de Usuário HS02 - Consultar Pedido
- ✅ Lista de pedidos do cliente logado
- ✅ Informações completas do pedido
- ✅ Filtros por status
- ✅ Acesso restrito ao cliente autenticado

## Entidades Implementadas

### Core Entities
- **Usuario** - Sistema de autenticação
- **Cliente** - Clientes do sistema
- **Automovel** - Veículos disponíveis
- **Agente** - Bancos e empresas financeiras
- **PedidoAluguel** - Pedidos de aluguel
- **ContratoAluguel** - Contratos executados
- **Rendimento** - Informações financeiras dos clientes

### Relacionamentos
- Cliente ↔ Usuario (1:1)
- Cliente ↔ PedidoAluguel (1:N)
- Automovel ↔ PedidoAluguel (1:N)
- Agente ↔ PedidoAluguel (1:N)
- PedidoAluguel ↔ ContratoAluguel (1:1)
- Cliente ↔ Rendimento (1:N)

## Segurança
- Spring Security configurado
- Autenticação por username/password
- Endpoints protegidos
- Roles: CLIENTE, AGENTE, ADMIN

## Tecnologias Utilizadas
- Spring Boot 3.5.5
- Spring Security
- Spring Data JPA
- MySQL
- Lombok
- Java 21

## Status dos Casos de Uso
- ✅ Realizar login no sistema
- ✅ Cadastrar no sistema
- ✅ Introduzir Pedido de aluguel
- ✅ Associar contrato de crédito
- ✅ Consultar pedido
- ✅ Modificar Pedido
- ✅ Cancelar Pedido
- ✅ Avaliar Pedido
- ✅ Executar contrato de Aluguel

## Próximos Passos
1. Implementar JWT tokens
2. Adicionar validações de entrada
3. Implementar testes unitários
4. Adicionar tratamento de exceções global
5. Implementar logs de auditoria
