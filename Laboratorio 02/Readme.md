# Laboratorio-Desenvolvimento-Software 

<img src="Lab 02.gif" align="center" style="width:100%;" alt="Descrição do gif">

# 📋 História de Usuário: Introduzir Pedido de Aluguel - HS01  

👤  
**Como** Cliente,  
**Eu quero** introduzir um pedido de aluguel no sistema,  
**Para que** eu possa solicitar um contrato de aluguel associado a crédito, acompanhar e gerenciar meus pedidos.  

---

## **🎯 Critérios de Aceitação**  
✔ O sistema deve permitir o cadastro de um novo pedido de aluguel.  
✔ O cliente pode associar um contrato de crédito ao pedido.  
✔ Deve ser possível consultar o status do pedido.  
✔ Deve ser possível modificar ou cancelar o pedido após a criação, desde que ainda não esteja em execução.  
✔ O pedido deve ser avaliado automaticamente ou por agentes (empresas/bancos) antes da execução.  
✔ O cliente deve estar autenticado (login realizado).  

---

## **🔍 Detalhamento Técnico**  
- **Pré-condição:** Cliente deve estar logado no sistema.  
- **Fonte de dados:** Base de pedidos e contratos do sistema.  
- **Pós-condição:** Pedido registrado e associado a um contrato de aluguel.  
- **Regra de negócio:** Apenas pedidos aprovados por agentes ou pelo sistema podem ser executados.  

---

# 📋 História de Usuário: Consultar Pedido - HS02  

👤  
**Como** Cliente,  
**Eu quero** consultar os pedidos de aluguel que realizei,  
**Para que** eu possa acompanhar o status, verificar detalhes e decidir se preciso modificar ou cancelar.  

---

## **🎯 Critérios de Aceitação**  
✔ O sistema deve exibir uma lista de pedidos do cliente logado.  
✔ Cada pedido deve mostrar:  
   - Número do pedido.  
   - Data.  
   - Status (em análise, aprovado, em execução, cancelado).  
   - Valor.  
   - Agente associado.  
✔ O cliente deve poder filtrar os pedidos por status ou período.  
✔ Deve existir uma opção para visualizar os detalhes completos do pedido.  
✔ Apenas o cliente autenticado pode visualizar seus próprios pedidos.  

---

## **🔍 Detalhamento Técnico**  
- **Pré-condição:** Cliente deve estar autenticado no sistema.  
- **Fonte de dados:** Base de pedidos do sistema.  
- **Pós-condição:** Dados exibidos em tela de forma paginável/ordenável.  
- **Regra de negócio:** O cliente só tem acesso aos pedidos que ele próprio cadastrou.  

---

## 📦 Diagrama de Casos de Uso do Sistema  
![Imagem Diagrama de Casos de Uso](https://github.com/VianaLeo13/Laboratorio-Desenvolvimento-Software/blob/main/Laboratorio%2002/CasoUso-Lab2-2.png)

## Diagrama de Componentes

![Imagem Diagrama de Componentes](https://github.com/VianaLeo13/Laboratorio-Desenvolvimento-Software/blob/main/Laboratorio%2002/Diagrama%20de%20Componentes.png)

## Diagrama de Implantação

![Diagrama  de Implantação](https://github.com/VianaLeo13/Laboratorio-Desenvolvimento-Software/blob/main/Laboratorio%2002/DiagramaImplantacaoLab.png)

## 🔎 Diagrama da Pacote
```mermaid
graph TB
  %% Frontend
  subgraph frontend["Frontend (View)"]
    VWeb[Web Pages]
    VForms[Formulários]
    VTemplates[Templates]
  end

  %% Controllers
  subgraph controllers["Controllers"]
    CCliente[ClienteController]
    CPedido[PedidoController]
    CContrato[ContratoController]
    CAuth[AuthController]
    CAgente[AgenteController]
  end

  %% Security Layer
  subgraph security["Security"]
    SConfig[SecurityConfig]
    SJWT[JWT Filter]
    SProvider[Auth Provider]
    SUserDetails[UserDetailsService]
  end

  %% Services
  subgraph services["Services"]
    SCliente[ClienteService]
    SPedido[PedidoService]
    SContrato[ContratoService]
    SAuth[AuthService]
    SAgente[AgenteService]
  end

  %% Repositories
  subgraph repositories["Repositories"]
    RCliente[ClienteRepository]
    RPedido[PedidoRepository]
    RContrato[ContratoRepository]
    RAutomovel[AutomovelRepository]
    RAgente[AgenteRepository]
    RBanco[BancoRepository]
  end

  %% Models
  subgraph models["Models"]
    MCliente[Cliente]
    MPedido[Pedido]
    MContrato[Contrato]
    MAutomovel[Automovel]
    MAgente[Agente]
    MBanco[Banco]
  end

  %% DTOs
  subgraph dtos["DTOs"]
    DCliente[ClienteDTO]
    DPedido[PedidoDTO]
    DContrato[ContratoDTO]
    DAuth[AuthDTO]
  end

  %% Resources
  subgraph resources["Resources"]
    RStatic[Static Resources]
    RConfig[Configuration Files]
    RTemplates[Templates]
  end

  %% Relações
  frontend -->|requisições| controllers
  controllers -->|usa| services
  controllers -->|retorna views| frontend
  security -->|protege| controllers
  security -->|autentica| services
  services -->|acessa| repositories
  services -->|manipula| models
  repositories -->|persiste| models
  services -->|converte| dtos
  controllers -->|envia/recebe| dtos
  resources -->|suporta| frontend
