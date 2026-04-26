const servicios = [
  {
    nombre: "Web básica para captar clientes",
    precio: 497,
    tipo: "unico",
    descripcion: "Página profesional sencilla para empezar a recibir contactos. Incluye estructura clara, diseño adaptado a móvil y botones de contacto directo."
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
  document.querySelectorAll(".extra-btn").forEach(b => b.classList.remove("activo"));

  if (tipo === "basico") marcarServicios([0, 5]);
  if (tipo === "local") marcarServicios([0, 2, 3, 5]);
  if (tipo === "completo") marcarServicios([1, 2, 3, 4, 5, 6, 7]);

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

function serviciosSeleccionados() {
  return Array.from(document.querySelectorAll(".servicio-check:checked"))
    .map(c => {
      const index = Number(c.value);
      const servicio = servicios[index];
      const gratis = document.querySelector(`.gratis-check[value="${index}"]`)?.checked || false;

      return {
        ...servicio,
        gratis: gratis
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
  let y = 18;

  doc.setFillColor(24, 32, 51);
doc.rect(0, 0, 210, 42, "F");

if (logo) {
  doc.addImage(logo, "PNG", 14, 9, 38, 18);
}

doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.text("PRESUPUESTO PROFESIONAL", 62, 15);

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("Diseño web · Google Business · SEO local · Captación de clientes", 62, 24);

doc.setFontSize(8);
doc.text(`Nº: ${numeroPresupuesto}`, 160, 14);
doc.text(`Fecha: ${fecha}`, 160, 21);

  y = 55;

  doc.setTextColor(24, 32, 51);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, y, 180, 36, 5, 5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Datos del cliente", 22, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Cliente: ${datos.cliente}`, 22, y + 19);
  doc.text(`Negocio: ${datos.negocio}`, 22, y + 27);
  doc.text(`Ciudad: ${datos.ciudad}`, 112, y + 19);
  doc.text(`Teléfono: ${datos.telefono}`, 112, y + 27);

  y += 52;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Servicios incluidos", 15, y);

  y += 9;

  seleccionados.forEach(s => {
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(250, 251, 252);
  doc.roundedRect(15, y, 180, 11, 3, 3, "F");

  doc.setTextColor(24, 32, 51);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(s.nombre, 21, y + 7);

  if (s.gratis) {
    doc.text(`${s.precio} ${s.tipo === "mensual" ? "€/mes" : "€"}`, 138, y + 7);

    doc.setTextColor(15, 122, 79);
    doc.text("Incluido gratis", 155, y + 7);
    doc.setTextColor(24, 32, 51);
  } else {
    doc.text(`${s.precio} ${s.tipo === "mensual" ? "€/mes" : "€"}`, 168, y + 7);
  }

  y += 12;

  // 🔥 SOLUCIÓN CLAVE: evitar error si no hay descripción
  if (s.descripcion) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const descripcionLineas = doc.splitTextToSize(s.descripcion, 160);
    doc.text(descripcionLineas, 21, y);

    y += descripcionLineas.length * 5 + 5;
  } else {
    y += 6;
  }
});

  y += 8;

  doc.setFillColor(15, 122, 79);
  doc.roundedRect(15, y, 180, 46, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Resumen económico", 22, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const textoHabitual = `Precio habitual: ${calculo.subtotal} €`;
  doc.text(textoHabitual, 22, y + 23);

  const anchoTexto = doc.getTextWidth(textoHabitual);
  doc.setDrawColor(255, 255, 255);
  doc.line(22, y + 22, 22 + anchoTexto, y + 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(`OFERTA FINAL: ${calculo.total.toFixed(2)} €`, 22, y + 37);

  doc.setFontSize(10);
  doc.text(`Mantenimiento: ${calculo.mensual} €/mes`, 130, y + 37);

  y += 59;

  doc.setTextColor(24, 32, 51);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Detalles", 15, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Descuento aplicado: ${calculo.descuento} €`, 15, y);
  y += 7;
  doc.text(`IVA aplicado: ${calculo.iva}%`, 15, y);
  y += 7;
  doc.text("Validez del presupuesto: 15 días", 15, y);

  y += 13;

  doc.setFont("helvetica", "bold");
  doc.text("Observaciones", 15, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  const obs = doc.splitTextToSize(datos.observaciones, 175);
  doc.text(obs, 15, y);

  y += obs.length * 6 + 12;

  if (y > 225) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Condiciones", 15, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("- Forma de pago recomendada: 50% al inicio y 50% a la entrega.", 15, y);
  y += 6;
  doc.text("- Servicios adicionales no incluidos se presupuestarán aparte.", 15, y);
  y += 6;
  doc.text("- El objetivo es mejorar imagen profesional, visibilidad y captación de clientes.", 15, y);

  y += 20;

  doc.setDrawColor(24, 32, 51);
  doc.line(15, y, 85, y);
  doc.line(115, y, 185, y);

  y += 6;
  doc.setFontSize(9);
  doc.text("Firma del cliente", 30, y);
  doc.text("Firma / sello empresa", 132, y);

  y += 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Datos de contacto", 15, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text("Web: www.disenowebmurcia.es", 15, y);
  y += 6;
  doc.text("Teléfono: 639311161", 15, y);

  doc.setFillColor(24, 32, 51);
  doc.rect(0, 282, 210, 15, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Diseño Web Murcia · www.disenowebmurcia.es · Tel. 639311161", 15, 291);

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

pintarServicios();
sincronizarExtras();
calcular();
pintarClientes();
