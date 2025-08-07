const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const guardarReporteEmitido = require("../../application/useCases/guardarReporteEmitido");
const SequelizeReporteEmitidoRepository = require("../../infrastructure/repositories/SequelizeReporteEmitidoRepository");

// Este controlador recibe un PDF en base64 y lo guarda en una carpeta personalizada por trabajador
// El PDF ya debe contener su hash y QR antes de ser enviado
// Se guarda tal como llega, sin ninguna modificación

const guardarReporteIndividual = async (req, res) => {
  try {
    const { 
        pdfBase64, 
        nombre_archivo, 
        carpeta,
        usuario_id,
        mes,
        creado_por,
        qr_base64
    } = req.body;

    // Validaciones básicas
    if (!pdfBase64 || !nombre_archivo || !carpeta || !usuario_id || !mes || !creado_por) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    // Ruta de guardado
    const rutaBase = path.resolve(__dirname, "../../../../../public/reportes", carpeta);
    const rutaCompleta = path.join(rutaBase, nombre_archivo);

    // Aseguramos que la carpeta exista
    fs.mkdirSync(rutaBase, { recursive: true });

    // Decodificar el base64 y guardar el archivo tal cual
    const buffer = Buffer.from(pdfBase64, "base64");
    fs.writeFileSync(rutaCompleta, buffer);

    // Calcular el hash del archivo guardado como referencia (NO se usa para validar integridad)
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Construímos el URL público
    const dominio = process.env.DOMINIO_PUBLICO || "http://localhost:4001";
    const url = `${dominio}/reportes/${carpeta}/${nombre_archivo}`;

    // Guardamos en base de datos como reporte emitido (inmutable)
    const repository = new SequelizeReporteEmitidoRepository();
    if (qr_base64 && qr_base64 !== "TEMPORAL") {
        await guardarReporteEmitido({
            usuario_id,
            mes,
            hash,
            qr_base64,
            pdf_path: url,
            creado_por
        }, repository);
    }
    
    return res.status(200).json({
        message: "Reporte guardado y registrado correctamente.",
        url,
        hash,
      });
    } catch (error) {
        console.error("Error al guardar reporte individual:", error);
        return res.status(500).json({error: "Error interno al guardar el reporte. "});
    }
  }

  const verificarReporteEmitido = async (req, res) => {
    try {
        const { usuario_id, mes } = req.query;
        if (!usuario_id || !mes) return res.status(400).json({ error: "Falta usuario_id y mes" });

        const repository = new SequelizeReporteEmitidoRepository();
        const existente = await repository.obtenerPorUsuarioYMes(usuario_id, mes);
        
        if (existente) {
            return res.status(200).json({ existe: true, url: existente.pdf_path, hash: existente.hash });
        }

        return res.status(200).json({ existe: false });
    } catch (err) {
        console.error("Error al verificar reporte emitido:", err);
        return res.status(500).json({ error: "Error interno al verificar reporte" });
    }
};

  module.exports = {
    guardarReporteIndividual,
    verificarReporteEmitido
};