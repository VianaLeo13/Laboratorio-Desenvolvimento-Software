# 📘 Relatório de Análise Crítica do Projeto 👨‍💻

## 1. Informações do grupo
- **🎓 Curso:** Engenharia de Software
- **📘 Disciplina:** Laboratório de Desenvolvimento de Software
- **🗓 Período:** 4° Período
- **👨‍🏫 Professor(a):** Prof. Dr. João Paulo Carneiro Aramuni
- **👥 Membros do Grupo:** Paulo Assis, Pedro Maia, Leonardo Vieira

---

## 📌 2. Identificação do Projeto
- **Nome do projeto:** _Moeda Estudantil_  
- **Link do repositório:** _[https://github.com/AulusHZP/LabProjetoDeSoftware/tree/main/MoedaEstudantil](https://github.com/AulusHZP/LabProjetoDeSoftware/tree/main/MoedaEstudantil)_  
- **Integrantes do outro grupo:** _Lucas Ferreira, Aulus Batista, Joao Almeida_  

---

## 🧱 3. Arquitetura e Tecnologias Utilizadas

O projeto utiliza a seguinte arquitetura e tecnologias:

### Back-end

<img width="342" height="526" alt="Captura de tela 2025-12-11 164554" src="https://github.com/user-attachments/assets/3bf12efc-58e1-4c74-af3e-dc7ba7ad1614" />

* **Linguagem:** Java
* **Framework:** Spring Boot
* **Banco de Dados:** MySQL
* **Arquitetura:** MVC estendida

A arquitetura é organizada nas seguintes camadas:

* **config:** gerenciamento de configurações da aplicação
* **controller:** controle das requisições HTTP
* **dto:** transporte de dados de forma estruturada
* **model:** entidades e mapeamentos
* **repository:** interface com o banco de dados
* **service:** regras de negócio centralizadas

Essa organização favorece separação de responsabilidades e facilita manutenção.

### Front-end

<img width="335" height="583" alt="Captura de tela 2025-12-11 164609" src="https://github.com/user-attachments/assets/a8a16b7a-8998-47c3-9513-d5fe45116ce8" />

* **Tecnologia:** React
* **Estrutura organizada em:**

  * config
  * hooks
  * lib
  * pages
  * services
  * utils
  * components
  * assets

Essa estrutura permite reutilização de componentes, boa divisão entre lógica e interface e facilita expansão futura.

---

## 🗂️ 4. Organização do GitHub

Foram identificados problemas significativos na estrutura do repositório:

* Presença de pastas redundantes, como **backend** e **código**, sem justificativa funcional.
* Arquivos desnecessários foram enviados para a branch principal, incluindo:

  * `.env`
  * `.env.example`
  * arquivos gerados automaticamente por IA
* O README carece de melhor estruturação e poderia incluir um índice para facilitar navegação.
* A organização geral dificulta entendimento e manutenção.

<img width="341" height="558" alt="Captura de tela 2025-12-11 164848" src="https://github.com/user-attachments/assets/fc9ab892-d0d5-42fc-8d79-d8a633d7c788" />
<img width="365" height="236" alt="Captura de tela 2025-12-11 164911" src="https://github.com/user-attachments/assets/c4f42fc7-47dc-4807-9fc4-a601de57c452" />

---

## 🖥️ 5. Dificuldade para Configuração do Ambiente

Apesar de haver instruções básicas de execução, alguns pontos dificultam a configuração:

* Mostram apenas como acessar o projeto localmente
* Presença de arquivos `.example` sem explicação clara, sugerindo inconsistência na estrutura.
* Não há indicação explícita de que o sistema está hospedado.
* Não foram fornecidos links para acessar a aplicação em produção.

Esses fatores dificultam a preparação do ambiente e tornam o processo mais confuso.

---

## 🚀 6. Sugestões de Melhorias

### Back-end

* Utilizar de forma mais consistente as convenções REST, evitando endpoints fora do padrão, como `/register`.
* Remover lógica de negócio das controllers, concentrando-a exclusivamente nas services.
* Utilizar classes específicas para retornos complexos, evitando manipulação direta dentro das controllers.
* Adotar Lombok nas entidades para reduzir código repetitivo.
* Melhorar a geração dos códigos de vantagens, evitando valores fixos e estáticos.

### Front-end

* Reduzir componentes duplicados ou de baixa reutilização.
* Revisar hooks e services extensos, que dificultam entendimento e manutenção.
* Separar com mais clareza responsabilidades entre lógica, interface e serviços.

### GitHub

* Reestruturar as pastas de forma clara entre front-end e back-end.
* Remover arquivos indevidos ou sensíveis.
* Aprimorar o README incluindo:

  * índice
  * explicações diretas
  * links úteis
  * documentação de execução

### Deploy

* Informar de maneira clara se o projeto está hospedado.
* Disponibilizar links diretos no README.
* Explicar como acessar o ambiente de produção.

<img width="840" height="635" alt="Captura de tela 2025-12-11 165221" src="https://github.com/user-attachments/assets/47632725-6891-4190-b103-f4395a617c06" />
<img width="953" height="632" alt="Captura de tela 2025-12-11 165359" src="https://github.com/user-attachments/assets/2c8db012-37c0-4301-b20e-b4f332d8b899" />
<img width="753" height="435" alt="Captura de tela 2025-12-11 165608" src="https://github.com/user-attachments/assets/2395abf7-f841-455b-8ea3-2ed7caa3eb98" />

---

## 📄 7. Conclusão

O projeto apresenta uma boa escolha de tecnologias, utilizando React no front-end e Spring Boot no back-end, e uma arquitetura bem estruturada com separação clara de responsabilidades.

Contudo, foram identificadas oportunidades de melhoria na organização do repositório, na estrutura do README, na padronização das camadas do sistema e na clareza da documentação de ambiente. Além disso, as práticas REST e a separação entre controller e service podem ser aprimoradas para fortalecer a manutenção e evolução do software.

