import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

public class Cobranca {
    private Aluno aluno;

    public Cobranca(Aluno aluno){
        this.aluno = aluno;
    }

    public Aluno getAluno(){
        return this.aluno;
    }

    public void setAluno(Aluno aluno){
        this.aluno = aluno;
    }


    public double gerarCobranca(Aluno aluno) {
        return Stream.concat(
                        aluno.getDisciplinasObrigatorias().stream(),
                        aluno.getDisciplinasOptativas().stream()
                )
                .mapToDouble(Disciplina::getPreco)
                .sum();
    }
}
