const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tarefa = new Schema({
	tarefa: {
		type: String,
		required: true
	},
	descricao: {
		type: String,
		default: "Nenhuma descrição fornecida."
	},
	data: {
		type: Date,
		default: Date.now()
	}
});

mongoose.model("tarefas", Tarefa);