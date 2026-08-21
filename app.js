const express = require('express')
const app = express()

const produtos = [
     { id: 1, descrição: "Banana Prata 1Kg", preco: 8.99 },
     { id: 2, descrição: "Leite integral 1L", preco: 2.99 },
     { id: 3, descrição: "Paçoca", preco: 1.99 }
]
 
app.get ('/produtos', (req, res) => {
    res.json(produtos)
})

app.delete('/produtos/:id', (req,res) => {
    const id = parseInt (req.params.id);
    console.log (`excluir ${id}`)

    const index = produtos.findIndex (produto => produtos.id === id)
    if (index != -1) {
      produtos.splice (index, 1)
      res.json (produtos)
    }
    else { res.status (404)
        res.send ("Esse id nãoo existe") 
        //res pro cliente(postman no caso) e console pro servidor
        console.error ("Error 484")
        console.log ("Esse id não existe")
    }
})


if (id > produtos.length) or (id > produtos.length)
    exit()

const port = 3000
app.listen (3000, (e) => {
    console.log (`Servidor ouvindo em http://localhost: ${port}`)
})

//criar novo produto
app.post('/produto', (req, res) => {
    const novoProduto = req.body
    produtos.push(novoProduto)
    res.json(novoProduto)

})

//atualizar produto que ja existe
app.put('/produto/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
    
    if (index !== -1) {
        produtos[index] = req.body
        res.json(produtos[index])
    } else {
        res.status(404)
        res.send("Esse id não existe")
    }
})