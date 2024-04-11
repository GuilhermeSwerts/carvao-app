using carvao_app.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Requests
{
    public class NovoProdutoRequest
    {
        public int ClienteId { get; set; }
        public List<ProdutoDto> ProdutosAdicionado { get; set; }
        public int VendedorUsuarioId { get; set; }
        public string ValorTotal { get; set; }
        public string ValorDesconto { get; set; }
        public int PercentualDesconto { get; set; }
        public string Observacao { get; set; }
    }
}
