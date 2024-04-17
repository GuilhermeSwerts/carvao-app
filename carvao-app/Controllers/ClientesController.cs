using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace carvao_app.Controllers
{
    public class ClientesController : PrivateController
    {
        private readonly IClientesService _service;
        public ClientesController(IClientesService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("/api/Cliente/BuscarClientes/{id}")]
        public ActionResult<ClienteDto> BuscarClientesId([FromRoute] int id)
        {
            try
            {
                ClienteDto clientes = _service.BuscarClientesId(id);
                return Ok(clientes);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/Cliente/BuscarClientes")]
        public ActionResult<List<ClienteDto>> BuscarClientes([FromQuery] string q = "", string dtInicio = "", string dtFim = "", bool valores = false)
        {
            try
            {
                var clientes = _service.BuscarClientes(q, dtInicio, dtFim, valores);
                return Ok(clientes);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpPost]
        [Route("/api/Cliente/NovoCliente")]
        public ActionResult NovoCliente([FromBody] ClienteRequest request)
        {
            try
            {
                _service.NovoCliente(request);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest($"Houve um erro: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("/api/Cliente/AtualizaDadosCliente")]
        public ActionResult AtualizaDadosCliente([FromBody] ClienteRequest request)
        {
            try
            {
                _service.AtualizaDadosCliente(request);
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpPost]
        [Route("/api/Cliente/InativaCliente/{id}")]
        public ActionResult InativaCliente([FromRoute] int id)
        {
            try
            {
                _service.AlterarStatusCliente(id, true);
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpPost]
        [Route("/api/Cliente/AtivaCliente/{id}")]
        public ActionResult AtivaCliente([FromRoute] int id)
        {
            try
            {
                _service.AlterarStatusCliente(id, false);
                return Ok();
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
    }
}
