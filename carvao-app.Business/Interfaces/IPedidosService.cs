using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using System.Collections.Generic;

namespace carvao_app.Business.Interfaces
{
    public interface IPedidosService
    {
        object BuscarPedidoId(int pedidoId);
        PedidoDto BuscarTodosPedidos(string q ,string dtInicio, string dtFim,Repository.Maps.UsuarioMap usuarioMap);
        void EditarPedido(EditarProdutoRequest request);
        List<HistoricoDto> HistoricoPedidosCliente(int id);
        void NovoPedido(NovoProdutoRequest request);
        bool AtualizarSaldoDevedor(int pedidoId, decimal valorPago);
        public bool AtualizarStatusPedido(int pedidoId, int status);
       
    }
}
