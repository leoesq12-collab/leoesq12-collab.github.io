#!/usr/bin/env node
/*
 * Genera todas las páginas HTML del sitio a partir de assets/core.js.
 * Uso: node mascotas/scripts/generar.js
 * Vuelve a ejecutarlo después de editar razas, precios o textos.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const Core = require("../assets/core.js");

const ROOT = path.join(__dirname, "..");
const BASE = "https://leoesq12-collab.github.io/mascotas/";
const SITE = "Cuánto Cuesta Mi Mascota";
const ADSENSE = "ca-pub-6906150555937991";
const MAIN_COUNTRY = "mx";
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = TODAY.slice(0, 4);

// Lo que encarece (o abarata) cada raza. Texto propio por raza = contenido útil y único para Google.
const NOTES = {
  "chihuahua": "Come muy poco, pero es propenso al sarro y la pérdida de dientes: una limpieza dental anual en el veterinario es el gasto que más se olvida.",
  "yorkshire-terrier": "Su pelo crece sin parar, así que la estética cada 4–6 semanas pesa en el presupuesto. También suele necesitar limpiezas dentales.",
  "pomerania": "Necesita cepillado frecuente para evitar nudos y vigilar su salud dental. Algunos desarrollan alopecia X, que requiere tratamiento.",
  "caniche-toy": "No suelta pelo, pero precisamente por eso necesita corte profesional cada 4–6 semanas. Vigila la luxación de rótula, frecuente en tallas mini.",
  "maltes": "El manto blanco requiere baños y cortes regulares y limpieza diaria de lagrimales para evitar manchas e infecciones.",
  "shih-tzu": "Estética mensual y cuidado de ojos (son saltones y se irritan con facilidad). Muchos dueños optan por el corte “cachorro” para ahorrar.",
  "schnauzer-miniatura": "Necesita corte o stripping cada 6–8 semanas. Es sensible a las dietas grasosas (pancreatitis), así que conviene un alimento de buena calidad.",
  "dachshund": "Su columna larga lo hace propenso a hernias discales (IVDD), que pueden requerir cirugía costosa: mantenerlo delgado y evitar saltos es la mejor inversión.",
  "pug": "Raza braquicéfala: puede tener problemas respiratorios, de ojos y de pliegues de piel. Un seguro o fondo de emergencias es muy recomendable.",
  "bulldog-frances": "De las razas más caras en veterinario por su nariz chata (problemas respiratorios), alergias de piel y columna. Presupuesta un fondo de emergencias.",
  "beagle": "Glotón por naturaleza: la obesidad es su riesgo número uno. Medir la comida ahorra dinero y visitas al veterinario. Revisa sus orejas por otitis.",
  "cocker-spaniel": "Sus orejas largas acumulan humedad y son propensas a otitis. Necesita estética cada 6–8 semanas.",
  "border-collie": "Muy activo e inteligente: necesita juguetes de estimulación mental y mucho ejercicio, y come más que un perro de su peso promedio.",
  "husky-siberiano": "Muda masivamente dos veces al año: un buen cepillo deslanador ahorra visitas a la estética. Necesita mucho ejercicio y no tolera bien el calor.",
  "bulldog-ingles": "Probablemente la raza más cara en salud: problemas respiratorios, de piel, articulaciones y ojos. El seguro para mascotas suele valer la pena.",
  "labrador-retriever": "Tiende a la obesidad y a la displasia de cadera y codo. Comida de raza grande medida con báscula y control de peso le ahorran años de gastos.",
  "golden-retriever": "Suelta mucho pelo y necesita cepillado frecuente. Es propenso a displasia y algunos tipos de cáncer: los chequeos anuales son clave.",
  "boxer": "Propenso a problemas cardíacos y tumores con la edad. Muy energético, destruye juguetes baratos: conviene invertir en juguetes resistentes.",
  "pastor-aleman": "La displasia de cadera es frecuente en la raza. Come bastante y suelta pelo todo el año.",
  "rottweiler": "Su tamaño multiplica el gasto en comida y medicamentos (que se dosifican por peso). Vigila sus articulaciones desde cachorro.",
  "gran-danes": "Come muchísimo y todo se dosifica por peso, así que cada tratamiento cuesta más. Riesgo de torsión gástrica: dale varias comidas pequeñas al día.",
  "gato-domestico": "El gato mestizo suele ser el más resistente y económico. Su mayor gasto, además de la comida, es la arena.",
  "siames": "Muy vocal y activo: necesita juego diario. Es propenso a problemas dentales y respiratorios.",
  "persa": "Cepillado diario obligatorio y limpieza de ojos. Raza braquicéfala y con predisposición a enfermedad renal poliquística (PKD).",
  "british-shorthair": "Tranquilo y con tendencia al sobrepeso: mide sus porciones. Pregunta al criador por pruebas de cardiomiopatía hipertrófica (HCM).",
  "bengali": "Extremadamente activo: rascadores, repisas y juguetes no son opcionales. Algunos tienen estómago sensible y requieren alimento premium.",
  "ragdoll": "Pelo semilargo que se enreda poco, pero agradece cepillado semanal. Predisposición a cardiomiopatía hipertrófica (HCM).",
  "maine-coon": "Uno de los gatos más grandes: come más, necesita areneros y rascadores grandes. Vigila HCM y displasia de cadera.",
  "esfinge": "Sin pelo, pero necesita baños semanales para retirar la grasa de la piel y ropa en climas fríos. Come más para mantener su temperatura."
};

const DEFAULT_INPUT = { stage: "adulto", neutered: true, activity: "normal", quality: "media", grooming: true, insurance: false };

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function money(v, c) { return Core.formatMoney(v, c || MAIN_COUNTRY); }
function calcFor(b, country) {
  return Core.calculate(Object.assign({}, DEFAULT_INPUT, { species: b.species, weight: b.weight, coat: b.coat, life: b.life }),
    Core.COUNTRIES[country].prices);
}
const GUIDES = require("./guias.js")({ Core, money: (v, c) => money(v, c), calcFor });

function guideCards(list) {
  return `<div class="cards guides">${list.map(g => `<a href="/mascotas/guias/${g.slug}.html">${esc(g.title)}</a>`).join("")}</div>`;
}

function article(b) { return b.species === "gato" ? "un gato " + b.name.replace(/^Gato /, "") : "un " + b.name; }

function layout({ title, description, pathName, body, jsonLd, current, extraHead, ogType }) {
  const url = BASE + pathName;
  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ogType || "website"}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="es_MX">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#e07a2f">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐾</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/mascotas/assets/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ""}${extraHead || ""}</head>
<body>
<header class="site-header"><div class="wrap">
  <a class="logo" href="/mascotas/">🐾 Cuánto cuesta <span>mi mascota</span></a>
  <nav class="nav" aria-label="Principal">
    <a href="/mascotas/"${current === "home" ? ' aria-current="page"' : ""}>Calculadora de gastos</a>
    <a href="/mascotas/comida.html"${current === "food" ? ' aria-current="page"' : ""}>¿Cuánto debe comer?</a>
    <a href="/mascotas/razas/"${current === "breeds" ? ' aria-current="page"' : ""}>Costos por raza</a>
    <a href="/mascotas/guias/"${current === "guides" ? ' aria-current="page"' : ""}>Guías</a>
  </nav>
</div></header>
<main class="wrap">
${body}
</main>
<footer class="site-footer"><div class="wrap">
  <nav><a href="/mascotas/">Calculadora de gastos</a><a href="/mascotas/comida.html">Porción de comida</a><a href="/mascotas/razas/">Razas</a><a href="/mascotas/guias/">Guías</a><a href="/mascotas/privacidad.html">Privacidad y afiliados</a><a href="/">Más herramientas</a></nav>
  <p>© ${YEAR} ${SITE}. Estimaciones orientativas: no sustituyen la consulta con tu veterinario. Como afiliados de Amazon obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.</p>
</div></footer>
<script src="/mascotas/assets/config.js"></script>
<script src="/mascotas/assets/core.js"></script>
<script src="/mascotas/assets/app.js"></script>
</body>
</html>
`;
}

function faqHtml(items) {
  return items.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n");
}
function faqLd(items) {
  return { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) };
}

function breedCards(species) {
  return `<div class="cards">${Core.BREEDS.filter(b => b.species === species).map(b =>
    `<a href="/mascotas/razas/${b.slug}.html">${esc(b.name)} <small>${money(calcFor(b, MAIN_COUNTRY).monthTotal)}/mes</small></a>`).join("")}</div>`;
}

function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/* ---------- Portada ---------- */
function home() {
  const lab = calcFor(Core.findBreed("labrador-retriever"), MAIN_COUNTRY);
  const cat = calcFor(Core.findBreed("gato-domestico"), MAIN_COUNTRY);
  const chi = calcFor(Core.findBreed("chihuahua"), MAIN_COUNTRY);
  const faqs = [
    ["¿Cuánto cuesta mantener un perro al mes en México?",
      `Depende sobre todo del tamaño. Con precios de gama media, un perro chico como el Chihuahua cuesta alrededor de ${money(chi.monthTotal)} al mes y uno grande como el Labrador cerca de ${money(lab.monthTotal)}, sumando comida, veterinario, antipulgas, estética y accesorios.`],
    ["¿Cuánto cuesta mantener un gato al mes?",
      `Un gato doméstico adulto cuesta aproximadamente ${money(cat.monthTotal)} al mes en México. La comida y la arena son los dos gastos principales.`],
    ["¿Qué gastos se olvidan al adoptar una mascota?",
      "Los más olvidados son la esterilización, el microchip, la limpieza dental, el antipulgas mensual y, sobre todo, un fondo para emergencias veterinarias, que pueden costar varios miles de pesos."],
    ["¿Cómo se calcula la comida que necesita mi mascota?",
      'Usamos la fórmula de requerimiento energético en reposo (RER = 70 × peso<sup>0.75</sup>) multiplicada por un factor según edad, esterilización y actividad. Puedes calcular la porción exacta para tu marca en la <a href="/mascotas/comida.html">calculadora de comida</a>.'],
    ["¿Sirve para otros países?",
      "Sí. Incluye precios de referencia para México, España, Colombia, Chile, Perú y Estados Unidos, y puedes ajustar cada precio a los de tu ciudad."]
  ];
  const body = `
<section class="hero">
  <h1>¿Cuánto cuesta tener un perro o un gato?</h1>
  <p>Calcula en segundos el gasto mensual, anual y de toda la vida de tu mascota: comida, veterinario, vacunas, antipulgas, estética y más. Gratis y con precios de tu país.</p>
</section>
<section class="calc" id="calc" aria-label="Calculadora de gastos de mascota"><noscript>Activa JavaScript para usar la calculadora.</noscript></section>
<div class="content">
  <h2>Costos por raza</h2>
  <p>Gasto mensual estimado en México (adulto, esterilizado, alimento de gama media). Entra a cada raza para ver el detalle y sus gastos típicos de salud.</p>
  <h3>Perros</h3>
  ${breedCards("perro")}
  <h3>Gatos</h3>
  ${breedCards("gato")}
  <div data-slot="ad" data-name="articulo"></div>
  <h2>Guías para dueños de mascotas</h2>
  ${guideCards(GUIDES)}
  <h2>Cómo calculamos los gastos</h2>
  <p><strong>Comida:</strong> calculamos las calorías diarias con la fórmula veterinaria RER y las convertimos a gramos según la calidad del alimento; luego multiplicamos por el precio por kilo.</p>
  <p><strong>Veterinario:</strong> consultas al año según la edad (los cachorros y seniors van más seguido) más el paquete anual de vacunas, prorrateado por mes.</p>
  <p><strong>Antipulgas, estética y accesorios:</strong> se ajustan al tamaño y tipo de pelo, porque los medicamentos se dosifican por peso y los perros grandes o de pelo largo cuestan más en la estética.</p>
  <p><strong>Gastos únicos:</strong> kit inicial, microchip y esterilización (si todavía no está esterilizado).</p>
  <h2>Preguntas frecuentes</h2>
  ${faqHtml(faqs)}
  <div data-slot="newsletter"></div>
</div>`;
  const ld = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Calculadora de gastos de mascotas", url: BASE,
      applicationCategory: "FinanceApplication", operatingSystem: "Web", inLanguage: "es", offers: { "@type": "Offer", price: "0", priceCurrency: "MXN" } },
    faqLd(faqs)
  ];
  write("index.html", layout({
    title: "¿Cuánto cuesta tener un perro o gato? Calculadora de gastos " + YEAR,
    description: "Calculadora gratuita: cuánto cuesta mantener un perro o un gato al mes, al año y de por vida. Comida, veterinario, vacunas y más con precios de México y Latinoamérica.",
    pathName: "", body, jsonLd: ld, current: "home"
  }));
}

