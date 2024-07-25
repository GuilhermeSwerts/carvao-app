using carvao_app.Business.Interfaces;
using carvao_app.Models.Dtos;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;

namespace carvao_app.Controllers
{
    public class EstoqueController : PrivateController
    {
        private readonly IProdutosService _produtosService;

        public EstoqueController(IProdutosService produtosService)
        {
            _produtosService = produtosService;
        }

        [HttpGet]
        [Route("/api/Estoque")]
        public IActionResult GetEstoque()
        {
            try
            {
                var produtos = _produtosService.BuscarTodosProdutos();
                return Ok(produtos);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("/api/Estoque/{id}")]
        public IActionResult GetEstoqueId([FromRoute] int id)
        {
            try
            {
                var produto = (List<ProdutoDto>)_produtosService.BuscarTodosProdutos();
                return Ok(produto.FirstOrDefault(x=> x.Id == id) ?? new ProdutoDto());
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPut]
        [Route("/api/Estoque/{id}")]
        public IActionResult PutEstoqueId([FromRoute] int id,[FromQuery] int qtd)
        {
            try
            {
                _produtosService.AtualizarEstoque(id, qtd);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

    }
}
