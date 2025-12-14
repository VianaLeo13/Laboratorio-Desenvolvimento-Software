import java.util.ArrayList;
import java.util.List;

public class Curso {
    private String nome;
    private int credito;
    private List<Disciplina> disciplinas;

    public Curso(String nome, int credito){
        this.nome = nome;
        this.credito = credito;
        this.disciplinas = new ArrayList<Disciplina>();
    }

    public Curso() {

    }

    public String getNome(){
        return this.nome;
    }

    public void setNome(String nome){
        this.nome = nome;
    }

    public int getCredito(){
        return this.credito;
    }

    public void setCredito(int credito){
        this.credito = credito;
    }

    public List<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplinas.add(disciplina);
    }
}