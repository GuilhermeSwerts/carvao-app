using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Dtos
{
    public class PedidoDto
    {
        public List<PedidoMap> Pedidos { get; set; } = new();
        public List<StatusPagamentoMap> StatusPagamento { get; set; } = new();
        public List<StatusPedidoMap> StatusPedido { get; set; } = new();


        public PedidoDto ToDto(List<PedidoMap> pedidos, List<StatusPagamentoMap> statusPagamento, List<StatusPedidoMap> StatusPedido)
        {
            return new PedidoDto
            {
                Pedidos = pedidos,
                StatusPagamento = statusPagamento,
                StatusPedido = StatusPedido,
            };
        }
    }
}
