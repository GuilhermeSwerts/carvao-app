using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Repository.Maps
{
    public class ProdutoMap
    {
        public int Produto_id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Link_foto { get; set; }
        public DateTime Data_cadastro { get; set; }
        public decimal Valor { get; set; }
        public string Codigo_barra { get; set; }
        public int Quantidade { get; set; }
        public decimal Valor_desconto_maximo { get; set; }
        public decimal desconto_unitario { get; set; }
    }
}