/* ---------- Comida ---------- */
function food() {
  const rows = [2, 5, 10, 15, 20, 30, 40].map(kg => {
    const k = Core.dailyKcal("perro", kg, "adulto", true, "normal");
    return `<tr><td>${kg} kg</td><td>${Math.round(k)} kcal</td><td>${Math.round(k / 3600 * 1000)} g</td></tr>`;
  }).join("");
  const catRows = [3, 4, 5, 6, 7].map(kg => {
    const k = Core.dailyKcal("gato", kg, "adulto", true, "normal");
    return `<tr><td>${kg} kg</td><td>${Math.round(k)} kcal</td><td>${Math.round(k / 3800 * 1000)} g</td></tr>`;
  }).join("");
  const faqs = [
    ["¿Cuántas veces al día debe comer un perro?", "Los cachorros, 3 o 4 veces al día; los adultos, 2 veces. Las razas gigantes se benefician de 2 o 3 comidas pequeñas para reducir el riesgo de torsión gástrica."],
    ["¿Cuántos gramos de croquetas trae una taza?", "Una taza medidora estándar contiene entre 90 y 110 g de croquetas, según el tamaño y densidad. Por eso lo más exacto es pesar la porción con una báscula de cocina."],
    ["¿Dónde veo las kcal de mi alimento?", "En el empaque, normalmente como “energía metabolizable” en kcal/kg. Si solo aparece en kcal por taza, búscalo en la web del fabricante."],
    ["¿Los premios cuentan?", "Sí. Los premios no deberían superar el 10 % de las calorías diarias; si das muchos, reduce un poco la porción de croquetas."]
  ];
  const body = `
<section class="hero">
  <h1>¿Cuánto debe comer mi perro o gato al día?</h1>
  <p>Calcula los gramos exactos de alimento según su peso, edad y actividad, y las kcal de tu marca de croquetas.</p>
</section>
<section class="calc" id="food-calc" aria-label="Calculadora de porciones"><noscript>Activa JavaScript para usar la calculadora.</noscript></section>
<div class="content">
  <h2>Tabla de cantidad de comida para perros adultos</h2>
  <p>Perro adulto esterilizado, actividad normal, alimento de 3,600 kcal/kg:</p>
  <div class="table-scroll"><table><thead><tr><th>Peso</th><th>Energía al día</th><th>Croquetas al día</th></tr></thead><tbody>${rows}</tbody></table></div>
  <h2>Tabla de cantidad de comida para gatos adultos</h2>
  <p>Gato adulto esterilizado, actividad normal, alimento de 3,800 kcal/kg:</p>
  <div class="table-scroll"><table><thead><tr><th>Peso</th><th>Energía al día</th><th>Croquetas al día</th></tr></thead><tbody>${catRows}</tbody></table></div>
  <div data-slot="ad" data-name="articulo"></div>
  <h2>Preguntas frecuentes</h2>
  ${faqHtml(faqs)}
</div>`;
  write("comida.html", layout({
    title: "¿Cuánto debe comer mi perro o gato? Calculadora de porciones en gramos",
    description: "Calcula cuántos gramos de croquetas necesita tu perro o gato al día según su peso, edad y actividad. Con tablas por peso y fórmula veterinaria.",
    pathName: "comida.html", body, jsonLd: faqLd(faqs), current: "food"
  }));
}

