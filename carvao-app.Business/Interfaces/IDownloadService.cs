using carvao_app.Models.Enum;
using carvao_app.Repository.Maps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace carvao_app.Business.Interfaces
{
    public interface IDownloadService
    {
        byte[] DownloadFiltro(string filtro, string dtInicio, string dtFim, ETipoDownload tipoDownload, UsuarioMap usuarioMap, int? nPedido, int? vendedor);
    }
}
