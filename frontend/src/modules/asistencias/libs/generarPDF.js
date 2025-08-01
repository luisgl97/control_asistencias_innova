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
      doc.text(`REGISTRO DE CONTROL DE ASISTENCIA`, 40, 12);
      doc.setFontSize(8);
      doc.text(`DATOS DE LA EMPRESA`, 14, 18);
      doc.text(`Nombre o Razón Social: `, 14, 24);
      doc.text(`${usuario.filial_razon_social}`, 50, 24);
      doc.text(`RUC: `, 14, 29);
      doc.text(`${usuario.filial_ruc}`, 25, 29);
      doc.text(`DATOS DEL TRABAJADOR: `, 14, 34);
      doc.text(`Apellidos y nombres: `, 14, 38);
      doc.text(`${usuario.nombres} ${usuario.apellidos}`, 43, 38);

      doc.text(`${usuario.tipo_documento} `, 14, 42);
      doc.text(`${usuario.dni}`, 25, 42);
      doc.text(`Cargo: `, 14, 46);
      doc.text(`${usuario.cargo ? usuario.cargo : "-"}`, 24, 46);
      const tableData = asistencias.map((a) => {
         const fecha = parseISO(a.fecha);
         return [
            format(fecha, "EEEE d 'de' MMMM yyyy", { locale: es }),
            a.hora_ingreso || "-",
            a.hora_inicio_refrigerio || "-",
            a.hora_fin_refrigerio || "-",
            a.hora_salida || "-",
            a.horas_extras?.toString() || "0",
         ];
      });

      autoTable(doc, {
         startY: 50,
         head: [
            [
               "Fecha",
               "Hora\nIngreso",
               "Hora inicio\nrefrigerio",
               "Hora termino\nrefrigerio",
               "Salida",
               "Horas Extras",
            ],
         ],
         body: tableData,
         styles: {
            fontSize: 8,
            cellPadding: 1.5, // menor padding = tabla más compacta
         },
         headStyles: {
            fontSize: 8,
            halign: "center",
            valign: "middle",
         },
         columnStyles: {
            0: { halign: "start", valign: "middle" },
            1: { halign: "center", valign: "middle" },
            2: { halign: "center", valign: "middle" },
            3: { halign: "center", valign: "middle" },
            4: { halign: "center", valign: "middle" },
            5: { halign: "center", valign: "middle" },
            6: { halign: "center", valign: "middle" },
            7: { halign: "center", valign: "middle" },
         },
      });

      // Firmas al final de la página
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.text("Firma del Trabajador: _______________________", 14, finalY);
      doc.text("Firma del Gerente: __________________________", 110, finalY);

      // Salto de página si no es el último
      if (index !== asistenciasPorTrabajador.length - 1) {
         doc.addPage();
      }
   });

   // Descargar PDF
   doc.save("reporte_asistencias.pdf");
};
