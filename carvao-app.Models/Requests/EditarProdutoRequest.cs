using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class EditarProdutoRequest : NovoProdutoRequest
    {
        public int PedidoId { get; set; }
    }
}
