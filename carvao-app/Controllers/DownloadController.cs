using carvao_app.Business.Interfaces;
using carvao_app.Models.Enum;
using carvao_app.Repository.Maps;
using iTextSharp.text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;

namespace carvao_app.Controllers
{
    public class DownloadController : PrivateController
    {
        private readonly IDownloadService _service;
        private readonly IPedidosService _servicePedido;
        private readonly IProdutosService _serviceProdutos;

        public DownloadController(IDownloadService service, IPedidosService servicePedido, IProdutosService serviceProdutos)
        {
            _service = service;
            _servicePedido = servicePedido;
            _serviceProdutos = serviceProdutos;
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

        [HttpGet]
        [Route("/api/Download/Pdf/DetalhesPedido/{pedidoId}")]
        public IActionResult ExportToPDF([FromRoute] int pedidoId)
        {
            var dados = (BuscarPedidoMap)_servicePedido.BuscarPedidoId(pedidoId);
            var produtos = (List<ProdutoMap>)_serviceProdutos.BuscarTodosProdutos();

            using (MemoryStream memoryStream = new MemoryStream())
            {
                Document document = new Document(PageSize.A4);
                PdfWriter writer = PdfWriter.GetInstance(document, memoryStream);
                document.Open();

                // Adicionando o título
                var titleFont = FontFactory.GetFont("Arial", 18, Font.BOLD);
                var sectionFont = FontFactory.GetFont("Arial", 12, Font.BOLD);
                var normalFont = FontFactory.GetFont("Arial", 12, Font.NORMAL);

                document.Add(new Paragraph("DETALHES DO PEDIDO", titleFont));
                document.Add(new Chunk("\n"));

                // Dados Gerais
                document.Add(new Paragraph("DADOS GERAIS", sectionFont));
                document.Add(new Paragraph($"Nº DO PEDIDO: {dados.Pedido.Pedido_id}", normalFont));
                document.Add(new Paragraph($"DATA DO PEDIDO: {DateTime.Parse(dados.Pedido.Data_pedido.ToString()).ToString("dd/MM/yyyy HH:mm:ss")}", normalFont));
                document.Add(new Paragraph($"NOME DO VENDEDOR: {dados.Pedido.NomeVendedor}", normalFont));
                document.Add(new Paragraph($"NOME DO CLIENTE: {dados.Pedido.NomeCliente}", normalFont));
                document.Add(new Paragraph($"ENDEREÇO: {dados.Pedido.Endereco}", normalFont));
                document.Add(new Chunk("\n"));

                // Dados do Pedido
                document.Add(new Paragraph("DADOS DO PEDIDO", sectionFont));
                PdfPTable table = new PdfPTable(5);
                table.AddCell("QUANTIDADE");
                table.AddCell("PRODUTO");
                table.AddCell("VALOR UN.");
                table.AddCell("DESCONTO UN.");
                table.AddCell("TOTAL");

                foreach (var item in dados.Pedido.Produtos)
                {
                    table.AddCell(item.Quantidade.ToString());
                    table.AddCell(produtos.First(x=> x.Produto_id == dados.Pedido.Pedido_id).Nome);
                    table.AddCell($"R$ {item.Valor_unitario:F2}");
                    table.AddCell($"R$ {item.Desconto_unitario:F2}");
                    table.AddCell($"R$ {item.Valor_total:F2}");
                }
                document.Add(table);

                // Observação
                document.Add(new Paragraph("OBSERVAÇÃO", sectionFont));
                document.Add(new Paragraph(dados.Pedido.Observacao, normalFont));
                document.Add(new Chunk("\n"));

                // Resumo do Pedido
                document.Add(new Paragraph($"PORCENTAGEM DE DESCONTO: {dados.Pedido.Percentual_desconto}%", normalFont));
                document.Add(new Paragraph($"VALOR TOTAL DO PEDIDO: R$ {dados.Pedido.Valor_total:F2}", normalFont));

                document.Close();
                writer.Close();

                byte[] bytes = memoryStream.ToArray();
                return File(bytes, "application/pdf", $"pedido_{dados.Pedido.NomeCliente}_{dados.Pedido.Pedido_id}.pdf");
            }
        }

    }
}
