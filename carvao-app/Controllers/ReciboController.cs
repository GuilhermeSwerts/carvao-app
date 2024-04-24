using carvao_app.Business.Interfaces;
using carvao_app.Business.Services;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace carvao_app.Controllers
{
    public class ReciboController : PrivateController
    {
        private readonly IRecibo _recibosService;

        public ReciboController(IRecibo service)
        {
            _recibosService = service;
        }

        [HttpPost]
        [Route("/api/Recibo/GerarRecibo")]
        public ActionResult GerarRecibo([FromForm] string data)
        { 

            try
            {
                var recibo = JsonConvert.DeserializeObject<GerarReciboRequest>(data);
                var reciboId = _recibosService.GerarRecibo(recibo);
                return Ok(reciboId);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpPost]
        [Route("/api/Recibo/CancelarReciboPorId")]
        public ActionResult CancelarReciboPorId([FromForm] string data)
        {
            try
            {
                var recibo = JsonConvert.DeserializeObject<CancelarReciboRequest>(data);


                var result = _recibosService.CancelarReciboPorId(recibo.Id, recibo.justificativa);
                return Ok(result);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/Recibo/BuscarRecibosPorPedido")]
        public ActionResult BuscarRecibosPorPedido([FromQuery] int pedidoId)
        {
            try
            {
                var recibos = _recibosService.BuscarRecibosId(pedidoId);
                return Ok(recibos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }



        }

        [HttpGet]
        [Route("/api/Recibo/BuscarReciboPorId")]
        public ActionResult BuscarReciboPorId([FromQuery] int reciboId)
        {
            try
            {
                var recibos = _recibosService.BuscarReciboPorId(reciboId);
                return Ok(recibos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

    }

}

 