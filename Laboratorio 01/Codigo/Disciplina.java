import java.util.ArrayList;
import java.util.List;

public class Disciplina{
    private int carga;
    private String nome;
    private boolean ativo;
    private List<Aluno> alunos;
    private static final int MIN_ALUNO = 3;
    private static final int MAX_ALUNO = 60;
    private int totalAlunos;
    private double preco;
    private DisciplinaType tipoDisciplina;

    public Disciplina(int carga, String nome, double preco, DisciplinaType tipoDisciplina) {
        this.carga = carga;
        this.nome = nome;
        this.preco = preco;
        this.ativo = false;
        this.totalAlunos = 0;
        this.alunos = new ArrayList<Aluno>();
        this.tipoDisciplina = tipoDisciplina;
    }

    public int getCarga() {
        return carga;
    }

    public void setCarga(int carga) {
        this.carga = carga;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAluno(Aluno aluno){
        this.alunos.add(aluno);
        this.setAtivo(true);
        this.totalAlunos++;
    }

    public int getTotalAlunos() {
        return totalAlunos;
    }

    public void setTotalAlunos() {
        this.totalAlunos++;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public DisciplinaType getTipoDisciplina() {
        return tipoDisciplina;
    }

    public void setTipoDisciplina(DisciplinaType tipoDisciplina) {
        this.tipoDisciplina = tipoDisciplina;
    }

    public boolean temEspaco(){
        return getTotalAlunos() < MAX_ALUNO;
    }

    public void removerAluno(Aluno aluno) {
        if (alunos.remove(aluno)) {
            totalAlunos--;
            if(totalAlunos == 0){
                setAtivo(false);
            }
        }
    }

    // aqui o método “setAluno” na verdade adiciona um aluno à lista, um nome mais intuitivo como “adicionarAluno” deixaria o código mais fácil de entender

    // vc já tem as constantes MIN_ALUNO e MAX_ALUNO, mas só está usando a máxima, poderia aproveitar o MIN_ALUNO para validar se a disciplina pode realmente ser ativada

    // o contador totalAlunos é atualizado manualmente em vários lugares, uma alternativa seria calcular esse valor com `alunos.size()` para evitar inconsistências.

    // seria interessante mover a lógica de ativação/desativação de disciplina para métodos específicos, tipo “ativarDisciplina()” e “desativarDisciplina()”, isso deixaria o código mais organizado e com responsabilidades bem definidas
}

