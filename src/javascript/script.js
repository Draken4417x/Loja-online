// Função para carregar os dados do LocalStorage
function carregarLocalStorage() {
    // Carregar dados de produtos do LocalStorage
    const produtosSalvos = JSON.parse(localStorage.getItem('produtos'));
    if (produtosSalvos) {
        produtos = produtosSalvos;
    }

    // Carregar dados de histórico de vendas do LocalStorage
    const historicoSalvo = JSON.parse(localStorage.getItem('historicoVendas'));
    if (historicoSalvo) {
        historicoVendas = historicoSalvo;
    }

    // Carregar dados de vendas
    vendasDinheiro = parseFloat(localStorage.getItem('vendasDinheiro')) || 0;
    vendasCartao = parseFloat(localStorage.getItem('vendasCartao')) || 0;
    vendasPix = parseFloat(localStorage.getItem('vendasPix')) || 0;
    totalVendasDinheiro = parseFloat(localStorage.getItem('totalVendasDinheiro')) || 0;
    totalVendasCartao = parseFloat(localStorage.getItem('totalVendasCartao')) || 0;
    totalVendasPix = parseFloat(localStorage.getItem('totalVendasPix')) || 0;
    totalCaixa = parseFloat(localStorage.getItem('totalCaixa')) || 0;
    entradaCaixa = parseFloat(localStorage.getItem('entradaCaixa')) || 0;
}

// Chamar a função para carregar os dados ao inicializar a página
window.onload = carregarLocalStorage;


// Variáveis de controle
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let totalCaixa = parseFloat(localStorage.getItem('totalCaixa')) || 0;
// Histórico de vendas
let historicoVendas = JSON.parse(localStorage.getItem('historicoVendas')) || [];

// Função que salva o historico de vendas
function salvarHistoricoLocalStorage() {
    try {
        localStorage.setItem('historicoVendas', JSON.stringify(historicoVendas));
    } catch (e) {
        console.error("Erro ao salvar o histórico de vendas no localStorage:", e);
    }
}

// Função para salvar os dados no Local Storage
function salvarLocalStorage() {
    try {
        localStorage.setItem('produtos', JSON.stringify(produtos));
        localStorage.setItem('totalCaixa', totalCaixa.toString());
    } catch (e) {
        console.error("Erro ao salvar os dados no localStorage:", e);
    }
}

// Função para exibir a página correta
function mostrarPagina(idPagina) {
    document.getElementById('cadastro-page').classList.add('hidden');
    document.getElementById('vendas-page').classList.add('hidden');
    document.getElementById('reposicao-page').classList.add('hidden');
    document.getElementById('editar-page').classList.add('hidden');
    document.getElementById('historico-page').classList.add('hidden');
    document.getElementById(idPagina).classList.remove('hidden');
}

// Ação para ir à página de cadastro
document.getElementById('ir-cadastro').addEventListener('click', () => {
    mostrarPagina('cadastro-page');
});


// Ação para ir à página de vendas
document.getElementById('ir-vendas').addEventListener('click', () => {
    mostrarPagina('vendas-page');
});



// Ação para ir à página de reposição
document.getElementById('ir-reposicao').addEventListener('click', () => {
    mostrarPagina('reposicao-page');
});

// Ação para ir à página de edição
document.getElementById('ir-editar').addEventListener('click', () => {
    mostrarPagina('editar-page');
});

// Trocar entre estoque de unidade e kg
document.getElementById('estoque-unidade').addEventListener('change', () => {
    document.getElementById('estoque-unidade-container').classList.remove('hidden');
    document.getElementById('estoque-kg-container').classList.add('hidden');
});

document.getElementById('estoque-kg').addEventListener('change', () => {
    document.getElementById('estoque-unidade-container').classList.add('hidden');
    document.getElementById('estoque-kg-container').classList.remove('hidden');
});

