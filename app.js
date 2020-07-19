const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const PORTNUMBER = process.env.PORT || 8081;

const mongoose = require('mongoose');
require("./models/Tarefa");
const Tarefa = mongoose.model("tarefas");

// Configurações

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.connect("mongodb://localhost/todolistapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
	console.log("Conectado ao banco de dados.");
}).catch(() => {
	console.log("Erro na conexão com o banco de dados.");
})

// Rotas

app.get("/", (req, res) => {
	
	Tarefa.find().lean().then((tarefas) => {
		
		let quantidade = "";
		if (tarefas.length == 1){
			quantidade = "Há 1 tarefa restante.";
		} else {
			quantidade = "Há " + (tarefas.length) + " tarefas restantes.";
		}
		
		res.render("principal/index", {tarefas: tarefas, quantidade: quantidade});
	}).catch(() => {
		res.render("principal/index", {erros: [{msg: "Ocorreu um erro ao tentar recolher as tarefas."}]});
	});

});


app.get("/add/", (req, res) => {
	res.render("principal/add");
})


app.post("/add/", (req, res) => {
	
	if (!req.body.tarefa) {
		res.render("principal/add", {erros: [{msg: "Você precisa inserir um nome para a tarefa."}]});
		return;
	}
		
	let novaTarefa = {
		tarefa: req.body.tarefa,
	}
	
	if (req.body.descricao) {
		novaTarefa.descricao = req.body.descricao;
	}
	
	new Tarefa(novaTarefa).save().then(() => {
		res.redirect("/");
	}).catch(() => {
		res.render("principal/add", {erros: [{msg: "Ocorreu um erro durante a inclusão da tarefa."}]});
	});

})


app.get("/delete/:id", (req, res) => {
	
	Tarefa.findOneAndDelete({_id: req.params.id}).then(() => {
		res.redirect("/");
	}).catch(() => {
		res.render("principal/index", {erros: [{msg: "Ocorreu um erro ao tentar deletar a tarefa."}]});
	});
	
})


// Iniciar servidor

app.listen(PORTNUMBER, () => {
	console.log("Iniciando servidor na porta " + PORTNUMBER);
})