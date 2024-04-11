import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Modal } from 'react-bootstrap';
import { FaCartPlus } from 'react-icons/fa'
import { api } from '../../api/api';

function ModalPedidosCliente({ show, close, produtos, clienteSelecionado, handdleNovoPedido }) {
    return (
        <Modal show={show}>
            <Modal.Header>
                <h2>Pedidos do Cliente</h2>
                {produtos.length > 0 && <button onClick={() => handdleNovoPedido(clienteSelecionado)} style={{ width: '100%' }} className='btn btn-success'><FaCartPlus /></button>}
            </Modal.Header>
            <Modal.Body>
                {produtos.length > 0 && <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Pedido Id</th>
                            <th>Valor Total</th>
                            <th>Data Pedido</th>
                            <th>Status Pedido</th>
                            <th>Status Pagamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td data-label="Pedido Id">{pedido.id}</td>
                                <td data-label="Valor Total">R$ {pedido.valorTotal.toFixed(2)}</td>
                                <td data-label="Data Pedido">
                                    Data Pedido: {format(pedido.dataPedido, "dd/MM/yyyy")}
                                </td>
                                <td data-label="Status Pedido">{pedido.statusPedido}</td>
                                <td data-label="Status Pagamento">{pedido.statusPagamento}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
                {produtos.length == 0 && <button onClick={() => handdleNovoPedido(true)} style={{ width: '100%' }} className='btn btn-success'>Adicionar novo pedido <FaCartPlus /> </button>}
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-danger' onClick={() => close(false)}>
                    Fechar
                </button>
            </Modal.Footer >
        </Modal >
    );
}

export default ModalPedidosCliente;