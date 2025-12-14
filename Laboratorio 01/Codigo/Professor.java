import java.util.*;

public class Professor extends Usuario{

    private List<Disciplina> disciplinasLecionadas;

    public Professor(String nome, String codiogoPessoa, String cpf, String senha) {
        super(nome, codiogoPessoa, cpf, senha);
        this.disciplinasLecionadas = new ArrayList<Disciplina>();
    }

    public void addDisciplina(Disciplina disciplina){
        this.disciplinasLecionadas.add(disciplina);
    }

    public List<Disciplina> getDisciplinasLecionadas() {
        return disciplinasLecionadas;
    }

    public void setDisciplinasLecionadas(List<Disciplina> disciplinasLecionadas) {
        this.disciplinasLecionadas = disciplinasLecionadas;
    }

    public String getAlunosDisciplina(Disciplina disciplina){
        String retorno = "";

        if (disciplina == null || disciplina.getAlunos() == null) {
            return "Nenhum aluno encontrado.";
        }

        for (Aluno aluno : disciplina.getAlunos()) {
            retorno += "Nome: " + aluno.getNome() + "\n" +
                    "Codigo Pessoa: " + aluno.getCodigoPessoa() + "\n\n";
        }

        return retorno;
    }

     public void removerDisciplina(Disciplina disciplina) throws Exception {
          disciplinasLecionadas.remove(disciplina);
    }
}