/* ---------- Razas ---------- */
function breedPage(b) {
  const r = calcFor(b, MAIN_COUNTRY);
  const who = article(b);
  const sizeTxt = b.species === "gato" ? "felino" : "de talla " + r.size;
  const countryRows = Object.keys(Core.COUNTRIES).map(k => {
    const x = calcFor(b, k);
    return `<tr><td>${Core.COUNTRIES[k].name}</td><td>${money(x.monthTotal, k)}</td><td>${money(x.yearTotal, k)}</td><td>${money(x.lifetime, k)}</td></tr>`;
  }).join("");
  const breakdown = r.monthly.map(x => `<tr><td>${esc(x.label)}</td><td>${money(x.value)}</td></tr>`).join("");
  const faqs = [
    [`¿Cuánto cuesta mantener ${who} al mes?`,
      `En México, mantener ${who} adulto cuesta alrededor de ${money(r.monthTotal)} al mes con alimento de gama media, veterinario, antipulgas${b.species === "perro" ? ", estética" : ", arena"} y accesorios.`],
    [`¿Cuánto cuesta ${who} en toda su vida?`,
      `Con una esperanza de vida de unos ${b.life} años, el costo total ronda los ${money(r.lifetime)}, incluyendo los gastos iniciales.`],
    [`¿Cuánto come ${who} al día?`,
      `Un ejemplar adulto de unos ${b.weight} kg necesita alrededor de ${Math.round(r.kcal)} kcal diarias, unos ${Math.round(r.gramsDay)} g de alimento seco de gama media.`]
  ];
  const others = Core.BREEDS.filter(x => x.species === b.species && x.slug !== b.slug)
    .sort((x, y) => Math.abs(x.weight - b.weight) - Math.abs(y.weight - b.weight)).slice(0, 6);
  const body = `
<p class="breadcrumb"><a href="/mascotas/">Inicio</a> › <a href="/mascotas/razas/">Razas</a> › ${esc(b.name)}</p>
<section class="hero">
  <h1>¿Cuánto cuesta tener ${esc(who)}?</h1>
  <p>Mantener ${esc(who)} en México cuesta aproximadamente <strong>${money(r.monthTotal)} al mes</strong> y <strong>${money(r.yearTotal)} al año</strong>. Ajusta la calculadora a tu caso:</p>
</section>
<section class="calc" id="calc" data-breed="${b.slug}" aria-label="Calculadora de gastos"><noscript>Activa JavaScript para usar la calculadora.</noscript></section>
<div class="content">
  <div class="facts">
    <div><span>Peso adulto promedio</span><b>${b.weight} kg</b></div>
    <div><span>Tamaño</span><b>${b.species === "gato" ? "Gato" : r.size[0].toUpperCase() + r.size.slice(1)}</b></div>
    <div><span>Pelo</span><b>${b.coat[0].toUpperCase() + b.coat.slice(1)}</b></div>
    <div><span>Esperanza de vida</span><b>~${b.life} años</b></div>
    <div><span>Comida al día</span><b>~${Math.round(r.gramsDay)} g</b></div>
  </div>
  <h2>Lo que más influye en el costo de ${esc(who)}</h2>
  <p>${esc(NOTES[b.slug] || "")}</p>
  <h2>Desglose de gastos mensuales en México</h2>
  <div class="table-scroll"><table><thead><tr><th>Concepto</th><th>Al mes</th></tr></thead><tbody>${breakdown}
  <tr><th>Total</th><th>${money(r.monthTotal)}</th></tr></tbody></table></div>
  <p>Además, al llegar a casa hay que contemplar unos ${money(r.initialTotal - (r.initial.find(x => x.key === "sterilization") || { value: 0 }).value)} de gastos iniciales (kit básico y microchip), más la esterilización si aún no está esterilizado.</p>
  <div data-slot="ad" data-name="articulo"></div>
  <h2>Costo de ${esc(who)} en otros países</h2>
  <div class="table-scroll"><table><thead><tr><th>País</th><th>Al mes</th><th>Al año</th><th>Toda su vida</th></tr></thead><tbody>${countryRows}</tbody></table></div>
  <div data-slot="insurance"></div>
  <h2>Cómo ahorrar con ${esc(who)}</h2>
  <ul>
    <li><strong>Mide la comida con báscula.</strong> Un ${sizeTxt} con sobrepeso come de más y enferma más.</li>
    <li><strong>Compra el bulto grande</strong> de croquetas y el antipulgas en paquete de varias dosis.</li>
    <li><strong>Prevención antes que tratamiento:</strong> vacunas, desparasitación y chequeo anual cuestan mucho menos que una urgencia.</li>
    ${b.coat !== "corto" ? "<li><strong>Cepilla en casa</strong> varias veces por semana para espaciar las visitas a la estética.</li>" : ""}
    <li><strong>Ten un fondo de emergencias</strong> o un seguro para mascotas.</li>
  </ul>
  <h2>Preguntas frecuentes</h2>
  ${faqHtml(faqs)}
  <h2>Compara con razas parecidas</h2>
  <div class="cards">${others.map(o => `<a href="/mascotas/razas/${o.slug}.html">${esc(o.name)} <small>${money(calcFor(o, MAIN_COUNTRY).monthTotal)}/mes</small></a>`).join("")}</div>
  <h2>Guías útiles</h2>
  ${guideCards(GUIDES.filter(g => b.species === "gato" ? !/perro/.test(g.slug) || /gato/.test(g.slug) : !/gato/.test(g.slug) || /perro/.test(g.slug)).slice(0, 4))}
  <div data-slot="newsletter"></div>
</div>`;
  const ld = [faqLd(faqs), { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
    { "@type": "ListItem", position: 2, name: "Razas", item: BASE + "razas/" },
    { "@type": "ListItem", position: 3, name: b.name, item: BASE + "razas/" + b.slug + ".html" }] }];
  write(`razas/${b.slug}.html`, layout({
    title: `¿Cuánto cuesta tener ${who}? Gastos al mes y de por vida (${YEAR})`,
    description: `Mantener ${who} cuesta aprox. ${money(r.monthTotal)} al mes en México. Desglose de comida, veterinario y estética, costo de por vida y en otros países.`,
    pathName: `razas/${b.slug}.html`, body, jsonLd: ld, current: "breeds"
  }));
}

