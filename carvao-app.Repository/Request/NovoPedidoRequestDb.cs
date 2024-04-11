using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Request
{
    public class NovoPedidoRequestDb
    {
        public int ClienteId { get; set; }
        public DateTime DataPedido { get; set; }
        public string Observacao { get; set; }
        public int StatusPedidoId { get; set; }
        public string ValorDesconto { get; set; }
        public int PercentualDesconto { get; set; }
        public string ValorTotal { get; set; }
        public int VendedorUsuarioId { get; set; }
        public int StatusPagamentoId { get; set; }
        public List<ProdutoMap> ProdutosAdicionado { get; set; }
    }
}
