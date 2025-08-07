import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO} from "date-fns";
import { es } from "date-fns/locale";
import QRCode from "qrcode";
import api from "../../../shared/service/api";

// Funcion para convertir imagenes a base64
const toBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

// Función para convertir arrays a base64
const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Calcular hash SHA-256 en el navegador
const calcularHashSHA256 = async (arrayBuffer) => {
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};


// Función principal para generar PDF por cada trabajador con hash + QR
export const generarPDFMasivoConQR = async (asistenciasPorTrabajador, mes, anio, creadoPor = 1) => {
    const imageBase64 = await toBase64("/images/logo_azul.png");

    const resultados = [];

    const batchSize = 5;
    for (let i = 0; i < asistenciasPorTrabajador.length; i += batchSize) {
        const batch = asistenciasPorTrabajador.slice(i, i + batchSize);

        const resultadosBatch = await Promise.all(
            batch.map(async (trabajador) => {
                try {
                    const { usuario, asistencias } = trabajador;
                    
                    if (!usuario || !usuario.nombres || !Array.isArray(asistencias)) {
                        console.warn(" Trabajador con datos incompletos o asistencias inválidas:", trabajador);
                        return null;
                    }

                    // Validamos si ya fue emitido previamente
                    const resVerificacion = await api.get("/reportes/verificar-reporte", {
                        params: {
                            usuario_id: usuario.id,
                            mes: `${anio}-${mes}`
                        }
                    });

                    if (resVerificacion.data.existe) {
                        return {
                            trabajador: `${usuario.nombres} ${usuario.apellidos}`,
                            url: resVerificacion.data.url,
                            hash: resVerificacion.data.hash,
                            yaEmitido: true,
                            usuario_id: usuario.id
                        };
                    }

                    // Nombre estandarizado para carpetas y archivos
                    const nombreTrabajador = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase().replace(/\s+/g, "-");
                    const nombreArchivo = `reporte-${mes}-${anio}.pdf`;
                    const carpeta = `${anio}-${mes}/${nombreTrabajador}`;

                    const generarContenidoPDF = (doc, hash = null, qrDataUrl = null ) => {
                        // Título + logotipo de la empresa
                        doc.setFontSize(10);
                        doc.addImage(imageBase64, "JPEG", 14, 5, 22, 10);
                        doc.setFont("helvetica", "bold");
                        doc.text("REGISTRO DE CONTROL DE ASISTENCIA", 105, 12, { align: "center" });

                        // Datos de la empresa y el trabajador
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(8);
                        doc.text("DATOS DE LA EMPRESA", 14, 20);
                        doc.setFont("helvetica", "normal");
                        doc.text(`Razón Social: ${usuario.filial.razon_social ?? "-"}`, 14, 26);
                        doc.text(`RUC: ${usuario.filial.ruc ?? "-"}`, 14, 30);

                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(8);
                        doc.text("DATOS DEL TRABAJADOR", 14, 38);
                        doc.setFont("helvetica", "normal");
                        doc.text(`Apellidos y nombres: ${usuario.apellidos.toUpperCase()} ${usuario.nombres.toUpperCase()}`, 14, 44);
                        doc.text(`Documento de identidad: ${usuario.tipo_documento ?? "-"} ${usuario.dni ?? "-"}`, 14, 48);
                        doc.text(`Cargo: ${usuario.cargo || "-"}`, 14, 52);

                        // Tabla de asistencia
                        const tableData = asistencias.map((a) => {
                            let fechaFormateada = "-";
                            try {
                                if (a.fecha) fechaFormateada = format(parseISO(a.fecha), "EEEE d 'de' MMMM yyyy", { locale: es });
                            } catch (err) {
                                console.warn("Fecha inválida:", a.fecha, err);
                            }

                            return [
                                fechaFormateada,
                                a.hora_ingreso || "-",
                                a.hora_inicio_refrigerio || "-",
                                a.hora_fin_refrigerio || "-",
                                a.hora_salida || "-",
                                a.horas_extras?.toString() || "0",
                            ];
                        });

                        autoTable(doc, {
                            startY: 60,
                            head: [["Fecha", "Ingreso", "Inicio Refrigerio", "Fin Regrigerio", "Salida", "Horas Extras"]],
                            body: tableData,
                            styles: {
                                fontSize: 8,
                                cellPadding: 1.5,
                            },
                            headStyles: {
                                fillColor: [41, 128, 185],
                                textColor: [255, 255, 255],
                                fontStyle: "bold",
                                halign: "center",
                            },
                            columnStyles: {
                                0: { halign: "left" },
                                1: { halign: "center" },
                                2: { halign: "center" },
                                3: { halign: "center" },
                                4: { halign: "center" },
                                5: { halign: "center" },
                            },
                            didParseCell(data) {
                                if (data.cell.raw === "-") {
                                    data.cell.styles.textColor = [200, 0, 0];
                                    data.cell.styles.fontStyle = "bold";
                                }
                            },
                        });

                        // NOTA LEGAL
                        const finalY = doc.lastAutoTable.finalY + 10;
                        doc.setFontSize(7);
                        doc.setTextColor(80);
                        doc.text(
                            "Conforme al Decreto Legislativo N.º 728, el Decreto Supremo N.º 003-97-TR y el Decreto Supremo N.º 004-2006-TR,\nel trabajador certifica mediante su firma y huella que este reporte refleja fielmente su jornada laboral.",
                            14,
                            finalY,
                            { maxWidth: 180, align: "justify" }
                        );

                        doc.setTextColor(0);
                        doc.setFontSize(8);
                        doc.text("Firma del Trabajador: __________________________", 14, finalY + 30);
                        doc.text("Firma del Supervisor: __________________________", 110, finalY + 30);

                        if (hash) {
                            if (qrDataUrl) {
                                const qrX = 115;
                                const qrY = 15;
                                const qrWidth = 80;
                                const qrHeight = 40;

                                // Caja QR con borde más elegante
                                doc.setDrawColor(180);
                                doc.setLineWidth(0.3);
                                doc.rect(qrX, qrY, qrWidth, qrHeight);

                                // Etiquetas QR y HASH
                                doc.setFont("courier", "normal");
                                doc.setFontSize(6);
                                doc.setTextColor(80);
                                doc.text("HASH (SHA-256):", qrX + 2, qrY + 6);
                                doc.setFontSize(5.5);
                                doc.text(hash, qrX + 2, qrY + 11, { maxWidth: qrWidth - 4 });

                                doc.setTextColor(0);
                                doc.text("QR:", qrX + 48, qrY + 16);
                                // Imagen QR
                                doc.addImage(qrDataUrl, "PNG", qrX + 55, qrY + 14, 22, 22);

                                doc.setFont("helvetica", "italic");
                                doc.setFontSize(6);
                                doc.setTextColor(80);
                                doc.text(
                                    "Este documento ha sido firmado digitalmente mediante un código HASH y un QR único.",
                                    qrX + 2,
                                    qrY + 16,
                                    { maxWidth: qrWidth - 40 }
                                );
                                doc.text(
                                    "Esto garantiza que su contenido no ha sido modificado y puede ser verificado como auténtico.",
                                    qrX + 2,
                                    qrY + 25,
                                    { maxWidth: qrWidth - 40 }
                                );

                                doc.setTextColor(200, 0, 0); 
                                doc.setFontSize(8);
                                doc.text("DOCUMENTO EMITIDO OFICIALMENTE", qrX + 2, qrY + 38);
                                doc.setTextColor(0);
                            }
                        }

                        doc.setFont("helvetica", "italic");
                        doc.setFontSize(6);
                        doc.setTextColor(100);
                        const firmaY = finalY + 30
                        doc.text(
                            "Ante cualquier duda, consulta o verificación técnica relacionada a este documento, puede comunicarse con la Oficina de Desarrollo Informático del Grupo INNOVA.",
                            20,
                            firmaY + 15
                        );
                        doc.text(
                            "Todos los derechos reservados © Grupo INNOVA - Sistema Marcate+",
                            20,
                            firmaY + 20
                        );

                    };

                    // Generamos PPDF sin hash ni qr aún
                    const docTemp = new jsPDF();
                    generarContenidoPDF(docTemp); 
                    const bufferTemp = docTemp.output("arraybuffer");

                    // HASH UNICO !!!
                    const hashFinal = await calcularHashSHA256(bufferTemp);

                    // Generamos QR con la URL destino del archivo
                    const urlPDF = `${window.location.origin}/reportes/${carpeta}/${nombreArchivo}`;
                    const qrDataUrl = await QRCode.toDataURL(urlPDF);

                     // Regeneramos PDF definitivo con hash real
                    const docFinal = new jsPDF();
                    generarContenidoPDF(docFinal, hashFinal, qrDataUrl);

                    // Exportamos el FINAL que irá al backend
                    const pdfFinalBuffer = docFinal.output("arraybuffer");
                    const pdfFinalBase64 = arrayBufferToBase64(pdfFinalBuffer);

/*                     // IMPORTANTE: Calculamos el hash del FINAL otra vez y lo comparamos
                    const hashFinalConfirmado = await calcularHashSHA256(pdfFinalBuffer);
                    if (hashFinal !== hashFinalConfirmado) {
                        console.warn("El hash visual no coincide con el hash real del PDF guardado");
                    } */

                    // Enviamos al backend para guardar, generar hash y registrar oficialmente
                    const res = await api.post("/reportes/guardar-reporte-individual", {
                        pdfBase64: pdfFinalBase64,
                        nombre_archivo: nombreArchivo,
                        carpeta,
                        usuario_id: usuario.id,
                        mes: `${anio}-${mes}`,
                        creado_por: creadoPor,
                        qr_base64: qrDataUrl,
                        hash: hashFinal
                    });

                    const { url } = res.data;

                    return {
                        trabajador: `${usuario.nombres} ${usuario.apellidos}`,
                        url,
                        hash: hashFinal,
                        usuario_id: usuario.id
                    };
                } catch (error) {
                    console.error("Error generando PDF:", error);
                    return null;
                }
            })
        );

        resultados.push(...resultadosBatch.filter(Boolean));
    }

    return resultados;
}