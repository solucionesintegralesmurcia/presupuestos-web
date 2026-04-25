const servicios = [
  { nombre: "Landing page profesional", precio: 500, tipo: "unico" },
  { nombre: "Página web completa", precio: 800, tipo: "unico" },
  { nombre: "Google Business Profile", precio: 200, tipo: "unico" },
  { nombre: "SEO local inicial", precio: 300, tipo: "unico" },
  { nombre: "Hosting y dominio anual", precio: 150, tipo: "unico" },
  { nombre: "WhatsApp + llamadas", precio: 80, tipo: "unico" },
  { nombre: "Textos SEO profesionales", precio: 180, tipo: "unico" },
  { nombre: "Mantenimiento mensual", precio: 120, tipo: "mensual" }
];

const contenedor = document.getElementById("servicios");

function pintarServicios() {
  contenedor.innerHTML = "";

  servicios.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "servicio";

    div.innerHTML = `
      <label>
        <input type="checkbox" value="${i}" onchange="calcular()">
        ${s.nombre}
      </label>
      <strong>${s.precio} €</strong>
    `;

    contenedor.appendChild(div);
  });
}

function aplicarPack(tipo) {
  document.querySelectorAll(".servicio input").forEach(c => c.checked = false);

  if (tipo === "basico") marcar([0, 5]);
  if (tipo === "local") marcar([0, 2, 3, 5]);
  if (tipo === "completo") marcar([1, 2, 3, 4, 5, 6, 7]);

  calcular();
}

function marcar(indices) {
  const checks = document.querySelectorAll(".servicio input");
  indices.forEach(i => checks[i].checked = true);
}

function calcular() {
  let subtotal = 0;
  let mensual = 0;

  document.querySelectorAll(".servicio input:checked").forEach(c => {
    const s = servicios[c.value];

    if (s.tipo === "mensual") {
      mensual += s.precio;
    } else {
      subtotal += s.precio;
    }
  });

  const descuento = Number(document.getElementById("descuento").value) || 0;
  const iva = Number(document.getElementById("iva").value) || 0;

  let total = subtotal - descuento;
  total = Math.max(total, 0);

  if (iva > 0) {
    total = total + (total * iva / 100);
  }

  document.getElementById("subtotal").textContent = subtotal + " €";
  document.getElementById("total").textContent = total.toFixed(2) + " €";
  document.getElementById("mensual").textContent = mensual + " €/mes";

  return { subtotal, descuento, iva, total, mensual };
}

document.getElementById("descuento").addEventListener("input", calcular);
document.getElementById("iva").addEventListener("change", calcular);

function datosFormulario() {
  return {
    cliente: document.getElementById("cliente").value || "Cliente sin indicar",
    negocio: document.getElementById("negocio").value || "Negocio sin indicar",
    ciudad: document.getElementById("ciudad").value || "Ciudad sin indicar",
    telefono: document.getElementById("telefono").value || "",
    observaciones: document.getElementById("observaciones").value || "Sin observaciones adicionales."
  };
}

function serviciosSeleccionados() {
  return Array.from(document.querySelectorAll(".servicio input:checked")).map(c => servicios[c.value]);
}

function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const datos = datosFormulario();
  const calculo = calcular();
  const seleccionados = serviciosSeleccionados();

  if (seleccionados.length === 0) {
    alert("Selecciona al menos un servicio.");
    return;
  }

  let y = 20;

  const logo = new Image();
  logo.src = "logo.png";

  logo.onload = function () {
    doc.addImage(logo, "PNG", 20, 12, 35, 20);
    crearContenidoPDF(doc, datos, calculo, seleccionados, y);
  };

  logo.onerror = function () {
    crearContenidoPDF(doc, datos, calculo, seleccionados, y);
  };
}

