const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Produto = require('./models/Produto'); 
const Usuario = require('./models/Usuario'); 
const crypto = require('crypto');
const Marca = require('./models/Marca');
const Categoria = require('./models/Categoria'); 


app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: 'API de E-commerce de Máquinas para Salão de Cabeleireiro' });
});

//-- Rota Produto --//

// Create produto
app.post('/produto', async (req, res) => {
    const { nome, preco, descricao, categoriaId } = req.body;
    const produto = { nome, preco, descricao, categoriaId };
    
    try {
        await Produto.create(produto);
        res.status(200).json({ message: "Produto inserido" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read produtos
app.get("/produto", async (req, res) => {
    try {
        const produtos = await Produto.find().populate('categoriaId');
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read produto por id
app.get("/produto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const produto = await Produto.findById(id).populate('categoriaId');
        if (!produto) {
            res.status(422).json({ message: "Produto não encontrado!" });
            return;
        }
        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Update produto
app.patch("/produto/:id", async (req, res) => {
    const id = req.params.id;
    const { nome, preco, descricao, categoriaId } = req.body;
    const produto = { nome, preco, descricao, categoriaId };

    try {
        const updateProduto = await Produto.updateOne({ _id: id }, produto);
        if (updateProduto.matchedCount === 0) {
            res.status(422).json({ message: "Produto não encontrado!" });
            return;
        }
        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete produto
app.delete("/produto/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const produto = await Produto.findById(id);
        if (!produto) {
            res.status(422).json({ message: "Produto não encontrado!" });
            return;
        }
        await Produto.deleteOne({ _id: id });
        res.status(200).json({ message: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

//-- Rota Categoria --//

// Create categoria
app.post('/categoria', async (req, res) => {
    const { nome } = req.body;
    const categoria = { nome };
    
    try {
        await Categoria.create(categoria);
        res.status(200).json({ message: "Categoria inserida" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read categorias
app.get("/categoria", async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Resto das rotas de usuário permanece inalterado
//-- Rota Marca --//

// Create marca
app.post('/marca', async (req, res) => {
    const { nome } = req.body;
    const marca = { nome };
    
    try {
        await Marca.create(marca);
        res.status(200).json({ message: "Marca inserida" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read marcas
app.get("/marca", async (req, res) => {
    try {
        const marcas = await Marca.find();
        res.status(200).json(marcas);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Read marca por id
app.get("/marca/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const marca = await Marca.findById(id);
        if (!marca) {
            res.status(422).json({ message: "Marca não encontrada!" });
            return;
        }
        res.status(200).json(marca);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Update marca
app.patch("/marca/:id", async (req, res) => {
    const id = req.params.id;
    const { nome } = req.body;
    const marca = { nome };

    try {
        const updateMarca = await Marca.updateOne({ _id: id }, marca);
        if (updateMarca.matchedCount === 0) {
            res.status(422).json({ message: "Marca não encontrada!" });
            return;
        }
        res.status(200).json(marca);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Delete marca
app.delete("/marca/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const marca = await Marca.findById(id);
        if (!marca) {
            res.status(422).json({ message: "Marca não encontrada!" });
            return;
        }
        await Marca.deleteOne({ _id: id });
        res.status(200).json({ message: "Marca removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Criando função p/ criptografar senhas
const cipher = {
    algorithm: "aes-256-cbc",
    secret: process.env.SECRET_KEY, // Use uma variável de ambiente para a chave
    iv: crypto.randomBytes(16) // Gerando um vetor de inicialização
};

async function getCrypto(password) {
    return new Promise((resolve, reject) => {
        const cipher = crypto.createCipheriv(cipher.algorithm, Buffer.from(cipher.secret, 'hex'), cipher.iv);
        let encryptedData = '';

        cipher.on('readable', () => {
            let chunk;
            while (null !== (chunk = cipher.read())) {
                encryptedData += chunk.toString('hex');
            }
        });

        cipher.on('end', () => {
            resolve(encryptedData);
        });

        cipher.on('error', (error) => {
            reject(error);
        });

        cipher.write(password);
        cipher.end();
    });
}

// Configurando API para ler JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.post('/usuario', async (req, res) => { // Alterado para usuario
    let { email, pass } = req.body;
    try {
        let newPass = await getCrypto(pass);
        const usuario = {
            email,
            pass: newPass,
            iv: cipher.iv.toString('hex') // Armazena o IV junto com a senha
        };
        await Usuario.create(usuario);
        res.status(201).json({ message: 'Usuário inserido no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
});

// O R do CRUD
app.get('/usuario', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
});

// Login do Usuário
app.post('/login', async (req, res) => {
    let { email, pass } = req.body;
    try {
        let encryptedPass = await getCrypto(pass);
        const usuario = await Usuario.findOne({ email, pass: encryptedPass });
        if (!usuario) {
            res.status(422).json({ message: 'Credenciais inválidas!' });
            return;
        }
        res.status(200).json({ message: 'Usuário Logado', user: usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro no login.' });
    }
});


// Conexão com MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {

    console.log("Conexão bem sucedida");
}).catch(err => {
    console.error("Erro ao conectar ao MongoDB", err);
    
});