function breedsIndex() {
  const rows = Core.BREEDS.map(b => ({ b, r: calcFor(b, MAIN_COUNTRY) })).sort((x, y) => x.r.monthTotal - y.r.monthTotal);
  const body = `
<p class="breadcrumb"><a href="/mascotas/">Inicio</a> › Razas</p>
<section class="hero">
  <h1>Costo de mantener cada raza de perro y gato</h1>
  <p>Ranking de las razas más baratas a las más caras de mantener en México, con gasto mensual y de toda la vida.</p>
</section>
<div class="content">
  <div class="table-scroll"><table><thead><tr><th>Raza</th><th>Al mes</th><th>Toda su vida</th></tr></thead><tbody>
  ${rows.map(({ b, r }) => `<tr><td><a href="/mascotas/razas/${b.slug}.html">${esc(b.name)}</a> ${b.species === "gato" ? "🐱" : "🐶"}</td><td>${money(r.monthTotal)}</td><td>${money(r.lifetime)}</td></tr>`).join("\n  ")}
  </tbody></table></div>
  <p>Estimación para un ejemplar adulto esterilizado, con alimento de gama media y estética incluida. <a href="/mascotas/">Personaliza el cálculo</a> con la edad, actividad y precios de tu ciudad.</p>
  <div data-slot="ad" data-name="articulo"></div>
  <div data-slot="newsletter"></div>
</div>`;
  write("razas/index.html", layout({
    title: `Razas de perros y gatos más baratas y más caras de mantener (${YEAR})`,
    description: "Ranking del costo mensual y de por vida de mantener cada raza de perro y gato en México: Chihuahua, Labrador, Bulldog Francés, Persa, Maine Coon y más.",
    pathName: "razas/", body, current: "breeds"
  }));
}