// Ação ao adicionar produto
document.getElementById('add-produto').addEventListener('click', () => {
    const nomeProduto = document.getElementById('produto-nome').value;
    const precoProduto = parseFloat(document.getElementById('produto-preco').value);
    let estoqueProduto = 0;
    let tipoEstoque = '';

    // Verifica se o tipo de estoque foi selecionado
    if (!document.getElementById('estoque-unidade').checked && !document.getElementById('estoque-kg').checked) {
        alert("Por favor, selecione o tipo de estoque.");
        return;
    }

    // Verifica qual tipo de estoque foi selecionado
    if (document.getElementById('estoque-unidade').checked) {
        estoqueProduto = parseInt(document.getElementById('produto-estoque-unidade').value);
        tipoEstoque = 'unidade';
    } else if (document.getElementById('estoque-kg').checked) {
        estoqueProduto = parseFloat(document.getElementById('produto-estoque-kg').value);
        tipoEstoque = 'kg';
    }

    // Valida os campos
    if (!nomeProduto || isNaN(precoProduto) || isNaN(estoqueProduto) || estoqueProduto < 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Adiciona o produto ao array de produtos
    produtos.push({ nome: nomeProduto, preco: precoProduto, estoque: estoqueProduto, tipoEstoque });
    salvarLocalStorage(); // Salva os dados no Local Storage
    alert(`Produto ${nomeProduto} cadastrado com sucesso!`);

    // Limpa os campos
    document.getElementById('produto-nome').value = '';
    document.getElementById('produto-preco').value = '';
    document.getElementById('produto-estoque-unidade').value = '';
    document.getElementById('produto-estoque-kg').value = '';
});

function carregarHistoricoLocalStorage() {
    const historico = localStorage.getItem('historicoVendas');
    historicoVendas = historico ? JSON.parse(historico) : [];
}

// Função para carregar os produtos do LocalStorage
try {
    produtos = JSON.parse(localStorage.getItem('produtos')) || [];
} catch (e) {
    console.error("Erro ao carregar os produtos do localStorage:", e);
}

// Ação para ir para a página de vendas
document.getElementById('ir-vendas').addEventListener('click', () => {
    if (produtos.length === 0) {
        alert("Por favor, cadastre pelo menos um produto.");
        return;
    }

    // Popula o select de produtos na página de vendas
    const produtoSelect = document.getElementById('produto-selecionado');
    produtoSelect.innerHTML = ''; // Limpa o select antes de adicionar novos produtos

    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        const tipoEstoqueTexto = produto.tipoEstoque === 'kg' ? 'Kg' : 'Unidades';
        option.text = `${produto.nome} - R$ ${produto.preco.toFixed(2)} (${produto.estoque} ${tipoEstoqueTexto})`;
        produtoSelect.add(option);
    });

    // Limpa campos ao carregar a página de vendas
    document.getElementById('peso-em-gramas').value = ''; // Limpa o campo de peso
    document.getElementById('preco-convertido').textContent = ''; // Limpa o preço convertido

    // Exibe sempre os campos relacionados ao peso
    const inputPesoContainer = document.getElementById('input-peso-container');
    const precoConvertidoContainer = document.getElementById('preco-convertido-container');
    inputPesoContainer.classList.remove('hidden'); // Garante que o campo de gramas esteja visível
    precoConvertidoContainer.classList.remove('hidden'); // Garante que o preço convertido esteja visível

    // Evento para calcular o valor convertido com base no peso
    document.getElementById('peso-em-gramas').removeEventListener('input', calcularPrecoConvertido); // Remover ouvintes anteriores
    document.getElementById('peso-em-gramas').addEventListener('input', calcularPrecoConvertido);

    function calcularPrecoConvertido(e) {
        const pesoGramas = parseFloat(e.target.value);
        const produtoSelecionado = produtos[produtoSelect.value];

        if (!isNaN(pesoGramas) && produtoSelecionado.tipoEstoque === 'kg') {
            const precoPorKg = produtoSelecionado.preco;
            const precoConvertido = (pesoGramas / 1000) * precoPorKg;

            // Exibe o valor convertido
            document.getElementById('preco-convertido').textContent = 
                `Valor total: R$ ${precoConvertido.toFixed(2)}`;
        } else {
            document.getElementById('preco-convertido').textContent = ''; // Limpa o valor caso o peso não seja válido
        }
    }

    mostrarPagina('vendas-page');
});


// Variável para armazenar o valor da entrada de caixa
let entradaCaixa = parseFloat(localStorage.getItem('entradaCaixa')) || 0;

// Função para salvar a entrada de caixa no Local Storage
function salvarEntradaCaixa() {
    localStorage.setItem('entradaCaixa', entradaCaixa.toString());
}

// Atualizar a exibição do valor de entrada de caixa
function atualizarValorEntradaCaixa() {
    document.getElementById('valor-entrada-caixa').textContent = `R$ ${entradaCaixa.toFixed(2)}`;
}

