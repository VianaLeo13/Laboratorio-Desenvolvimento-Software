public abstract class Usuario {
    private String nome;
    private String cpf;
    private String senha;
    private String codigoPessoa;

    public Usuario(String nome, String codigoPessoa, String cpf, String senha) {
        this.codigoPessoa = codigoPessoa;
        this.cpf = cpf;
        this.senha = senha;
        this.nome = nome;
    }

    public boolean fazerLogin(String codigoPessoa, String senha) {
        if(this.codigoPessoa.equals(codigoPessoa) && this.senha.equals(senha)) {
            return true;
        }
        return false;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCodigoPessoa() {
        return codigoPessoa;
    }

    public void setCodigoPessoa(String codigoPessoa) {
        this.codigoPessoa = codigoPessoa;
    }
}