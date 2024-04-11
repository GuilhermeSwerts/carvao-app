import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import { CgDetailsMore } from 'react-icons/cg';


function DetalhesPedido({ historico, produtos }) {
    const [show, SetShow] = useState(false);
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
                    <table style={{ width: '100%' }} className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor Bruto</th>
                                <th>Valor Desconto</th>
                                <th>Valor Liquído</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map((produto, index) => {
                                return (
                                    <tr>
                                        <td data-label="Id">{index + 1}</td>
                                        <td data-label="Produto">{produtos.filter(x => x.id === produto.produto_id)[0].nome}</td>
                                        <td data-label="Quantidade">{produto.quantidade}</td>
                                        <td data-label="Valor Bruto">R$ {(produto.valor_unitario * produto.quantidade).toFixed(2)}</td>
                                        <td data-label="Valor Desconto">R$ {produto.valor_desconto.toFixed(2)}</td>
                                        <td data-label="Valor Liquído">R$ {(produto.valor_total).toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
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