// Carregar o valor salvo ao carregar a página
atualizarValorEntradaCaixa();

// Adicionando evento ao botão de confirmação
document.getElementById('confirmar-entrada-caixa').addEventListener('click', () => {
    const valorEntrada = parseFloat(document.getElementById('entrada-caixa').value);

    if (isNaN(valorEntrada) || valorEntrada <= 0) {
        alert("Por favor, insira um valor válido para a entrada de caixa.");
        return;
    }

    // Atualizar o valor da entrada de caixa
    entradaCaixa = valorEntrada;
    salvarEntradaCaixa(); // Salvar o valor no localStorage
    alert(`Entrada de Caixa confirmada: R$ ${entradaCaixa.toFixed(2)}`);

    // Atualizar a exibição
    atualizarValorEntradaCaixa();

    // Limpar o campo de entrada
    document.getElementById('entrada-caixa').value = '';
});


// Evento para o campo de pesquisa de produtos
document.getElementById('pesquisa-produto').addEventListener('input', function () {
    const pesquisa = this.value.toLowerCase();
    const produtosFiltrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(pesquisa) && produto.estoque > 0
    );

    atualizarProdutoSelect(produtosFiltrados);
});

// Função para atualizar o select de produtos na página de vendas com pesquisa
function atualizarProdutoSelect(produtosFiltrados) {
    const vendaSelect = document.getElementById('produto-selecionado');
    vendaSelect.innerHTML = ''; // Limpa o select antes de adicionar novos produtos

    // Adiciona os produtos filtrados no select
    produtosFiltrados.forEach((produto) => {
        const option = document.createElement('option');
        option.value = produtos.indexOf(produto); // Armazena o índice do array original
        const tipoEstoqueTexto = produto.tipoEstoque === 'kg' ? 'Kg' : 'Unidades';
        option.text = `${produto.nome} - ${produto.estoque} ${tipoEstoqueTexto} em estoque`;
        vendaSelect.add(option);
    });
}

// Carrinho de pedidos
let pedidoAtual = [];
let pedidosRealizados = [];
let pedidosCancelados = [];
let produtosKgVendidos = 0; 

// Função para adicionar produto ao carrinho
document.getElementById('adicionar-produto').addEventListener('click', () => {
    const produtoSelecionadoIndex = parseInt(document.getElementById('produto-selecionado').value);
    const produto = produtos[produtoSelecionadoIndex]; // Usa o índice do array original

    if (!produto) {
        alert("Por favor, selecione um produto válido.");
        return;
    }

    let quantidadeVendida = 1; // Para produtos por unidade
    let valorVenda = produto.preco;

    // Verifica se o produto é vendido por peso
    if (produto.tipoEstoque === 'kg') {
        const pesoGramas = parseFloat(document.getElementById('peso-em-gramas').value);
        if (isNaN(pesoGramas) || pesoGramas <= 0) {
            alert("Por favor, insira uma quantidade válida em gramas.");
            return;
        }

        quantidadeVendida = pesoGramas / 1000; // Converte gramas para kg
        valorVenda = quantidadeVendida * produto.preco;

        if (quantidadeVendida > produto.estoque) {
            alert("Estoque insuficiente para a quantidade solicitada.");
            return;
        }

        // Atualiza o estoque do produto imediatamente
        produto.estoque -= quantidadeVendida;

    } else {
        // Produtos por unidade
        if (produto.estoque < 1) {
            alert("Estoque insuficiente!");
            return;
        }

        // Atualiza o estoque do produto
        produto.estoque -= 1;
    }

    // Adiciona o produto ao pedido
    pedidoAtual.push({
        produto: produto.nome,
        quantidade: quantidadeVendida,
        precoUnitario: produto.preco,
        valorTotal: valorVenda,
        tipoEstoque: produto.tipoEstoque // Certifique-se de armazenar o tipo de estoque também
    });

    alert(`${produto.nome} adicionado ao pedido.`);
    
    atualizarResumoPedido();

    // Limpa o campo de pesquisa e o campo de peso
    document.getElementById('pesquisa-produto').value = ''; 
    document.getElementById('peso-em-gramas').value = ''; 

    // Atualiza a lista de produtos exibidos no select
    atualizarProdutoSelect(produtos.filter(produto => produto.estoque > 0));
});



