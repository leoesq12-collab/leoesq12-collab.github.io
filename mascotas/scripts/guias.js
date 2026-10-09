/*
 * Artículos (guías) del sitio. Cada guía se convierte en /mascotas/guias/<slug>.html.
 * Para agregar una guía nueva, añade un objeto a la lista y ejecuta: node mascotas/scripts/generar.js
 *
 * Helpers disponibles:
 *   amz(texto, búsqueda) → enlace de afiliado a Amazon (el tag se toma de assets/config.js)
 *   breed(slug)          → enlace a la página de una raza
 *   calc / food          → enlaces a las calculadoras
 */
"use strict";

module.exports = function ({ Core, money, calcFor }) {
  const amz = (text, q) =>
    `<a data-amazon="${q}" href="https://www.amazon.com.mx/s?k=${encodeURIComponent(q)}" rel="sponsored nofollow noopener" target="_blank">${text}</a>`;
  const breed = slug => `<a href="/mascotas/razas/${slug}.html">${Core.findBreed(slug).name}</a>`;
  const calc = '<a href="/mascotas/">calculadora de gastos</a>';
  const food = '<a href="/mascotas/comida.html">calculadora de comida</a>';

  // Ranking calculado con los mismos datos que la calculadora.
  const dogs = Core.BREEDS.filter(b => b.species === "perro").map(b => ({ b, r: calcFor(b, "mx") }))
    .sort((x, y) => x.r.monthTotal - y.r.monthTotal);
  const cheapRows = dogs.slice(0, 8).map(({ b, r }, i) =>
    `<tr><td>${i + 1}. <a href="/mascotas/razas/${b.slug}.html">${b.name}</a></td><td>${b.weight} kg</td><td>${money(r.monthTotal)}</td><td>${money(r.lifetime)}</td></tr>`).join("");
  const priceyRows = dogs.slice(-5).reverse().map(({ b, r }) =>
    `<tr><td><a href="/mascotas/razas/${b.slug}.html">${b.name}</a></td><td>${b.weight} kg</td><td>${money(r.monthTotal)}</td></tr>`).join("");

  return [
    /* ------------------------------------------------------------------ */
    {
      slug: "cuanto-cuesta-esterilizar-perro-gato",
      title: "¿Cuánto cuesta esterilizar a un perro o un gato en México?",
      description: "Precios aproximados de esterilización de perros y gatos en México según tamaño y sexo, qué incluye, cuidados después de la cirugía y cómo encontrar campañas gratuitas.",
      intro: "La esterilización es uno de los primeros gastos grandes al adoptar, pero también uno de los que más dinero te ahorra a largo plazo. Aquí tienes rangos de precio reales, qué debe incluir y cómo pagar menos.",
      body: `
<h2>Precio de esterilizar a un perro</h2>
<p>El costo depende sobre todo del <strong>tamaño</strong> (más peso = más anestesia y medicamentos) y del <strong>sexo</strong>: en las hembras la cirugía (ovariohisterectomía) es abdominal y más larga que la castración del macho.</p>
<div class="table-scroll"><table><thead><tr><th>Tamaño del perro</th><th>Macho (aprox.)</th><th>Hembra (aprox.)</th></tr></thead><tbody>
<tr><td>Chico (menos de 10 kg)</td><td>$1,200 – $2,200</td><td>$1,500 – $2,800</td></tr>
<tr><td>Mediano (10 a 25 kg)</td><td>$1,800 – $3,000</td><td>$2,200 – $3,800</td></tr>
<tr><td>Grande (25 a 45 kg)</td><td>$2,500 – $4,000</td><td>$3,000 – $5,000</td></tr>
<tr><td>Gigante (más de 45 kg)</td><td>$3,500 – $5,500</td><td>$4,000 – $7,000</td></tr>
</tbody></table></div>
<p>Son rangos orientativos de clínicas privadas en ciudades de México. En zonas con menor costo de vida pueden ser más bajos, y en hospitales veterinarios de especialidad, más altos.</p>

<h2>Precio de esterilizar a un gato</h2>
<p>En gatos el precio es más parejo porque casi todos pesan entre 3 y 7 kg: la castración de un macho suele costar entre <strong>$800 y $1,500</strong> y la esterilización de una hembra entre <strong>$1,000 y $2,200</strong>.</p>

<h2>¿Qué debe incluir el precio?</h2>
<p>Antes de comparar presupuestos, pregunta si incluyen todo esto, porque una cirugía “barata” puede encarecerse con extras:</p>
<ul>
<li>Valoración previa y, en mascotas mayores de 6–7 años, análisis de sangre prequirúrgicos.</li>
<li>Anestesia inhalada (más segura que la inyectada) y monitoreo durante la cirugía.</li>
<li>Analgésicos y antibióticos para casa.</li>
<li>Collar isabelino o body quirúrgico.</li>
<li>Revisión y retiro de puntos a los 8–10 días.</li>
</ul>

<h2>Campañas de esterilización gratuitas o de bajo costo</h2>
<p>Muchos municipios, centros de salud animal y asociaciones protectoras organizan <strong>jornadas de esterilización gratuitas o a muy bajo costo</strong> varias veces al año. Búscalas en las redes sociales de tu municipio, del centro de control animal de tu ciudad o de los refugios locales. Suelen llenarse rápido, así que conviene registrarse con anticipación.</p>

<h2>¿Por qué esterilizar ahorra dinero?</h2>
<ul>
<li>Evita camadas no planeadas (alimentar, vacunar y desparasitar cachorros cuesta mucho).</li>
<li>En hembras reduce de forma importante el riesgo de piometra (infección del útero, que requiere cirugía de urgencia mucho más cara) y de tumores mamarios.</li>
<li>En machos reduce marcaje, escapes y peleas, que terminan en heridas y visitas al veterinario.</li>
</ul>
<p>Un detalle: después de esterilizar, el metabolismo baja un poco. Ajusta la porción de comida con la ${food} para evitar sobrepeso.</p>

<h2>Cuidados después de la cirugía</h2>
<ul>
<li>Reposo de 7 a 10 días: nada de saltos, correr ni baños.</li>
<li>Usa el collar o un body quirúrgico para que no se lama la herida.</li>
<li>Revisa la herida a diario: un poco de enrojecimiento es normal; pus, sangrado o mal olor no.</li>
<li>Dale solo los medicamentos que indicó el veterinario. Nunca analgésicos humanos: el paracetamol y el ibuprofeno son tóxicos para perros y gatos.</li>
</ul>
<p>Un ${amz("body quirúrgico para mascotas", "body postquirurgico perro")} suele ser más cómodo que el collar isabelino y les permite comer y dormir mejor.</p>
<p>¿Quieres ver cuánto te cuesta tu mascota en total, incluyendo la esterilización? Usa la ${calc} y desmarca la casilla “Ya está esterilizado”.</p>`,
      faqs: [
        ["¿A qué edad se puede esterilizar a un perro?", "Depende del tamaño: en razas chicas suele recomendarse alrededor de los 6 meses y en razas grandes o gigantes muchos veterinarios prefieren esperar a que terminen de crecer (12–18 meses). Decide la edad con tu veterinario."],
        ["¿A qué edad se esteriliza a un gato?", "Generalmente entre los 4 y 6 meses, antes del primer celo."],
        ["¿Mi mascota va a engordar después de esterilizarla?", "Sus necesidades de energía bajan, así que si sigue comiendo lo mismo puede subir de peso. Ajustar la porción lo evita."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "calendario-vacunas-perro",
      title: "Calendario de vacunas para perros y cachorros en México (y cuánto cuesta)",
      description: "Qué vacunas necesita un cachorro, a qué edad se aplican, refuerzos anuales, desparasitación y precio aproximado del esquema completo en México.",
      intro: "Las vacunas son la forma más barata de evitar enfermedades graves como el parvovirus o el moquillo, cuyo tratamiento puede costar miles de pesos. Este es el esquema más común; tu veterinario lo ajustará según la edad, la zona y el estilo de vida de tu perro.",
      body: `
<h2>Esquema de vacunación habitual del cachorro</h2>
<div class="table-scroll"><table><thead><tr><th>Edad</th><th>Vacuna</th><th>Protege contra</th></tr></thead><tbody>
<tr><td>6 – 8 semanas</td><td>Primera vacuna (tipo “puppy”)</td><td>Parvovirus y moquillo</td></tr>
<tr><td>9 – 11 semanas</td><td>Múltiple (quíntuple o séxtuple)</td><td>Moquillo, parvovirus, hepatitis, parainfluenza, leptospira</td></tr>
<tr><td>12 – 14 semanas</td><td>Refuerzo de la múltiple</td><td>Las mismas</td></tr>
<tr><td>12 – 16 semanas</td><td>Antirrábica</td><td>Rabia</td></tr>
<tr><td>15 – 16 semanas</td><td>Último refuerzo de la múltiple (según el veterinario)</td><td>Las mismas</td></tr>
<tr><td>Cada año</td><td>Refuerzo de múltiple y antirrábica</td><td>Mantener la protección</td></tr>
</tbody></table></div>
<p>Otras vacunas opcionales según el riesgo: <strong>tos de las perreras</strong> (Bordetella), recomendada si va a guardería, estética o convive con muchos perros.</p>
<p><strong>Importante:</strong> no saques a tu cachorro a la calle ni a parques hasta que el veterinario te lo autorice (normalmente una o dos semanas después de completar el esquema). El parvovirus vive mucho tiempo en el suelo.</p>

<h2>Desparasitación</h2>
<p>Los cachorros suelen desparasitarse por primera vez entre las 2 y 4 semanas de vida, repetir cada 2–4 semanas hasta los 3 meses y luego de forma periódica (cada 3 meses es lo más común en adultos). Además, la protección contra pulgas y garrapatas suele ser mensual. Las dosis van por peso: pésalo antes de cada aplicación.</p>

<h2>¿Cuánto cuesta vacunar a un perro en México?</h2>
<div class="table-scroll"><table><thead><tr><th>Concepto</th><th>Precio aproximado</th></tr></thead><tbody>
<tr><td>Cada vacuna del cachorro (con consulta)</td><td>$350 – $700</td></tr>
<tr><td>Esquema completo de cachorro (4–5 aplicaciones)</td><td>$1,500 – $3,000</td></tr>
<tr><td>Refuerzo anual (múltiple + rabia)</td><td>$700 – $1,500</td></tr>
<tr><td>Desparasitante interno (por dosis)</td><td>$80 – $300 según peso</td></tr>
</tbody></table></div>
<p>La <strong>vacuna antirrábica</strong> se aplica gratis en las jornadas nacionales y campañas de vacunación antirrábica que organizan los servicios de salud; consulta las fechas en tu centro de salud o en el de control animal de tu ciudad.</p>

<h2>Cómo no olvidar ninguna vacuna</h2>
<ul>
<li>Guarda la cartilla de vacunación en un lugar fijo y tómale foto después de cada visita.</li>
<li>Pon recordatorios en el calendario de tu celular para el siguiente refuerzo.</li>
<li>Pide al veterinario que te avise por WhatsApp; muchas clínicas lo hacen.</li>
</ul>
<p>Las vacunas y consultas ya están incluidas en la ${calc}: elige “Cachorro” en la edad para ver el gasto del primer año.</p>`,
      faqs: [
        ["¿Cuándo se pone la primera vacuna a un cachorro?", "Normalmente entre las 6 y 8 semanas de edad."],
        ["¿Cada cuánto se vacuna a un perro adulto?", "Lo más común es un refuerzo anual de la vacuna múltiple y de la antirrábica, aunque algunos veterinarios espacian ciertas vacunas según el riesgo."],
        ["¿Puedo vacunar yo mismo a mi perro?", "No es recomendable: la vacuna debe conservarse en frío, aplicarse a un animal sano y registrarse en la cartilla. Además, la consulta permite detectar problemas a tiempo."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "calendario-vacunas-gato",
      title: "Calendario de vacunas para gatos: qué vacunas necesita y cuánto cuestan",
      description: "Esquema de vacunación para gatitos y gatos adultos: triple felina, rabia y leucemia felina, a qué edad se aplican y precio aproximado en México.",
      intro: "Aunque tu gato nunca salga de casa, necesita vacunas: varios virus llegan en la ropa, los zapatos o por la ventana. Este es el esquema más habitual.",
      body: `
<h2>Esquema de vacunación del gatito</h2>
<div class="table-scroll"><table><thead><tr><th>Edad</th><th>Vacuna</th><th>Protege contra</th></tr></thead><tbody>
<tr><td>8 – 9 semanas</td><td>Triple felina</td><td>Panleucopenia, rinotraqueítis y calicivirus</td></tr>
<tr><td>11 – 12 semanas</td><td>Refuerzo de la triple felina</td><td>Las mismas</td></tr>
<tr><td>12 – 16 semanas</td><td>Antirrábica</td><td>Rabia</td></tr>
<tr><td>14 – 16 semanas</td><td>Último refuerzo de la triple (según el veterinario)</td><td>Las mismas</td></tr>
<tr><td>Cada año</td><td>Refuerzos indicados por el veterinario</td><td>Mantener la protección</td></tr>
</tbody></table></div>
<p><strong>Leucemia felina (FeLV):</strong> se recomienda a gatos que salen al exterior o conviven con otros gatos de estado desconocido. Antes de aplicarla se hace una prueba rápida de leucemia e inmunodeficiencia felina.</p>

<h2>¿Cuánto cuesta vacunar a un gato?</h2>
<div class="table-scroll"><table><thead><tr><th>Concepto</th><th>Precio aproximado</th></tr></thead><tbody>
<tr><td>Triple felina (con consulta)</td><td>$400 – $750</td></tr>
<tr><td>Antirrábica</td><td>$200 – $400 (gratis en campañas)</td></tr>
<tr><td>Prueba de leucemia / inmunodeficiencia</td><td>$500 – $900</td></tr>
<tr><td>Vacuna contra leucemia felina</td><td>$450 – $800</td></tr>
<tr><td>Esquema completo del gatito</td><td>$1,200 – $2,800</td></tr>
</tbody></table></div>

<h2>Desparasitación del gato</h2>
<p>Los gatitos se desparasitan varias veces durante sus primeros meses y los adultos, de forma periódica según su estilo de vida (más seguido si salen o cazan). Para pulgas existen pipetas mensuales específicas para gatos.</p>
<p><strong>Nunca uses en tu gato un antipulgas para perros:</strong> algunos contienen permetrina, que es muy tóxica para los gatos.</p>

<h2>Cómo llevarlo al veterinario sin estrés</h2>
<ul>
<li>Deja la ${amz("transportadora", "transportadora para gato")} abierta en casa, con una manta, para que la conozca y no la relacione solo con el veterinario.</li>
<li>Cúbrela con una toalla durante el viaje.</li>
<li>Pregunta por clínicas “cat friendly”, con sala de espera separada de los perros.</li>
</ul>
<p>Calcula todo lo que cuesta tu gato al mes, incluidas vacunas y arena, con la ${calc}.</p>`,
      faqs: [
        ["¿Un gato que no sale de casa necesita vacunas?", "Sí. La triple felina y la rabia se recomiendan a todos los gatos; la de leucemia depende de si sale o convive con otros gatos."],
        ["¿Cuándo se vacuna a un gatito por primera vez?", "Generalmente entre las 8 y 9 semanas de edad."],
        ["¿Puedo usar antipulgas de perro en mi gato?", "No. Algunos contienen permetrina, que es tóxica para los gatos. Usa siempre productos específicos para gatos."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "que-comprar-para-un-perro-nuevo",
      title: "Qué comprar antes de adoptar un perro: lista completa y presupuesto",
      description: "Checklist de todo lo que necesitas antes de que llegue tu perro o cachorro: comida, cama, correa, juguetes, higiene y botiquín, con presupuesto aproximado.",
      intro: "Tener todo listo antes de que llegue tu perro hace la adaptación mucho más fácil y evita compras de pánico (y caras) de último minuto. Esta es la lista completa, ordenada por prioridad.",
      body: `
<h2>Lo indispensable desde el primer día</h2>
<ul>
<li><strong>Alimento:</strong> pregunta qué comía antes y haz el cambio de forma gradual en 7 días. Elige ${amz("croquetas para su edad y tamaño", "croquetas cachorro")}.</li>
<li><strong>Platos para agua y comida:</strong> los de ${amz("acero inoxidable", "plato acero inoxidable perro")} duran años y son fáciles de limpiar.</li>
<li><strong>Collar con placa de identificación</strong> con tu teléfono.</li>
<li><strong>Correa y ${amz("pechera", "pechera para perro")}:</strong> la pechera reparte mejor la presión que el collar, sobre todo en razas chicas y braquicéfalas.</li>
<li><strong>Cama</strong> lavable de su tamaño adulto (los cachorros crecen rápido).</li>
<li><strong>Bolsas para recoger heces.</strong></li>
<li><strong>Tapetes entrenadores</strong> si es cachorro o vives en departamento.</li>
</ul>

<h2>Higiene y salud</h2>
<ul>
<li>Shampoo para perros (el humano les irrita la piel).</li>
<li>${amz("Cepillo adecuado a su tipo de pelo", "cepillo para perro")}.</li>
<li>${amz("Cortaúñas para perro", "cortauñas perro")}.</li>
<li>Antipulgas y desparasitante indicados por el veterinario.</li>
<li>Botiquín básico: gasas, solución antiséptica para mascotas, venda y el teléfono de una clínica de urgencias 24 h.</li>
</ul>

<h2>Comodidad y entretenimiento</h2>
<ul>
<li>2 o 3 juguetes resistentes, por ejemplo uno ${amz("rellenable tipo Kong", "juguete kong perro")}: lo mantiene ocupado y ayuda con la ansiedad por separación.</li>
<li>Juguetes para morder durante la dentición si es cachorro.</li>
<li>${amz("Transportadora", "transportadora perro")} o jaula (indispensable para perros chicos y viajes).</li>
<li>Premios pequeños para el entrenamiento.</li>
</ul>

<h2>Presupuesto aproximado del kit inicial</h2>
<div class="table-scroll"><table><thead><tr><th>Tamaño</th><th>Kit básico</th><th>Kit completo</th></tr></thead><tbody>
<tr><td>Perro chico</td><td>$1,200 – $2,000</td><td>$2,500 – $4,000</td></tr>
<tr><td>Perro mediano</td><td>$1,600 – $2,600</td><td>$3,000 – $5,000</td></tr>
<tr><td>Perro grande</td><td>$2,000 – $3,500</td><td>$4,000 – $7,000</td></tr>
</tbody></table></div>
<p>A eso súmale la primera consulta, vacunas, microchip y esterilización. Usa la ${calc} para ver el presupuesto del primer año completo.</p>

<h2>Errores comunes al comprar</h2>
<ul>
<li>Comprar la cama de tamaño cachorro: en tres meses ya no le queda.</li>
<li>Comprar muchos juguetes baratos que se rompen y pueden tragarse.</li>
<li>Comprar un costal enorme de comida antes de saber si le cae bien.</li>
</ul>`,
      faqs: [
        ["¿Qué es lo primero que hay que comprar para un perro?", "Comida, platos, collar con placa de identificación, correa, cama y bolsas para heces. Lo demás puede esperar unos días."],
        ["¿Cuánto cuesta todo lo necesario para un perro nuevo?", "El kit básico cuesta aproximadamente entre $1,200 y $3,500 según el tamaño, sin contar vacunas, microchip ni esterilización."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "que-comprar-para-un-gato-nuevo",
      title: "Qué comprar antes de adoptar un gato: lista completa",
      description: "Todo lo que necesitas antes de que llegue tu gato o gatito: arenero, arena, rascador, comida, transportadora y más, con presupuesto aproximado.",
      intro: "Los gatos son muy sensibles a los cambios. Tener su espacio listo antes de que llegue reduce el estrés y evita problemas como hacer sus necesidades fuera del arenero.",
      body: `
<h2>Lo indispensable</h2>
<ul>
<li><strong>Arenero:</strong> al menos uno por gato, más uno extra. Debe medir alrededor de 1.5 veces el largo de tu gato.</li>
<li><strong>${amz("Arena aglomerante", "arena aglomerante gato")}:</strong> forma bolitas fáciles de retirar y rinde más que la arena común.</li>
<li><strong>Pala para el arenero.</strong></li>
<li><strong>Alimento</strong> para su edad (gatito o adulto) y platos poco profundos.</li>
<li><strong>${amz("Fuente de agua", "fuente de agua para gato")}:</strong> muchos gatos beben poco, y una fuente los anima a beber más, lo que cuida sus riñones.</li>
<li><strong>${amz("Transportadora", "transportadora para gato")}</strong> rígida que se abra también por arriba.</li>
</ul>

<h2>Para su bienestar (y el de tus muebles)</h2>
<ul>
<li><strong>${amz("Rascador", "rascador gato torre")}:</strong> mejor alto y estable. Si se tambalea, no lo usará y elegirá el sillón.</li>
<li><strong>Escondites y lugares altos:</strong> repisas, cajas o una torre. Los gatos se sienten seguros en las alturas.</li>
<li><strong>Juguetes:</strong> una ${amz("caña con plumas", "juguete caña plumas gato")} y pelotas. Jugar 10–15 minutos al día evita el sobrepeso y el aburrimiento.</li>
<li><strong>Cama o manta</strong> en un lugar tranquilo.</li>
</ul>

<h2>Prepara la casa</h2>
<ul>
<li>Pon mallas de protección en ventanas y balcones.</li>
<li>Retira plantas tóxicas para gatos, como los lirios (son muy peligrosos), el potus y la dieffenbachia.</li>
<li>Guarda hilos, ligas y bolsas de plástico.</li>
<li>Coloca el arenero lejos de su comida y en un lugar tranquilo.</li>
</ul>

<h2>Presupuesto aproximado</h2>
<p>El kit básico (arenero, arena, platos, transportadora, rascador sencillo y juguetes) cuesta aproximadamente entre <strong>$1,200 y $2,500</strong>; con torre rascadora y fuente puede llegar a $4,000 o más. A partir de ahí, la arena y la comida son los gastos mensuales principales. Calcula los tuyos con la ${calc}.</p>`,
      faqs: [
        ["¿Cuántos areneros necesita un gato?", "La regla general es un arenero por gato más uno extra, en lugares distintos de la casa."],
        ["¿Qué arena es mejor para gatos?", "La arena aglomerante sin perfume es la más práctica para la mayoría: forma bolitas fáciles de retirar y rinde más."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "razas-de-perro-mas-baratas-de-mantener",
      title: "Las razas de perro más baratas (y más caras) de mantener",
      description: "Ranking de las razas de perro más económicas de mantener en México según comida, veterinario y estética, y cuáles son las más caras.",
      intro: "El precio de compra o adopción es lo de menos: lo que realmente pesa es lo que gastas cada mes durante 10 a 15 años. Calculamos el costo de mantener cada raza con los mismos datos de nuestra calculadora.",
      body: `
<h2>Las razas de perro más baratas de mantener</h2>
<div class="table-scroll"><table><thead><tr><th>Raza</th><th>Peso adulto</th><th>Al mes</th><th>Toda su vida</th></tr></thead><tbody>${cheapRows}</tbody></table></div>
<p>Estimación para un perro adulto esterilizado, con alimento de gama media y estética incluida, con precios de México.</p>

<h2>¿Qué hace que una raza sea barata de mantener?</h2>
<ul>
<li><strong>Tamaño chico:</strong> come menos y los medicamentos, que se dosifican por peso, cuestan menos.</li>
<li><strong>Pelo corto:</strong> casi no necesita estética profesional.</li>
<li><strong>Buena salud general:</strong> sin problemas hereditarios frecuentes.</li>
</ul>
<p>Ojo: “chico” no siempre significa barato en salud. El ${breed("chihuahua")} come muy poco, pero suele necesitar limpiezas dentales; el ${breed("pug")} y el ${breed("bulldog-frances")} son chicos pero tienen problemas respiratorios que pueden salir caros.</p>

<h2>Las razas más caras de mantener</h2>
<div class="table-scroll"><table><thead><tr><th>Raza</th><th>Peso adulto</th><th>Al mes</th></tr></thead><tbody>${priceyRows}</tbody></table></div>
<p>Las razas grandes y gigantes encabezan la lista por la comida y los medicamentos. Pero el costo mensual no lo dice todo: razas como el ${breed("bulldog-ingles")} o el ${breed("bulldog-frances")} tienen gastos veterinarios inesperados más frecuentes, y para ellas un seguro o un fondo de emergencias es casi obligatorio.</p>

<h2>¿Y los perros mestizos?</h2>
<p>Un perro mestizo adoptado suele ser de las opciones más económicas: la adopción es gratuita o de bajo costo, muchos refugios los entregan ya vacunados y esterilizados, y en general tienen menos enfermedades hereditarias que las razas puras. En la ${calc} elige “Otra raza / mestizo” y escribe su peso.</p>`,
      faqs: [
        ["¿Cuál es la raza de perro más barata de mantener?", `Según nuestros cálculos, el ${dogs[0].b.name}, con un costo aproximado de ${money(dogs[0].r.monthTotal)} al mes en México.`],
        ["¿Los perros grandes cuestan más?", "Sí. Comen más y los medicamentos, antipulgas y la estética cuestan más por su peso. Un perro gigante puede costar el doble o más que uno chico."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cuanto-cuesta-una-urgencia-veterinaria",
      title: "¿Cuánto cuesta una urgencia veterinaria en México? Y cómo prepararte",
      description: "Precios aproximados de consultas de urgencia, hospitalización, estudios y cirugías veterinarias en México, y cómo cubrirlos con un fondo o seguro para mascotas.",
      intro: "Una urgencia veterinaria es el gasto que más desestabiliza el presupuesto de una familia con mascota. Saber cuánto puede costar te ayuda a prepararte antes de que pase.",
      body: `
<h2>Precios aproximados de una urgencia</h2>
<div class="table-scroll"><table><thead><tr><th>Concepto</th><th>Precio aproximado</th></tr></thead><tbody>
<tr><td>Consulta de urgencia (horario normal)</td><td>$600 – $1,200</td></tr>
<tr><td>Consulta de urgencia nocturna o en fin de semana</td><td>$900 – $2,000</td></tr>
<tr><td>Análisis de sangre completos</td><td>$800 – $2,000</td></tr>
<tr><td>Radiografías</td><td>$600 – $1,500</td></tr>
<tr><td>Ultrasonido</td><td>$800 – $1,800</td></tr>
<tr><td>Hospitalización (por día)</td><td>$1,200 – $4,000</td></tr>
<tr><td>Cirugía por cuerpo extraño (tragó algo)</td><td>$8,000 – $25,000</td></tr>
<tr><td>Cirugía de fractura</td><td>$10,000 – $35,000</td></tr>
<tr><td>Tratamiento de parvovirus (hospitalizado)</td><td>$6,000 – $20,000</td></tr>
</tbody></table></div>
<p>Son rangos orientativos de clínicas privadas; varían mucho por ciudad y por la gravedad del caso.</p>

<h2>Las urgencias más comunes</h2>
<ul>
<li><strong>Intoxicaciones:</strong> chocolate, uvas o pasas, xilitol (chicles sin azúcar), cebolla, medicamentos humanos y raticidas.</li>
<li><strong>Cuerpos extraños:</strong> calcetines, huesos cocidos, juguetes pequeños, hilos (sobre todo en gatos).</li>
<li><strong>Atropellamientos y caídas</strong> de balcones y ventanas.</li>
<li><strong>Golpe de calor</strong>, especialmente en razas de nariz chata.</li>
<li><strong>Torsión gástrica</strong> en perros grandes: abdomen hinchado, arcadas sin vomitar. Es una urgencia de minutos.</li>
<li><strong>Gato macho que no puede orinar:</strong> también es una urgencia grave.</li>
</ul>

<h2>Cómo prepararte</h2>
<h3>1. Un fondo de emergencias</h3>
<p>Separa una cantidad fija cada mes, por ejemplo $300 a $500, en una cuenta aparte solo para tu mascota. En un par de años tendrás un colchón para la mayoría de las urgencias.</p>
<h3>2. Un seguro para mascotas</h3>
<p>Por una mensualidad, el seguro cubre una parte de los gastos por accidente o enfermedad. Antes de contratar, revisa el deducible, el porcentaje de reembolso, el límite anual, los periodos de espera y qué enfermedades preexistentes o hereditarias excluye. Conviene sobre todo en razas propensas a problemas de salud, como el ${breed("bulldog-frances")}, el ${breed("pug")} o el ${breed("dachshund")}.</p>
<div data-slot="insurance"></div>
<h3>3. Ten a mano</h3>
<ul>
<li>El teléfono y la dirección de una clínica veterinaria 24 horas cercana.</li>
<li>La cartilla de vacunación y el peso actual de tu mascota.</li>
<li>Un ${amz("botiquín para mascotas", "botiquin primeros auxilios mascotas")} básico.</li>
</ul>
<p>Activa la casilla “Incluir seguro” en la ${calc} para ver cuánto cambia tu presupuesto mensual.</p>`,
      faqs: [
        ["¿Cuánto cobra un veterinario por una urgencia?", "Solo la consulta de urgencia suele costar entre $600 y $2,000 en México, según el horario. Los estudios, medicamentos y la hospitalización se cobran aparte."],
        ["¿Vale la pena un seguro para mascotas?", "Suele valer la pena si no tienes un fondo de emergencias o si tu mascota es de una raza propensa a problemas de salud. Revisa bien las exclusiones antes de contratar."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "como-ahorrar-en-gastos-de-mascota",
      title: "12 formas de ahorrar en los gastos de tu perro o gato (sin descuidar su salud)",
      description: "Consejos prácticos para gastar menos en comida, veterinario, antipulgas y estética de tu mascota, sin poner en riesgo su salud.",
      intro: "Ahorrar con tu mascota no significa darle lo más barato: muchas veces lo barato sale caro en el veterinario. Estas son las estrategias que de verdad reducen el gasto.",
      body: `
<h2>En la comida (el gasto más grande)</h2>
<ol>
<li><strong>Mide la porción con una ${amz("báscula de cocina", "bascula cocina digital gramos")}.</strong> La mayoría de los dueños sirve de más “a ojo”. Calcula la porción exacta con la ${food}.</li>
<li><strong>Compra el costal grande</strong> y guárdalo en un ${amz("contenedor hermético", "contenedor hermetico croquetas")} para que no se ponga rancio.</li>
<li><strong>Una croqueta de gama media-alta puede salir igual o más barata</strong> que una económica: al ser más densa en nutrientes, se sirve menos cantidad. Compara precio por porción, no por kilo.</li>
<li><strong>Aprovecha la compra recurrente</strong> con descuento de las tiendas en línea y las ofertas por volumen.</li>
<li><strong>Controla los premios:</strong> no más del 10 % de las calorías diarias. Puedes usar sus mismas croquetas como premio.</li>
</ol>

<h2>En salud</h2>
<ol start="6">
<li><strong>La prevención es lo más barato:</strong> vacunas, desparasitación y un chequeo anual cuestan mucho menos que tratar parvovirus, moquillo o una infestación de garrapatas.</li>
<li><strong>Compra antipulgas en paquetes</strong> de 3 o 6 dosis.</li>
<li><strong>Aprovecha las campañas</strong> gratuitas de vacunación antirrábica y de esterilización de tu municipio.</li>
<li><strong>Mantén su peso ideal:</strong> la obesidad causa problemas de articulaciones, diabetes y corazón.</li>
<li><strong>Cepilla sus dientes</strong> con un ${amz("cepillo y pasta para mascotas", "kit cepillo dientes perro")}: una limpieza dental con anestesia cuesta varios miles de pesos.</li>
</ol>

<h2>En estética y accesorios</h2>
<ol start="11">
<li><strong>Baña y cepilla en casa</strong> entre visitas a la estética. Un ${amz("cepillo deslanador", "cepillo deslanador")} y un ${amz("cortaúñas", "cortauñas perro")} se pagan solos en pocos meses.</li>
<li><strong>Compra pocos juguetes, pero resistentes.</strong> Rota los juguetes cada semana para que parezcan nuevos.</li>
</ol>

<h2>¿Cuánto podrías ahorrar?</h2>
<p>Abre la ${calc}, anota tu total actual y luego despliega “Ajustar precios a mi ciudad” para probar con otros precios de comida o estética. Verás de inmediato cuánto ahorras al mes y en toda la vida de tu mascota.</p>`,
      faqs: [
        ["¿Cuál es el gasto más grande de tener un perro?", "Normalmente la comida, seguida del veterinario y la estética. En perros grandes la comida puede ser más de la mitad del gasto mensual."],
        ["¿Es malo darle croquetas económicas a mi perro?", "No necesariamente, pero conviene comparar el precio por porción diaria y no por kilo, y vigilar que su pelo, peso y digestión estén bien."]
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "como-elegir-croquetas",
      title: "Cómo elegir las mejores croquetas para tu perro o gato (sin gastar de más)",
      description: "Guía para leer la etiqueta de las croquetas, entender ingredientes, proteínas y kcal, y elegir el mejor alimento por calidad y precio para tu mascota.",
      intro: "En el pasillo de croquetas hay decenas de marcas con fotos de carne y promesas de “premium”. Esta guía te ayuda a leer la etiqueta y elegir con criterio, en lugar de por el empaque.",
      body: `
<h2>1. Elige según edad y tamaño</h2>
<p>Un cachorro necesita más energía, proteína y calcio controlado que un adulto; un senior, menos calorías. En perros, las fórmulas para razas grandes cuidan el crecimiento de las articulaciones y las de razas chicas tienen croquetas más pequeñas. Los gatos necesitan alimento específico para gatos: tienen requerimientos de taurina y proteína que el alimento de perro no cubre.</p>

<h2>2. Lee la lista de ingredientes</h2>
<ul>
<li>Los ingredientes se enlistan de mayor a menor cantidad. Idealmente, el primero debe ser una fuente de proteína animal identificada (pollo, cordero, salmón, “harina de pollo”).</li>
<li>“Harina de pollo” no es mala: es carne deshidratada y concentra más proteína que el pollo fresco, que tiene mucha agua.</li>
<li>Desconfía de etiquetas vagas como “carne y subproductos” sin especificar el animal.</li>
<li>Los cereales no son malos por sí mismos; el problema es cuando dominan la lista.</li>
</ul>

<h2>3. Revisa el análisis garantizado</h2>
<div class="table-scroll"><table><thead><tr><th>Nutriente</th><th>Perro adulto (orientativo)</th><th>Gato adulto (orientativo)</th></tr></thead><tbody>
<tr><td>Proteína</td><td>22 % – 30 %</td><td>30 % – 40 %</td></tr>
<tr><td>Grasa</td><td>10 % – 18 %</td><td>12 % – 20 %</td></tr>
<tr><td>Fibra</td><td>2 % – 5 %</td><td>1 % – 4 %</td></tr>
</tbody></table></div>

<h2>4. Busca las kcal por kilo</h2>
<p>La “energía metabolizable” (kcal/kg) te dice cuánta comida necesita servir. Con ese dato, la ${food} te da la porción exacta en gramos.</p>

<h2>5. Compara el precio por porción diaria, no por kilo</h2>
<p>Un ejemplo: un perro de 20 kg puede necesitar unos 320 g al día de una croqueta económica de 3,300 kcal/kg, pero solo unos 270 g de una de 3,900 kcal/kg. Si la económica cuesta $50/kg y la mejor $65/kg, la diferencia real por día es mucho menor de lo que sugiere la etiqueta: unos $16 contra $17.7. Y las croquetas de mejor calidad suelen producir menos heces y un mejor pelaje.</p>

<h2>6. Haz el cambio poco a poco</h2>
<p>Cambia de alimento en 7 días: mezcla 25 % del nuevo con 75 % del anterior durante dos días, luego mitad y mitad, luego 75/25, y al final solo el nuevo. Así evitas diarreas.</p>

<h2>Dónde comprar más barato</h2>
<p>Compara precios de ${amz("croquetas para perro", "croquetas perro adulto")} y ${amz("croquetas para gato", "croquetas gato adulto")} en línea: los costales grandes y la compra recurrente suelen tener los mejores precios por kilo. Después, mira cuánto representa la comida en tu presupuesto con la ${calc}.</p>`,
      faqs: [
        ["¿Qué croquetas son mejores para mi perro?", "Las que corresponden a su edad y tamaño, con una proteína animal identificada como primer ingrediente y que le sienten bien (buen peso, pelo brillante, heces firmes). Tu veterinario puede orientarte según su salud."],
        ["¿Las croquetas sin granos son mejores?", "No necesariamente. Solo son necesarias en casos específicos de alergia. Consulta con tu veterinario antes de elegir una dieta sin granos."]
      ]
    }
  ];
};
