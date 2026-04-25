const servicios = [
  {
    nombre: "Landing page profesional",
    descripcion: "Página principal optimizada para captar clientes con WhatsApp, llamada directa y textos comerciales.",
    precio: 500
  },
  {
    nombre: "Página web completa",
    descripcion: "Web con varias secciones o páginas: inicio, servicios, contacto, zonas de trabajo y estructura profesional.",
    precio: 800
  },
  {
    nombre: "Google Business Profile",
    descripcion: "Optimización de ficha de Google Business: descripción, servicios, fotos, publicaciones y estructura local.",
    precio: 200
  },
  {
    nombre: "SEO local inicial",
    descripcion: "Optimización básica para aparecer en búsquedas locales relacionadas con el servicio y la ciudad.",
    precio: 300
  },
  {
    nombre: "Hosting y dominio anual",
    descripcion: "Configuración inicial de dominio, hosting, SSL y publicación de la web.",
    precio: 150
  },
  {
    nombre: "Integración WhatsApp y llamadas",
    descripcion: "Botones directos de WhatsApp, llamada, mensajes preparados y llamadas a la acción.",
    precio: 80
  },
  {
    nombre: "Alta en Google Search Console",
    descripcion: "Alta de la web en Google Search Console para facilitar la indexación y seguimiento.",
    precio: 90
  },
  {
    nombre: "Textos SEO profesionales",
    descripcion: "Redacción de textos orientados a captar clientes y mejorar el posicionamiento local.",
    precio: 180
  },
  {
    nombre: "Mantenimiento mensual recomendado",
    descripcion: "Cambios, mejoras, publicaciones, revisión de ficha, pequeños ajustes y seguimiento.",
    precio: 120
  }
];

const contenedor = document.getElementById("servicios");
const totalTexto = document.getElementById("total");
const descuentoInput = document.getElementById("descuento");

function pintarServicios() {
  servicios.forEach((servicio, index) => {
    const div = document.createElement("div");
    div.className = "servicio";

    div.innerHTML = `
      <label>
        <input type="checkbox" value="${index}" onchange="calcularTotal()">
        <span>
          <strong>${servicio.nombre}</strong><br>
          <small>${servicio.descripcion}</small>
        </span>
      </label>
      <span class="precio">${servicio.precio} €</span>
    `;

    contenedor.appendChild(div);
  });
}

function obtenerSeleccionados() {
  const checks = document.querySelectorAll(".servicio input:checked");
  return Array.from(checks).map(check => servicios[check.value]);
}

function calcularTotal() {
  const seleccionados = obtenerSeleccionados();
  const subtotal = seleccionados.reduce((suma, servicio) => suma + servicio.precio, 0);
  const descuento = Number(descuentoInput.value) || 0;
  const total = Math.max(subtotal - descuento, 0);

  totalTexto.textContent = total + " €";
  return { subtotal, descuento, total, seleccionados };
}

descuentoInput.addEventListener("input", calcularTotal);

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const cliente = document.getElementById("cliente").value || "Cliente sin indicar";
  const negocio = document.getElementById("negocio").value || "Negocio sin indicar";
  const ciudad = document.getElementById("ciudad").value || "Ciudad sin indicar";
  const telefono = document.getElementById("telefono").value || "Teléfono sin indicar";
  const observaciones = document.getElementById("observaciones").value || "Sin observaciones adicionales.";

  const datos = calcularTotal();

  if (datos.seleccionados.length === 0) {
    alert("Selecciona al menos un servicio.");
    return;
  }

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("PRESUPUESTO PROFESIONAL", 20, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Servicios de página web, visibilidad local y captación de clientes", 20, y);

  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Datos del cliente", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${cliente}`, 20, y);
  y += 7;
  doc.text(`Negocio: ${negocio}`, 20, y);
  y += 7;
  doc.text(`Ciudad: ${ciudad}`, 20, y);
  y += 7;
  doc.text(`Teléfono: ${telefono}`, 20, y);

  y += 15;
  doc.setFont("helvetica", "bold");
  doc.text("Servicios incluidos", 20, y);

  y += 10;

  datos.seleccionados.forEach(servicio => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`${servicio.nombre} - ${servicio.precio} €`, 20, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    const lineas = doc.splitTextToSize(servicio.descripcion, 165);
    doc.text(lineas, 20, y);
    y += lineas.length * 6 + 5;
  });

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text(`Subtotal: ${datos.subtotal} €`, 20, y);
  y += 8;
  doc.text(`Descuento aplicado: ${datos.descuento} €`, 20, y);
  y += 8;
  doc.setFontSize(16);
  doc.text(`TOTAL PRESUPUESTO: ${datos.total} €`, 20, y);

  y += 15;
  doc.setFontSize(12);
  doc.text("Observaciones", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  const obs = doc.splitTextToSize(observaciones, 165);
  doc.text(obs, 20, y);

  y += obs.length * 6 + 15;

  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Condiciones generales", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  const condiciones = [
    "El presupuesto incluye los servicios seleccionados en este documento.",
    "Cualquier servicio adicional no incluido podrá presupuestarse aparte.",
    "Los plazos dependerán de la entrega de textos, imágenes y accesos necesarios.",
    "El objetivo del trabajo es mejorar la presencia online, la imagen profesional y la captación de clientes."
  ];

  condiciones.forEach(texto => {
    const lineas = doc.splitTextToSize("- " + texto, 165);
    doc.text(lineas, 20, y);
    y += lineas.length * 6;
  });

  const nombreArchivo = `presupuesto-${negocio.toLowerCase().replaceAll(" ", "-")}.pdf`;
  doc.save(nombreArchivo);
}

pintarServicios();
calcularTotal();