function atualizarResumoPedido() {
    const resumoContainer = document.getElementById('resumo-pedido');
    resumoContainer.innerHTML = ''; // Limpa o resumo atual

    let totalPedido = 0;

    pedidoAtual.forEach((item) => {
        const itemResumo = document.createElement('p');

        if (item.quantidade < 1) {
            // Produtos vendidos por peso, mostrando em kg
            itemResumo.textContent = `${item.produto} - ${item.quantidade.toFixed(3)} kg - R$ ${item.valorTotal.toFixed(2)}`;
        } else {
            // Produtos vendidos por unidade
            itemResumo.textContent = `${item.produto} - ${item.quantidade.toFixed(0)} unidades - R$ ${item.valorTotal.toFixed(2)}`;
        }

        resumoContainer.appendChild(itemResumo);
        totalPedido += item.valorTotal;
    });

    // Exibe o total do pedido
    const totalResumo = document.createElement('p');
    totalResumo.innerHTML = `<strong>Total do Pedido: R$ ${totalPedido.toFixed(2)}</strong>`;
    resumoContainer.appendChild(totalResumo);
}



// Função para finalizar o pedido
document.getElementById('vender').addEventListener('click', () => {
    if (pedidoAtual.length === 0) {
        alert("O pedido está vazio. Adicione produtos antes de finalizar.");
        return;
    }

    // Obtém o tipo de pagamento selecionado
    const tipoPagamento = document.querySelector('input[name="tipoPagamento"]:checked').value;
    
    let vendasDinheiro = parseFloat(localStorage.getItem('vendasDinheiro'));
    vendasDinheiro = isNaN(vendasDinheiro) ? 0 : vendasDinheiro;
    vendasDinheiro = parseFloat(localStorage.getItem('vendasDinheiro')) || 0;


    vendasDinheiro = 0;
    vendasCartao = 0;
    vendasPix = 0;
    let totalPedido = 0;
    let troco = 0;
    let valorRecebido = 0; // Declara variável para armazenar o valor recebido

    pedidoAtual.forEach(item => {
        const produto = produtos.find(p => p.nome === item.produto);
        if (produto) {
            totalPedido += item.valorTotal;
        }

        // Contabilizar as unidades vendidas por tipo de pagamento
        if (tipoPagamento === 'dinheiro') {
            vendasDinheiro += item.quantidade;
            totalVendasDinheiro += item.valorTotal;
        } else if (tipoPagamento === 'cartao') {
            vendasCartao += item.quantidade;
            totalVendasCartao += item.valorTotal;
        } else if (tipoPagamento === 'pix') {
            vendasPix += item.quantidade;
            totalVendasPix += item.valorTotal;
        }
    });

    // Se o pagamento for em dinheiro, calcular o troco
    if (tipoPagamento === 'dinheiro') {
        valorRecebido = parseFloat(prompt('Digite o valor recebido do cliente: R$')); // Solicita o valor recebido uma única vez

        if (isNaN(valorRecebido) || valorRecebido < totalPedido) {
            alert("Valor recebido não pode ser menor que o total do pedido.");
            return;
        }

        troco = valorRecebido - totalPedido;

        // Exibe o troco
        alert(`Troco: R$ ${troco.toFixed(2)}`);
    }

    // Atualiza o caixa total (simulação de caixa)
    totalCaixa += totalPedido;

    // Atualiza a lista de produtos na página de vendas
    atualizarProdutoSelect(produtos);

    // Salva os dados no LocalStorage
    salvarLocalStorage();

    alert(`Venda finalizada com sucesso! Tipo de pagamento: ${tipoPagamento.charAt(0).toUpperCase() + tipoPagamento.slice(1)}`);

    // Registra o pedido realizado
    pedidosRealizados.push({
        produtos: [...pedidoAtual], // Clona o pedido atual
        valorTotal: totalPedido,
        tipoPagamento: tipoPagamento,
        valorRecebido: tipoPagamento === 'dinheiro' ? valorRecebido : 0 // Usa o valor já armazenado
    });

    // Atualiza a tabela de pedidos realizados
    atualizarTabelaPedidos();

    // Limpa o pedido e o resumo
    pedidoAtual = [];
    atualizarResumoPedido();
});

