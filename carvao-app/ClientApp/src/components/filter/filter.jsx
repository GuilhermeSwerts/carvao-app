import React from 'react';
import { FaDownload, FaPlus } from 'react-icons/fa'
import { api } from '../api/api';
import { eTipoDownload } from '../../enum/eTipoDownload';
import { Alert } from '../../util/Alertas';
import ReactInputMask from 'react-input-mask';

function ClienteListHeader({
    filtroNome,
    handleInputChange,
    handleAbrirModal,
    setDataInicio,
    setDataFim,
    fetchClientes,
    dataInicio,
    dataFim,
    showNovoCliente = false,
    showFiltroNome = true,
    filtroStatusPedido = false,
    statusPedido = [],
    onChangeFiltroStatusPedido = () => { },
    extrairDados = false,
    tipoDownload = 0,
    nPedido = null,
    setNPedido = () => { },
    showNPedido = false,
    filtroVendedor = false,
    vededores = [],
    setVendedorSelecionado = () => { },
    vendedorSelecionado = null
}) {

    const DonwloadArquivo = async () => {
        const url = `${api.urlBase}api/DownloadFiltro?filtro=${filtroNome ? filtroNome : ''}&dtInicio=${dataInicio}&dtFim=${dataFim}&nPedido=${nPedido.replaceAll("_", "")}&tipoDownload=${tipoDownload}&vendedor=${vendedorSelecionado}`;
        const token = api.access_token;
        try {

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                Alert('Erro ao baixar o arquivo', false);
            }

            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = GetNomeArquivo();
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const GetNomeArquivo = () => {
        switch (tipoDownload) {
            case eTipoDownload.GestaoPedidos:
                return "GestaoPedidos.xlsx";
            case eTipoDownload.Clientes:
                return "Clientes.csv";
            default:
                return "SemNome.csv";
        }
    }

    return (
        <div style={{
            padding: '1rem',
            background: 'var(--cor-principal)',
            color: '#fff',
            width: '100%',
            margin: '0'
        }}
            className='row'
        >
            <div class="col-md-12" style={{ marginBottom: '10px' }}>
                <label for="validationTooltipUsername">Filtros:</label>
                {showFiltroNome && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Nome do cliente"
                        value={filtroNome}
                        className='form-control'
                        onChange={handleInputChange}
                    />
                    {showNovoCliente && <div class="input-group-prepend">
                        <button
                            className='btn btn-white'
                            style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100%', gap: 10 }}
                            onClick={() => handleAbrirModal(null)}
                        >
                            Add<FaPlus />
                        </button>
                    </div>}
                </div>}<br />
                <form className="row" onSubmit={e => { e.preventDefault(); fetchClientes(filtroNome, dataInicio, dataFim) }}>
                    <div className="col-md-3">
                        <label>De:</label>
                        <input value={dataInicio} onChange={e => setDataInicio(e.target.value)} type="date" className='form-control' />
                    </div>
                    <div className="col-md-3">
                        <label>Até:</label>
                        <input value={dataFim} onChange={e => setDataFim(e.target.value)} type="date" className='form-control' />
                    </div>
                    {showNPedido && <div className="col-md-3">
                        <label>N° Pedido</label>
                        {/* <input
                            value={nPedido}
                            onChange={e => setNPedido(e.target.value)}
                            type="text"
                            className='form-control'
                        /> */}
                        <ReactInputMask
                            className='form-control'
                            mask={"9999999999"}
                            style={{ borderColor: '#bbb' }}
                            value={nPedido}
                            onChange={(e) => setNPedido(e.target.value)}
                            placeholder={"N° Pedido"}
                        />
                    </div>}
                    <div className="col-md-3" style={{ marginTop: 24 }}>
                        <button className='btn btn-white'>Buscar</button>
                    </div>
                    {filtroStatusPedido && <div className="col-md-3">
                        <label>Status do pedido:</label>
                        <select onChange={onChangeFiltroStatusPedido} className='form-control'>
                            <option value="-1">TODOS MENOS CONCLUÍDOS E CANCELADOS</option>
                            <option value="0">TODOS</option>
                            {statusPedido.map(item => (
                                <option value={item.status_pedido_id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>}
                    {filtroVendedor && <div className='col-12 col-md-3'>
                        <label>Vendedor:</label>
                        <select value={vendedorSelecionado} onChange={e => setVendedorSelecionado(e.target.value)} className='form-control'>
                            <option value={null}>Todos</option>
                            {vededores.map(item => (
                                <option value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>}

                    {extrairDados && <div className="col-md-12" style={{ width: '100%', display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
                        <label></label>
                        <button type='button' onClick={DonwloadArquivo} className='btn btn-white'>Extrair Dados <FaDownload size={25} /></button>
                    </div>}
                </form>
            </div>

        </div>
    );
}

export default ClienteListHeader;