function guidePage(g, i) {
  const related = GUIDES.filter(x => x !== g).slice(i % (GUIDES.length - 1)).concat(GUIDES.filter(x => x !== g)).slice(0, 3);
  // Coloca un anuncio a mitad del artículo (antes del tercer h2)
  let n = 0;
  const content = g.body.replace(/<h2>/g, m => (++n === 3 ? '<div data-slot="ad" data-name="articulo"></div>\n' + m : m));
  const body = `
<p class="breadcrumb"><a href="/mascotas/">Inicio</a> › <a href="/mascotas/guias/">Guías</a></p>
<article class="content">
  <section class="hero">
    <h1>${esc(g.title)}</h1>
    <p>${g.intro}</p>
    <p class="byline">Actualizado: ${TODAY}</p>
  </section>
  ${content}
  <h2>Preguntas frecuentes</h2>
  ${faqHtml(g.faqs)}
  <div data-slot="newsletter"></div>
  <div data-slot="product"></div>
  <p class="disclaimer">Información general y precios orientativos; no sustituye la consulta con tu médico veterinario. Algunos enlaces son de afiliado: si compras, recibimos una pequeña comisión sin costo extra para ti.</p>
  <h2>Sigue leyendo</h2>
  ${guideCards(related)}
</article>`;
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, inLanguage: "es-MX",
      datePublished: TODAY, dateModified: TODAY, mainEntityOfPage: BASE + "guias/" + g.slug + ".html",
      author: { "@type": "Person", name: "Leo Esquivel" }, publisher: { "@type": "Organization", name: SITE } },
    faqLd(g.faqs)
  ];
  write(`guias/${g.slug}.html`, layout({
    title: g.title, description: g.description, pathName: `guias/${g.slug}.html`, body, jsonLd: ld, current: "guides", ogType: "article"
  }));
}

