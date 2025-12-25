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

    // o nome do método “setDisciplina” pode confundir um pouco, já que ele adiciona uma disciplina à lista e não substitui o valor talvez renomear para “addDisciplina” deixaria a intenção mais clara

    // Você poderia validar se a disciplina já existe antes de adicioná-la, evitando duplicidade na lista, isso ajuda a manter a integridade dos dados do curso

    // o atributo “credito” poderia ser melhor representado com um nome mais descritivo, como “quantidadeDeCreditos” — isso ajuda na leitura e entendimento do código

    // Caso o sistema venha a crescer, vale considerar mover essa lista de disciplinas para uma classe separada de gerenciamento, mantendo essa classe apenas como modelo
}
