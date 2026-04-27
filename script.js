const servicios = [
  {
    nombre: "Web profesional",
    precio: 497,
    tipo: "unico",
    descripcion: "Web profesional. Diseño claro, rápido y adaptado a móvil."
  },
  {
    nombre: "Web completa profesional",
    precio: 897,
    tipo: "unico",
    descripcion: "Web con varias secciones para presentar mejor el negocio, explicar servicios y transmitir más confianza al cliente."
  },
  {
    nombre: "Google Business optimizado",
    precio: 147,
    tipo: "unico",
    descripcion: "Configuración y mejora de la ficha de Google para aparecer mejor en búsquedas locales y Google Maps." 
  },
  {
    nombre: "SEO local inicial",
    precio: 247,
    tipo: "unico",
    descripcion: "Optimización básica para que Google entienda tu negocio, tu zona y los servicios que ofreces."
  },
  {
    nombre: "Hosting anual",
    precio: 97,
    tipo: "unico",
    descripcion: "Alojamiento donde estará publicada la web para que funcione online durante todo el año."
  },
  {
    nombre: "Dominio anual",
    precio: 47,
    tipo: "unico",
    descripcion: "Nombre profesional de la web, por ejemplo tunegocio.com, para dar mejor imagen y facilitar que te encuentren."
  },
  {
    nombre: "WhatsApp + llamadas directas",
    precio: 67,
    tipo: "unico",
    descripcion: "Botones de contacto directo para que el cliente pueda llamar o escribir por WhatsApp en un solo clic."
  },
  {
    nombre: "Textos SEO optimizados",
    precio: 147,
    tipo: "unico",
    descripcion: "Textos preparados para explicar el servicio, captar clientes y ayudar al posicionamiento en Google."
  },
  {
    nombre: "Mantenimiento web",
    precio: 97,
    tipo: "mensual",
    descripcion: "Servicio mensual para mantener la web actualizada, realizar pequeños cambios y revisar que todo funcione correctamente."
  },
  {
    nombre: "Blog SEO inicial",
    precio: 197,
    tipo: "unico",
    descripcion: "Contenido inicial pensado para atraer visitas desde Google y mejorar la visibilidad del negocio."
  },
  {
    nombre: "Logo profesional básico",
    precio: 67,
    tipo: "unico",
    descripcion: "Diseño de un logotipo sencillo y profesional para mejorar la imagen del negocio."
  },
  {
    nombre: "Pack Estudio SEO + Dominio",
    precio: 197,
    tipo: "unico",
    descripcion: "Estudio de palabras clave y recomendación de dominio estratégico para empezar la web con mejor enfoque."
  },
  {
    nombre: "Configuración en Google Search Console",
    precio: 57,
    tipo: "unico",
    descripcion: "Alta y configuración de la web en Google para facilitar su indexación y seguimiento básico."
  },
  {
    nombre: "Mapa de localización en la web",
    precio: 67,
    tipo: "unico",
    descripcion: "Inserción de mapa de localización para que el cliente vea fácilmente dónde está el negocio o zona de servicio."
  }
];

const contenedor = document.getElementById("servicios");

function pintarServicios() {
  contenedor.innerHTML = "";

  servicios.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "servicio";

    div.innerHTML = `
      <div class="servicio-info">
        <label>
          <input type="checkbox" class="servicio-check" value="${i}" onchange="calcular()">
          ${s.nombre}
        </label>

        <details class="detalle-servicio">
          <summary>Ver detalle</summary>
          <p>${s.descripcion}</p>
        </details>

        <label class="gratis-linea">
          <input type="checkbox" class="gratis-check" value="${i}" onchange="calcular()">
          Añadir gratis al presupuesto
        </label>
      </div>

      <strong>${s.precio} ${s.tipo === "mensual" ? "€/mes" : "€"}</strong>
    `;

    contenedor.appendChild(div);
  });
}