function guidesIndex() {
  const body = `
<p class="breadcrumb"><a href="/mascotas/">Inicio</a> › Guías</p>
<section class="hero">
  <h1>Guías para dueños de perros y gatos</h1>
  <p>Precios, calendarios de vacunas, listas de compras y consejos para cuidar a tu mascota sin gastar de más.</p>
</section>
<div class="content">
  <ul class="guide-list">
  ${GUIDES.map(g => `<li><a href="/mascotas/guias/${g.slug}.html"><strong>${esc(g.title)}</strong></a><span>${esc(g.description)}</span></li>`).join("\n  ")}
  </ul>
  <div data-slot="ad" data-name="articulo"></div>
  <div data-slot="newsletter"></div>
</div>`;
  write("guias/index.html", layout({
    title: "Guías para dueños de perros y gatos: precios, vacunas y consejos",
    description: "Guías prácticas para dueños de mascotas en México: cuánto cuesta esterilizar, calendario de vacunas, qué comprar, urgencias veterinarias y cómo ahorrar.",
    pathName: "guias/", body, current: "guides"
  }));
}

function privacy() {
  const body = `
<section class="hero"><h1>Privacidad y afiliados</h1></section>
<div class="content">
  <h2>Datos que usamos</h2>
  <p>Las calculadoras funcionan por completo en tu navegador: no enviamos ni guardamos en ningún servidor los datos de tu mascota. Si ajustas precios, se guardan solo en tu dispositivo (almacenamiento local) para la próxima visita.</p>
  <p>Si te suscribes a nuestra lista de correo, tu email lo gestiona el proveedor de newsletters y solo lo usamos para enviarte el contenido que pediste. Puedes darte de baja en cualquier momento.</p>
  <h2>Publicidad y cookies</h2>
  <p>Este sitio muestra anuncios de Google AdSense. Google y sus socios usan cookies para mostrar anuncios basados en tus visitas a este y otros sitios. Puedes desactivar la publicidad personalizada en la <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">configuración de anuncios de Google</a>. Más información en <a href="https://policies.google.com/technologies/ads" rel="nofollow noopener" target="_blank">cómo usa Google los datos</a>.</p>
  <h2>Enlaces de afiliado</h2>
  <p>Algunos enlaces a tiendas (como Amazon) son enlaces de afiliado: si compras a través de ellos recibimos una pequeña comisión, sin ningún costo adicional para ti. Como afiliados de Amazon obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables. Esto nos permite mantener gratis las herramientas.</p>
  <h2>Aviso</h2>
  <p>Los resultados son estimaciones orientativas basadas en precios promedio y fórmulas generales. No sustituyen la opinión de un médico veterinario.</p>
</div>`;
  write("privacidad.html", layout({
    title: "Privacidad, cookies y afiliados — " + SITE,
    description: "Política de privacidad, uso de cookies, publicidad y enlaces de afiliado de " + SITE + ".",
    pathName: "privacidad.html", body
  }));
}

function sitemap() {
  const urls = ["", "comida.html", "razas/", "guias/", "privacidad.html"]
    .concat(Core.BREEDS.map(b => `razas/${b.slug}.html`), GUIDES.map(g => `guias/${g.slug}.html`));
  write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${BASE}${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}
</urlset>
`);
}

home();
food();
breedsIndex();
Core.BREEDS.forEach(breedPage);
GUIDES.forEach(guidePage);
guidesIndex();
privacy();
sitemap();
console.log(`Generadas ${Core.BREEDS.length + GUIDES.length + 5} páginas + sitemap.xml`);
