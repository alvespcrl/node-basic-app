const corpoTabela = document.getElementById('corpo-tabela');
const salvar = document.getElementById('form-produto');
let editando =null;

function carregarProdutos(){
fetch('/produtos')
    .then(res => res.json())
    .then(data => {
        corpoTabela.innerHTML = '';
        data.forEach(produto => {
            corpoTabela.innerHTML += `
                <tr>    
                    <td>${produto.id}</td>
                    <td>${produto.descricao}</td>
                    <td>${produto.preco.toFixed(2)}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.estoque}</td>

                    <td>
                        <button onclick = "editar(${produto.id})">Editar</button>
                       <button onclick="deletar(${produto.id})">Excluir</button>
                    </td>
                </tr>
            `
        });
    });
}


salvar.addEventListener('submit', (e) => {
    const descricao = document.getElementById('descricao').value
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value
    const estoque = parseInt(document.getElementById('estoque').value);
    const novoProduto = { descricao, preco, categoria, estoque };
    const url = editando ? `/produtos/${editando}` : '/produtos';
    const metodo = editando ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
    })
        .then(res => res.json())
        .then(data => {
            console.log('Produto cadastrado: ', data);
            salvar.reset();  
            editando = null;     
            carregarProdutos();
        });
});

function editar(id){
    fetch(`/produtos/${id}`)
        .then(res => res.json())
        .then(produto => {
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('categoria').value = produto.categoria;
            document.getElementById('estoque').value = produto.estoque;

            editando = produto.id;
        });
}

function deletar(id){
    
    fetch(`/produtos/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok){
            console.log('Produto deletado');
            carregarProdutos();
        }
        else {
            alert('Erro ao excluir o produto');
        }
    });
}
carregarProdutos();