class User {
    constructor(login, senha) {
        this.id = new Date().getTime().toString(),
            this.login = login,
            this.senha = senha
    }
}

module.exports = User