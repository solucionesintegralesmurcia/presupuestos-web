const servicios = [
  { nombre: "Landing page", precio: 500, tipo: "unico" },
  { nombre: "Web completa", precio: 800, tipo: "unico" },
  { nombre: "Google Business", precio: 200, tipo: "unico" },
  { nombre: "SEO local", precio: 300, tipo: "unico" },
  { nombre: "Hosting anual", precio: 150, tipo: "unico" },
  { nombre: "WhatsApp + llamadas", precio: 80, tipo: "unico" },
  { nombre: "Textos SEO", precio: 180, tipo: "unico" },
  { nombre: "Mantenimiento mensual", precio: 120, tipo: "mensual" }
];

const contenedor = document.getElementById("servicios");

function pintarServicios() {
  servicios.forEach((s,i)=>{
    const div=document.createElement("div");
    div.className="servicio";

    div.innerHTML=`
      <label>
        <input type="checkbox" value="${i}" onchange="calcular()">
        ${s.nombre}
      </label>
      <strong>${s.precio} €</strong>
    `;

    contenedor.appendChild(div);
  });
}

function aplicarPack(tipo){
  document.querySelectorAll(".servicio input").forEach(c=>c.checked=false);

  if(tipo==="basico") marcar([0,5]);
  if(tipo==="local") marcar([0,2,3,5]);
  if(tipo==="completo") marcar([1,2,3,4,5,6,7]);

  calcular();
}

function marcar(arr){
  const checks=document.querySelectorAll(".servicio input");
  arr.forEach(i=>checks[i].checked=true);
}

function calcular(){
  let subtotal=0;
  let mensual=0;

  document.querySelectorAll(".servicio input:checked").forEach(c=>{
    const s=servicios[c.value];
    if(s.tipo==="mensual") mensual+=s.precio;
    else subtotal+=s.precio;
  });

  const descuento=Number(document.getElementById("descuento").value)||0;
  const iva=Number(document.getElementById("iva").value);

  let total=subtotal-descuento;
  if(iva>0) total=total+(total*iva/100);

  document.getElementById("subtotal").textContent=subtotal+" €";
  document.getElementById("total").textContent=total.toFixed(2)+" €";
  document.getElementById("mensual").textContent=mensual+" €/mes";

  return {subtotal,total,mensual};
}

function generarPDF(){
  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();

  const negocio=document.getElementById("negocio").value || "presupuesto";
  const datos=calcular();

  doc.text("PRESUPUESTO",20,20);
  doc.text("www.disenowebmurcia.es",20,30);
  doc.text("Tel: 639311161",20,36);

  doc.text("Precio habitual: "+datos.subtotal+" €",20,60);
  doc.text("OFERTA FINAL: "+datos.total.toFixed(2)+" €",20,70);
  doc.text("Mantenimiento: "+datos.mensual+" €/mes",20,80);

  doc.save("presupuesto-"+negocio+".pdf");
}

function generarYEnviar(){
  generarPDF();
  setTimeout(()=>{enviarWhatsApp()},1200);
}

function enviarWhatsApp(){
  const telefono=document.getElementById("telefono").value.replace(/\D/g,"");
  if(!telefono) return alert("Falta teléfono");

  window.open(`https://wa.me/34${telefono}?text=Te envío el presupuesto ahora mismo`,"_blank");
}

pintarServicios();
calcular();
