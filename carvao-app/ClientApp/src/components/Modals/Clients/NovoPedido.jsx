import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

function ModalNovoPedido({
    CalcularValorMinimo = () => { },
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
    mensagem = "",
    closeModalNovoPedido = () => { }
}) {

    const getValue = () => produtoSelecionado && (quantidade * produtoSelecionado.valor).toFixed(2);

    const onChangeProdutoSelecionado = (e) => {
        const produtoId = parseInt(e.target.value);
        const produtoSelecionado = produtos.find(
            (p) => p.id === produtoId
        );
        setProdutoSelecionado(produtoSelecionado);
    }

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
                        <Col md={6}>
                            <label>Produto</label>
                            <select
                                id="produtos"
                                className="form-control"
                                onChange={onChangeProdutoSelecionado}
                            >
                                <option value="">Selecione um Produto</option>
                                {produtos.map((produto) => (
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
                                onChange={handleQuantidadeChange}
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
                                onChange={handleQuantidadeChange}
                            />
                        </Col>
                        <Col md={2}>
                            <label htmlFor=""></label>
                            <button
                                style={{ marginTop: '2rem', width: '100%' }}
                                className="btn btn-success"
                                onClick={() => adicionarProduto()}
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
                                                <td>{produto.quantidade}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        style={{ width: '50%' }}
                                                        value={produto.valorDesconto === 0 ? '' : produto.valorDesconto} // Isso permite que o campo seja apagado
                                                        onChange={(e) => handleDescontoReaisChange(produto.id, e)}
                                                        step="0.01"
                                                        min={0}
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
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-danger' onClick={() => closeModalNovoPedido()}>Cancelar</button>
                {produtosAdicionados.length > 0 && <button className='btn btn-primary' onClick={handleEnviarPedido}>Enviar Pedido</button>}
            </Modal.Footer>
        </Modal >
    );
}

export default ModalNovoPedido;