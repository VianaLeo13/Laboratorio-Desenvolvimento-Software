

public class Matricula {
    private boolean status;
    private Aluno aluno;
    private Disciplina disciplina;

    public Matricula(Aluno aluno, Disciplina disciplina) {
        status = true;
        this.aluno = aluno;
        this.disciplina = disciplina;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public void adicionarAlunoDisciplina(Aluno aluno, Disciplina disciplina) throws Exception{
        if(disciplina.temEspaco()){
            disciplina.setAluno(aluno);
            System.out.println("Aluno " + aluno.getNome() + " adicionado com sucesso!");
        }else{
            throw new Exception("Não há vagas para esta disciplina");
        }
    }
}
