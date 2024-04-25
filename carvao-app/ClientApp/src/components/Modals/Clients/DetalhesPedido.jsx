import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { CgDetailsMore } from 'react-icons/cg';

function DetalhesPedido({ historico, produtos, observacao,Pedido }) {
    const [show, SetShow] = useState(false);
    const [valorTotal, SetValorTotal] = useState(0);
    const [valorDesconto, setValorDesconto] = useState(0);
    const [porcentagemDesconto, setPorcentagemDesconto] = useState(0);

    useEffect(() => {
        if (historico.length > 0) {
            console.log(historico);
            setPorcentagemDesconto(Pedido.percentual_desconto);
            SetValorTotal(historico[0].valor_total);
            setValorDesconto(historico[0].valor_desconto);
        }
    }, [historico, Pedido]);

    return (
        <>
            <ButtonTooltip
                text="Detalhes do Pedido"
                textButton={<CgDetailsMore size={20} color='#fff' />}
                className='btn btn-warning'
                top={true}
                onClick={() => SetShow(true)}
            />
            <Modal show={show} >
                <Modal.Header>
                    <h2>Detalhes Do Pedido</h2>
                </Modal.Header>
                <Modal.Body>
                    <h4>Valores:</h4>
                    <table style={{ width: '100%' }} className='table table-striped'>
                        <thead>
                            <tr>
                                <td>Valor Total Do Pedido (R$)</td>
                                <td>Valor Total Desconto (R$)</td>
                                <td>Porcentagem Desconto (%)</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Valor Total Do Pedido">R$ {valorTotal.toFixed(2)}</td>
                                <td data-label="Valor Total Desconto">R$ {valorDesconto.toFixed(2)}</td>
                                <td data-label="Porcentagem Desconto Adcional">{porcentagemDesconto}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4>Produtos:</h4>
                    <table style={{ width: '100%' }} className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor Unitário</th>
                                <th>Desconto Unitário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map((produto, index) => {
                                return (
                                    <tr>
                                        <td data-label="Id">{index + 1}</td>
                                        <td data-label="Produto">{produtos.filter(x => x.id === produto.produto_id)[0]?.nome}</td>
                                        <td data-label="Quantidade">{produto.quantidade}</td>
                                        <td data-label="Valor Unitário">R$ {produto.valor_unitario.toFixed(2)}</td>
                                        <td data-label="Desconto Unitário">R$ {produto.desconto_unitario.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <h4>Observação:</h4>
                    {!observacao || observacao === "" && <p>{"Nenhuma..."}</p>}
                    {observacao || observacao !== "" && <p>{observacao}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-danger' onClick={() => SetShow(false)}>
                        Fechar
                    </button>
                </Modal.Footer >
            </Modal >
        </>
    );
}

export default DetalhesPedido;