function crearContenidoPDF(doc, datos, calculo, seleccionados, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PRESUPUESTO PROFESIONAL", 65, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Web · Google Business · SEO Local · Captación de clientes", 65, y);

  y += 18;

  doc.setDrawColor(15, 122, 79);
  doc.setLineWidth(0.8);
  doc.line(20, y, 190, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Datos del cliente", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${datos.cliente}`, 20, y);
  y += 7;
  doc.text(`Negocio: ${datos.negocio}`, 20, y);
  y += 7;
  doc.text(`Ciudad: ${datos.ciudad}`, 20, y);
  y += 7;
  doc.text(`Teléfono: ${datos.telefono}`, 20, y);

  y += 14;

  doc.setFont("helvetica", "bold");
  doc.text("Servicios incluidos", 20, y);

  y += 10;

  seleccionados.forEach(s => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "normal");
    doc.text(`- ${s.nombre} (${s.precio} €)`, 20, y);
    y += 7;
  });

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Resumen económico", 20, y);

  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  doc.text(`Precio normal: ${calculo.subtotal} €`, 20, y);
  doc.line(50, y - 1, 78, y - 1);

  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 122, 79);
  doc.text(`Precio oferta: ${calculo.total.toFixed(2)} €`, 20, y);

  y += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(`Descuento aplicado: ${calculo.descuento} €`, 20, y);

  y += 8;
  doc.text(`IVA aplicado: ${calculo.iva}%`, 20, y);

  y += 8;
  doc.text(`Mantenimiento mensual recomendado: ${calculo.mensual} €/mes`, 20, y);

  y += 14;

  doc.setFont("helvetica", "bold");
  doc.text("Observaciones", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  const obs = doc.splitTextToSize(datos.observaciones, 165);
  doc.text(obs, 20, y);

  y += obs.length * 6 + 12;

  doc.setFont("helvetica", "bold");
  doc.text("Condiciones", 20, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("- Presupuesto válido durante 15 días.", 20, y);
  y += 6;
  doc.text("- Forma de pago recomendada: 50% al inicio y 50% a la entrega.", 20, y);
  y += 6;
  doc.text("- Servicios adicionales no incluidos se presupuestarán aparte.", 20, y);

  const archivo = `presupuesto-${datos.negocio.toLowerCase().replaceAll(" ", "-")}.pdf`;
  doc.save(archivo);
}

function enviarWhatsApp() {
  const datos = datosFormulario();
  const calculo = calcular();
  const seleccionados = serviciosSeleccionados();

  if (!datos.telefono) {
    alert("Introduce el teléfono del cliente.");
    return;
  }

  const listaServicios = seleccionados.map(s => `- ${s.nombre}`).join("%0A");

  const mensaje = `Hola ${datos.cliente}, te paso el resumen del presupuesto para ${datos.negocio}.%0A%0AServicios incluidos:%0A${listaServicios}%0A%0APrecio normal: ${calculo.subtotal} €%0APrecio oferta: ${calculo.total.toFixed(2)} €%0AMantenimiento recomendado: ${calculo.mensual} €/mes%0A%0AEl presupuesto tiene una validez de 15 días.`;

  const telefonoLimpio = datos.telefono.replace(/\D/g, "");
  window.open(`https://wa.me/34${telefonoLimpio}?text=${mensaje}`, "_blank");
}

function guardarCliente() {
  const datos = datosFormulario();

  let clientes = JSON.parse(localStorage.getItem("clientesPresupuestos")) || [];
  clientes.push(datos);

  localStorage.setItem("clientesPresupuestos", JSON.stringify(clientes));
  pintarClientes();

  alert("Cliente guardado.");
}

function pintarClientes() {
  const caja = document.getElementById("clientesGuardados");
  const clientes = JSON.parse(localStorage.getItem("clientesPresupuestos")) || [];

  caja.innerHTML = "";

  clientes.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "cliente-card";

    div.innerHTML = `
      <div>
        <strong>${c.negocio}</strong><br>
        <small>${c.cliente} · ${c.ciudad} · ${c.telefono}</small>
      </div>
      <button onclick="cargarCliente(${index})">Cargar</button>
    `;

    caja.appendChild(div);
  });
}

function cargarCliente(index) {
  const clientes = JSON.parse(localStorage.getItem("clientesPresupuestos")) || [];
  const c = clientes[index];

  document.getElementById("cliente").value = c.cliente;
  document.getElementById("negocio").value = c.negocio;
  document.getElementById("ciudad").value = c.ciudad;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("observaciones").value = c.observaciones;
}

pintarServicios();
calcular();
pintarClientes();