// Função atualizar Tabela de pedidos
function atualizarTabelaPedidos() {
    const tabelaPedidos = document.getElementById('tabela-pedidos').querySelector('tbody');
    tabelaPedidos.innerHTML = ''; // Limpa a tabela

    if (pedidosRealizados.length === 0) {
        const linha = document.createElement('tr');
        const coluna = document.createElement('td');
        coluna.colSpan = 5;
        coluna.textContent = 'Nenhum pedido realizado até o momento.';
        linha.appendChild(coluna);
        tabelaPedidos.appendChild(linha);
        return;
    }

    pedidosRealizados.forEach((pedido, index) => {
        // Linha principal do pedido
        const linha = document.createElement('tr');

        // Coluna do número do pedido
        const colunaNumero = document.createElement('td');
        colunaNumero.textContent = index + 1;
        linha.appendChild(colunaNumero);

        // Coluna dos produtos
        const colunaProdutos = document.createElement('td');
        colunaProdutos.textContent = pedido.produtos.map(produto => `${produto.produto}`).join(', ');
        linha.appendChild(colunaProdutos);

        // Coluna da quantidade (Unidades e KG)
        const colunaQuantidade = document.createElement('td');
        
        // Linha 1: Exibe as unidades
        const unidades = pedido.produtos.reduce((total, produto) => {
            return produto.tipoEstoque === 'unidade' ? total + produto.quantidade : total;
        }, 0);
        const linhaUnidades = document.createElement('div');
        linhaUnidades.textContent = `${unidades > 0 ? unidades.toFixed(0) : '-'} unidade(s)`;
        colunaQuantidade.appendChild(linhaUnidades);

        // Linha 2: Exibe os kg
        const kg = pedido.produtos.reduce((total, produto) => {
            return produto.tipoEstoque === 'kg' ? total + produto.quantidade : total;
        }, 0);
        const linhaKg = document.createElement('div');
        linhaKg.textContent = `${kg > 0 ? kg.toFixed(3) : '-'} kg`;
        colunaQuantidade.appendChild(linhaKg);

        linha.appendChild(colunaQuantidade);

        // Coluna do valor total
        const colunaValorTotal = document.createElement('td');
        colunaValorTotal.textContent = `R$ ${pedido.valorTotal.toFixed(2)}`;
        linha.appendChild(colunaValorTotal);

        // Coluna das ações (botão de cancelar)
        const colunaAcoes = document.createElement('td');
        const botaoCancelar = document.createElement('button');
        botaoCancelar.textContent = 'Cancelar Venda';
        botaoCancelar.addEventListener('click', () => cancelarPedido(index));
        colunaAcoes.appendChild(botaoCancelar);
        linha.appendChild(colunaAcoes);

        // Adiciona a linha principal à tabela
        tabelaPedidos.appendChild(linha);
    });
}

// Cancelar pedidos
function cancelarPedido(index) {
    const pedidoCancelado = pedidosRealizados.splice(index, 1)[0]; // Remove o pedido da lista

    // Atualiza o total do caixa (remover o valor do pedido cancelado)
    totalCaixa -= pedidoCancelado.valorTotal;

    // Subtrai do tipo de pagamento correto
    if (pedidoCancelado.tipoPagamento === 'dinheiro') {
        totalVendasDinheiro -= pedidoCancelado.valorTotal;
    } else if (pedidoCancelado.tipoPagamento === 'cartao') {
        totalVendasCartao -= pedidoCancelado.valorTotal;
    } else if (pedidoCancelado.tipoPagamento === 'pix') {
        totalVendasPix -= pedidoCancelado.valorTotal;
    }

    // Registra o pedido cancelado em um histórico (opcional)
    pedidosCancelados.push(pedidoCancelado);

    // Alerta o usuário sobre o cancelamento
    alert(`Pedido ${index + 1} cancelado com sucesso! Valor removido: R$ ${pedidoCancelado.valorTotal.toFixed(2)}`);

    // Atualiza a exibição da tabela e outros dados
    atualizarTabelaPedidos();
    salvarLocalStorage();
}


