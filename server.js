const express = require ('express')
const app = express()

const produtos = [
    {id: 1, descricao: "Banana Prata", preco: 8.99, categoria: "Periféricos", estoque: 15},
    {id: 2, descricao: "Leite Integral 1L", preco: 2.99, categoria: "Periféricos", estoque: 15},
    {id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Periféricos", estoque: 15}
]

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

app.use(express.json())

app.post('/produtos', (req, res) => {

    const {id, descricao, preco, categoria, estoque} = req.body

    if (!descricao || !preco){
        return res.status(400).json({ erro: 'Descricao e erro sao obrigatorios'})
    }

    const novoId = produtos.length > 0 ? produtos[produtos.lenght -1].id + 1 : 1

    const novoProduto = {
        id: novoId,
        descricao,
        preco,
        categoria: categoria || "Geral",
        estoque: estoque || 0
    }

    
})

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt (req.params.id);

    const index = produtos.findIndex (produto => produto.id === id)

    if (index != -1){
        
    produtos.splice (index, 1)
    res.json (produtos)
    } else{ 
        res.status(404)
        res.send ('produto não encontrado')
    }
})



app.listen (3000, (e) => {
    console.log('Servidor ouvindo em http://localhost:3000')
})