import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

class ModalDetalhesPedidosVendedor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pedidos: [],
            show: false,
            totalComissao: ''
        }
        this.AbrirModal = (pedidos, totalComissao) => this.setState({ show: true, pedidos: pedidos, totalComissao: totalComissao });
    }
    render() {

        const { pedidos, show, totalComissao } = this.state;

        return (
            <Modal show={show}>
                <Modal.Header>
                    Detalhes
                </Modal.Header>
                <Modal.Body>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <td>N° Do Pedido</td>
                                <td>Valor Total Do Pedido</td>
                                <td>Valor Comissão</td>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(x => (
                                <tr>
                                    <td>{x.pedidoId}</td>
                                    <td>R$ {`${x.valorTotalPedido.toFixed(2)}`.replace(".", ",")}</td>
                                    <td>R$ {`${x.valorComissao.toFixed(2)}`.replace(".", ",")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <small>Valor Total Em Comissão: {totalComissao}</small>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-info' onClick={e => this.setState({ show: false, pedidos: [] })}>Fehcar</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalDetalhesPedidosVendedor;