using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Interfaces
{
    public interface IProdutosService
    {
        object BuscarTiposPagamento();
        object BuscarTodosProdutos();
    }
}
