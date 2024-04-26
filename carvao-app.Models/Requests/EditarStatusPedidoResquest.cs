using carvao_app.Models.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class EditarStatusPedidoResquest
    {
        public int StatusPedidoId { get; set; }

        public int PedidoId { get;  set; }
    }
}
