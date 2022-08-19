const app = require('./app')
require('dotenv').config();
const Account = require('./models/Account')
const Expense = require('./models/Expense')
const mysql = require('./config')
const User = require('./models/User')

let expenses = []

app.get("/", (req, res) => {
    return res.json(expenses)
})

app.post('/expenses', (req, res) => {
    const { nome, dueDate, bestDay } = req.body
    let account = new Account(nome, dueDate, bestDay)
    expenses.push(account)

    const response = {
        message: 'cadastrado com sucesso',
        data: [...expenses]
    }
    res.json(response)
})

app.patch('/expenses/:id', (req, res) => {
    const expense = expenses.filter(item => { return item.id === req.params.id })
    const exp = new Expense(req.body.nome, req.body.value)
    const total = expense[0].expenses.reduce((accumulator, item) => { return accumulator + parseFloat(item.value) }, 0.0)
    expense[0].total = total;
    expense[0].expenses.push(exp);
    res.json(expense)
})


app.get('/users', (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) res.json(error)
        conn.query('SELECT * FROM users', (error, result) => {
            conn.release()
            if (error) res.json(error)
            res.json(result)
        })
    })
})

app.post('/users', (req, res) => {

    const { login, senha } = req.body

    console.log(login + ' ' + senha);

    const user = new User(login, senha)

    mysql.getConnection((error, conn) => {
        if (error) res.json(error)
        conn.query('INSERT INTO users (login , senha) values (? , ?)', [user.login, user.senha], (error, result) => {
            conn.release()
            if (error) res.json(error)
            res.json(result)
        })
    })
})


app.listen(9999, console.log('Conectado'))