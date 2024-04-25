import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { FaPencil } from 'react-icons/fa6';
import { api } from '../../api/api';

function ModalEditarPedido({ PedidoId, Produtos, Historico, Pedido, reloadPage }) {
    const [show, setShow] = useState(false);
    const [produtosAdicionados, setProdutosAdicionados] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState({ valor: 0 });
    const [quantidade, setQuantidade] = useState(1);
    const [descontoPercentual, setDescontoPercentual] = useState(0);
    const [observacao, setObservacao] = useState('');

    const TransferirQtdHtProdutos = (produtos, historico) => {
        const produtosAtualizados = produtos.map(produto => ({ ...produto }));
        const produtosEncontrados = [];

        for (const itemHistorico of historico) {
            const produto = produtosAtualizados.find(prod => prod.id === itemHistorico.produto_id);
            if (produto) {
                if (!produto.qtdProdutos) produto.qtdProdutos = 0;
                produto.qtdProdutos += itemHistorico.quantidade;
                produto.valorDesconto = itemHistorico.desconto_unitario;
                produtosEncontrados.push(produto);
            }
        }

        return produtosEncontrados;
    }

    const BuscarHistoricoPedido = () => {
        setDescontoPercentual(Pedido.percentual_desconto);
        setObservacao(Pedido.observacao);
        var hitProd = TransferirQtdHtProdutos(Produtos, Historico);
        setProdutosAdicionados(hitProd);
    }

    useEffect(() => {
        BuscarHistoricoPedido();
    }, []);

    const getValue = () => produtoSelecionado && (quantidade * produtoSelecionado.valor).toFixed(2);

    const onChangeProdutoSelecionado = (e) => {
        const produtoId = parseInt(e.target.value);
        const produtoSelecionado = Produtos.find(
            (p) => p.id === produtoId
        );
        setProdutoSelecionado(produtoSelecionado);
    }

    const removerProduto = (produtoRemovido) => {
        const novosProdutosAdicionados = produtosAdicionados.filter(
            (produto) => produto.id !== produtoRemovido.id
        );
        setProdutosAdicionados(novosProdutosAdicionados);
    }

    //const onChangeValor = (produtoId, e) => {
    //    const valorDescontoReais = parseFloat(e.target.value);
    //    if (!isNaN(valorDescontoReais)) {
    //        const updatedProdutosAdicionados = produtosAdicionados.map((produto) => {
    //            if (produto.id === produtoId) {
    //                return { ...produto, valorDesconto: valorDescontoReais, valorDescontoUnitario: valorDescontoReais };
    //            }
    //            return produto;
    //        });
    //        setProdutosAdicionados(updatedProdutosAdicionados);
    //    }
    //}
    const onChangeValor = (produtoId, e) => {
        const valor = e.target.value;
     
        const valorDescontoReais = valor === '' ? 0 : parseFloat(valor);
        if (!isNaN(valorDescontoReais) || valor === '') {
            const updatedProdutosAdicionados = produtosAdicionados.map((produto) => {
                if (produto.id === produtoId) {
                    return { ...produto, valorDesconto: valorDescontoReais, valorDescontoUnitario: valorDescontoReais };
                }
                return produto;
            });
            setProdutosAdicionados(updatedProdutosAdicionados);
        }
    };

    const onAddProduto = () => {
        if (produtoSelecionado) {
            const produtoExistente = produtosAdicionados.find(
                (p) => p.id === produtoSelecionado.id
            );
            const novaQuantidade = parseInt(quantidade);

            if (produtoExistente) {
                const updatedProdutosAdicionados = produtosAdicionados.map((p) =>
                    p.id === produtoExistente.id
                        ? { ...p, qtdProdutos: p.qtdProdutos + novaQuantidade }
                        : p
                );
                setProdutosAdicionados(updatedProdutosAdicionados);
            } else {
                setProdutosAdicionados([
                    ...produtosAdicionados,
                    { ...produtoSelecionado, qtdProdutos: novaQuantidade },
                ]);
            }
            setProdutoSelecionado(null);
            const e = document.getElementById('produtos');
            e.value = "";
            setQuantidade(1);
        }
    }

    const calcularValorTotalPedido = () => {
        let total = produtosAdicionados.reduce((acc, produto) => {
            const totalProdutoSemDesconto = produto.valor * produto.qtdProdutos;
            // Aqui é aplicado o desconto em reais para cada produto
            const totalProdutoComDesconto =
                totalProdutoSemDesconto - (produto.valorDesconto || 0);
            return acc + totalProdutoComDesconto;
        }, 0);

        // Aqui é aplicado o desconto percentual ao total do pedido
        const descontoPercentualValor = (total * descontoPercentual) / 100;
        total -= descontoPercentualValor;

        // Retorna o valor total formatado com duas casas decimais
        return total.toFixed(2);
    };

    const handleDescontoPercentualChange = (event) => {
        const inputValue = event.target.value;
        if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
            const percentual = inputValue === "" ? "" : parseFloat(inputValue);
            if (percentual >= 0 && percentual <= 100) {
                setDescontoPercentual(percentual);
            }
        }
    };

    const CalcularValorMinimo = (desconto) => {
        if (/^\d*\.?\d*$/.test(desconto) || desconto === "") {
            const percentual = desconto === "" ? "" : parseFloat(desconto);
            if (percentual >= 0 && percentual <= 100) {
                let total = produtosAdicionados.reduce((acc, produto) => {
                    acc += produto.valorMinimo * produto.quantidade;
                    return acc;
                }, 0);

                let valorVenda = produtosAdicionados.reduce((acc, produto) => {
                    const totalProdutoSemDesconto = produto.valor * produto.quantidade;
                    const totalProdutoComDesconto =
                        totalProdutoSemDesconto - (produto.valorDesconto || 0);
                    return acc + totalProdutoComDesconto;
                }, 0);

                let valorDesconto = (valorVenda * percentual) / 100;
                let abaixo = (valorVenda - valorDesconto.toFixed(2)) < total;

                if (abaixo) {
                    alert(`Valor do pedido está a baixo que o valor minímo.
          Desconto permitido até o valor de R$ ${total}`);
                }

                return abaixo;
            }
        }
    }

    const calcularValorTotalSemDescontoPedido = () => {
        let total = produtosAdicionados.reduce((acc, produto) => {
            const totalProdutoSemDesconto = produto.valor * produto.qtdProdutos;
            // Aqui é aplicado o desconto em reais para cada produto
            return acc + totalProdutoSemDesconto;
        }, 0);

        return total.toFixed(2);
    };

    const onSubmit = () => {
        if (produtosAdicionados.length === 0) {
            alert("Por favor, selecione pelo menos um produto.");
            return;
        }

        if (CalcularValorMinimo(descontoPercentual)) {
            return;
        }

        const vt = calcularValorTotalPedido();
        const vs = calcularValorTotalSemDescontoPedido();
        const data = new FormData();

        produtosAdicionados.forEach(produto => { produto.quantidade = produto.qtdProdutos });

        const obj = JSON.stringify({
            PedidoId: PedidoId,
            ClienteId: Pedido.cliente_id,
            ProdutosAdicionado: produtosAdicionados,
            VendedorUsuarioId: 1, //userData.
            ValorTotal: vt,
            ValorDesconto: vs - vt,
            PercentualDesconto: descontoPercentual,
            Observacao: observacao,
        });
        data.append("obj", obj);
        try {
            api.post("api/Pedido/EditarPedido", data, res => {
                alert("Pedido editado com sucesso!");
                reloadPage();
                setShow(false);
            }, erro => {
                alert("Houve um erro na solicitação!\nPor favor tente novamente mais tarde.");
            })

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
        }
    }

    return (
        <>
            <ButtonTooltip text="Editar Pedido" textButton={<FaPencil size={20} color='#fff' />} className='btn btn-success' top={true} onClick={() => setShow(true)} />
            <Modal show={show}>
                <Modal.Header>
                    <h2>Editar Pedido</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <Row>
                            <Col md={6}>
                                <label>Produto</label>
                                <select
                                    id='produtos'
                                    className="form-control"
                                    onChange={onChangeProdutoSelecionado}
                                >
                                    <option value="">Selecione um Produto</option>
                                    {Produtos.map((produto) => (
                                        <option
                                            key={produto.id}
                                            value={produto.id}
                                        >
                                            {produto.nome}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col md={6}>
                                <label>Quantidade</label>
                                <input
                                    className='form-control'
                                    type="number"
                                    min="1"
                                    value={quantidade}
                                    onChange={e => setQuantidade(e.target.value)}
                                    contentLabel="Quantidade"
                                />
                            </Col>
                            <Col md={10}>
                                <label htmlFor="">Total</label>
                                <input
                                    className='form-control'
                                    disabled
                                    type="text"
                                    value={`R$ ${getValue() ? getValue() : 0}`}
                                />
                            </Col>
                            <Col md={2}>
                                <label htmlFor=""></label>
                                <button
                                    style={{ marginTop: '2rem', width: '100%' }}
                                    className="btn btn-success"
                                    onClick={onAddProduto}
                                ><FaPlus /></button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={12}>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Quantidade</th>
                                            <th>Valor Desconto</th>
                                            <th>Valor Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtosAdicionados.map((produto, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{produto.nome}</td>
                                                    <td>{produto.qtdProdutos}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            style={{ width: '50%' }}
                                                            value={produto.valorDesconto === 0 ? '' : produto.valorDesconto}
                                                            onChange={(e) => onChangeValor(produto.id, e)}
                                                            step="0.01" // Permite inserir valores decimais
                                                        />
                                                    </td>
                                                    <td>
                                                        R${" "}
                                                        {(
                                                            produto.valor * produto.qtdProdutos -
                                                            (produto.valorDesconto || 0)
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => removerProduto(produto)}
                                                            className='btn btn-danger'
                                                        >
                                                            -
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            {produtosAdicionados.length > 0
                                && <Col md={12}>
                                    <label>Desconto em %:</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        value={descontoPercentual}
                                        onChange={e => { handleDescontoPercentualChange(e); CalcularValorMinimo(e.target.value) }}
                                        pattern="\d*\.?\d*"
                                        title="Insira um número decimal válido"
                                    />
                                </Col>}
                            {produtosAdicionados.length > 0
                                && <Col md={12} style={{ width: '100%', textAlign: 'end', marginTop: 10 }}>
                                    <label style={{ fontSize: 25 }}>Total: R$ {calcularValorTotalPedido()}</label>
                                </Col>}
                        </Row>
                        <Row>
                            <Col md={12}>
                                <label>Observação:</label>
                                <textarea
                                    className="form-control"
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Digite alguma observação sobre o pedido aqui."
                                ></textarea>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-danger' onClick={() => { BuscarHistoricoPedido(); setShow(false) }}>Cancelar</button>
                    {produtosAdicionados.length > 0 && <button className='btn btn-primary' type='button' onClick={() => onSubmit()}>Atualizar Pedido</button>}
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalEditarPedido;