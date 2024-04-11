using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace carvao_app.Controllers
{
    public class ReciboController : Controller
    {
        private readonly IRecibo _service;

        public ReciboController(IRecibo service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("/api/Recibo/GerarRecibo")]
        public ActionResult BuscarPedidoId([FromForm] string data)
        {
            try
            {
                var recibo = JsonConvert.DeserializeObject<GerarReciboRequest>(data);
                var reciboId = _service.GerarRecibo(recibo);
                return Ok(reciboId);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/Recibo/BuscarRecibos")]
        public ActionResult BuscarRecibosId([FromQuery] int pedidoId)
        {
            try
            {
                var recibos = _service.BuscarRecibosId(pedidoId);
                return Ok(recibos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

    }
}
