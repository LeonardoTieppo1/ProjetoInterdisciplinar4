const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyparser = require("body-parser");
app.use(bodyparser.json());


var con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'empregos'
});

con.connect((err) => {
    if (!err)
        console.log("DB connection sucess!");
    else
        console.log("DB connection failed! \n ERROR: " + JSON.stringify(err, undefined, 2));
});


app.get("/", (req, res) => {
    return res.send("Seja bem vindo ao meu site!")
});

//GET todas as vagas
app.get("/vagas", (req, res) => {
    var sql = "SELECT*FROM empregos.empregos";
    con.query(sql, (err, result) => {
        if (err) throw err;
        return res.json(result);
    });
});

app.get("/vagas/:id", (req, res) => {
    con.query("SELECT*FROM empregos.empregos WHERE idVag=?", [req.params], (err, rows, fields) => {
        if (!err)
            return res.json(rows);
        else
            console.log(err);
    });
});


app.listen(4003, () => console.log("Conectado com sucesso! Acesse o site: http://localhost:4003"));