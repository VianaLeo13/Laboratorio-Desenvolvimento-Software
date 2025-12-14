import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner teclado = new Scanner(System.in);
        Secretaria secretaria = new Secretaria();
        secretaria.carregarDadosDeTxt();

        int opcaoPrincipal;

        do {
            System.out.println("\n=== SISTEMA DE MATRÍCULA ===");
            System.out.println("1. Cadastrar novo usuário");
            System.out.println("2. Realizar login");
            System.out.println("0. Sair do sistema");
            System.out.print("Digite a opção: ");

            opcaoPrincipal = teclado.nextInt();
            teclado.nextLine();

            switch (opcaoPrincipal) {
                case 1:
                    cadastrarNovoUsuario(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 2:
                    Object usuarioLogado = realizarLogin(teclado, secretaria);
                    if (usuarioLogado != null) {
                        System.out.println("Login realizado com sucesso!");

                        if (usuarioLogado instanceof Professor) {
                            Professor professor = (Professor) usuarioLogado;
                            menuProfessor(teclado, secretaria, professor);
                        } else if (usuarioLogado instanceof Aluno) {
                            Aluno aluno = (Aluno) usuarioLogado;
                            menuAluno(teclado, secretaria, aluno);
                        } else if (usuarioLogado instanceof String && usuarioLogado.equals("admin")) {
                            menuAdmin(teclado, secretaria);
                        }
                    } else {
                        System.out.println("Login falhou! Verifique suas credenciais.");
                    }
                    break;
                case 0:
                    System.out.println("Saindo do sistema...");
                    break;
                default:
                    System.out.println("Opção inválida! Digite novamente.");
            }

        } while (opcaoPrincipal != 0);

        teclado.close();
    }

    private static void cadastrarNovoCurso(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- CADASTRO DE NOVO CURSO ---");

        System.out.print("Digite o nome do curso: ");
        String nomeCurso = teclado.nextLine();

        System.out.print("Digite a carga de créditos do curso: ");
        int credito = teclado.nextInt();
        teclado.nextLine();

        Curso novoCurso = new Curso(nomeCurso, credito);

        System.out.println("Deseja:");
        System.out.println("1. Adicionar disciplinas existentes");
        System.out.println("2. Criar novas disciplinas");
        System.out.print("Digite a opção: ");

        int opcao = teclado.nextInt();
        teclado.nextLine();

        if (opcao == 1) {
            adicionarDisciplinasExistentes(teclado, secretaria, novoCurso);
        } else if (opcao == 2) {
            criarNovasDisciplinas(teclado, secretaria, novoCurso);
        } else {
            System.out.println("Opção inválida. Nenhuma disciplina adicionada.");
        }

        secretaria.setCurso(novoCurso);
        System.out.println("Curso '" + nomeCurso + "' cadastrado com sucesso!");
    }

    private static void adicionarDisciplinasExistentes(Scanner teclado, Secretaria secretaria, Curso curso) {
        System.out.println("\nDisciplinas disponíveis:");

        if (secretaria.getDisciplinas().isEmpty()) {
            System.out.println("Nenhuma disciplina cadastrada no sistema.");
            return;
        }

        for (int i = 0; i < secretaria.getDisciplinas().size(); i++) {
            Disciplina disciplina = secretaria.getDisciplinas().get(i);
            System.out.println((i + 1) + ". " + disciplina.getNome());
        }

        System.out.println("0. Não adicionar nenhuma disciplina");
        System.out.print("Digite os números das disciplinas para adicionar (separados por vírgula) ou 0 para nenhuma: ");

        String input = teclado.nextLine().trim();

        if (input.equals("0")) {
            System.out.println("Nenhuma disciplina foi adicionada ao curso.");
            return;
        }

        String[] numeros = input.split(",");
        boolean disciplinasAdicionadas = false;

        for (String numeroStr : numeros) {
            try {
                int numero = Integer.parseInt(numeroStr.trim()) - 1;

                if (numero == -1) {
                    System.out.println("Opção 0 ignorada (use apenas 0 sozinho para cancelar)");
                    continue;
                }

                if (numero >= 0 && numero < secretaria.getDisciplinas().size()) {
                    Disciplina disciplina = secretaria.getDisciplinas().get(numero);
                    curso.setDisciplina(disciplina);
                    System.out.println("Disciplina '" + disciplina.getNome() + "' adicionada ao curso.");
                    disciplinasAdicionadas = true;
                } else {
                    System.out.println("Número inválido: " + (numero + 1) + " (fora do range)");
                }
            } catch (NumberFormatException e) {
                System.out.println("Entrada inválida: '" + numeroStr + "' (deve ser um número)");
            }
        }

        if (!disciplinasAdicionadas) {
            System.out.println("Nenhuma disciplina válida foi adicionada ao curso.");
        }
    }

    private static void criarNovasDisciplinas(Scanner teclado, Secretaria secretaria, Curso curso) {
        System.out.println("\n--- CRIAÇÃO DE NOVAS DISCIPLINAS ---");

        int continuar = 1;

        while (continuar == 1) {
            System.out.print("Digite o nome da disciplina: ");
            String nomeDisciplina = teclado.nextLine();

            System.out.print("Digite a carga horária: ");
            int carga = teclado.nextInt();

            System.out.print("Digite o preço: ");
            double preco = teclado.nextDouble();

            System.out.println("Tipo de disciplina:");
            System.out.println("1. Obrigatória");
            System.out.println("2. Optativa");
            System.out.print("Digite a opção: ");
            int tipoOpcao = teclado.nextInt();
            teclado.nextLine();

            DisciplinaType tipoDisciplina = (tipoOpcao == 1) ? DisciplinaType.OBRIGATORIA : DisciplinaType.OPTATIVA;

            Disciplina novaDisciplina = new Disciplina(carga, nomeDisciplina, preco, tipoDisciplina);

            secretaria.setDisciplina(novaDisciplina);
            curso.setDisciplina(novaDisciplina);

            System.out.println("Disciplina '" + nomeDisciplina + "' criada e adicionada ao curso!");

            System.out.print("Deseja criar outra disciplina? (1-Sim / 2-Não): ");
            continuar = teclado.nextInt();
            teclado.nextLine();
        }
    }

    private static void setDisciplinasCadastradasObrigatoria(Scanner teclado, Secretaria secretaria, Aluno aluno) {
        List<Disciplina> temporarias = new ArrayList<Disciplina>();

        for (int i = 0; i < secretaria.getDisciplinas().size(); i++){
            for(Disciplina disciplina : aluno.getDisciplinasObrigatorias()) {
                if (secretaria.getDisciplinas().get(i).getTipoDisciplina() == DisciplinaType.OBRIGATORIA) {
                    temporarias.add(secretaria.getDisciplinas().get(i));
                }
            }
        }

        for (int i = 0; i < temporarias.size(); i++){
            System.out.println((i + 1) + " - " + temporarias.get(i).getNome());
        }

        System.out.println("Selecione a disciplina digitando seu número:");
        if (temporarias.isEmpty()) {
            System.out.println("Não há disciplinas obrigatórias cadastradas.");
            return;
        }
        int opcao = teclado.nextInt();
        teclado.nextLine();
        try {
            aluno.addDisciplina(temporarias.get(opcao - 1));
            System.out.println("Disciplina cadastrada com sucesso!");
            temporarias.get(opcao - 1).setAluno(aluno);
            if(temporarias.get(opcao -1).getAlunos().contains(aluno)){
                System.out.println("Disciplina cadastrada com sucesso e aluno adicionado à disciplina!");
            } else {
                System.out.println("Erro: aluno não foi adicionado à disciplina!");
            }

        } catch (Exception e) {
            System.out.println("Erro ao adicionar disciplina: " + e.getMessage());
        }
    }

    private static void setDisciplinasCadastradasOptativa(Scanner teclado, Secretaria secretaria, Aluno aluno){
        List<Disciplina> temporarias = new ArrayList<Disciplina>();

        for (int i = 0; i < secretaria.getDisciplinas().size(); i++){
            for(Disciplina disciplina: aluno.getDisciplinasOptativas()) {
                if (secretaria.getDisciplinas().get(i).getTipoDisciplina() == DisciplinaType.OPTATIVA && !secretaria.getDisciplinas().get(i).equals(disciplina)) {
                    temporarias.add(secretaria.getDisciplinas().get(i));
                }
            }
            //System.out.println(i + 1 + " - " + secretaria.getDisciplinas().get(i).getNome());
        }

        for (int i = 0; i < temporarias.size(); i++){
            System.out.println((i + 1) + " - " + temporarias.get(i).getNome());
        }

        System.out.println("Selecione a disciplina digitando seu número:");
        if (temporarias.isEmpty()) {
            System.out.println("Não há disciplinas optativas cadastradas.");
            return;
        }
        int opcao = teclado.nextInt();
        teclado.nextLine();
        try {
            aluno.addDisciplina(temporarias.get(opcao - 1));
            System.out.println("Disciplina cadastrada com sucesso!");
            temporarias.get(opcao - 1).setAluno(aluno);
            if(temporarias.get(opcao -1).getAlunos().contains(aluno)){
                System.out.println("Disciplina cadastrada com sucesso e aluno adicionado à disciplina!");
            } else {
                System.out.println("Erro: aluno não foi adicionado à disciplina!");
            }
        } catch (Exception e) {
            System.out.println("Erro ao adicionar disciplina: " + e.getMessage());
        }
    }

    private static void cadastrarAlunoEmDisciplina(Scanner teclado, Secretaria secretaria, Aluno aluno){
        System.out.println("Qual disciplina você quer matricular?");
        System.out.println("1 - Matricular em disciplina Obrigatória");
        System.out.println("2 - Matricular em disciplina Optativa");
        int opcao = teclado.nextInt();
        teclado.nextLine();
        if(opcao == 1){
            setDisciplinasCadastradasObrigatoria(teclado, secretaria, aluno);
        }else if(opcao == 2){
            setDisciplinasCadastradasOptativa(teclado, secretaria, aluno);
        }else{
            System.out.println("Não existe esta opção!");
        }
        secretaria.salvarDadosEmTxt();
    }

    private static void vincularProfessorDisciplina(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- VINCULAR PROFESSOR À DISCIPLINA ---");

        if (secretaria.getProfessores().isEmpty()) {
            System.out.println("Nenhum professor cadastrado no sistema.");
            return;
        }

        if (secretaria.getDisciplinas().isEmpty()) {
            System.out.println("Nenhuma disciplina cadastrada no sistema.");
            return;
        }

        System.out.println("Professores disponíveis:");
        for (int i = 0; i < secretaria.getProfessores().size(); i++) {
            Professor professor = secretaria.getProfessores().get(i);
            System.out.println((i + 1) + ". " + professor.getNome() + " (" + professor.getCodigoPessoa() + ")");
        }

        System.out.print("Digite o número do professor: ");
        int numeroProfessor = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroProfessor < 0 || numeroProfessor >= secretaria.getProfessores().size()) {
            System.out.println("Número de professor inválido!");
            return;
        }

        Professor professorSelecionado = secretaria.getProfessores().get(numeroProfessor);

        System.out.println("Disciplinas disponíveis:");
        for (int i = 0; i < secretaria.getDisciplinas().size(); i++) {
            Disciplina disciplina = secretaria.getDisciplinas().get(i);
            System.out.println((i + 1) + ". " + disciplina.getNome());
        }

        System.out.print("Digite o número da disciplina: ");
        int numeroDisciplina = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroDisciplina < 0 || numeroDisciplina >= secretaria.getDisciplinas().size()) {
            System.out.println("Número de disciplina inválido!");
            return;
        }

        Disciplina disciplinaSelecionada = secretaria.getDisciplinas().get(numeroDisciplina);

        if (professorSelecionado.getDisciplinasLecionadas().contains(disciplinaSelecionada)) {
            System.out.println("Este professor já leciona esta disciplina!");
            return;
        }

        professorSelecionado.getDisciplinasLecionadas().add(disciplinaSelecionada);
        System.out.println("Professor '" + professorSelecionado.getNome() + "' vinculado à disciplina '" + disciplinaSelecionada.getNome() + "' com sucesso!");
    }

    private static void excluirDisciplina(Scanner teclado, Aluno aluno, Secretaria secretaria){
        List<Disciplina> temporarias = new ArrayList<Disciplina>();

        temporarias.addAll(aluno.getDisciplinasObrigatorias());
        temporarias.addAll(aluno.getDisciplinasOptativas());

        if(temporarias.isEmpty()){
            System.out.println("Nenhuma disciplina cadastrada para o " + aluno.getNome());
            return;
        }

        for (int i = 0; i < temporarias.size(); i++){
            System.out.println((i + 1) + " - " + temporarias.get(i).getNome());
        }
        System.out.println("Qual disciplina você quer excluir?");
        int opcao = teclado.nextInt();
        teclado.nextLine();
        Disciplina escolhida = temporarias.get(opcao - 1);

        try{
            aluno.removerDisciplina(escolhida);
            System.out.println("Disciplina excluída com sucesso!");
        } catch (Exception e) {
            System.out.println("Erro ao excluir disciplina: " + e.getMessage());
        }
        secretaria.salvarDadosEmTxt();
    }

    private static void desvincularProfessorDisciplina(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- DESVINCULAR PROFESSOR DA DISCIPLINA ---");

        if (secretaria.getProfessores().isEmpty()) {
            System.out.println("Nenhum professor cadastrado no sistema.");
            return;
        }

        System.out.println("Professores disponíveis:");
        for (int i = 0; i < secretaria.getProfessores().size(); i++) {
            Professor professor = secretaria.getProfessores().get(i);
            System.out.println((i + 1) + ". " + professor.getNome() + " (" + professor.getCodigoPessoa() + ")");
            System.out.println("   Disciplinas: " + professor.getDisciplinasLecionadas().size());
        }

        System.out.print("Digite o número do professor: ");
        int numeroProfessor = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroProfessor < 0 || numeroProfessor >= secretaria.getProfessores().size()) {
            System.out.println("Número de professor inválido!");
            return;
        }

        Professor professorSelecionado = secretaria.getProfessores().get(numeroProfessor);

        if (professorSelecionado.getDisciplinasLecionadas().isEmpty()) {
            System.out.println("Este professor não leciona nenhuma disciplina!");
            return;
        }

        System.out.println("Disciplinas lecionadas por " + professorSelecionado.getNome() + ":");
        for (int i = 0; i < professorSelecionado.getDisciplinasLecionadas().size(); i++) {
            Disciplina disciplina = professorSelecionado.getDisciplinasLecionadas().get(i);
            System.out.println((i + 1) + ". " + disciplina.getNome());
        }

        System.out.print("Digite o número da disciplina para remover: ");
        int numeroDisciplina = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroDisciplina < 0 || numeroDisciplina >= professorSelecionado.getDisciplinasLecionadas().size()) {
            System.out.println("Número de disciplina inválido!");
            return;
        }

        Disciplina disciplinaRemovida = professorSelecionado.getDisciplinasLecionadas().remove(numeroDisciplina);
        System.out.println("Disciplina '" + disciplinaRemovida.getNome() + "' removida do professor '" + professorSelecionado.getNome() + "' com sucesso!");
    }

    private static Object realizarLogin(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- LOGIN NO SISTEMA ---");

        System.out.print("Digite seu código Pessoa (ou 'admin' para acesso administrativo): ");
        String codigoPessoa = teclado.nextLine();

        System.out.print("Digite sua senha: ");
        String senha = teclado.nextLine();

        // Verifica se é admin
        if (codigoPessoa.equals("admin") && senha.equals("admin")) {
            return "admin";
        }

        System.out.println("Você é: ");
        System.out.println("1. Professor");
        System.out.println("2. Aluno");
        System.out.print("Digite a opção: ");

        int opcaoTipo = teclado.nextInt();
        teclado.nextLine();

        if (opcaoTipo == 1) {
            for (Professor professor : secretaria.getProfessores()) {
                if (professor.fazerLogin(codigoPessoa, senha))
                    return professor;
            }
        } else if (opcaoTipo == 2) {
            for (Aluno aluno : secretaria.getAlunos()) {
                if (aluno.fazerLogin(codigoPessoa, senha))
                    return aluno;
            }
        } else {
            System.out.println("Opção inválida!");
        }

        return null;
    }

    private static void cadastrarNovoUsuario(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- CADASTRO DE NOVO USUÁRIO ---");

        System.out.print("Digite seu nome: ");
        String nome = teclado.nextLine();

        System.out.print("Digite seu CPF: ");
        String cpf = teclado.nextLine();

        System.out.print("Digite sua senha: ");
        String senha = teclado.nextLine();

        System.out.print("Digite seu código Pessoa: ");
        String codigoPessoa = teclado.nextLine();

        System.out.println("Você é:");
        System.out.println("1. Professor");
        System.out.println("2. Aluno");
        System.out.print("Digite a opção: ");

        int opcaoTipo = teclado.nextInt();
        teclado.nextLine();

        if (opcaoTipo == 1) {
            Professor professor = new Professor(nome, codigoPessoa, cpf, senha);
            secretaria.setProfessore(professor);
            System.out.println("Professor cadastrado com sucesso!");
        } else if (opcaoTipo == 2) {
            Aluno aluno = new Aluno(nome, codigoPessoa, cpf, senha);
            secretaria.setAluno(aluno);
            System.out.println("Aluno cadastrado com sucesso!");
        } else {
            System.out.println("Opção inválida!");
        }
    }

    private static void menuProfessor(Scanner teclado, Secretaria secretaria, Professor professor) {
        int opcao;
        do {
            System.out.println("\n=== MENU PROFESSOR ===");
            System.out.println("1. Ver minhas disciplinas");
            System.out.println("2. Ver perfil");
            System.out.println("3. Ver todos os cursos");
            System.out.println("0. Voltar ao menu principal");
            System.out.print("Digite a opção: ");

            opcao = teclado.nextInt();
            teclado.nextLine();

            switch (opcao) {
                case 1:
                    System.out.println("Disciplinas lecionadas:");
                    for (Disciplina disciplina : professor.getDisciplinasLecionadas()) {
                        System.out.println("- " + disciplina.getNome());
                    }
                    break;
                case 2:
                    System.out.println("Nome: " + professor.getNome());
                    System.out.println("CPF: " + professor.getCpf());
                    System.out.println("Código: " + professor.getCodigoPessoa());
                    break;
                case 3:
                    System.out.println("Cursos disponíveis:");
                    for (Curso curso : secretaria.getCursos()) {
                        System.out.println("- " + curso.getNome() + " (" + curso.getCredito() + " créditos)");
                    }
                    break;
                case 0:
                    System.out.println("Voltando ao menu principal...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 0);
    }

    private static void menuAluno(Scanner teclado, Secretaria secretaria, Aluno aluno) {
        int opcao;
        do {
            System.out.println("\n=== MENU ALUNO ===");
            System.out.println("1. Matricular em disciplina");
            System.out.println("2. Ver disciplinas matriculadas");
            System.out.println("3. Cancelar matrícula");
            System.out.println("4. Ver perfil");
            System.out.println("5. Ver cursos disponíveis");
            System.out.println("6. Ver preço da mensalidade");
            System.out.println("0. Voltar ao menu principal");
            System.out.print("Digite a opção: ");

            opcao = teclado.nextInt();
            teclado.nextLine();

            switch (opcao) {
                case 1: cadastrarAlunoEmDisciplina(teclado, secretaria, aluno);
                break;

                case 2:
                    List<Disciplina> temporarias = new ArrayList<Disciplina>();

                    temporarias.addAll(aluno.getDisciplinasObrigatorias());
                    temporarias.addAll(aluno.getDisciplinasOptativas());

                    if(temporarias.isEmpty()){
                        System.out.println("Você não está cursando nenhuma disciplina!");
                    } else {
                        System.out.println("Estas são as disciplinas que você está cursando");
                        System.out.println("Disciplinas obrigatórias:");
                        for (Disciplina disciplina : aluno.getDisciplinasObrigatorias()) {
                            System.out.println("- " + disciplina.getNome());
                        }
                        System.out.println("Disciplinas optativas:");
                        for (Disciplina disciplina : aluno.getDisciplinasOptativas()) {
                            System.out.println("- " + disciplina.getNome());
                        }
                    }
                    break;

                case 3: excluirDisciplina(teclado,aluno,secretaria);
                break;

                case 4:
                    System.out.println("Nome: " + aluno.getNome());
                    System.out.println("CPF: " + aluno.getCpf());
                    System.out.println("Código: " + aluno.getCodigoPessoa());
                    break;
                case 5:
                    System.out.println("Cursos disponíveis:");
                    for (Curso cursoD : secretaria.getCursos()) {
                        System.out.println("- " + cursoD.getNome() + " (" + cursoD.getCredito() + " créditos)");
                        System.out.println("  Disciplinas: " + cursoD.getDisciplinas().size());
                    }
                    break;
                case 6:
                    Cobranca cobranca = new Cobranca(aluno);
                    gerarCobrancas(aluno, cobranca, secretaria);
                    break;
                case 0:
                    System.out.println("Voltando ao menu principal...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 0);
    }

    private static void adicionarDisciplinaAoCurso(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- ADICIONAR DISCIPLINA AO CURSO ---");

        if (secretaria.getCursos().isEmpty()) {
            System.out.println("Nenhum curso cadastrado no sistema.");
            return;
        }

        if (secretaria.getDisciplinas().isEmpty()) {
            System.out.println("Nenhuma disciplina cadastrada no sistema.");
            return;
        }

        System.out.println("Cursos disponíveis:");
        for (int i = 0; i < secretaria.getCursos().size(); i++) {
            Curso curso = secretaria.getCursos().get(i);
            System.out.println((i + 1) + ". " + curso.getNome());
        }

        System.out.print("Digite o número do curso: ");
        int numeroCurso = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroCurso < 0 || numeroCurso >= secretaria.getCursos().size()) {
            System.out.println("Número de curso inválido!");
            return;
        }

        Curso cursoSelecionado = secretaria.getCursos().get(numeroCurso);

        System.out.println("Disciplinas disponíveis:");
        for (int i = 0; i < secretaria.getDisciplinas().size(); i++) {
            Disciplina disciplina = secretaria.getDisciplinas().get(i);
            System.out.println((i + 1) + ". " + disciplina.getNome());
        }

        System.out.print("Digite o número da disciplina: ");
        int numeroDisciplina = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroDisciplina < 0 || numeroDisciplina >= secretaria.getDisciplinas().size()) {
            System.out.println("Número de disciplina inválido!");
            return;
        }

        Disciplina disciplinaSelecionada = secretaria.getDisciplinas().get(numeroDisciplina);

        if (cursoSelecionado.getDisciplinas().contains(disciplinaSelecionada)) {
            System.out.println("Esta disciplina já está no curso!");
            return;
        }

        cursoSelecionado.setDisciplina(disciplinaSelecionada);
        System.out.println("Disciplina '" + disciplinaSelecionada.getNome() + "' adicionada ao curso '" + cursoSelecionado.getNome() + "' com sucesso!");
    }

    private static void cadastrarNovaDisciplina(Scanner teclado, Secretaria secretaria) {
        System.out.println("\n--- CADASTRO DE NOVA DISCIPLINA ---");

        System.out.print("Digite o nome da disciplina: ");
        String nome = teclado.nextLine();

        System.out.print("Digite a carga horária: ");
        int carga = teclado.nextInt();

        System.out.print("Digite o preço: ");
        double preco = teclado.nextDouble();

        System.out.println("Tipo de disciplina:");
        System.out.println("1. Obrigatória");
        System.out.println("2. Optativa");
        System.out.print("Digite a opção: ");
        int tipoOpcao = teclado.nextInt();
        teclado.nextLine();

        DisciplinaType tipoDisciplina = (tipoOpcao == 1) ? DisciplinaType.OBRIGATORIA : DisciplinaType.OPTATIVA;

        Disciplina novaDisciplina = new Disciplina(carga, nome, preco, tipoDisciplina);
        secretaria.setDisciplina(novaDisciplina);

        System.out.println("Disciplina '" + nome + "' cadastrada com sucesso!");

        System.out.print("Deseja adicionar esta disciplina a algum curso? (S/N): ");
        String resposta = teclado.nextLine();

        if (resposta.equalsIgnoreCase("S")) {
            adicionarDisciplinaExistenteAoCurso(teclado, secretaria, novaDisciplina);
        }
    }

    private static void adicionarDisciplinaExistenteAoCurso(Scanner teclado, Secretaria secretaria, Disciplina disciplina) {
        if (secretaria.getCursos().isEmpty()) {
            System.out.println("Nenhum curso cadastrado no sistema.");
            return;
        }

        System.out.println("Cursos disponíveis:");
        for (int i = 0; i < secretaria.getCursos().size(); i++) {
            Curso curso = secretaria.getCursos().get(i);
            System.out.println((i + 1) + ". " + curso.getNome());
        }

        System.out.print("Digite o número do curso: ");
        int numeroCurso = teclado.nextInt() - 1;
        teclado.nextLine();

        if (numeroCurso < 0 || numeroCurso >= secretaria.getCursos().size()) {
            System.out.println("Número de curso inválido!");
            return;
        }

        Curso cursoSelecionado = secretaria.getCursos().get(numeroCurso);

        if (cursoSelecionado.getDisciplinas().contains(disciplina)) {
            System.out.println("Esta disciplina já está no curso!");
            return;
        }

        cursoSelecionado.setDisciplina(disciplina);
        System.out.println("Disciplina '" + disciplina.getNome() + "' adicionada ao curso '" + cursoSelecionado.getNome() + "' com sucesso!");
    }

    private static void gerarCobrancas(Aluno aluno, Cobranca cobranca, Secretaria secretaria){
        double valor = cobranca.gerarCobranca(aluno);
        System.out.println("Aluno: " + aluno.getNome() + "o valor da sua mensalidade será: " + valor);
        aluno.setMensalidade(valor);
        secretaria.salvarDadosEmTxt();
    }

    private static void menuAdmin(Scanner teclado, Secretaria secretaria) {
        int opcaoAdmin;

        do {
            System.out.println("\n=== MENU ADMINISTRATIVO ===");
            System.out.println("1. Cadastrar curso");
            System.out.println("2. Adicionar disciplina ao curso");
            System.out.println("3. Cadastrar disciplina");
            System.out.println("4. Vincular professor à disciplina");
            System.out.println("5. Desvincular professor da disciplina");
            System.out.println("6. Ver todos os dados do sistema");
            System.out.println("0. Voltar ao menu principal");
            System.out.print("Digite a opção: ");

            opcaoAdmin = teclado.nextInt();
            teclado.nextLine();

            switch (opcaoAdmin) {
                case 1:
                    cadastrarNovoCurso(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 2:
                    adicionarDisciplinaAoCurso(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 3:
                    cadastrarNovaDisciplina(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 4:
                    vincularProfessorDisciplina(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 5:
                    desvincularProfessorDisciplina(teclado, secretaria);
                    secretaria.salvarDadosEmTxt();
                    break;
                case 6:
                    exibirTodosDados(secretaria);
                    break;
                case 0:
                    System.out.println("Voltando ao menu principal...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }

        } while (opcaoAdmin != 0);
    }

    private static void exibirTodosDados(Secretaria secretaria) {
        System.out.println("\n=== DADOS COMPLETOS DO SISTEMA ===");

        System.out.println("\n--- DISCIPLINAS (" + secretaria.getDisciplinas().size() + ") ---");
        for (Disciplina disciplina : secretaria.getDisciplinas()) {
            System.out.println("- " + disciplina.getNome() + " (" + disciplina.getTipoDisciplina() +
                    ") - Carga: " + disciplina.getCarga() + "h - Preço: R$" + disciplina.getPreco());
        }

        System.out.println("\n--- CURSOS (" + secretaria.getCursos().size() + ") ---");
        for (Curso curso : secretaria.getCursos()) {
            System.out.println("- " + curso.getNome() + " (" + curso.getCredito() + " créditos)");
            System.out.println("  Disciplinas: " + curso.getDisciplinas().size());
            for (Disciplina disciplina : curso.getDisciplinas()) {
                System.out.println("  * " + disciplina.getNome());
            }
        }

        System.out.println("\n--- PROFESSORES (" + secretaria.getProfessores().size() + ") ---");
        for (Professor professor : secretaria.getProfessores()) {
            System.out.println("- " + professor.getNome() + " (" + professor.getCodigoPessoa() + ")");
            System.out.println("  Disciplinas lecionadas: " + professor.getDisciplinasLecionadas().size());
        }

        System.out.println("\n--- ALUNOS (" + secretaria.getAlunos().size() + ") ---");
        for (Aluno aluno : secretaria.getAlunos()) {
            System.out.println("- " + aluno.getNome() + " (" + aluno.getCodigoPessoa() + ")");
            System.out.println("  Disciplinas obrigatórias: " + aluno.getDisciplinasObrigatorias().size());
            System.out.println("  Disciplinas optativas: " + aluno.getDisciplinasOptativas().size());
        }
    }
}