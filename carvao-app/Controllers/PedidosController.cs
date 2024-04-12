using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace carvao_app.Controllers
{
    public class PedidosController : Controller
    {
        private readonly IPedidosService _service;
        public PedidosController(IPedidosService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("/api/Pedido/NovoPedido")]
        public ActionResult NovoPedido([FromForm] string obj)
        {
            try
            {
                var request = JsonConvert.DeserializeObject<NovoProdutoRequest>(obj);
                _service.NovoPedido(request);
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/pedidos/cliente/{id}")]
        public ActionResult HistoricoPedidosCliente([FromRoute] int id)
        {
            try
            {
                var pedidos = _service.HistoricoPedidosCliente(id);
                return Ok(pedidos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/pedidos/BuscarTodos")]
        public ActionResult BuscarTodosPedidos([FromQuery] string dtInicio = "", string dtFim = "")
        {
            try
            {
                var pedidos = _service.BuscarTodosPedidos(dtInicio, dtFim);
                return Ok(pedidos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/pedidos/BuscarPedidoId")]
        public ActionResult BuscarPedidoId([FromQuery] int pedidoId)
        {
            try
            {
                var pedido = _service.BuscarPedidoId(pedidoId);
                return Ok(pedido);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
    }
}
