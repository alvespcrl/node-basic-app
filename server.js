const express = require ('express')
const app = express()
app.use(express.json())


const produtos = [
    { id: 1, descricao: "Banana Prata", preco: 8.99, categoria: "Alimentos", estoque: 15 },
    { id: 2, descricao: "Leite Integral 1L", preco: 5.99, categoria: "Alimentos", estoque: 20 },
    { id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Doces", estoque: 30 },
    { id: 4, descricao: "Teclado Mecânico", preco: 249.90, categoria: "Periféricos", estoque: 10 },
    { id: 5, descricao: "Mouse sem fio", preco: 89.90, categoria: "Periféricos", estoque: 25 }
]

app.use((req, res, next) => {
    console.log(new Date().toLocaleString(), req.method, req.path)
    next()
})

app.use ('/site', express.static ('site'))

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

app.post('/produtos', (req, res) => {

    console.log(req.body)

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

    
})

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