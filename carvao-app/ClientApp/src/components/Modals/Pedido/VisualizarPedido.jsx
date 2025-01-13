import React from 'react';
import { Modal } from 'react-bootstrap';
import { CgDetailsMore } from 'react-icons/cg';
import ButtonTooltip from '../../Inputs/ButtonTooltip';
import axios from 'axios';
import { api } from '../../../components/api/api';
class VisualizarPedido extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        console.clear();
        console.log(this.props)
    }

    render() {
        const CloseModal = () => this.setState({ show: false });
        const OpenModal = () => this.setState({ show: true });

        const { Pedido } = this.props;

        const handleExport = async () => {
            try {

                const response = await axios.get(`api/Download/Pdf/DetalhesPedido/${Pedido.pedido_id}`, {
                    responseType: 'blob',
                    headers: {
                        "Authorization": `Bearer ${api.access_token ? api.access_token : ""}`
                    }
                });

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `pedido_${Pedido.nomeCliente}_${Pedido.pedido_id}.pdf`
                link.click();
            } catch (error) {
                console.error('Erro ao exportar para PDF:', error);
            }
        };

        const getDataFormatada = (datastr) => {
            var data = new Date(datastr);

            const day = String(data.getDate()).padStart(2, '0');
            const month = String(data.getMonth() + 1).padStart(2, '0');
            const year = data.getFullYear();

            return `${day}/${month}/${year} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
        }

        return (
            <>
                <ButtonTooltip
                    text="Detalhes do Pedido"
                    textButton={<CgDetailsMore size={20} color='#fff' />}
                    className='btn btn-warning'
                    top={true}
                    onClick={OpenModal}
                />
                <Modal show={this.state.show} dialogClassName="custom-modal" onHide={CloseModal}>
                    <Modal.Header closeButton>
                        <h1 style={{ fontWeight: '700', textAlign: 'center' }}>DETALHES DO PEDIDO</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="resumo-titulo">
                            <span>DADOS GERAIS</span>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-sm-4">
                                <span><b>Cnpj:</b> {Pedido.cnpj}</span>
                            </div>
                            <div className="col-sm-2">
                                <span><b>N° DO PEDIDO:</b> {Pedido.pedido_id}</span>
                            </div>
                            <div className="col-sm-4">
                                <span><b>DATA DO PEDIDO:</b> {getDataFormatada(Pedido.data_pedido)}</span>
                            </div>
                            <div className="col-sm-6">
                                <span><b>NOME DO VENDEDOR:</b> {Pedido.nomeVendedor.toUpperCase()}</span>
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-sm-4">
                                <span><b>NOME DO CLIENTE:</b> {Pedido.nomeCliente.toUpperCase()}</span>
                            </div>
                            <div className="col-sm-8">
                                <span><b>ENDEREÇO:</b> {Pedido.endereco}</span>
                            </div>
                        </div>
                        <br />
                        <div className="resumo-titulo">
                            <span>DADOS DO PEDIDO</span>
                        </div>
                        <br />
                        <table className='table table-striped'>
                            <thead>
                                <th>QUANTIDADE</th>
                                <th>PRODUTO</th>
                                <th>VALOR UN.</th>
                                <th>DESCONTO UN.</th>
                                <th>TOTAL</th>
                            </thead>
                            <tbody>
                                {Pedido.produtos.map((produto, i) => (
                                    <tr key={i}>
                                        <td data-label="QUANTIDADE">{produto.quantidade}</td>
                                        <td data-label="PRODUTO">{this.props.produtos.filter(x => x.id === produto.produto_id)[0]?.nome}</td>
                                        <td data-label="QUANVALOR UN.TIDADE">R$ {produto.valor_unitario.toFixed(2)}</td>
                                        <td data-label="DESCONTO UN.">R$ {produto.desconto_unitario.toFixed(2)}</td>
                                        <td data-label="TOTAL">R$ {((produto.quantidade * produto.valor_unitario) - produto.desconto_unitario).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <label>OBSERVAÇÃO</label>
                        <textarea className='form-control' value={Pedido.observacao} disabled style={{ resize: 'none', height: 100, width: '100%' }} />
                        <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-3">
                                <label>PORCENTAGEM DE DESCONTO</label>
                                <input type="text" disabled className='form-control' value={`${Pedido.percentual_desconto}%`} />
                            </div>
                            <div className="col-md-3">
                                <label>VALOR DESCONTO DO PEDIDO</label>
                                <input type="text" disabled className='form-control' value={`R$ ${Pedido.valor_desconto.toFixed(2)}`} />
                            </div>
                            <div className="col-md-3">
                                <label>VALOR TOTAL DO PEDIDO</label>
                                <input type="text" disabled className='form-control' value={`R$ ${this.props.historico.filter(x => x.pedido_id === Pedido.pedido_id)[0].valor_total.toFixed(2)}`} />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 10 }}>
                            <button className='btn btn-danger' onClick={CloseModal}>Fechar</button>
                            <button className='btn btn-primary' onClick={handleExport}>Download</button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default VisualizarPedido;