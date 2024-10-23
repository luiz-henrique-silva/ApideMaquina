const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    descricao: { type: String },
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }, // chave estrangeira da categoria  
    marcaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Marca' } // chave estrangeira da marca
});

module.exports = mongoose.model('Produto', ProdutoSchema);
