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
        public ActionResult BuscarTodosPedidos([FromQuery] string filtro, string dtInicio, string dtFim, ETipoDownload tipoDownload, int? nPedido = null)
        {
            try
            {
                byte[] data = _service.DownloadFiltro(filtro, dtInicio, dtFim, tipoDownload, GetUser(), nPedido);
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
            var dados = _servicePedido.BuscarTodosPedidos("", "", "", GetUser(), pedidoId);
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

                XImage image = XImage.FromFile("images/icone.jpg");

                double width = 250;
                double height = image.PixelHeight * (width / image.PixelWidth);
                double xPosition = page.Width - width + 50;
                double yPosition = 35;

                gfx.DrawImage(image, xPosition, yPosition, width, height);

                XRect rect = new XRect(0, 0, page.Width, 40);
                XColor backgroundColor = XColor.FromArgb(207, 42, 59);
                gfx.DrawRectangle(new XSolidBrush(backgroundColor), rect);

                gfx.DrawString("DETALHES DO PEDIDO", titleFont, XBrushes.White, rect, XStringFormats.Center);

                double yPoint = 60;

                // DADOS GERAIS
                gfx.DrawString("DADOS GERAIS", sectionFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;

                gfx.DrawString($"Nº DO PEDIDO: {Pedido.Pedido_id}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"CNPJ: {Pedido.Cnpj}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"DATA DO PEDIDO: {DateTime.Parse(Pedido.Data_pedido.ToString()).ToString("dd/MM/yyyy HH:mm:ss")}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"NOME DO VENDEDOR: {Pedido.NomeVendedor}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"NOME DO CLIENTE: {Pedido.NomeCliente}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 20;
                gfx.DrawString($"ENDEREÇO: {Pedido.Endereco}", normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 40;

                // TABELA DE ITENS
                gfx.DrawString("DADOS DO PEDIDO", sectionFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 25;

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
                    gfx.DrawString($"{produto.Nome}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths[0], yPoint, columnWidths[1], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(2).Sum(), yPoint, columnWidths[2], tableHeight);
                    gfx.DrawString($"R$ {item.Valor_unitario:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(2).Sum(), yPoint, columnWidths[2], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(3).Sum(), yPoint, columnWidths[3], tableHeight);
                    gfx.DrawString($"R$ {item.Desconto_unitario:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(3).Sum(), yPoint, columnWidths[3], tableHeight), XStringFormats.Center);

                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidths.Take(4).Sum(), yPoint, columnWidths[4], tableHeight);
                    gfx.DrawString($"R$ {((item.Quantidade * item.Valor_unitario) - item.Desconto_unitario):F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidths.Take(4).Sum(), yPoint, columnWidths[4], tableHeight), XStringFormats.Center);

                    yPoint += Convert.ToInt32(tableHeight);
                }

                yPoint += 25;

                gfx.DrawString("TOTAL DO PEDIDO", sectionFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 25;

                double totalTableStartY = yPoint;
                double[] columnWidthsTotal = { 100, 150, 150, 150 };

                string[] headersTotal = { "Valor Total", "Porcentagem de desconto", "Total Descontos", "Valor Líquido" };
                for (int i = 0; i < headersTotal.Length; i++)
                {
                    gfx.DrawRectangle(XPens.Black, tableStartX + columnWidthsTotal.Take(i).Sum(), totalTableStartY, columnWidthsTotal[i], tableHeight);
                    gfx.DrawString(headersTotal[i], normalFont, XBrushes.Black, new XRect(tableStartX + columnWidthsTotal.Take(i).Sum(), totalTableStartY, columnWidthsTotal[i], tableHeight), XStringFormats.Center);
                }

                yPoint += Convert.ToInt32(tableHeight);

                gfx.DrawRectangle(XPens.Black, tableStartX, yPoint, columnWidthsTotal[0], tableHeight);
                gfx.DrawString($"R$ {(Pedido.Valor_total + Pedido.Valor_desconto):F2}", normalFont, XBrushes.Black, new XRect(tableStartX, yPoint, columnWidthsTotal[0], tableHeight), XStringFormats.Center);

                gfx.DrawRectangle(XPens.Black, tableStartX + columnWidthsTotal[0], yPoint, columnWidthsTotal[1], tableHeight);
                gfx.DrawString($"{Pedido.Percentual_desconto}%", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidthsTotal[0], yPoint, columnWidthsTotal[1], tableHeight), XStringFormats.Center);

                gfx.DrawRectangle(XPens.Black, tableStartX + columnWidthsTotal.Take(2).Sum(), yPoint, columnWidthsTotal[2], tableHeight);
                gfx.DrawString($"R$ {Pedido.Valor_desconto:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidthsTotal.Take(2).Sum(), yPoint, columnWidthsTotal[2], tableHeight), XStringFormats.Center);

                gfx.DrawRectangle(XPens.Black, tableStartX + columnWidthsTotal.Take(3).Sum(), yPoint, columnWidthsTotal[3], tableHeight);
                gfx.DrawString($"R$ {Pedido.Valor_total:F2}", normalFont, XBrushes.Black, new XRect(tableStartX + columnWidthsTotal.Take(3).Sum(), yPoint, columnWidthsTotal[3], tableHeight), XStringFormats.Center);

                yPoint += 50;
                gfx.DrawString("DESCRIÇÃO DO PEDIDO", sectionFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                yPoint += 25;
                gfx.DrawString(Pedido.Observacao, normalFont, XBrushes.Black, new XRect(20, yPoint, page.Width, 20), XStringFormats.CenterLeft);
                document.Save(memoryStream, false);

                byte[] bytes = memoryStream.ToArray();
                return File(bytes, "application/pdf", $"pedido_{Pedido.NomeCliente}_{Pedido.Pedido_id}.pdf");
            }

        }

    }
}
