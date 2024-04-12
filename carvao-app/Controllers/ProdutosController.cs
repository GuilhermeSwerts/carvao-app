﻿using carvao_app.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace carvao_app.Controllers
{
    public class ProdutosController : Controller
    {
        private readonly IProdutosService _service;
        public ProdutosController(IProdutosService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("/api/Produto/BuscarTodos")]
        public ActionResult BuscarTodos()
        {
            try
            {
                var produtos = _service.BuscarTodosProdutos();
                return Ok(produtos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpGet]
        [Route("/api/Pedidos/BuscarTipoPagamento")]
        public ActionResult BuscarTipoPagamento()
        {
            try
            {
                var tipos = _service.BuscarTiposPagamento();
                return Ok(tipos);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
    }   
}
