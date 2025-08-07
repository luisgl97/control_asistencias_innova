class ReporteEmitido {
  constructor({ usuario_id, mes, hash, qr_base64, pdf_path, creado_por }) {
    this.usuario_id = usuario_id;
    this.mes = mes;
    this.hash = hash;
    this.qr_base64 = qr_base64;
    this.pdf_path = pdf_path;
    this.creado_por = creado_por;
  }
}

module.exports = ReporteEmitido;