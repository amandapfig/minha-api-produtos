const express = require('express')
const app = express()

app.use(express.json())

const produtos = [
    { id: 1, descricao: "Banana Prata 1Kg", preco: 8.99 },
    { id: 2, descricao: "Leite integral 1L", preco: 2.99 },
    { id: 3, descricao: "Paçoca", preco: 1.99 }
]

// Listar produtos
app.get('/produtos', (req, res) => {
    res.json(produtos)
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
    const novoProduto = req.body

    produtos.push(novoProduto) // Adicionando o novo produto ao array de produtos

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