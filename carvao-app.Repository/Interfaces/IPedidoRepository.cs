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
        List<PedidoMap> BuscarTodosPedidos(string q, string dtInicio, string dtFim, UsuarioMap usuarioMap);
        List<StatusPagamentoMap> BuscarTodosStatusPagamento();
        List<StatusPedidoMap> BuscarTodosStatusPedido();
        void EditarPedido(EditarPedidoRequestDb map);
        List<HistoricoMap> HistoricoPedidosCliente(int id);
        void NovoPedido(NovoPedidoRequestDb map);

        bool AtualizarSaldoDevedor(int pedidoId, decimal valorPago);

        public bool AtualizarStatusPedido(int pedidoId, int statusPedido);
    }
}
