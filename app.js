const express = require('express')
const app = express()

app.use(express.json())

const produtos = [
    {
        id: 1,
        descricao: "Banana Prata 1Kg",
        preco: 8.99,
        categoria: "Frutas",
        estoque: 20
    },
    {
        id: 2,
        descricao: "Leite integral 1L",
        preco: 2.99,
        categoria: "Laticínios",
        estoque: 30
    },
    {
        id: 3,
        descricao: "Paçoca",
        preco: 1.99,
        categoria: "Doces",
        estoque: 50
    },
    {
        id: 4,
        descricao: "Arroz 5Kg",
        preco: 24.90,
        categoria: "Alimentos",
        estoque: 15
    },
    {
        id: 5,
        descricao: "Café 500g",
        preco: 18.90,
        categoria: "Bebidas",
        estoque: 25
    }
]

// Listar todos os produtos
app.get('/produtos', (req, res) => {
    res.json(produtos)
})

// Buscar produtos por id
app.get('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const produto = produtos.find(produto => produto.id === id)

    if (produto) {
        res.json(produto)
    } else {
        res.status(404).send("Esse id não existe")
    }
})

// Excluir produto
app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const index = produtos.findIndex(produto => produto.id === id) // procurando o índice do produto com o id fornecido

    if (index !== -1) {
        produtos.splice(index, 1) // Removendo o produto do array de produtos
        res.json(produtos)
    } else {
        console.error("Esse id não existe")
        res.status(404).send("Esse id não existe")
    }
})

// Criar novo produto
app.post('/produtos', (req, res) => {
    const novoProduto = {
        id: produtos.length > 0
            ? Math.max(...produtos.map(produto => produto.id)) + 1
            : 1,
        descricao: req.body.descricao,
        preco: req.body.preco,
        categoria: req.body.categoria,
        estoque: req.body.estoque
    }

    produtos.push(novoProduto)

    res.status(201).json(novoProduto)
})

// Atualizar produto
app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id) // convertendo o id da string para um número inteiro

    const index = produtos.findIndex(produto => produto.id === id) // procurando o índice do produto com o id fornecido

    if (index !== -1) {
        produtos[index] = {
            ...produtos[index], // mantendo as propriedades existentes do produto
            ...req.body,
            id: id
        }

        res.json(produtos[index]) // retornando o produto atualizado como resposta
    } else {
        res.status(404).send("Esse id não existe") // retornando um status 404 (Not Found) se o produto não for encontrado
    }
})

const port = 3000

app.listen(port, () => {
    console.log(`Servidor ouvindo em http://localhost:${port}`)
})