// Fechamento de caixa
document.getElementById('fechar-caixa').addEventListener('click', () => {
    const dataAtual = new Date().toLocaleDateString();

    // Inicializando as variáveis para unidades e kg vendidos
    let unidadesVendidas = 0;
    let kgVendidos = 0;

    // Percorrendo os pedidos realizados para calcular unidades e kg
    pedidosRealizados.forEach(pedido => {
        pedido.produtos.forEach(produto => {
            if (produto.tipoEstoque === 'unidade') {
                unidadesVendidas += produto.quantidade; // Contabiliza unidades
            } else if (produto.tipoEstoque === 'kg') {
                kgVendidos += produto.quantidade; // Contabiliza kg
            }
        });
    });

    const valorTotal = totalVendasCartao + totalVendasPix + totalVendasDinheiro; // Total das vendas

    // Calcular o total de cancelamentos por tipo de pagamento
    const totalCanceladoDinheiro = pedidosCancelados
        .filter(pedido => pedido.tipoPagamento === 'dinheiro')
        .reduce((total, pedido) => total + pedido.valorTotal, 0);

    const totalCanceladoCartao = pedidosCancelados
        .filter(pedido => pedido.tipoPagamento === 'cartao')
        .reduce((total, pedido) => total + pedido.valorTotal, 0);

    const totalCanceladoPix = pedidosCancelados
        .filter(pedido => pedido.tipoPagamento === 'pix')
        .reduce((total, pedido) => total + pedido.valorTotal, 0);

    const totalCancelado = totalCanceladoDinheiro + totalCanceladoCartao + totalCanceladoPix;

    // Calcular itens e valores cancelados
    const itensCancelados = pedidosCancelados.reduce((total, pedido) => {
        return total + pedido.produtos.reduce((subtotal, produto) => subtotal + produto.quantidade, 0);
    }, 0);

    const valorCancelado = pedidosCancelados.reduce((total, pedido) => total + pedido.valorTotal, 0);

    // Calcular unidades e kg de todos os produtos cancelados
    let unidadesCanceladas = 0;
    let kgCancelados = 0;

    pedidosCancelados.forEach(pedido => {
        pedido.produtos.forEach(produto => {
            if (produto.tipoEstoque === 'unidade') {
                unidadesCanceladas += produto.quantidade; // Contabiliza unidades canceladas
            } else if (produto.tipoEstoque === 'kg') {
                kgCancelados += produto.quantidade; // Contabiliza kg cancelados
            }
        });
    });

    // Adicionar o registro ao histórico de vendas, com unidades e kg corretamente separados
    historicoVendas.push({
        data: dataAtual,
        unidades: unidadesVendidas, // Total de unidades vendidas
        kgVendidos: kgVendidos,     // Total de kg vendidos
        valor: valorTotal,          // Valor total das vendas
        itensCancelados: itensCancelados, // Itens cancelados
        valorCancelado: valorCancelado,   // Valor cancelado
        unidadesCanceladas: unidadesCanceladas, // Unidades canceladas
        kgCancelados: kgCancelados   // Quilos cancelados
    });

    salvarHistoricoLocalStorage();

    // Calcular o total de troco a ser subtraído
    const trocoTotal = pedidosRealizados.reduce((totalTroco, pedido) => {
        if (pedido.tipoPagamento === 'dinheiro') {
            const valorRecebido = pedido.valorRecebido || pedido.valorTotal;
            if (valorRecebido >= pedido.valorTotal) {
                totalTroco += (valorRecebido - pedido.valorTotal);
            }
        }
        return totalTroco;
    }, 0);

    // Exibe o alerta com o resumo do fechamento de caixa
    alert(`
Fechamento de Caixa:
======================
Entrada Original de Caixa: R$ ${entradaCaixa.toFixed(2)}
Entrada de Caixa (Com remoções de troco): R$ ${(entradaCaixa - trocoTotal).toFixed(2)}

Vendas por Tipo de Pagamento:
-----------------------------
Dinheiro: R$ ${totalVendasDinheiro.toFixed(2)}
Cartão: R$ ${totalVendasCartao.toFixed(2)}
Pix: R$ ${totalVendasPix.toFixed(2)}

Total em Vendas: R$ ${(totalVendasDinheiro + totalVendasCartao + totalVendasPix).toFixed(2)}

Cancelamentos:
--------------
Total Cancelado: R$ ${totalCancelado.toFixed(2)}

Troco Total Removido: R$ ${trocoTotal.toFixed(2)}

Saldo Final (Com entrada de caixa): R$ ${(entradaCaixa + totalVendasDinheiro + totalVendasCartao + totalVendasPix - totalCancelado - trocoTotal).toFixed(2)}
`);

    // Reseta os pedidos realizados após o fechamento
    pedidosRealizados = [];
    atualizarTabelaPedidos();

    // Resetar valores após o fechamento
    totalCaixa = 0;  // Reseta o total de caixa após o fechamento
    vendasCartao = 0;
    vendasPix = 0;
    vendasDinheiro = 0;
    totalVendasCartao = 0;
    totalVendasPix = 0;
    totalVendasDinheiro = 0;
    pedidosCancelados = []; // Resetar pedidos cancelados

    // Resetando a entrada de caixa
    entradaCaixa = 0;
    salvarEntradaCaixa();  // Atualiza o localStorage com o novo valor de entrada de caixa

    // Resetar o campo de entrada de caixa e exibição na página de vendas
    document.getElementById('entrada-caixa').value = ''; // Limpa o campo de entrada
    document.getElementById('valor-entrada-caixa').textContent = 'R$ 0.00'; // Reseta a exibição

    salvarLocalStorage(); // Atualiza o Local Storage

    // Exibir o pop-up informando que o caixa foi resetado
    const popup = document.getElementById('popup-reset');
    popup.style.display = 'flex';

    // Fechar o pop-up quando o botão for clicado
    document.getElementById('popup-close').addEventListener('click', () => {
        popup.style.display = 'none';
    });
});



