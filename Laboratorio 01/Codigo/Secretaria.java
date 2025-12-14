import java.util.ArrayList;
import java.util.List;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Secretaria {
    private List<Disciplina> disciplinas;
    private List<Professor> professores;
    private List<Aluno> alunos;
    private List<Curso> cursos;

    public Secretaria(){
        this.disciplinas = new ArrayList<Disciplina>();
        this.alunos = new ArrayList<Aluno>();
        this.professores = new ArrayList<Professor>();
        this.cursos = new ArrayList<Curso>();
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCurso(Curso curso) {
        this.cursos.add(curso);
    }

    public List<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
    }

    public List<Professor> getProfessores() {
        return professores;
    }

    public void setProfessore(Professor professor) {
        this.professores.add(professor);
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAluno(Aluno alunos) {
        this.alunos.add(alunos);
    }

    public String gerarCurriculoDoSemestre(){
        String retorno = "";

        if (disciplinas == null) {
            return "Nenhuma disciplina encontrada.";
        }

        for (Disciplina disciplina : disciplinas) {
            retorno += "Nome da Disciplina: " + disciplina.getNome() + "\n" +
                    "Carga Horária: " + disciplina.getCarga() + "\n" +
                    "Preco da Matéria " + disciplina.getPreco() + "\n";
        }

        return retorno;
    }


    public void salvarDadosEmTxt() {
        salvarDisciplinasEmTxt();
        salvarProfessoresEmTxt();
        salvarAlunosEmTxt();
        salvarCursosEmTxt();
    }

    private void salvarDisciplinasEmTxt() {
        try (FileWriter writer = new FileWriter("disciplinas.txt")) {
            writer.write(disciplinas.size() + "\n");

            for (Disciplina disciplina : disciplinas) {
                String linha = disciplina.getNome() + ";" +
                        disciplina.getCarga() + ";" +
                        disciplina.getPreco() + ";" +
                        disciplina.isAtivo() + ";" +
                        disciplina.getTotalAlunos() + ";" +
                        disciplina.getTipoDisciplina() + ";";

                        List<Aluno> alunos = disciplina.getAlunos();
                        for (Aluno aluno : alunos) {
                            linha += aluno.getNome() + ","; // ou aluno.getCodigoPessoa()
                        }
                        if (!alunos.isEmpty()) {
                            linha = linha.substring(0, linha.length() - 1); // remove última vírgula
                        }
                        linha += "\n";
                        writer.write(linha);
            }
        } catch (IOException e) {
            System.err.println("Erro ao salvar disciplinas: " + e.getMessage());
        }
    }

    private void salvarProfessoresEmTxt() {
        try (FileWriter writer = new FileWriter("professores.txt")) {
            writer.write(professores.size() + "\n");

            for (Professor professor : professores) {
                String linha = professor.getNome() + ";" +
                        professor.getCodigoPessoa() + ";" +
                        professor.getCpf() + ";" +
                        professor.getSenha() + ";";

                List<Disciplina> disciplinasLecionadas = professor.getDisciplinasLecionadas();
                linha += disciplinasLecionadas.size() + ";";
                for (Disciplina disciplina : disciplinasLecionadas) {
                    linha += disciplina.getNome() + ",";
                }
                if (!disciplinasLecionadas.isEmpty()) {
                    linha = linha.substring(0, linha.length() - 1);
                }
                linha += "\n";

                writer.write(linha);
            }
        } catch (IOException e) {
            System.err.println("Erro ao salvar professores: " + e.getMessage());
        }
    }

    private void salvarAlunosEmTxt() {
        try (FileWriter writer = new FileWriter("alunos.txt")) {
            writer.write(alunos.size() + "\n");

            for (Aluno aluno : alunos) {
                String linha = aluno.getNome() + ";" +
                        aluno.getCodigoPessoa() + ";" +
                        aluno.getCpf() + ";" +
                        aluno.getSenha() + ";" + 
                        aluno.getA_mensalidade() + ";";
                        

                List<Disciplina> obrigatorias = aluno.getDisciplinasObrigatorias();
                linha += obrigatorias.size() + ";";
                for (Disciplina disciplina : obrigatorias) {
                    linha += disciplina.getNome() + ",";
                }
                if (!obrigatorias.isEmpty()) {
                    linha = linha.substring(0, linha.length() - 1);
                }
                linha += ";";

                List<Disciplina> optativas = aluno.getDisciplinasOptativas();
                linha += optativas.size() + ";";
                for (Disciplina disciplina : optativas) {
                    linha += disciplina.getNome() + ",";
                }
                if (!optativas.isEmpty()) {
                    linha = linha.substring(0, linha.length() - 1);
                }
                linha += "\n";

                writer.write(linha);
            }
        } catch (IOException e) {
            System.err.println("Erro ao salvar alunos: " + e.getMessage());
        }
    }

    private void salvarCursosEmTxt() {
        try (FileWriter writer = new FileWriter("cursos.txt")) {
            writer.write(cursos.size() + "\n");

            for (Curso curso : cursos) {
                String linha = curso.getNome() + ";" +
                        curso.getCredito() + ";";

                List<Disciplina> disciplinas = curso.getDisciplinas();
                linha += disciplinas.size() + ";";

                for (Disciplina disciplina : disciplinas) {
                    linha += disciplina.getNome() + ",";
                }

                if (!disciplinas.isEmpty()) {
                    linha = linha.substring(0, linha.length() - 1);
                }
                linha += "\n";

                writer.write(linha);
            }
        } catch (IOException e) {
            System.err.println("Erro ao salvar cursos: " + e.getMessage());
        }
    }

    public void carregarDadosDeTxt() {
        carregarDisciplinasDeTxt();
        carregarProfessoresDeTxt();
        carregarAlunosDeTxt();
        carregarCursosDeTxt();
    }

    private void carregarDisciplinasDeTxt() {
        try (BufferedReader reader = new BufferedReader(new FileReader("disciplinas.txt"))) {
            String linha = reader.readLine();
            if (linha == null) return;

            int totalDisciplinas = Integer.parseInt(linha);
            disciplinas = new ArrayList<>();

            for (int i = 0; i < totalDisciplinas; i++) {
                linha = reader.readLine();
                if (linha == null) break;

                String[] dados = linha.split(";");
                if (dados.length >= 6) {
                    String nome = dados[0];
                    int carga = Integer.parseInt(dados[1]);
                    double preco = Double.parseDouble(dados[2]);
                    boolean ativo = Boolean.parseBoolean(dados[3]);
                    int totalAlunos = Integer.parseInt(dados[4]);
                    DisciplinaType tipoDisciplina = DisciplinaType.valueOf(dados[5]);

                    Disciplina disciplina = new Disciplina(carga, nome, preco, tipoDisciplina);
                    if (ativo) disciplina.setAtivo(true);
                    disciplinas.add(disciplina);
                }
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar disciplinas: " + e.getMessage());
        }
    }

    private void carregarProfessoresDeTxt() {
        try (BufferedReader reader = new BufferedReader(new FileReader("professores.txt"))) {
            String linha = reader.readLine();
            if (linha == null) return;

            int totalProfessores = Integer.parseInt(linha);
            professores = new ArrayList<>();

            for (int i = 0; i < totalProfessores; i++) {
                linha = reader.readLine();
                if (linha == null) break;

                String[] dados = linha.split(";");
                if (dados.length >= 5) {
                    String nome = dados[0];
                    String codigoPessoa = dados[1];
                    String cpf = dados[2];
                    String senha = dados[3];
                    int totalDisciplinas = Integer.parseInt(dados[4]);

                    Professor professor = new Professor(nome, codigoPessoa, cpf, senha);

                    if (totalDisciplinas > 0 && dados.length > 5) {
                        String[] nomesDisciplinas = dados[5].split(",");
                        for (String nomeDisciplina : nomesDisciplinas) {
                            Disciplina disciplina = buscarDisciplinaPorNome(nomeDisciplina);
                            if (disciplina != null) {
                                professor.getDisciplinasLecionadas().add(disciplina);
                            }
                        }
                    }

                    professores.add(professor);
                }
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar professores: " + e.getMessage());
        }
    }

    private void carregarAlunosDeTxt() {
        try (BufferedReader reader = new BufferedReader(new FileReader("alunos.txt"))) {
            String linha = reader.readLine();
            if (linha == null) return;

            int totalAlunos = Integer.parseInt(linha);
            alunos = new ArrayList<>();

            for (int i = 0; i < totalAlunos; i++) {
                linha = reader.readLine();
                if (linha == null) break;

                String[] dados = linha.split(";");
                if (dados.length >= 7) {
                    String nome = dados[0];
                    String codigoPessoa = dados[1];
                    String cpf = dados[2];
                    String senha = dados[3];
                    Double mensalidade = Double.parseDouble(dados[4]);
                    int totalObrigatorias = Integer.parseInt(dados[5]);
                    int totalOptativas = Integer.parseInt(dados[7]);

                    Aluno aluno = new Aluno(nome, codigoPessoa, cpf, senha);

                    if (totalObrigatorias > 0 && dados.length > 6) {
                        String[] nomesObrigatorias = dados[6].split(",");
                        for (String nomeDisciplina : nomesObrigatorias) {
                            Disciplina disciplina = buscarDisciplinaPorNome(nomeDisciplina);
                            if (disciplina != null) {
                                aluno.getDisciplinasObrigatorias().add(disciplina);
                            }
                        }
                    }

                    if (totalOptativas > 0 && dados.length > 8) {
                        String[] nomesOptativas = dados[8].split(",");
                        for (String nomeDisciplina : nomesOptativas) {
                            Disciplina disciplina = buscarDisciplinaPorNome(nomeDisciplina);
                            if (disciplina != null) {
                                aluno.getDisciplinasOptativas().add(disciplina);
                            }
                        }
                    }

                    alunos.add(aluno);
                }
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar alunos: " + e.getMessage());
        }
    }

    private void carregarCursosDeTxt() {
        try (BufferedReader reader = new BufferedReader(new FileReader("cursos.txt"))) {
            String linha = reader.readLine();
            if (linha == null) return;

            int totalCursos = Integer.parseInt(linha);
            cursos = new ArrayList<>();

            for (int i = 0; i < totalCursos; i++) {
                linha = reader.readLine();
                if (linha == null) break;

                String[] dados = linha.split(";");
                if (dados.length >= 3) {
                    String nome = dados[0];
                    int credito = Integer.parseInt(dados[1]);
                    int totalDisciplinas = Integer.parseInt(dados[2]);

                    Curso curso = new Curso(nome, credito);

                    if (totalDisciplinas > 0 && dados.length > 3) {
                        String[] nomesDisciplinas = dados[3].split(",");
                        for (String nomeDisciplina : nomesDisciplinas) {
                            Disciplina disciplina = buscarDisciplinaPorNome(nomeDisciplina);
                            if (disciplina != null) {
                                curso.getDisciplinas().add(disciplina);
                            }
                        }
                    }

                    cursos.add(curso);
                }
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar cursos: " + e.getMessage());
        }
    }

    private Disciplina buscarDisciplinaPorNome(String nome) {
        for (Disciplina disciplina : disciplinas) {
            if (disciplina.getNome().equals(nome)) {
                return disciplina;
            }
        }
        return null;
    }
}
