using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Request
{
    public class EditarPedidoRequestDb : NovoPedidoRequestDb
    {
        public int PedidoId { get; set; }
    }
}
