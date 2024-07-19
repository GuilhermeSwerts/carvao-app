using carvao_app.Business.Interfaces;
using carvao_app.Models.Enum;
using carvao_app.Repository.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using carvao_app.Models.Dtos;

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
            var dados = _servicePedido.BuscarTodosPedidos("","","",GetUser());
            var Pedido = dados.Pedidos.First(x => x.Pedido_id == pedidoId); 
            var produtos = (List<ProdutoDto>)_serviceProdutos.BuscarTodosProdutos();

            using (MemoryStream memoryStream = new MemoryStream())
            {
                PdfDocument document = new PdfDocument();
                PdfPage page = document.AddPage();
                XGraphics gfx = XGraphics.FromPdfPage(page);

                XFont titleFont = new XFont("Arial", 18, XFontStyleEx.Bold);
                XFont sectionFont = new XFont("Arial", 12, XFontStyleEx.Bold);
                XFont normalFont = new XFont("Arial", 12, XFontStyleEx.Regular);

                XRect rect = new XRect(0, 0, page.Width, 40);
                XColor backgroundColor = XColor.FromArgb(13, 110, 253);
                gfx.DrawRectangle(new XSolidBrush(backgroundColor), rect);

                gfx.DrawString("DETALHES DO PEDIDO", titleFont, XBrushes.White, rect, XStringFormats.Center);
                gfx.DrawString("\n", normalFont, XBrushes.Black, new XRect(0, 40, page.Width, 20), XStringFormats.Center);

                gfx.DrawString("DADOS GERAIS", sectionFont, XBrushes.Black, new XRect(20, 60, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString($"Nº DO PEDIDO: {Pedido.Pedido_id}", normalFont, XBrushes.Black, new XRect(20, 80, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString($"DATA DO PEDIDO: {DateTime.Parse(Pedido.Data_pedido.ToString()).ToString("dd/MM/yyyy HH:mm:ss")}", normalFont, XBrushes.Black, new XRect(20, 100, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString($"NOME DO VENDEDOR: {Pedido.NomeVendedor}", normalFont, XBrushes.Black, new XRect(20, 120, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString($"NOME DO CLIENTE: {Pedido.NomeCliente}", normalFont, XBrushes.Black, new XRect(20, 140, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString($"ENDEREÇO: {Pedido.Endereco}", normalFont, XBrushes.Black, new XRect(20, 160, page.Width, 20), XStringFormats.CenterLeft);

                gfx.DrawString("\n", normalFont, XBrushes.Black, new XRect(0, 180, page.Width, 20), XStringFormats.CenterLeft);
                gfx.DrawString("DADOS DO PEDIDO", sectionFont, XBrushes.Black, new XRect(20, 200, page.Width, 20), XStringFormats.CenterLeft);

                int yPoint = 225;
                double tableStartY = yPoint;
                double tableStartX = 25;
                double tableWidth = page.Width - 100;
                double tableHeight = 20;
                double[] columnWidths = { 50, 200, 100, 100, 100 };

                string[] headers = { "Qtd.", "Nome", "Valor Unitário", "Desconto Unitário", "Valor Total" };
                for (int i = 0; i < headers.Length; i++)
                {
                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(i).Sum(), tableStartY, columnWidths[i], tableHeight);
                    gfx.DrawString(headers[i], normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(i).Sum(), tableStartY, columnWidths[i], tableHeight), XStringFormats.Center);
                }

                yPoint += Convert.ToInt32(tableHeight);

                foreach (var item in Pedido.Produtos)
                {
                    var produto = produtos.First(x => x.Id == item.Produto_id);

                    gfx.DrawRectangle(XPens.Black, tableStartX, yPoint, columnWidths[0], tableHeight);
                    gfx.DrawString($"{item.Quantidade}", normalFont, XBrushes.Black, new XRect(tableStartX, yPoint, columnWidths[0], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths[0], yPoint, columnWidths[1], tableHeight);
                    gfx.DrawString($"{produto.Nome}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths[0], yPoint, columnWidths[1], tableHeight), XStringFormats.CenterLeft);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(2).Sum(), yPoint, columnWidths[2], tableHeight);
                    gfx.DrawString($"R$ {item.Valor_unitario:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(2).Sum(), yPoint, columnWidths[2], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(3).Sum(), yPoint, columnWidths[3], tableHeight);
                    gfx.DrawString($"R$ {item.Desconto_unitario:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(3).Sum(), yPoint, columnWidths[3], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(4).Sum(), yPoint, columnWidths[4], tableHeight);
                    gfx.DrawString($"R$ {item.Valor_total:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(4).Sum(), yPoint, columnWidths[4], tableHeight), XStringFormats.Center);

                    yPoint += Convert.ToInt32(tableHeight);
                }

                gfx.DrawString("\n", normalFont, XBrushes.Black, new XRect(0, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString("OBSERVAÇÃO", sectionFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString(Pedido.Observacao, normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);

                yPoint += 40;
                gfx.DrawString($"PORCENTAGEM DE DESCONTO: {Pedido.Percentual_desconto}%", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"VALOR TOTAL DO PEDIDO: R$ {Pedido.Valor_total:F2}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);

                document.Save(memoryStream, false);

                byte[] bytes = memoryStream.ToArray();
                return File(bytes, "application/pdf", $"pedido_{Pedido.NomeCliente}_{Pedido.Pedido_id}.pdf");
            }
        }

    }
}