// Função para atualizar o select de produtos na página de reposição
function atualizarProdutoReposicaoSelect() {
    const reposicaoSelect = document.getElementById('produto-selecionado-reposicao');
    reposicaoSelect.innerHTML = ''; // Limpa o select antes de adicionar novos produtos

    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        const tipoEstoqueTexto = produto.tipoEstoque === 'kg' ? 'Kg' : 'Unidades';
        option.text = `${produto.nome} - ${produto.estoque} ${tipoEstoqueTexto} em estoque`;
        reposicaoSelect.add(option);
    });
}



// Evento de clique para ir para a página de reposição
document.getElementById('ir-reposicao').addEventListener('click', () => {
    atualizarProdutoReposicaoSelect(); // Atualiza a lista de produtos ao abrir a página de reposição
    document.getElementById('vendas-page').classList.add('hidden');
    document.getElementById('reposicao-page').classList.remove('hidden');
});

// Evento de clique para confirmar a reposição de estoque
document.getElementById('confirmar-reposicao').addEventListener('click', () => {
    const produtoSelecionado = parseInt(document.getElementById('produto-selecionado-reposicao').value);
    const quantidadeParaRepor = parseInt(document.getElementById('quantidade-repor').value);

    if (isNaN(quantidadeParaRepor) || quantidadeParaRepor <= 0) {
        alert("Por favor, insira uma quantidade válida para reposição.");
        return;
    }

    // Repor o estoque do produto selecionado
    const produto = produtos[produtoSelecionado];
    produto.estoque += quantidadeParaRepor;
    salvarLocalStorage(); // Atualiza os dados no Local Storage

    // Atualiza a lista de produtos na página
    atualizarProdutoReposicaoSelect();

    alert(`Estoque de ${produto.nome} atualizado!`);
});


// Evento para ir para a página de edição
document.getElementById('ir-editar').addEventListener('click', () => {
    atualizarProdutoSelectEditar(); // Atualiza o select com os produtos ao acessar a página de edição
    mostrarPagina('editar-page'); // Mostra a página de edição
});


// Função para atualizar o select de produtos na página de edição
function atualizarProdutoSelectEditar() {
    const produtoSelect = document.getElementById('produto-selecionado-editar');
    produtoSelect.innerHTML = ''; // Limpa o select antes de adicionar novos produtos

    produtos.forEach((produto, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = produto.nome;
        produtoSelect.add(option);
    });
}

