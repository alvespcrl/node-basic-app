const express = require ('express')
const app = express()
app.use(express.json())
const bcrypt = require('bcryptjs'); //importando o bcrypt
const jwt = require('jsonwebtoken');


const produtos = [
    { id: 1, descricao: "Banana Prata", preco: 8.99, categoria: "Alimentos", estoque: 15 },
    { id: 2, descricao: "Leite Integral 1L", preco: 5.99, categoria: "Alimentos", estoque: 20 },
    { id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Doces", estoque: 30 },
    { id: 4, descricao: "Teclado Mecânico", preco: 249.90, categoria: "Periféricos", estoque: 10 },
    { id: 5, descricao: "Mouse sem fio", preco: 89.90, categoria: "Periféricos", estoque: 25 }
]

const usuarios = [];

app.post('/usuarios', async(req, res) => {
    const {nome, email, senha} = req.body;

    const senhaCripto = await bcrypt.hash(senha, 10);

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha: senhaCripto
    };

    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email);

    if (usuarioEncontrado) {
        res.status(400).json({mensagem: 'Usuario ja cadastrado!'})
    }
    usuarios.push(novoUsuario);
    res.status(201).json({mensagem: 'Usuario criado com sucesso'});

});



app.use((req, res, next) => {
    console.log(new Date().toLocaleString(), req.method, req.path)
    next()
})

// Libera o acesso direto dos arquivos da pasta site para o navegador
app.use(express.static('site'))

app.get('/produtos', (req, res) => {
    res.json (produtos)
})

app.get('/produtos/:id', (req, res) => {
    const id = parseInt (req.params.id);

    const produto = produtos.find(p => p.id === id )

    if (!produto){
        return res.status(404).json ({erro: 'Produto não encontrado'});
    }
    
    return res.json(produto)
})

app.post('/produtos', verificarToken, (req, res) => {


    const { descricao, preco, categoria, estoque } = req.body

    if (!descricao || !preco){
        return res.status(400).json({ erro: 'Descricao e preco sao obrigatorios'})
    }

    const novoId = produtos.length > 0 ? produtos[produtos.length -1].id + 1 : 1

    const novoProduto = {
        id: novoId,
        descricao,
        preco,
        categoria: categoria || "Geral",
        estoque: estoque || 0
    }

    produtos.push(novoProduto)

    res.status(201).json(novoProduto)
    
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    console.log(req.body)
    const index = produtos.findIndex(produto => produto.id === id)

    if (index != -1){

        const { descricao, preco, categoria, estoque } = req.body

        produtos[index] = {
            id: id, 
            descricao,
            preco, 
            categoria, 
            estoque
        }
        return res.json(produtos[index])
        
    } else {
        return res.status(404).json({erro: 'produto nao encontrado'})
    }
})

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt (req.params.id);

    const index = produtos.findIndex (produto => produto.id === id)

    if (index != -1){
        
        produtos.splice (index, 1)

        return res.status(204).send()

    } else { 
        return res.status(404).json({erro: 'produto não encontrado' })
    }
})



app.listen (3000, () => {
    console.log('Servidor ouvindo em http://localhost:3000')
})

// login

app.use('/login', express.static('login'))

app.post ('/login', async (req, res) => {

    const {email, senha } = req.body;
    const emailCadastrado = usuarios.find(usuario => usuario.email === email);

    if (!emailCadastrado){
        return res.status(400).json({mensagem: 'Email nao encontrado'});
    }

    const senhaValida = await bcrypt.compare(senha, emailCadastrado.senha);

    if(!senhaValida){
        return res.status(400).json({mensagem: 'Senha incorreta!'});
    }

    const token = jwt.sign(
        {id: emailCadastrado.id},
        'chave_secreta_123',
        {expiresIn: '1h'}
    );
    return res.status(200).json({token, mensagem: 'Login realizado'});
})

function verificarToken(req, res, next){

    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({mensagem: 'token nao fornecido'})
    }

    const tokenPuro = authorization.split('Bearer ')[1];

    try {
        jwt.verify(tokenPuro, 'chave_secreta_123');
        next()
    } catch (erro){
            return res.status(401).json({mensagem: 'erro'})
        }
}
