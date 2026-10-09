# Cómo ganar dinero con "Cuánto Cuesta Mi Mascota"

Sitio: https://leoesq12-collab.github.io/mascotas/

Todo lo que activa ingresos está en **un solo archivo: `mascotas/assets/config.js`**.
Lo que dejes vacío no aparece en la web, así que puedes activar las fuentes una por una.

---

## 0. Primero: que Google te encuentre (semana 1)

Sin tráfico no hay ingresos. El sitio ya trae lo necesario para el SEO: títulos y descripciones,
datos estructurados FAQ, `sitemap.xml`, `robots.txt` y 29 páginas de razas que apuntan a
búsquedas reales ("cuánto cuesta tener un labrador", "cuánto come un gato al día").

1. Entra a [Google Search Console](https://search.google.com/search-console) y agrega la propiedad
   `https://leoesq12-collab.github.io/`.
2. En **Sitemaps**, envía `https://leoesq12-collab.github.io/mascotas/sitemap.xml`.
3. Usa **Inspección de URLs** para pedir la indexación de la portada y de 5–10 razas populares.

> Recomendación fuerte: compra un dominio propio (por ejemplo `cuantocuestamimascota.com`,
> ~$250 MXN/año) y conéctalo a GitHub Pages. Rankea mejor, da más confianza y AdSense
> aprueba con más facilidad un dominio propio que un subdominio de github.io.

## 1. Google AdSense (ingreso pasivo por visitas)

Ya está hecho:
- El script de anuncios automáticos con tu cuenta `ca-pub-6906150555937991` está en todas las páginas.
- Se creó `/ads.txt` en la raíz del sitio, que AdSense necesita para pagar sin restricciones.
- Hay una página de privacidad que menciona cookies y publicidad (requisito de AdSense).

Te toca:
1. En AdSense → **Sitios**, agrega el sitio (o tu dominio nuevo) y espera la aprobación.
2. Activa **Anuncios automáticos**.
3. Opcional, para ganar más: crea 2 bloques de anuncio "display" y pega su `data-ad-slot` en
   `adSlots.resultados` y `adSlots.articulo`. Aparecerán justo debajo del resultado de la
   calculadora, que es la zona más vista.
4. Si recibes tráfico de España o la UE, activa en AdSense el **mensaje de consentimiento (CMP)**.

## 2. Amazon Afiliados (la fuente principal en este nicho)

Cada resultado muestra recomendaciones **personalizadas** según la mascota (croquetas de raza
grande, cama ortopédica para seniors, arena para gatos, cepillo para pelo largo…). Los enlaces
abren Amazon de cada país.

1. Regístrate en [Afiliados Amazon México](https://afiliados.amazon.com.mx). Opcionalmente, también en
   Amazon España y Estados Unidos.
2. Copia tu **ID de seguimiento** (algo como `tunombre-20`) y pégalo en `amazonTags.mx`.
3. Ojo: Amazon cancela la cuenta si no logras **3 ventas en los primeros 180 días**. Activa el
   programa cuando ya tengas algo de tráfico, o comparte tú el sitio para lograr esas ventas.

Las comisiones en mascotas suelen ser de un solo dígito porcentual, pero los compradores de
croquetas repiten cada mes y Amazon te paga todo lo que compren en 24 horas, no solo el producto
del enlace.

## 3. Seguro para mascotas (la comisión más alta por cliente)

Ya existe un bloque "Cotizar seguro" que aparece en los resultados y en cada raza. Se muestra en
cuanto pegas un enlace.

1. Busca aseguradoras de mascotas con programa de afiliados o referidos en tu país, directamente
   o en redes de afiliados (Awin, Admitad, CJ…). Comprueba que acepten tráfico de México.
2. Pega tu enlace en `insuranceUrl` y el nombre de la aseguradora en `insuranceName`.

Las razas "caras" (Bulldog Francés, Bulldog Inglés, Pug, Dachshund) ya dicen en su texto que el
seguro conviene, así que son las páginas que mejor van a convertir.

## 4. Lista de correo (tu activo más valioso a largo plazo)

El formulario ofrece una *"checklist del primer mes con tu mascota"*.

1. Crea una cuenta gratis en [Formspree](https://formspree.io), MailerLite o Brevo.
2. Pega la URL del formulario en `newsletterAction`.
3. Escribe la checklist (un PDF de 1–2 páginas: vacunas, compras, trámites) y envíala con un
   correo automático de bienvenida.
4. Cada mes manda un correo con un consejo útil y 2–3 productos recomendados (afiliados).

## 5. Producto digital propio (margen casi del 100 %)

Ya existe un bloque para vender un **"Planificador de gastos para tu mascota (Excel + PDF)"**.

1. Crea la plantilla: control de gastos mensual, calendario de vacunas y desparasitación,
   y presupuesto anual. Puedo ayudarte a hacerla.
2. Súbela a Gumroad, Hotmart o Lemon Squeezy y ponle un precio de unos $99 MXN.
3. Pega el enlace en `productUrl` (y ajusta `productPrice`).

---

## Cómo conseguir más tráfico

- **TikTok / Reels / Shorts:** "¿Cuánto cuesta realmente tener un Bulldog Francés?", con captura
  de la calculadora y el enlace en la bio. Este formato se viraliza mucho.
- **Pinterest:** un pin por raza con el costo mensual. Pinterest manda tráfico durante meses.
- **Grupos de Facebook** de adopción y de razas: la calculadora es útil, no spam.
- **Refugios y veterinarias:** ofréceles la calculadora para que la compartan con quienes van a adoptar.
- **Botón de WhatsApp:** cada resultado se puede compartir, y la URL guarda el cálculo.

## Crecer el sitio (más páginas = más búsquedas = más ingresos)

Para agregar razas o cambiar precios, edita `mascotas/assets/core.js` (la lista `BREEDS` y los
`prices` de cada país) y agrega su texto en `NOTES` dentro de `mascotas/scripts/generar.js`.
Después regenera el sitio:

```bash
node mascotas/scripts/generar.js
```

Ideas de páginas nuevas con mucha búsqueda en México:
- ¿Cuánto cuesta esterilizar a un perro o un gato?
- ¿Cuánto cuesta vacunar a un cachorro? (calendario de vacunas)
- Las mejores croquetas por calidad y precio (página de comparativa = afiliados)
- Las razas de perro más baratas de mantener (ya existe un ranking en `/razas/`; puede convertirse en artículo)

## Expectativas realistas

Un sitio nuevo tarda normalmente de **3 a 6 meses** en empezar a posicionarse en Google. Los
primeros ingresos suelen llegar por afiliados y por compartirlo en redes, antes que por AdSense.
La clave es la constancia: agregar contenido nuevo cada semana y medir en Search Console qué
búsquedas te traen visitas.
