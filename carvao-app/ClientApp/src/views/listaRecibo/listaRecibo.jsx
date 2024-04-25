import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Row, Col, Button } from 'react-bootstrap';
import { api } from '../../components/api/api';
import CancelarReciboModal from '../../components/Modals/Clients/CancelarRecibo';
import { ReciboPDF } from '../../components/pdf/pdf';
import { PDFDownloadLink } from "@react-pdf/renderer";

function ListaRecibo() {
    const [pedidoId, setPedidoId] = useState(0);
    const [tipoPagamento, setTipoPagamento] = useState([]);
    const [recibos, setRecibos] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [pedido, setPedido] = useState(null);
    const [showCancelarModal, setShowCancelarModal] = useState(false);
    const [reciboParaCancelar, setReciboParaCancelar] = useState(null);


    const getParametro = (parametro) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(parametro);
    }

    const onReload = () => {
        const id = getParametro("pedidoId");
        setPedidoId(id);

        api.get(`api/Recibo/BuscarRecibosPorPedido?pedidoId=${id}`,
            res => setRecibos(res.data),
            erro => alert('1 Houve um erro na solicitação para buscar recibos' + erro)
        );

        setShowCancelarModal(false);
    }

    useEffect(() => {
        const id = getParametro("pedidoId");
        setPedidoId(id);

        api.get(`api/Recibo/BuscarRecibosPorPedido?pedidoId=${id}`,
            res => setRecibos(res.data),
            erro => alert('2 Houve um erro na solicitação para buscar recibos' + erro)
        );

        api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${id}`,
            res => {
                setCliente(res.data.cliente);
                setPedido(res.data.pedido);
            },
            erro => alert('Houve um erro na solicitação para buscar pedido' + erro)
        );

        api.get(`api/Pedidos/BuscarTipoPagamento`,
            res => setTipoPagamento(res.data),
            erro => alert('Houve um erro na solicitação para buscar tipos de pagamento' + erro)
        );

    }, [])

    const handleShowCancelarModal = (recibo) => {
        setReciboParaCancelar(recibo);
        setShowCancelarModal(true);
    };

    const handleCancelarRecibo = (justificativa) => {
        console.log('Recibo cancelado com a justificativa:', justificativa);
        setShowCancelarModal(false);
        setReciboParaCancelar(null);
    };

    return (
        <section className='content'>
            {cliente && pedido && (
                <div>
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
                                <label style={{ fontSize: 20 }}>Localidade: {cliente.endereco?.localidade + " - " + cliente.endereco?.uf}</label>
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
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recibos.map((recibo, index) => {
                                const pagamento = tipoPagamento.find(x => x.tipo_pagamento_id === recibo.forma_pagamento);
                                const nomePagamento = pagamento ? pagamento.nome : "n/i";
                                return (
                                    <tr key={recibo.recibo_id}>
                                        <td data-label="Id">{index + 1}</td>
                                        <td data-label="Data Do Recibo">{format(recibo.data_recibo, "dd/MM/yyyy")}</td>
                                        <td data-label="Valor Pago">R$ {recibo.valor_pago.toFixed(2)}</td>
                                        <td data-label="Forma De Pagamento">{nomePagamento}</td>
                                        <td data-label="Nome Do Pagador">{recibo.nome_pagador}</td>
                                        <td data-label="Ações" style={{ display: 'flex', gap: 20 }}>
                                            <button onClick={() => handleShowCancelarModal(recibo)} className='btn btn-danger'>Cancelar Recibo</button>
                                            <button type='button' className='btn btn-primary'>
                                                <PDFDownloadLink
                                                    style={{ color: '#fff', textDecoration: 'none', fontWeight: '700' }}
                                                    document={
                                                        <ReciboPDF pedidoId={pedidoId} data={{
                                                            forma_pagamento: recibo.forma_pagamento,
                                                            nome_pagador: recibo.nome_pagador,
                                                            observacoes: recibo.observacoes,
                                                            valor_pago: recibo.valor_pago.toFixed(2), 
                                                            hash_recibo: recibo.hash_recibo
                                                        }} tipoPagamento={tipoPagamento} cliente={cliente} pedido={pedido} reciboId={recibo.recibo_id} />
                                                    }
                                                    fileName={`recibo-${recibo.recibo_id}.pdf`}
                                                >
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? "Carregando documento..." : "Baixar PDF"
                                                    }
                                                </PDFDownloadLink>
                                            </button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {!cliente && !pedido && (
                <div style={{ textAlign: 'center' }}>
                    <h1>Pedido não encontrado!</h1>
                    <h3>
                        <a onClick={() => window.history.back()}
                            style={{ textDecoration: 'underline #28d', color: '#28d', cursor: 'pointer' }}>
                            Voltar
                        </a>
                    </h3>
                </div>
            )}

            {showCancelarModal && (
                <CancelarReciboModal
                    onReload={onReload}
                    recibo={reciboParaCancelar}
                    show={showCancelarModal}
                    onHide={() => setShowCancelarModal(false)}
                    onCancel={handleCancelarRecibo}
                />
            )}
        </section>
    );
}

export default ListaRecibo;