// Função para editar produto
document.getElementById('salvar-edicao').addEventListener('click', () => {
    const produtoSelecionado = parseInt(document.getElementById('produto-selecionado-editar').value);
    const novoNome = document.getElementById('novo-nome-produto').value;
    const novoPreco = parseFloat(document.getElementById('novo-preco-produto').value);

    if (novoNome && !isNaN(novoPreco)) {
        produtos[produtoSelecionado].nome = novoNome;
        produtos[produtoSelecionado].preco = novoPreco;

        salvarLocalStorage(); // Atualiza o Local Storage com os novos dados
        alert("Produto editado com sucesso!");

        // Limpa os campos de edição
        document.getElementById('novo-nome-produto').value = '';
        document.getElementById('novo-preco-produto').value = '';

        atualizarProdutoSelectEditar(); // Atualiza o select de produtos na edição
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
});

// Função para remover produto
document.getElementById('remover-produto').addEventListener('click', () => {
    const produtoSelecionado = parseInt(document.getElementById('produto-selecionado-editar').value);

    if (produtoSelecionado >= 0) {
        if (confirm(`Tem certeza que deseja remover o produto ${produtos[produtoSelecionado].nome}?`)) {
            produtos.splice(produtoSelecionado, 1); // Remove o produto selecionado
            salvarLocalStorage(); // Atualiza o Local Storage
            alert("Produto removido com sucesso!");
            atualizarProdutoSelectEditar(); // Atualiza a lista de produtos
        }
    }
});

// Função para atualizar a tabela de histórico de vendas
function atualizarHistoricoTabela() {
    const tabelaHistorico = document.getElementById('tabela-historico').querySelector('tbody');
    tabelaHistorico.innerHTML = ''; // Limpa os registros atuais

    historicoVendas.forEach(registro => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${registro.data}</td>
            <td>${registro.unidades || 0}</td>
            <td>${(registro.kgVendidos || 0).toFixed(3)} kg</td> <!-- Exibe kg vendidos com 3 casas decimais -->
            <td>R$ ${(registro.valor || 0).toFixed(2)}</td> <!-- Exibe valor total formatado -->
            <td>R$ ${(registro.valorCancelado || 0).toFixed(2)}</td> <!-- Exibe valor cancelado formatado -->
            <td>${registro.unidadesCanceladas || 0}</td> <!-- Exibe unidades canceladas -->
            <td>${(registro.kgCancelados || 0).toFixed(3)} kg</td> <!-- Exibe kg cancelados formatado com 3 casas decimais -->
        `;
        tabelaHistorico.appendChild(linha);
    });
}




// Evento para ir para a página de histórico
document.getElementById('ir-historico').addEventListener('click', () => {
    atualizarHistoricoTabela(); // Atualiza a tabela de histórico
    mostrarPagina('historico-page'); // Exibe a página de histórico
});

document.getElementById('limpar-historico').addEventListener('click', () => {
    const confirmacao = confirm('Você tem certeza de que deseja limpar todo o histórico de vendas? Esta ação não pode ser desfeita.');

    if (confirmacao) {
        // Limpa o array de histórico
        historicoVendas = [];

        // Atualiza o Local Storage
        salvarHistoricoLocalStorage();

        // Atualiza a tabela de histórico
        atualizarHistoricoTabela();

        alert('O histórico de vendas foi limpo com sucesso.');
    }
});

// Função para exportar histórico para CSV
document.getElementById('exportar-csv').addEventListener('click', () => {
    if (historicoVendas.length === 0) {
        alert('Não há registros para exportar.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Data,Unidades Vendidas,Quilos Vendidos,Valor Total (R$),Itens Cancelados,Valor Cancelado (R$),Unidades Canceladas,Quilos Cancelados\n";

    historicoVendas.forEach(registro => {
        const linha = [
            registro.data,
            registro.unidades,
            (registro.kgVendidos || 0).toFixed(3), // Acrescenta a quantidade de kg vendidos
            `R$ ${registro.valor.toFixed(2)}`,
            registro.itensCancelados || 0,
            `R$ ${(registro.valorCancelado || 0).toFixed(2)}`,
            registro.unidadesCanceladas || 0,
            (registro.kgCancelados || 0).toFixed(3) // Acrescenta a quantidade de kg cancelados
        ].join(",");
        csvContent += linha + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'historico_vendas.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
});


// Função para exportar histórico para PDF
document.getElementById('exportar-pdf').addEventListener('click', async () => {
    if (historicoVendas.length === 0) {
        alert('Não há registros para exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Histórico de Vendas", 10, 10);
    let y = 20;

    // Adiciona os dados na tabela
    doc.text("Data | Unidades | Quilos | Valor Total | Cancelados | Valor Cancelado | Unidades Canceladas | Quilos Cancelados", 10, y);
    y += 10;

    historicoVendas.forEach((registro) => {
        doc.text(
            `${registro.data} | ${registro.unidades} | ${(registro.kgVendidos || 0).toFixed(3)} | R$ ${registro.valor.toFixed(2)} | ${registro.itensCancelados || 0} | R$ ${(registro.valorCancelado || 0).toFixed(2)} | ${registro.unidadesCanceladas || 0} | ${(registro.kgCancelados || 0).toFixed(3)}`,
            10,
            y
        );
        y += 10;
    });

    // Baixa o arquivo PDF
    doc.save("historico_vendas.pdf");
});
