import java.util.ArrayList;
import java.util.List;

public class Aluno extends Usuario {

    private static final int A_MAX_OBRIGATORIAS = 4;
    private static final int A_MAX_OPTATIVAS = 2;
    private List<Disciplina> A_disciplinasObrigatorias;
    private List<Disciplina> A_disciplinasOptativas;
    private Disciplina A_disciplina;
    private double A_mensalidade;

    public Aluno(String nome, String codigoPessoa, String cpf, String senha){
        super(nome, codigoPessoa, cpf, senha);
        this.A_disciplinasObrigatorias = new ArrayList<Disciplina>();
        this.A_disciplinasOptativas = new ArrayList<Disciplina>();
    }

    public List<Disciplina> getDisciplinasObrigatorias() {
        return A_disciplinasObrigatorias;
    }

    public void setDisciplinasObrigatorias(Disciplina disciplina) {
        this.A_disciplinasObrigatorias.add(disciplina);
    }

    public List<Disciplina> getDisciplinasOptativas() {
        return A_disciplinasOptativas;
    }

    public void setDisciplinasOptativas(Disciplina disciplina) {
        this.A_disciplinasOptativas.add(disciplina);
    }

    public double setMensalidade(double mensalidade) {
        return this.A_mensalidade = mensalidade;
    }

    public double getA_mensalidade() {
        return A_mensalidade;
    }

    public void addDisciplina(Disciplina disciplina) throws Exception{
        //  Use exceções mais específicas, por exemplo, “DisciplinaJaExisteException” ou “LimiteDeDisciplinaAtingidoException” em vez de lançar uma Exception genérica

        if(A_disciplinasObrigatorias.contains(disciplina) || A_disciplinasOptativas.contains(disciplina)){
            throw new Exception("Disciplina já existente");
        }else {
            if (disciplina.getTipoDisciplina().equals(DisciplinaType.OBRIGATORIA)) {
                if (A_disciplinasObrigatorias.size() < A_MAX_OBRIGATORIAS) {
                    A_disciplinasObrigatorias.add(disciplina);
                } else {
                    throw new Exception("Limite de obrigatórias atingido.");
                }
            } else if (disciplina.getTipoDisciplina().equals(DisciplinaType.OPTATIVA)) {
                if (A_disciplinasOptativas.size() < A_MAX_OPTATIVAS) {
                    A_disciplinasOptativas.add(disciplina);
                } else {
                    throw new Exception("Limite de optativas atingido.");
                }
            } else {
                throw new Exception("Tipo de disciplina não encontrado.");
            }
        }
    }

    public void removerDisciplina(Disciplina disciplina) throws Exception {
        // retorne um boolean dizendo se a remoção deu certo ou não, em vez de só imprimir no console

        if (A_disciplinasObrigatorias.remove(disciplina) || A_disciplinasOptativas.remove(disciplina)) {
            disciplina.removerAluno(this); // apenas avisa a disciplina
        } else {
            System.out.println("Erro ao remover disciplina");
        }
    }

    // O atributo “A_disciplina” não está sendo usado em lugar nenhum.
    // Acho que pode ser um resto de código antigo. Se não tiver mais utilidade, vale remover pra deixar a classe mais limpa

    // Os métodos “setDisciplinasObrigatorias” e “setDisciplinasOptativas” na verdade adicionam disciplinas, não “setam” a lista toda.
    // Talvez renomear pra “addDisciplinaObrigatoria” e “addDisciplinaOptativa” deixaria o código mais intuitivo.
}
