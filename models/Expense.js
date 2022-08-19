class Expense {
    constructor(nome, value) {
        this.id = new Date().getTime(),
        this.nome = nome,
        this.value = value
    }
}

module.exports = Expense