import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import logotipo from "@/assets/png/logov1-removebg-preview.png";

const toBase64 = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generarPDFMasivoInformativo = async (asistenciasPorTrabajador) => {
  const imageBase64 = await toBase64("/images/logo_azul.png");
  const marcateLogoBase64 = await toBase64(logotipo);
  const resultados = [];
  const batchSize = 5;

  for (let i = 0; i < asistenciasPorTrabajador.length; i += batchSize) {
    const batch = asistenciasPorTrabajador.slice(i, i + batchSize);

    const resultadosBatch = await Promise.all(
      batch.map(async (trabajador) => {
        try {
          const { usuario, asistencias } = trabajador;
          if (!usuario || !usuario.nombres || !Array.isArray(asistencias)) {
            console.warn("Trabajador con datos incompletos o asistencias inválidas:", trabajador);
            return null;
          }

          const doc = new jsPDF();

          // HEADER
          doc.setFontSize(10);
          doc.addImage(imageBase64, "JPEG", 14, 5, 22, 10);
          doc.setFont("helvetica", "bold");
          doc.text("REGISTRO DE CONTROL DE ASISTENCIA", 105, 12, { align: "center" });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text("DATOS DE LA EMPRESA", 14, 20);
          doc.setFont("helvetica", "normal");
          doc.text(`Razón Social: ${usuario.filial?.razon_social ?? "-"}`, 14, 26);
          doc.text(`RUC: ${usuario.filial?.ruc ?? "-"}`, 14, 30);

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
            styles: { fontSize: 8, cellPadding: 1.5 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
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

          const finalY = doc.lastAutoTable.finalY + 10;
          doc.setFontSize(7);
          doc.setTextColor(80);
          doc.text(
            "Conforme al Decreto Legislativo N.º 728, el trabajador certifica mediante su firma que este reporte refleja fielmente su jornada laboral.",
            14,
            finalY,
            { maxWidth: 180, align: "justify" }
          );

          doc.setFontSize(8);
          doc.setTextColor(0);
          doc.text("Firma del Trabajador: __________________________", 14, finalY + 30);
          doc.text("Firma del Supervisor: __________________________", 110, finalY + 30);

          doc.setFont("helvetica", "italic");
          doc.setFontSize(6);
          doc.setTextColor(100);
          doc.text(
            "Ante cualquier duda o consulta técnica relacionada a este documento, comuníquese con la Oficina de Desarrollo Informático del Grupo INNOVA.",
            20,
            finalY + 45
          );
          doc.text("Todos los derechos reservados © Grupo INNOVA - Sistema Marcate+", 20, finalY + 50);
          doc.addImage(marcateLogoBase64, "PNG", 10, finalY + 40, 10, 10);

          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);

          return {
            usuario_id: usuario.id,
            trabajador: `${usuario.nombres} ${usuario.apellidos}`,
            tipo_documento: usuario.tipo_documento,
            dni: usuario.dni,
            cargo: usuario.cargo,
            filial: usuario.filial,
            asistencias,
            url: pdfUrl,
            hash: "INFORMATIVO",
          };
        } catch (err) {
          console.error("Error generando PDF informativo:", err);
          return null;
        }
      })
    );

    resultados.push(...resultadosBatch.filter(Boolean));
  }

  return resultados;
};