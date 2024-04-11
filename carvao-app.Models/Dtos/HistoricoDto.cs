using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Models.Dtos
{
    public class HistoricoDto
    {
        public int Id { get; set; }
        public decimal ValorTotal { get; set; }
        public DateTime DataPedido { get; set; }
        public string StatusPedido { get; set; }
        public string StatusPagamento { get; set; }

        public List<HistoricoDto> ToDtoList(List<HistoricoMap> list)
        {
            List<HistoricoDto> dtos = new();
            foreach (var item in list)
            {
                dtos.Add(new HistoricoDto
                {
                    DataPedido = item.DataPedido,
                    Id = item.Id,
                    StatusPagamento = item.StatusPagamento,
                    StatusPedido = item.StatusPedido,
                    ValorTotal = item.ValorTotal
                });
            }
            return dtos;
        }
    }
}
