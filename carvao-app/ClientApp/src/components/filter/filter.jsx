import React from 'react';
import { FaPlus } from 'react-icons/fa'

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
    onChangeFiltroStatusPedido = () => { }
}) {

    return (
        <div style={{
            padding: '1rem',
            background: '#28d',
            color: '#fff',
            width: '100%',
            margin: '0'
        }}
            className='row'
        >
            <div class="col-md-12" style={{ marginBottom: '10px' }}>
                <label for="validationTooltipUsername">Filtros:</label>
                {showFiltroNome && <div class="input-group">
                    <input
                        type="text"
                        placeholder="Nome do cliente"
                        value={filtroNome}
                        className='form-control'
                        onChange={handleInputChange}
                    />
                    {showNovoCliente && <div class="input-group-prepend">
                        <button
                            className='btn btn-success'
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
                        <input onChange={e => setDataInicio(e.target.value)} type="date" required className='form-control' />
                    </div>
                    <div className="col-md-3">
                        <label>Até:</label>
                        <div class="input-group">
                            <input onChange={e => setDataFim(e.target.value)} type="date" required className='form-control' />
                            <div class="input-group-prepend">
                                <button className='btn btn-success'>Buscar</button>
                            </div>
                        </div>
                    </div>
                    {filtroStatusPedido && <div className="col-md-3">
                        <label>Status do pedido:</label>
                        <select onChange={onChangeFiltroStatusPedido} className='form-control'>
                            <option value="0">TODOS</option>
                            {statusPedido.map(item => (
                                <option value={item.status_pedido_id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>}
                </form>
            </div>

        </div>
    );
}

export default ClienteListHeader;