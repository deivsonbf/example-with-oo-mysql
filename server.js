const app = require('./app')
require('dotenv').config();
const bcrypt = require('bcrypt')
const Account = require('./models/Account')
const Expense = require('./models/Expense')
const mysql = require('./config')
const User = require('./models/User');
const { log } = require('console');

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
    let salt = bcrypt.genSaltSync(process.env.SALT)
    let cryptedPass = bcrypt.hashSync(senha, salt)
    const user = new User(login, cryptedPass)

    mysql.getConnection((error, conn) => {
        if (error) res.json(error)
        conn.query('SELECT * FROM users WHERE login = ?;', [user.login], (error, resultset) => {
            if (error) res.json(error)
            try {
                if ((user.login === resultset[0].login)) {
                    conn.release()
                    res.json('Nome de usuário já existe')
                }
            } catch (error) {
                if (!user.login) {
                    res.json("Nao pode ser vazio")
                } else {
                    conn.query(`INSERT INTO users (login , senha)  values (? , ?)`, [user.login, user.senha], (error, result) => {
                        conn.release()
                        if (error) { res.json(error) }
                        res.json(
                            {
                                mensagem: 'Cadastrado com sucesso!',
                                id: result.insertId
                            })
                    })
                }
            }
        })
    })
})

app.get('/login', (req, res) => {

    const { login, senha } = req.body

    mysql.getConnection((error, conn) => {
        conn.query('SELECT * FROM users WHERE login = ?;', [login], async (error, result) => {
            if (error) { res.json(error) }
            try {
                const match = await bcrypt.compare(senha, result[0].senha)
                if (match) {
                    res.json({ mensagem: 'Logado com sucesso' })
                } else {
                    res.json({ mensagem: 'senha invalida' })
                }
            } catch (error) {
                res.json('usuario nao encontrado')
            }
        })
    })


})


app.listen(9999, console.log('Conectado'))
