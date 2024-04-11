using carvao_app.Repository.Maps;
using carvao_app.Repository.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Interfaces
{
    public interface IPedidoRepository
    {
        BuscarPedidoMap BuscarPedidoId(int pedidoId);
        List<PedidoMap> BuscarTodosPedidos(string dtInicio, string dtFim);
        List<StatusPagamentoMap> BuscarTodosStatusPagamento();
        List<StatusPedidoMap> BuscarTodosStatusPedido();
        List<HistoricoMap> HistoricoPedidosCliente(int id);
        void NovoPedido(NovoPedidoRequestDb map);
    }
}
