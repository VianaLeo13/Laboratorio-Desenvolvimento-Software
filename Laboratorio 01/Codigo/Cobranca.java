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
        // já está recebendo o aluno como parâmetro, mas a classe já tem um atributo “aluno”. é melhor não ser necessário passar ele no método, poderia usar direto o atributo interno

        return Stream.concat(
                        aluno.getDisciplinasObrigatorias().stream(),
                        aluno.getDisciplinasOptativas().stream()
                )
                .mapToDouble(Disciplina::getPreco)
                .sum();
    }

    // o método gera um valor de cobrança, acho que seria interessante armazenar esse resultado em um atributo interno para futuras consultas, como geração de boletos ou relatórios

    // se em algum momento o aluno não tiver disciplinas, o método vai retornar 0, mas vale considerar lançar um aviso ou logar esse caso, para ajudar no diagnóstico se algo der errado

    // uma sugestão de melhoria seria extrair a lógica de cálculo para uma classe de serviço, tipo `CobrancaService`, separando o cálculo da estrutura do modelo. Isso segue o princípio de responsabilidade única e facilita os testes.
}
