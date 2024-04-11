import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Row, Col } from 'react-bootstrap';
import { api } from '../../components/api/api';

function ListaRecibo() {
    const [pedidoId, PedidoId] = useState(0);

    const [tipoPagamento, setTipoPagamento] = useState([]);
    const [recibos, setRecibos] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [pedido, setPedido] = useState(null);

    const GetParametro = (parametro) => {
        const params = new URLSearchParams(window.location.search);
        const param = params.get(parametro);
        return param;
    }

    useEffect(() => {
        var id = GetParametro("pedidoId");
        PedidoId(id);


        api.get(`api/Recibo/BuscarRecibos?pedidoId=${id}`, res => {
            setRecibos(res.data);
        }, erro => {
            alert('Houve um erro na solicitação');
        });

        api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${id}`, res => {
            setCliente(res.data.cliente);
            setPedido(res.data.pedido);
        }, erro => {
            alert('Houve um erro na solicitação');
        })

        api.get(`api/Pedidos/BuscarTipoPagamento`, res => {
            setTipoPagamento(res.data);
        }, erro => {
            alert('Houve um erro na solicitação');
        })

    }, [])

    return (
        <section className='content'>
            {cliente && pedido && <div>
                <h1>Histórico De Recibos</h1>
                <div className="header-recibo" style={{
                    padding: '1rem',
                    background: '#28d',
                    color: '#fff',
                    width: '100%',
                    margin: '0'
                }}>
                    <Row>
                        <Col md={2}>
                            <label style={{ fontSize: 20 }}>Pedido Id: {pedidoId}</label>
                        </Col>
                    </Row><br />
                    <Row>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>Nome do cliente: {cliente.nome}</label>
                        </Col>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>{cliente.pessoaFisica ? "CPF" : "CNPJ"}: {cliente.pessoaFisica ? cliente.cpf : cliente.cnpj}</label>
                        </Col>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>Data Do Pedido: {format(pedido.data_pedido, "dd/MM/yyyy")}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label style={{ fontSize: 20 }}>Localidade: {cliente.endereco.localidade + " - " + cliente.endereco.uf}</label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>Valor Total: {pedido.valor_total.toFixed(2)}</label>
                        </Col>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>Valor Total Pago: {"R$ " + (pedido.valor_total - pedido.saldo_devedor).toFixed(2)} </label>
                        </Col>
                        <Col md={4}>
                            <label style={{ fontSize: 20 }}>Valor Total Devedor: {(pedido.valor_total - (pedido.valor_total - pedido.saldo_devedor)).toFixed(2)}</label>
                        </Col>
                    </Row>
                </div>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Data Do Recibo</th>
                            <th>Valor Pago</th>
                            <th>Forma De Pagamento</th>
                            <th>Nome Do Pagador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recibos.map(recibo => {
                            var pagamento = tipoPagamento.filter(x => x.tipo_pagamento_id === recibo.forma_pagamento);
                            pagamento = pagamento.length > 0 ? pagamento[0].nome : "n/i";
                            return (
                                <tr>
                                    <td data-label="Id">{recibo.recibo_id}</td>
                                    <td data-label="Data Do Recibo">{format(recibo.data_recibo, "dd/MM/yyyy")}</td>
                                    <td data-label="Valor Pago">R$ {recibo.valor_pago.toFixed(2)}</td>
                                    <td data-label="Forma De Pagamento">{pagamento}</td>
                                    <td data-label="Nome Do Pagador">{recibo.nome_pagador}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>}
            {!cliente && !pedido && <div style={{ textAlign: 'center' }}>
                <h1>Pedido não encontrado!</h1>
                <h3><a onClick={() => window.history.back()} style={{ textDecoration: 'underline #28d', color: '#28d', cursor: 'pointer' }}>Voltar</a></h3>
            </div>}
        </section>
    );
}

export default ListaRecibo;