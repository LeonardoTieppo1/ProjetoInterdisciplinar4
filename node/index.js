const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const ejs = require("ejs");
const port = 3000

app.set('view engine', 'ejs');
app.use(express.json());


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'empregos'
});

const runSQL = (sql) => {
    return new Promise(function(res, rej) {
        pool.getConnection(function(err, connection) {
            if (err) rej(err);
            connection.query(sql, function(err, rows) {
                if (err) rej(err);
                else res(rows);
                connection.release();
            });
        });
    });
}

exports.listaVagas = (firstLetter) => {
    var sql = "SELECT * FROM empregos WHERE UPPER(empresa) LIKE (UPPER(?))";
    var params = [];
    params.push(firstLetter + '%');
    sql = mysql.format(sql, params);
    return runSQL(sql);
};
app.get("/form", (req, res) => {
    res.render("pages/form")
});
app.post('/form', (req, res) => {
    this.listaVagas('').then((result) => {
        res.render('pages/teste', {
            empresas: result
        });
    });
});

app.get('/', (req, res) => {
    var l = '';
    if (req.query.firstLetter) l = req.query.firstLetter;
    this.list(l).then((result) => {
        res.render('pages/index', {
            empresas: result
        });
    });
})

app.get('/chart', (req, res) => {
    this.list('').then((result) => {
        res.render('pages/chart', {
            empresas: result
        });
    });
})


app.listen(port, () => console.log("Conectado com sucesso! Acesse o site: http://localhost:3000"));