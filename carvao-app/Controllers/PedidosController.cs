using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;

namespace carvao_app.Controllers
{
    public class PedidosController : PrivateController
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

                request.VendedorUsuarioId = GetUser().Usuario_id;

                _service.NovoPedido(request);
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
        [HttpPost]
        [Route("/api/pedidos/AtualizarStatusPedido")]
        public IActionResult AtualizarStatusPedido([FromForm] string obj)
        
        {
            try 
            { 
                 var request = JsonConvert.DeserializeObject<EditarStatusPedidoResquest>(obj);
                _service.AtualizarStatusPedido(request.PedidoId, request.StatusPedidoId);
                return Ok("Status do pedido atualizado com sucesso.");

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao atualizar status do pedido: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("/api/Pedido/EditarPedido")]
        public ActionResult EditarPedido([FromForm] string obj)
        {
            try
            {
                var request = JsonConvert.DeserializeObject<EditarProdutoRequest>(obj);
                _service.EditarPedido(request);
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
        public ActionResult BuscarTodosPedidos([FromQuery] string q = "", string dtInicio = "", string dtFim = "")
        {
            try
            {
                var pedidos = _service.BuscarTodosPedidos(q, dtInicio, dtFim, GetUser());
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
