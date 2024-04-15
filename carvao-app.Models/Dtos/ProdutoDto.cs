using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Dtos
{
    public class ProdutoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Valor { get; set; }
        public decimal ValorMinimo { get; set; }
        public decimal ValorDescontoUnitario { get; set; }
        public int Quantidade { get; set; }

        public List<ProdutoDto> ToDtoList(List<ProdutoMap> list)
        {
            List<ProdutoDto> dto = new();
            foreach (var map in list)
            {
                dto.Add(new ProdutoDto
                {
                    Id = map.Produto_id,
                    Valor = map.Valor,
                    ValorMinimo = map.Valor_desconto_maximo,
                    Nome = map.Nome,
                    Quantidade = map.Quantidade,
                    ValorDescontoUnitario = map.desconto_unitario
                });
            }
            return dto;
        }
    }
}