function aplicarPack(tipo) {
  document.querySelectorAll(".servicio-check").forEach(c => c.checked = false);
  document.querySelectorAll(".gratis-check").forEach(c => c.checked = false);
  document.querySelectorAll(".extra-btn").forEach(b => b.classList.remove("activo"));

  if (tipo === "basico") marcarServicios([0, 6, 11]);
  if (tipo === "local") marcarServicios([0, 2, 3, 6, 11]);
  if (tipo === "completo") marcarServicios([1, 2, 3, 6, 7, 11]);

  calcular();
}

function marcarServicios(indices) {
  const checks = document.querySelectorAll(".servicio-check");
  indices.forEach(i => {
    if (checks[i]) checks[i].checked = true;
  });
}

function sincronizarExtras() {
  document.querySelectorAll(".extra-btn").forEach(boton => {
    boton.addEventListener("click", () => {
      const index = Number(boton.dataset.index);
      const checkServicio = document.querySelector(`.servicio-check[value="${index}"]`);

      boton.classList.toggle("activo");

      if (checkServicio) {
        checkServicio.checked = boton.classList.contains("activo");
      }

      calcular();
    });
  });
}

function calcular() {
  let precioHabitual = 0;
  let subtotal = 0;
  let mensualHabitual = 0;
  let mensual = 0;

  document.querySelectorAll(".servicio-check:checked").forEach(c => {
    const index = Number(c.value);
    const s = servicios[index];
    const gratis = document.querySelector(`.gratis-check[value="${index}"]`)?.checked;

    if (s.tipo === "mensual") {
      mensualHabitual += s.precio;
      if (!gratis) mensual += s.precio;
    } else {
      precioHabitual += s.precio;
      if (!gratis) subtotal += s.precio;
    }
  });

  const descuento = Number(document.getElementById("descuento").value) || 0;
  const iva = Number(document.getElementById("iva").value) || 0;

  let total = subtotal - descuento;
  total = Math.max(total, 0);

  if (iva > 0) {
    total = total + (total * iva / 100);
  }

  document.getElementById("subtotal").textContent = precioHabitual + " €";
  document.getElementById("total").textContent = total.toFixed(2) + " €";
  document.getElementById("mensual").textContent = mensual + " €/mes";

  return {
    subtotal: precioHabitual,
    descuento,
    iva,
    total,
    mensual,
    mensualHabitual
  };
}

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
  return Array.from(document.querySelectorAll(".servicio-check:checked"))
    .map(c => {
      const index = Number(c.value);
      const servicio = servicios[index];
      const gratis = document.querySelector(`.gratis-check[value="${index}"]`)?.checked || false;

      return {
        ...servicio,
        gratis
      };
    });
}

function generarNumeroPresupuesto() {
  let numero = Number(localStorage.getItem("numeroPresupuesto")) || 1;
  const codigo = "P-2026-" + String(numero).padStart(3, "0");
  localStorage.setItem("numeroPresupuesto", numero + 1);
  return codigo;
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

  const numeroPresupuesto = generarNumeroPresupuesto();
  const fecha = new Date().toLocaleDateString("es-ES");

  const logo = new Image();
  logo.src = "logo.png";

  logo.onload = function () {
    crearPDFPremium(doc, datos, calculo, seleccionados, numeroPresupuesto, fecha, logo);
  };

  logo.onerror = function () {
    crearPDFPremium(doc, datos, calculo, seleccionados, numeroPresupuesto, fecha, null);
  };
}

