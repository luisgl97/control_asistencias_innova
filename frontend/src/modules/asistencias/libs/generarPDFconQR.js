import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import QRCode from "qrcode";
import api from "../../../shared/service/api";

export const generarPDFconQR = async (asistenciasPorTrabajador, nombreArchivo = "reporte-asistencias.pdf") => {
  const doc = new jsPDF();
  const imageUrl = "/images/logo_azul.png";

  const toBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const imageBase64 = await toBase64(imageUrl);

  // 1. Generar el PDF sin hash ni QR aún
  asistenciasPorTrabajador.forEach((trabajador, index) => {
    const { usuario, asistencias } = trabajador;

    doc.setFontSize(10);
    doc.addImage(imageBase64, "JPEG", 14, 5, 22, 10);
    doc.setFont("helvetica", "bold");
    doc.text("REGISTRO DE CONTROL DE ASISTENCIA", 105, 12, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("DATOS DE LA EMPRESA", 14, 20);
    doc.setFontSize(8);
    doc.text(`Nombre o Razón Social: ${usuario.filial_razon_social ?? "No disponible"}`, 14, 26);
    doc.text(`RUC: ${usuario.filial_ruc ?? "No disponible"}`, 14, 30);

    doc.setFontSize(9);
    doc.text("DATOS DEL TRABAJADOR", 14, 38);
    doc.setFontSize(8);
    doc.text(`Apellidos y nombres: ${usuario.nombres} ${usuario.apellidos}`, 14, 44);
    doc.text(`Documento: ${usuario.tipo_documento ?? "-"} ${usuario.dni ?? "-"}`, 14, 48);
    doc.text(`Cargo: ${usuario.cargo || "-"}`, 14, 52);

    const tableData = asistencias.map((a) => {
      const fecha = parseISO(a.fecha);
      return [
        format(fecha, "EEEE d 'de' MMMM yyyy", { locale: es }),
        a.hora_ingreso || "FALTA",
        a.hora_inicio_refrigerio || "-",
        a.hora_fin_refrigerio || "-",
        a.hora_salida || "FALTA",
        a.horas_extras?.toString() || "0",
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: [["Fecha", "Ingreso", "Inicio Refrigerio", "Fin Refrigerio", "Salida", "Horas Extras"]],
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
        if (data.cell.raw === "FALTA") {
          data.cell.styles.textColor = [200, 0, 0];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(7);
    doc.setTextColor(80);
    doc.text(
      "Conforme al Decreto Legislativo N.º 728, el D.S. N.º 003-97-TR y el D.S. N.º 004-2006-TR,\nel trabajador certifica mediante su firma y huella que este reporte refleja fielmente su jornada.",
      14,
      finalY,
      { maxWidth: 180 }
    );

    doc.setTextColor(0);
    doc.setFontSize(8);
    doc.text("Firma del Trabajador: __________________________", 14, finalY + 15);
    doc.text("Firma del Supervisor: __________________________", 110, finalY + 15);

    if (index !== asistenciasPorTrabajador.length - 1) {
      doc.addPage();
    }
  });

  // 2. Enviar al backend
  const pdfBuffer = doc.output("arraybuffer");
  const pdfBase64 = btoa(
    new Uint8Array(pdfBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );

  const nombre = nombreArchivo.replace(/\s+/g, "-").toLowerCase();
  const res = await api.post("/reportes/guardar", {
    nombre,
    pdfBase64,
  });

  const { url, hash } = res.data;

  // 3. Generar QR
  const qrDataUrl = await QRCode.toDataURL(url);

  // 4. Volver a cada página y agregar QR + hash arriba a la derecha
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(80);
    doc.setFont("courier", "normal");
    doc.text("HASH (SHA-256):", 150, 10);
    doc.text(hash.slice(0, 32), 150, 13);
    doc.text(hash.slice(32), 150, 16);
    doc.addImage(qrDataUrl, "PNG", 180, 20, 20, 20);
    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");
  }

  // 5. Generar blob final
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};