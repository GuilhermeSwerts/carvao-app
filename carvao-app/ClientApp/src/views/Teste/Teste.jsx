import React from 'react';
import './teste.css';
import VisualizarPedido from '../../components/Modals/Pedido/VisualizarPedido';

function Teste() {
    const id = 1;

    const produtos = [
        {
            qtd: 1,
            produto: 'Carvão 10kg',
            valorUn: 10.5,
            porcentagemDesconto: 10,
            total: 240.5
        },
        {
            qtd: 1,
            produto: 'Carvão 10kg',
            valorUn: 10.5,
            porcentagemDesconto: 10,
            total: 20
        }
    ]

    return <VisualizarPedido />;
    // <div className="content" style={{ display: 'flex', justifyContent: 'center' }}>
    //     <div style={{ width: '70%' }}>

    //         <h1 style={{ fontWeight: '700', textAlign: 'center' }}>DETALHES DO PEDIDO</h1>
    //         <hr />
    //         <div className="resumo-titulo">
    //             <span>DADOS GERAIS</span>
    //         </div>
    //         <br />
    //         <div className="row">

    //             <div className="col-sm-2">
    //                 <span><b>N° DO PEDIDO:</b> 1</span>
    //             </div>
    //             <div className="col-sm-4">
    //                 <span><b>DATA DO PEDIDO:</b> 18/07/2024 20:47:20</span>
    //             </div>
    //             <div className="col-sm-6">
    //                 <span><b>NOME DO VENDEDOR:</b> GUILHERME SWERTS</span>
    //             </div>
    //         </div>
    //         <br />
    //         <div className="row">
    //             <div className="col-sm-4">
    //                 <span><b>NOME DO CLIENTE:</b> BRUNO HENRRIQUE</span>
    //             </div>
    //             <div className="col-sm-8">
    //                 <span><b>ENDEREÇO:</b> Rua Montevidéu, 110 - CopacabanaBelo Horizonte - MG, 31550-140</span>
    //             </div>
    //         </div>
    //         <br />
    //         <div className="resumo-titulo">
    //             <span>DADOS DO PEDIDO</span>
    //         </div>
    //         <br />
    //         <table className='table table-striped'>
    //             <thead>
    //                 <th>QUANTIDADE</th>
    //                 <th>PRODUTO</th>
    //                 <th>VALOR UN.</th>
    //                 <th>DESCONTO UN.</th>
    //                 <th>TOTAL</th>
    //             </thead>
    //             <tbody>
    //                 {produtos.map((produto,i) => (
    //                     <tr key={i}>
    //                         <td>{produto.qtd}</td>
    //                         <td>{produto.produto}</td>
    //                         <td>R$ {produto.valorUn.toFixed(2)}</td>
    //                         <td>{produto.porcentagemDesconto}%</td>
    //                         <td>R$ {produto.total.toFixed(2)}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //         <br />
    //         <label>OBSERVAÇÃO</label>
    //         <textarea className='form-control' disabled style={{ resize: 'none', height: 200, width: '100%' }} />
    //         <br />
    //         <div className="row">
    //             <div className="col-md-6"></div>
    //             <div className="col-md-3">
    //                 <label>PORCENTAGEM DE DESCONTO</label>
    //                 <input type="text" disabled className='form-control' />
    //             </div>
    //             <div className="col-md-3">
    //                 <label>VALOR TOTAL DO PEDIDO</label>
    //                 <input type="text" disabled className='form-control' />
    //             </div>
    //         </div>
    //     </div>
    // </div >

}

export default Teste;
