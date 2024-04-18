using carvao_app.Business.Interfaces;
using carvao_app.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace carvao_app.Controllers
{
    public class ProdutosController : PrivateController
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

        [HttpPost]
        [Route("/api/Produto")]
        public ActionResult post([FromForm] string data)
        {
            try
            {
                var request  = JsonConvert.DeserializeObject<ProdutoRequest>(data);
                _service.NovoProduto(request);
                return Ok(true);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpPost]
        [Route("/api/Produto/Editar")]
        public ActionResult put([FromForm] string data)
        {
            try
            {
                var request = JsonConvert.DeserializeObject<ProdutoRequest>(data);
                _service.EditarProduto(request);
                return Ok(true);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }

        [HttpDelete]
        [Route("/api/Produto/{id}")]
        public ActionResult post([FromRoute] int id)
        {
            try
            {
                _service.DeletaProduto(id);
                return Ok(true);
            }
            catch (System.Exception)
            {
                return BadRequest("Houve um erro, por favor tente novamente mais tarde!");
            }
        }
    }   
}
