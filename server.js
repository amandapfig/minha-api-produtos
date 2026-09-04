const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const app = express()

app.use(express.json())
app.use(express.static("public"))

const SECRET_KEY = 'sua_chave_secreta_super_segura' // Em produção, utilize variáveis de ambiente (.env)

// Bancos de dados em memória
const usuarios = [] // Armazenará { email, senhaCriptografada }
const produtos = [
  { id: 1, descricao: "Banana Prata 1Kg", preco: 8.99, categoria: "Frutas", estoque: 20 },
  { id: 2, descricao: "Leite integral 1L", preco: 2.99, categoria: "Laticínios", estoque: 30 },
  { id: 3, descricao: "Paçoca", preco: 1.99, categoria: "Doces", estoque: 50 },
  { id: 4, descricao: "Arroz 5Kg", preco: 24.90, categoria: "Alimentos", estoque: 15 },
  { id: 5, descricao: "Café 500g", preco: 18.90, categoria: "Bebidas", estoque: 25 }
]

// Registrar novo usuário
app.post('/usuarios/register', async (req, res) => {
  const { email, senha } = req.body

  if (usuarios.find(u => u.email === email)) {
    return res.status(400).send("Este e-mail já está cadastrado.")
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10)
  usuarios.push({ email, senha: senhaCriptografada })

  res.status(201).send("Usuário cadastrado com sucesso!")
})

// Fazer login e gerar o Token JWT
app.post('/usuarios/login', async (req, res) => {
  const { email, senha } = req.body
  const usuario = usuarios.find(u => u.email === email)

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).send("E-mail ou senha inválidos.")
  }

  // Cria o token com validade de 2 horas
  const token = jwt.sign({ email: usuario.email }, SECRET_KEY, { expiresIn: '2h' })

  res.json({ mensagem: "Login realizado com sucesso!", token })
})

// MIDDLEWARE DE VERIFICAÇÃO DO TOKEN
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Formato: "Bearer <token>"

  if (!token) {
    return res.status(401).send("Acesso negado. Token não fornecido.")
  }

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).send("Token inválido ou expirado.")
    }
    req.usuario = payload // Guarda os dados do usuário na requisição se precisar
    next()
  })
}

// Listar todos os produtos (Aberta para quem acessar o site, ou protegida se preferir)
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

// Criar novo produto (AGORA PROTEGIDO COM JWT)
app.post('/produtos', verificarToken, (req, res) => {
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

// Atualizar produto (AGORA PROTEGIDO COM JWT)
app.put('/produtos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id)
  const index = produtos.findIndex(produto => produto.id === id)

  if (index !== -1) {
    produtos[index] = {
      ...produtos[index],
      ...req.body,
      id: id
    }
    res.json(produtos[index])
  } else {
    res.status(404).send("Esse id não existe")
  }
})

// Excluir produto (AGORA PROTEGIDO COM JWT)
app.delete('/produtos/:id', verificarToken, (req, res) => {
  const id = parseInt(req.params.id)
  const index = produtos.findIndex(produto => produto.id === id)

  if (index !== -1) {
    produtos.splice(index, 1)
    res.json(produtos)
  } else {
    res.status(404).send("Esse id não existe")
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`)
})