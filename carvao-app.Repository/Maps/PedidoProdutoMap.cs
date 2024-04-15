using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class PedidoProdutoMap
    {
        public int Pedido_produto_id { get; set; }
        public int Pedido_id { get; set; }
        public int Produto_id { get; set; }
        public int Quantidade { get; set; }
        public decimal Valor_unitario { get; set; }
        public decimal Valor_total { get; set; }
        public decimal Valor_desconto { get; set; }
        public decimal Desconto_unitario { get; set; }

    }
}
