import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { api } from '../../components/api/api';
import { format } from 'date-fns';
import { ReciboPDF } from '../../components/pdf/pdf';
import { PDFDownloadLink } from "@react-pdf/renderer";

function Recibo() {
    const [pedido, setPedido] = useState();
    const [cliente, setCliente] = useState();
    const [pedidoId, setPedidoId] = useState(0);
    const [tipoPagamento, setTipoPagamento] = useState([]);
    const [showPdf, setShowPdf] = useState(false);
    const [reciboId, setReciboId] = useState(0);
    const [reciboCorrente, setReciboCorrente] = useState(null);
    const [recibos, setRecibos] = useState([]);


    const [data, setData] = useState({
        valor_pago: '',
        forma_pagamento: 1,
        nome_pagador: '',
        observacoes: '',
        Id: 0,
        hash_recibo: '',
        pedido_id: 0
    });

    const GetParametro = (parametro) => {
        const params = new URLSearchParams(window.location.search);
        const param = params.get(parametro);
        return param;
    }

    useEffect(() => {
        var id = GetParametro("pedidoId");
        if (id) {
            setPedidoId(parseInt(id));
            setData({ ...data, ["pedido_id"]: pedidoId });
        }
        setData({ ...data, ["Id"]: parseInt(id) });

        api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${id}`, res => {
            console.log("BuscarPedidoId")
            console.log(res);
            if (res.data && res.data.pedido) {
                setPedido(res.data.pedido);
                setCliente(res.data.cliente);
            }
        }, erro => {
            alert('Houve um erro na solicitação BuscarPedidoId' + erro);
        });

        api.get(`api/Pedidos/BuscarTipoPagamento`, res => {
            if (res.data) {
                setTipoPagamento(res.data);
            }
        }, erro => {
            alert('Houve um erro na solicitação BuscarTipoPagamento' + erro);
        })

        api.get(`api/Recibo/BuscarRecibosPorPedido?PedidoId=${id}`, res => {
            if (res.data) {
                setRecibos(res.data);
            }
        }, erro => {
            alert('Houve um erro na solicitação BuscarRecibosPorPedido' + erro);
        });
    }, []);

    const onChangeValue = e => setData({ ...data, [e.target.name]: e.target.value });

    const onChangevalor_pago = e => {
        let valorRestante = (pedido.valor_total - (pedido.valor_total - pedido.saldo_devedor));
        if (e.target.value > valorRestante) {
            alert(`Valor acima do valor total a serem pagos\nValor máximo: R$ ${valorRestante.toFixed(2)}.`);
            return;
        }

        setData({ ...data, ["valor_pago"]: (e.target.value + "").replaceAll('.', ',') });
    }

    const handdleEnviar = async () => {
        let valorRestante = (pedido.valor_total - (pedido.valor_total - pedido.saldo_devedor));

        if (!data.valor_pago || data.valor_pago == '' || data.valor_pago < 1) {
            data.valor_pago = valorRestante;
            onChangevalor_pago({ target: { value: valorRestante } })
            var setValorTotal = await window.confirm("**Valor pago não foi informado! \n Deseja realizar recibo com valor total do saldo devedor?");
            if (!setValorTotal) {
                return;
            }
        }

        if (!pedido || !pedido.pedido_id || !pedidoId || pedidoId == 0) {
            alert("Pedido não está carregado ou pedidoId não está disponível");
            return;
        }

        if (data.valor_pago > valorRestante) {
            alert(`Valor acima do valor total a serem pagos\nValor máximo: R$ ${valorRestante.toFixed(2).replaceAll('.', ',')}.`);
            return;
        }

        var gerar = await window.confirm("Deseja realmente gerar um recibo?")
        if (gerar) {

            const formData = new FormData();
            data.valor_pago = data.valor_pago.replaceAll(',', '.');
            formData.append("data", JSON.stringify(data));
            console.log(data);

            api.post("api/Recibo/GerarRecibo", formData, resGerarRecibo => {

                setReciboId("resGerarRecibo.data");
                setReciboId(resGerarRecibo.data);
                setShowPdf(true);

                api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${pedidoId}`, resPedido => {
                    setPedido(resPedido.data.pedido);

                }, erro => {
                    alert('Houve um erro na solicitação');
                });

                api.get(`/api/Recibo/BuscarReciboPorId?reciboId=${resGerarRecibo.data}`, resRecibo => {
                    setReciboCorrente(resRecibo.data);
                }, erro => {
                    alert('Houve um erro na solicitação');
                });
            }, erro => {
                alert('Houve um erro na solicitação');
            })
        }

    }


    return (<section className='content'>
        {cliente && pedido && <form className="container" onSubmit={e => { e.preventDefault(); }}>
            <div className="header-recibo" style={{
                padding: '1rem',
                background: '#28d',
                color: '#fff',
                width: '100%',
                margin: '0',
            }}>
                <h1>Recibo</h1>
                <h3>Kompleto Carvão e Assesoria LTDA</h3>
                <h3>Cnpj: 52.808.744/0001-47</h3>
            </div>
            <Row>
                <Col md={2}>
                    <label>Código do pedido:</label>
                    <input value={pedidoId} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <label>Nome do cliente:</label>
                    <input value={cliente.nome} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>{cliente.pessoaFisica ? "CPF" : "CNPJ"}:</label>
                    <input value={cliente.pessoaFisica ? cliente.cpf : cliente.cnpj} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>Data Do Pedido:</label>
                    <input value={format(pedido.data_pedido, "dd/MM/yyyy")} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <label>Localidade:</label>
                    <input value={cliente.endereco?.localidade} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>UF:</label>
                    <input value={cliente.endereco?.uf} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <label>Valor Total Do Pedido:</label>
                    <input value={"R$ " + pedido.valor_total.toFixed(2).replaceAll('.', ',')} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>Valor Total Pago:</label>
                    <input value={"R$ " + (pedido.valor_total - pedido.saldo_devedor).toFixed(2).replaceAll('.', ',')} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>Saldo Devedor:</label>
                    <input value={"R$ " + (pedido.saldo_devedor).toFixed(2).replaceAll('.', ',')} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <label>*Valor Pago:</label>
                    <input disabled={showPdf} name='valor_pago' value={data.valor_pago} onChange={onChangevalor_pago} required min={1} className='form-control' type="text" />
                </Col>
                <Col md={4}>
                    <label>*Forma de Pagamento:</label>
                    <select disabled={showPdf} name='forma_pagamento' onChange={onChangeValue} required className='form-control'>
                        {tipoPagamento.map(tipo => (
                            <option value={tipo.tipo_pagamento_id}>{tipo.nome}</option>
                        ))}
                    </select>
                </Col>
                <Col md={5}>
                    <label>*Nome Do Pagador:</label>
                    <input disabled={showPdf} value={data.nome_pagador} name='nome_pagador' onChange={onChangeValue} required className='form-control' type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <label>Observação:</label>
                    <textarea disabled={showPdf} value={data.observacoes} name='observacoes' onChange={onChangeValue} style={{ resize: 'none' }} className='form-control'></textarea>
                </Col>
            </Row>
            <br />
            {!showPdf && <Row style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', gap: 10 }}>
                <Col md={3}>
                    <button onClick={() => window.history.back()} style={{ width: '100%' }} className='btn btn-danger'>Cancelar</button>
                </Col>
                <Col md={3}>
                    <button onClick={handdleEnviar} style={{ width: '100%' }} className='btn btn-primary'>Gerar Recibo</button>
                </Col>
            </Row>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                {showPdf && <a onClick={() => window.history.back()} className='btn btn-danger' >Voltar</a>}
                {showPdf && (
                    <button type='button' className='btn btn-primary' style={{ marginTop: "20px" }}>
                        <PDFDownloadLink
                            style={{ color: '#fff', textDecoration: 'none', fontWeight: '700' }}
                            document={
                                <ReciboPDF pedidoId={pedidoId} data={reciboCorrente}
                                    tipoPagamento={tipoPagamento} cliente={cliente}
                                    pedido={pedido} reciboId={reciboId} />
                            }
                            fileName={`recibo-${reciboId}.pdf`}
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? "Carregando documento..." : "Baixar PDF"
                            }
                        </PDFDownloadLink>
                    </button>
                )}
            </div>
        </form>}
        {!cliente && !pedido && <div style={{ textAlign: 'center' }}>
            <h1>Pedido não encontrado!</h1>
            <h3><a onClick={() => window.history.back()} style={{ textDecoration: 'underline #28d', color: '#28d', cursor: 'pointer' }}>Voltar</a></h3>
        </div>}

    </section>
    );
}

export default Recibo;