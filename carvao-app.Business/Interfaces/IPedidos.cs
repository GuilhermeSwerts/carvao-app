using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Interfaces
{
    public interface IPedidos
    {
        object BuscarPedidoId(int pedidoId);
        PedidoDto BuscarTodosPedidos(string dtInicio, string dtFim);
        List<HistoricoDto> HistoricoPedidosCliente(int id);
        void NovoPedido(NovoProdutoRequest request);
    }
}
