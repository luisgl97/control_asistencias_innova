import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = async (asistenciasPorTrabajador) => {
   const doc = new jsPDF();

   const imageUrl = `/images/logo_azul.png`;
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

   asistenciasPorTrabajador.forEach((trabajador, index) => {
      const { usuario, asistencias } = trabajador;

      // Encabezado
      doc.setFontSize(10);
      doc.addImage(imageBase64, "JPEG", 14, 5, 22, 10);
      doc.setFont("helvetica", "bold");
      doc.text(`REGISTRO DE CONTROL DE ASISTENCIA`, 105, 12, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`DATOS DE LA EMPRESA`, 14, 20);
      doc.setFontSize(8);
      doc.text(`RAZÓN SOCIAL: ${usuario.filial_razon_social ?? "No disponible"}`, 14, 26);
      doc.text(`RUC: ${usuario.filial_ruc ?? "No disponible"}`, 14, 30);

      doc.setFontSize(9);
      doc.text(`DATOS DEL TRABAJADOR: `, 14, 38);
      doc.setFontSize(8);
      const nombre_completo = (usuario.apellidos + " " + usuario.nombres);
      doc.text(`APELLIDOS Y NOMBRES: ${nombre_completo.toUpperCase()}`, 14, 44);
      doc.text(`DOCUMENTO DE IDENTIDAD: ${usuario.tipo_documento ?? "-"} ${usuario.dni ?? "-"}`, 14, 48);
      doc.text(`CARGO: ${usuario.cargo || "-"}`, 14, 52);

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
         head: [
            [
               "Fecha",
               "Ingreso",
               "Inicio Refrigerio",
               "Fin Refrigerio",
               "Salida",
               "Horas Extras",
            ],
         ],
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
            valign: "middle",
         },
         columnStyles: {
            0: { halign: "left" },
            1: { halign: "center" },
            2: { halign: "center" },
            3: { halign: "center" },
            4: { halign: "center" },
            5: { halign: "center" },
         },
         didParseCell: function (data) {
            // Marcar en rojo si hay "FALTA"
            if (data.cell.raw === "FALTA") {
               data.cell.styles.textColor = [200, 0, 0];
               data.cell.styles.fontStyle = "bold";
            }
         },
      });

      // Firmas al final de la página
      const finalY = doc.lastAutoTable.finalY + 10;

      const textoLegal =
      "Conforme al Decreto Legislativo N.º 728 y el Decreto Supremo N.º 004-2006-TR, el trabajador certifica mediante su firma y huella que los registros de ingreso, salida, tiempos de refrigerio y horas extras consignados en este reporte son veraces y constituyen evidencia válida del cumplimiento de su jornada laboral.";

      doc.setFontSize(7);
      doc.setTextColor(60, 60, 60);
      doc.text(textoLegal, 14, finalY, {
      maxWidth: 180,
      align: "justify",
      });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text("Firma del Trabajador: __________________________", 14, finalY + 40);
      doc.text("Firma del Supervisor: __________________________", 110, finalY + 40);


      // Salto de página si no es el último
      if (index < asistenciasPorTrabajador.length - 1) {
         doc.addPage();
      }
   });

   // Descargar PDF
   //doc.save("reporte_asistencias.pdf");

   // Retornar el Blob para previsualización
   const pdfBlob = doc.output("blob");
   return URL.createObjectURL(pdfBlob);
};
