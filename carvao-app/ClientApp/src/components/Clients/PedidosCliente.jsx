import React from 'react';
import { format } from "date-fns";
import { Modal } from 'react-bootstrap';
import { FaCartPlus } from 'react-icons/fa'

function ModalPedidosCliente({ show, close, produtos, calcularValorTotalPedido, handdleNovoPedido }) {
    return (
        <Modal show={show}>
            <Modal.Header>
                <h2>Pedidos do Cliente</h2>
                {produtos.length > 0 && <button onClick={() => handdleNovoPedido(true)} style={{ width: '100%' }} className='btn btn-success'><FaCartPlus /></button>}
            </Modal.Header>
            <Modal.Body>
                {produtos.map((pedido) => (
                    <table className="clientes-table" key={pedido.pedidoId}>
                        <tbody>
                            <tr>
                                <td>Pedido ID: {pedido.pedidoId}</td>
                                <td>Valor Total: R$ {pedido.valorTotal.toFixed(2)}</td>
                                <td colspan="2">Total: R$ {calcularValorTotalPedido()}</td>
                                <td>
                                    Data Pedido: {format(pedido.dataPedido, "dd/MM/yyyy")}
                                </td>
                                <td>Status: {pedido.status && pedido.status.nome}</td>
                                <td>Status Pagamento: Parcial</td>
                            </tr>
                        </tbody>
                    </table>
                ))}
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