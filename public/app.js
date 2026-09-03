const API_URL = "/produtos";

const form = document.getElementById("form-produto");
const listaProdutos = document.getElementById("lista-produtos");


// GET - Listar produtos
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";

        produtos.forEach(produto => {
            const div = document.createElement("div");

            div.classList.add("produto");

            div.innerHTML = `
                <h3>${produto.descricao}</h3>

                <p>
                    <strong>ID:</strong> ${produto.id}
                </p>

                <p>
                    <strong>Preço:</strong>
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${produto.categoria}
                </p>

                <p>
                    <strong>Estoque:</strong>
                    ${produto.estoque}
                </p>

                <div class="botoes">
                    <button
                        class="btn-editar"
                        onclick="editarProduto(${produto.id})">
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirProduto(${produto.id})">
                        Excluir
                    </button>
                </div>
            `;

            listaProdutos.appendChild(div);
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}


// POST - Cadastrar produto
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const produto = {
        descricao: document.getElementById("descricao").value,
        preco: Number(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value,
        estoque: Number(document.getElementById("estoque").value)
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar produto");
        }

        form.reset();

        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível cadastrar o produto.");
    }
});


// DELETE - Excluir produto
async function excluirProduto(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto");
        }

        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir o produto.");
    }
}


// PUT - Editar produto
async function editarProduto(id) {
    const descricao = prompt(
        "Digite a nova descrição:"
    );

    if (descricao === null) {
        return;
    }

    const preco = prompt(
        "Digite o novo preço:"
    );

    if (preco === null) {
        return;
    }

    const categoria = prompt(
        "Digite a nova categoria:"
    );

    if (categoria === null) {
        return;
    }

    const estoque = prompt(
        "Digite o novo estoque:"
    );

    if (estoque === null) {
        return;
    }

    const produtoAtualizado = {
        descricao: descricao,
        preco: Number(preco),
        categoria: categoria,
        estoque: Number(estoque)
    };

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produtoAtualizado)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar produto");
        }

        carregarProdutos();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível editar o produto.");
    }
}


// Carregar produtos quando a página abrir
carregarProdutos();