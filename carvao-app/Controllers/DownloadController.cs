using carvao_app.Business.Interfaces;
using carvao_app.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace carvao_app.Controllers
{
    public class DownloadController : PrivateController
    {
        private readonly IDownloadService _service;

        public DownloadController(IDownloadService service)
        {
           _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/api/DownloadFiltro")]
        public ActionResult BuscarTodosPedidos([FromQuery] string filtro,string dtInicio, string dtFim,ETipoDownload tipoDownload)
        {
            try
            {
                byte[] data = _service.DownloadFiltro(filtro, dtInicio, dtFim, tipoDownload, GetUser());
                string nomeArquivo = tipoDownload == ETipoDownload.GestaoPedidos ? "GestaoPedidos.csv" : "";
                return File(data, "application/csv;charset=utf-8", "FiltroClientes.csv");
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
    }
}