function crearPDFPremium(doc, datos, calculo, seleccionados, numeroPresupuesto, fecha, logo) {
  let y = 12;

  // CABECERA
  doc.setFillColor(24, 32, 51);
  doc.rect(0, 0, 210, 34, "F");

  if (logo) {
    doc.addImage(logo, "PNG", 14, 8, 32, 15);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("PRESUPUESTO WEB PERSONALIZADO", 55, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Diseño web · Google Business · SEO local · Captación de clientes", 55, 22);

  doc.setFontSize(7);
  doc.text(`Nº: ${numeroPresupuesto}`, 162, 12);
  doc.text(`Fecha: ${fecha}`, 162, 19);

  y = 43;

  // DATOS CLIENTE
  doc.setTextColor(24, 32, 51);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, y, 180, 26, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Datos del cliente", 20, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Cliente: ${datos.cliente}`, 20, y + 16);
  doc.text(`Negocio: ${datos.negocio}`, 20, y + 22);
  doc.text(`Ciudad: ${datos.ciudad}`, 115, y + 16);
  doc.text(`Teléfono: ${datos.telefono}`, 115, y + 22);

  y += 38;

  // SERVICIOS
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Servicios incluidos", 15, y);

  y += 7;

  seleccionados.forEach(s => {
    doc.setFillColor(250, 251, 252);
    doc.roundedRect(15, y, 180, 13, 3, 3, "F");

    // Nombre
    doc.setTextColor(24, 32, 51);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(s.nombre, 20, y + 5);

    // Precio en columna derecha
    doc.setFontSize(8);
    doc.text(`${s.precio} ${s.tipo === "mensual" ? "€/mes" : "€"}`, 164, y + 5);

    // Gratis debajo del precio
    if (s.gratis) {
      doc.setTextColor(15, 122, 79);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("GRATIS", 164, y + 10);
      doc.setTextColor(24, 32, 51);
    }

    y += 8;

    // Descripción
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    const descripcionLineas = doc.splitTextToSize(s.descripcion || "", 135);
    doc.text(descripcionLineas, 20, y);

    y += descripcionLineas.length * 3.3 + 5;
  });

  y += 2;

  // RESUMEN ECONÓMICO
  doc.setFillColor(15, 122, 79);
  doc.roundedRect(15, y, 180, 34, 5, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Resumen económico", 22, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const textoHabitual = `Precio habitual: ${calculo.subtotal} €`;
  doc.text(textoHabitual, 22, y + 18);

  const anchoTexto = doc.getTextWidth(textoHabitual);
  doc.setDrawColor(255, 255, 255);
  doc.line(22, y + 17, 22 + anchoTexto, y + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(`PRECIO FINAL HOY: ${Math.round(calculo.total)} €`, 22, y + 29);

  doc.setFontSize(8);
  doc.text(`Mantenimiento: ${calculo.mensual} €/mes`, 132, y + 29);

  y += 42;

  // DETALLES
  doc.setTextColor(24, 32, 51);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Detalles", 15, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Validez del presupuesto: 15 días", 15, y);

  y += 9;

  // OBSERVACIONES
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Observaciones", 15, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const obs = doc.splitTextToSize(datos.observaciones, 175);
  doc.text(obs, 15, y);

  y += obs.length * 4 + 8;



  // PIE
  doc.setFillColor(24, 32, 51);
  doc.rect(0, 284, 210, 13, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text("Diseño Web Murcia · www.disenowebmurcia.es · Tel. 639311161", 15, 292);

  const archivo = `presupuesto-${datos.negocio.toLowerCase().replaceAll(" ", "-")}.pdf`;
  doc.save(archivo);
}
function generarYEnviar() {
  generarPDF();

  setTimeout(() => {
    enviarWhatsApp();
  }, 1200);
}

function enviarWhatsApp() {
  const datos = datosFormulario();
  const calculo = calcular();
  const seleccionados = serviciosSeleccionados();

  if (!datos.telefono) {
    alert("Introduce el teléfono del cliente.");
    return;
  }

  const listaServicios = seleccionados.map(s => `• ${s.nombre}`).join("%0A");
  const telefono = datos.telefono.replace(/\D/g, "");

  const mensaje =
`Hola ${datos.cliente},

Te acabo de preparar el presupuesto para ${datos.negocio}.

Servicios incluidos:
${listaServicios}

Precio habitual: ${calculo.subtotal} €
Oferta final: ${calculo.total.toFixed(2)} €
Mantenimiento recomendado: ${calculo.mensual} €/mes

Ahora te adjunto el PDF con todos los detalles.`;

  window.open(`https://wa.me/34${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
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

document.getElementById("descuento").addEventListener("input", calcular);
document.getElementById("iva").addEventListener("change", calcular);

pintarServicios();
sincronizarExtras();
calcular();
pintarClientes();
