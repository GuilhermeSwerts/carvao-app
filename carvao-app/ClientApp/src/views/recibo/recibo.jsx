import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { api } from '../../components/api/api';
import { format } from 'date-fns';
import {
    PDFDownloadLink,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

function Recibo() {
    const [pedido, setPedido] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [pedidoId, setpedidoId] = useState(0);
    const [tipoPagamento, setTipoPagamento] = useState([]);
    const [showPdf, setShowPdf] = useState(false);
    const [reciboId, setReciboId] = useState(0);

    const [data, setData] = useState({
        ValorPagar: 0,
        FormaPagamento: 1,
        NomePagador: '',
        Observacao: '',
        Id: 0
    });

    const GetParametro = (parametro) => {
        const params = new URLSearchParams(window.location.search);
        const param = params.get(parametro);
        return param;
    }

    useEffect(() => {
        var id = GetParametro("pedidoId");
        setpedidoId(parseInt(id));
        setData({ ...data, ["Id"]: parseInt(id) });
        api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${id}`, res => {
            setPedido(res.data.pedido);
            setCliente(res.data.cliente);
            console.clear();
            console.log(res.data.pedido);
            console.log(res.data.cliente);
        }, erro => {
            alert('Houve um erro na solicitação');
        });

        api.get(`api/Pedidos/BuscarTipoPagamento`, res => {
            setTipoPagamento(res.data);
        }, erro => {
            alert('Houve um erro na solicitação');
        })
    }, []);

    const onChangeValue = e => setData({ ...data, [e.target.name]: e.target.value });

    const onChangeValorPagar = e => {

        let valorRestante = (pedido.valor_total - (pedido.valor_total - pedido.saldo_devedor));
        if (e.target.value > valorRestante) {
            alert(`Valor acima do valor total a serem pagos\nValor máximo: R$ ${valorRestante.toFixed(2)}.`);
            return;
        }

        setData({ ...data, ["ValorPagar"]: e.target.value });
    }

    const handdleEnviar = () => {
        if (!pedido || !pedido.pedido_id || !pedidoId || pedidoId == 0) {
            alert("Pedido não está carregado ou pedidoId não está disponível");
            return;
        }

        let valorRestante = (pedido.valor_total - (pedido.valor_total - pedido.saldo_devedor));
        if (data.ValorPagar > valorRestante) {
            alert(`Valor acima do valor total a serem pagos\nValor máximo: R$ ${valorRestante.toFixed(2)}.`);
            return;
        }

        if (window.confirm("Deseja realmente gerar um recibo?")) {

            const formData = new FormData();
            formData.append("data", JSON.stringify(data));

            api.post("api/Recibo/GerarRecibo", formData, res => {
                setShowPdf(true);
                setReciboId(res.data);
                api.get(`api/Pedidos/BuscarPedidoId?PedidoId=${pedidoId}`, res => {
                    setPedido(res.data.pedido);
                }, erro => {
                    alert('Houve um erro na solicitação');
                });
            }, erro => {
                alert('Houve um erro na solicitação');
            })
        }

    }

    const styles = StyleSheet.create({
        page: {
            padding: 30,
            flexDirection: "column",
            backgroundColor: "#fff",
            fontFamily: "Helvetica",
            fontSize: 12,
            lineHeight: 1.5,
        },
        header: {
            backgroundColor: "#28d",
            color: "#fff",
            padding: 10,
            marginBottom: 15,
        },
        title: {
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
        },
        companyName: {
            fontSize: 15,
            textAlign: "center",
            marginBottom: 3,
        },
        content: {
            paddingHorizontal: 35,
            marginBottom: 15,
        },
        section: {
            margin: 10,
            padding: 10,
        },
        signatureSpace: {
            marginTop: 20, // Space above signature line
            marginBottom: 5, // Space below signature line
        },
        dateSpace: {
            marginBottom: 5, // Space below the date line
        },
        detailsSection: {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '1rem'
        },
        detailItem: {
            marginBottom: 10,
            width: 300,
        },
        detailTitle: {
            fontWeight: "bold",
            marginBottom: 3,
        },
        detailValue: {
            fontSize: 12,
            marginBottom: 5,
        },
    });

    const ReciboPDF = ({ cliente, pedido, reciboId }) => (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>
                        Kompleto Carvao e Assesoria LTDA
                    </Text>
                    <Text style={styles.companyCNPJ}>CNPJ: 52.808.774/0001-47</Text>
                    <Text style={styles.title}>Recibo {reciboId}</Text>
                </View>

                <View style={styles.detailsSection}>
                    {/* Coluna Esquerda */}
                    <View style={styles.detailItem}>
                        <Text style={styles.detailTitle}>Nome Cliente:</Text>
                        <Text style={styles.detailValue}>{cliente?.nome}</Text>

                        <Text style={styles.detailTitle}>{cliente?.pessoaFisica ? "CPF" : "CNPJ:"}</Text>
                        <Text style={styles.detailValue}>{cliente?.pessoaFisica ? cliente?.cpf : cliente.cnpj}</Text>

                        <Text style={styles.detailTitle}>Forma de Pagamento:</Text>
                        <Text style={styles.detailValue}>{tipoPagamento.filter(x => x.tipo_pagamento_id === data.FormaPagamento).length > 0 ? tipoPagamento.filter(x => x.tipo_pagamento_id === data.FormaPagamento)[0].nome : ""}</Text>
                    </View>

                    {/* Coluna Direita */}
                    <View style={styles.detailItem}>
                        <Text style={styles.detailTitle}>Data do Pedido:</Text>
                        <Text style={styles.detailValue}>
                            {pedido && format(pedido.data_pedido, "dd/MM/yyyy")}
                        </Text>

                        <Text style={styles.detailTitle}>Nome do Pagador:</Text>
                        <Text style={styles.detailValue}>{data.NomePagador}</Text>

                        <Text style={styles.detailTitle}>Código Do Pedido:</Text>
                        <Text style={styles.detailValue}>{pedidoId}</Text>

                        <Text style={styles.detailTitle}>Valor Total:</Text>
                        <Text style={styles.detailValue}>
                            R$ {pedido?.valor_total.toFixed(2)}
                        </Text>
                    </View>
                </View>
                {/* Continuação da coluna esquerda com espaçamento extra */}
                <View style={{ ...styles.detailItem, width: "100%" }}>
                    <Text style={styles.detailTitle}>Saldo Devedor:</Text>
                    <Text style={styles.detailValue}>
                        {pedido &&
                            pedido.saldo_devedor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                    </Text>
                    <Text style={styles.detailTitle}>Observações:</Text>
                    <Text style={styles.detailValue}>{data.Observacao}</Text>
                </View>
            </Page>
        </Document>
    );

    return (<section className='content'>
        {cliente && pedido && <form className="container" onSubmit={e => { e.preventDefault(); handdleEnviar() }}>
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
                    <input value={cliente.endereco.localidade} className='form-control' disabled type="text" />
                </Col>
                <Col md={4}>
                    <label>UF:</label>
                    <input value={cliente.endereco.uf} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <label>Valor Total:</label>
                    <input value={"R$ " + pedido.valor_total.toFixed(2)} className='form-control' disabled type="text" />
                </Col>
                <Col md={6}>
                    <label>Valor Total Pago:</label>
                    <input value={"R$ " + (pedido.valor_total - pedido.saldo_devedor).toFixed(2)} className='form-control' disabled type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <label>*Valor a Pagar:</label>
                    <input disabled={showPdf} name='ValorPagar' value={data.ValorPagar} onChange={onChangeValorPagar} required min={1} className='form-control' type="number" />
                </Col>
                <Col md={4}>
                    <label>*Forma de Pagamento:</label>
                    <select disabled={showPdf} name='FormaPagamento' onChange={onChangeValue} required className='form-control'>
                        {tipoPagamento.map(tipo => (
                            <option value={tipo.tipo_pagamento_id}>{tipo.nome}</option>
                        ))}
                    </select>
                </Col>
                <Col md={5}>
                    <label>*Nome Do Pagador:</label>
                    <input disabled={showPdf} value={data.NomePagador} name='NomePagador' onChange={onChangeValue} required className='form-control' type="text" />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <label>Observação:</label>
                    <textarea disabled={showPdf} value={data.Observacao} name='Observacao' onChange={onChangeValue} style={{ resize: 'none' }} className='form-control'></textarea>
                </Col>
            </Row>
            <br />
            {!showPdf && <Row style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', gap: 10 }}>
                <Col md={2}>
                    <button onClick={() => window.history.back()} style={{ width: '100%' }} className='btn btn-danger'>Cancelar Pedido</button>
                </Col>
                <Col md={2}>
                    <button type='submit' style={{ width: '100%' }} className='btn btn-primary'>Enviar Pedido</button>
                </Col>
            </Row>}
            {showPdf && (
                <button type='button' className='btn btn-primary' style={{ marginTop: "20px" }}>
                    <PDFDownloadLink
                        style={{ color: '#fff', textDecoration: 'none', fontWeight: '700' }}
                        document={
                            <ReciboPDF cliente={cliente} pedido={pedido} reciboId={reciboId} />
                        }
                        fileName={`recibo-${reciboId}.pdf`}
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Carregando documento..." : "Baixar PDF"
                        }
                    </PDFDownloadLink>
                </button>
            )}
        </form>}
        {!cliente && !pedido && <div style={{ textAlign: 'center' }}>
            <h1>Pedido não encontrado!</h1>
            <h3><a onClick={() => window.history.back()} style={{ textDecoration: 'underline #28d', color: '#28d', cursor: 'pointer' }}>Voltar</a></h3>
        </div>}

    </section>
    );
}

export default Recibo;