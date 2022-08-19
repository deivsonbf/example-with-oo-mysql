class Account {
    constructor(id, nome, dueDate, bestDay, expenses = [], total = 0) {
        this.id = id,
            this.nome = nome,
            this.dueDate = dueDate,
            this.bestDay = bestDay,
            this.expenses = expenses,
            this.total = 0
    }
}

module.exports = Account