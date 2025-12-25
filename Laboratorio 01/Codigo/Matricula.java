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
        // esse método poderia usar diretamente os atributos “aluno” e “disciplina” da classe, em vez de recebê-los como parâmetros novamente, isso deixaria a interface da classe mais simples

        if(disciplina.temEspaco()){
            disciplina.setAluno(aluno);
            System.out.println("Aluno " + aluno.getNome() + " adicionado com sucesso!");
        }else{
            throw new Exception("Não há vagas para esta disciplina");
        }

        // seria interessante atualizar o atributo “status” aqui, por exemplo, desativar a matrícula se o aluno não puder ser adicionado, assim o objeto “Matricula” reflete o estado real da operação
    }

    // método lança Exception genérica, criar uma exceção personalizada, tipo “SemVagasException” ou “MatriculaInvalidaException”, deixaria o tratamento de erros mais claro e organizado.

    // Também seria legal registrar essa matrícula em uma lista dentro da classe “Aluno” ou “Disciplina”, para manter o relacionamento consistente entre as entidades e facilitar futuras consultas.
}
