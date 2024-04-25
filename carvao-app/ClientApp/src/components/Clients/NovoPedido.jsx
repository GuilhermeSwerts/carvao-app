import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

function ModalNovoPedido(props) {

    const {
        modalAberto = true,
        setModal = () => { },
        clienteSelecionado = {},
        produtos = [],
        setProdutoSelecionado = () => { },
        quantidade = 0,
        handleQuantidadeChange = () => { },
        produtoSelecionado = {},
        adicionarProduto = () => { },
        produtosAdicionados = [],
        handleDescontoReaisChange = () => { },
        removerProduto = () => { },
        descontoPercentual = 0,
        handleDescontoPercentualChange = () => { },
        calcularValorTotalPedido = () => { },
        observacao = "",
        setObservacao = () => { },
        handleEnviarPedido = () => { },
        mensagem = ""
    } = props;

    return (
        <Modal
            show={modalAberto}
        >
            <Modal.Header>
                <h2>
                    {clienteSelecionado
                        ? clienteSelecionado.nome
                        : "Selecione um cliente"}
                </h2>
            </Modal.Header>
            <Modal.Body>
                <div className='row'></div>
                <div className="container">
                    <Row>
                        <Col md={3}>
                            <label>Produto</label>
                            <select
                                className="form-control"
                                onChange={(e) => {
                                    const produtoId = parseInt(e.target.value);
                                    const produtoSelecionado = produtos.find(
                                        (p) => p.produtoId === produtoId
                                    );
                                    setProdutoSelecionado(produtoSelecionado);
                                }}
                            >
                                <option value="">Selecione um Produto</option>
                                {produtos.map((produto) => (
                                    <option
                                        key={produto.produtoId}
                                        value={produto.produtoId}
                                    >
                                        {produto.nome}
                                    </option>
                                ))}
                            </select>
                        </Col>
                        <Col md={3}>
                            <label>Quantidade</label>
                            <input
                                className='form-control'
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={handleQuantidadeChange}
                                contentLabel="Quantidade"
                            />
                        </Col>
                        <Col md={5}>
                            <label htmlFor="">Total</label>
                            <input
                                className='form-control'
                                disabled
                                type="text"
                                value={`R$ ${produtoSelecionado && (quantidade * produtoSelecionado.valor).toFixed(2)}`}
                                onChange={handleQuantidadeChange}
                            />
                        </Col>
                        <Col md={1}>
                            <label htmlFor=""></label>
                            <button
                                className="btn btn-success"
                                onClick={() => adicionarProduto()}
                            ><FaPlus /></button>
                        </Col>
                    </Row>
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
                                    {produtosAdicionados.map((produto, index) => (
                                        <tr key={index}>
                                            <td>{produto.nome}</td>
                                            <td>{produto.quantidade}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={produto.valorDesconto || 0}
                                                    onChange={(e) =>
                                                        handleDescontoReaisChange(produto.produtoId, e)
                                                    }
                                                    step="0.01" // Permite inserir valores decimais

                                                />
                                            </td>
                                            <td>
                                                R${" "}
                                                {(
                                                    produto.valor * produto.quantidade -
                                                    (produto.valorDesconto || 0)
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => removerProduto(produto)}
                                                    style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    -
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
                                    onChange={handleDescontoPercentualChange}
                                    pattern="\d*\.?\d*"
                                    title="Insira um número decimal válido"
                                />
                            </Col>}
                        {produtosAdicionados.length > 0
                            && <Col md={12}>
                                <label>Total: R$ {calcularValorTotalPedido()}</label>
                            </Col>}
                    </Row>
                    <Row>
                        {produtosAdicionados.length > 0
                            && <Col md={12}>
                                <label>Observação:</label>
                                <textarea
                                    className="form-control"
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Digite alguma observação sobre o pedido aqui."
                                ></textarea>
                            </Col>}
                    </Row>
                    <Row>
                        <Col md={4}>
                            <button className='btn btn-danger' onClick={() => setModal(false)}>Cancelar</button>
                        </Col>
                        <Col md={4}></Col>
                        {produtosAdicionados.length > 0 && <Col md={4}>
                            <button className='btn btn-primary' onClick={handleEnviarPedido}>Enviar Pedido</button>
                        </Col>}
                    </Row>
                </div>
                <div>{mensagem}</div>
            </Modal.Body>
        </Modal >
    );
}

export default ModalNovoPedido;