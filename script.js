const servicios = [
{nombre:"Landing page", precio:500, tipo:"unico"},
{nombre:"Web completa", precio:800, tipo:"unico"},
{nombre:"Google Business", precio:200, tipo:"unico"},
{nombre:"SEO local", precio:300, tipo:"unico"},
{nombre:"Hosting anual", precio:150, tipo:"unico"},
{nombre:"WhatsApp + llamadas", precio:80, tipo:"unico"},
{nombre:"Textos SEO", precio:180, tipo:"unico"},
{nombre:"Mantenimiento mensual", precio:120, tipo:"mensual"}
];

const contenedor = document.getElementById("servicios");

function pintar() {
servicios.forEach((s,i)=>{
const div=document.createElement("div");
div.className="servicio";
div.innerHTML=`
<label>
<input type="checkbox" value="${i}" onchange="calcular()">
${s.nombre}
</label>
<span>${s.precio} €</span>
`;
contenedor.appendChild(div);
});
}

function aplicarPack(tipo){
document.querySelectorAll("input[type=checkbox]").forEach(c=>c.checked=false);

if(tipo==="basico"){
marcar([0,5]);
}

if(tipo==="local"){
marcar([0,2,3]);
}

if(tipo==="completo"){
marcar([1,2,3,4,6,7]);
}

calcular();
}

function marcar(indices){
indices.forEach(i=>{
document.querySelectorAll("input")[i+4].checked=true;
});
}

function calcular(){

let subtotal=0;
let mensual=0;

document.querySelectorAll(".servicio input:checked").forEach(c=>{
const s=servicios[c.value];
if(s.tipo==="mensual"){
mensual+=s.precio;
}else{
subtotal+=s.precio;
}
});

const descuento=Number(document.getElementById("descuento").value)||0;
const iva=Number(document.getElementById("iva").value);

let total=subtotal-descuento;
if(iva>0){
total=total+(total*iva/100);
}

document.getElementById("subtotal").textContent=subtotal+" €";
document.getElementById("total").textContent=Math.max(total,0)+" €";
document.getElementById("mensual").textContent=mensual+" €/mes";

return {subtotal,total,mensual,descuento};
}

function generarPDF(){

const { jsPDF } = window.jspdf;
const doc=new jsPDF();

const cliente=document.getElementById("cliente").value;
const negocio=document.getElementById("negocio").value;

const datos=calcular();

let y=20;

doc.setFontSize(18);
doc.text("PRESUPUESTO",20,y);

y+=10;
doc.setFontSize(11);
doc.text("Soluciones web y captación de clientes",20,y);

y+=15;
doc.text("Cliente: "+cliente,20,y);
y+=6;
doc.text("Negocio: "+negocio,20,y);

y+=15;
doc.text("Servicios incluidos:",20,y);

y+=10;

document.querySelectorAll(".servicio input:checked").forEach(c=>{
const s=servicios[c.value];
doc.text("- "+s.nombre+" ("+s.precio+"€)",20,y);
y+=6;
});

y+=10;

doc.setFontSize(12);
doc.text("Precio real: "+datos.subtotal+" €",20,y);
y+=8;
doc.text("Precio final: "+datos.total+" €",20,y);
y+=8;
doc.text("Mantenimiento: "+datos.mensual+" €/mes",20,y);

y+=15;
doc.text("Condiciones:",20,y);

y+=8;
doc.setFontSize(10);
doc.text("- Presupuesto válido 15 días",20,y);
y+=6;
doc.text("- 50% inicio / 50% entrega",20,y);

doc.save("presupuesto-"+negocio+".pdf");
}

pintar();
calcular();
