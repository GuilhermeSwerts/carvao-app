using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class BuscarPedidoMap
    {
        public int Status_pedido_id { get; set; }

        public PedidoMap Pedido { get; set; }
        public ClienteMap Cliente { get; set; }
       
    }
}
