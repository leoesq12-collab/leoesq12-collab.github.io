/*
 * CONFIGURACIÓN DE MONETIZACIÓN
 * Edita solo este archivo para activar cada fuente de ingresos.
 * Lo que quede vacío ("") simplemente no se muestra en la web.
 * Guía completa: mascotas/MONETIZAR.md
 */
window.SITE_CONFIG = {
  // País que se muestra por defecto (mx, es, co, cl, pe, us)
  defaultCountry: "mx",

  // 1) Amazon Afiliados — tu "tracking ID" de cada programa (ej. "tuetiqueta-21")
  amazonTags: {
    mx: "",  // https://afiliados.amazon.com.mx
    es: "",  // https://afiliados.amazon.es
    us: ""   // https://affiliate-program.amazon.com
  },

  // 2) Google AdSense — el script de anuncios automáticos ya está en cada página.
  //    Si creas bloques manuales en AdSense, pega aquí sus "data-ad-slot".
  adsenseClient: "ca-pub-6906150555937991",
  adSlots: {
    resultados: "", // bloque debajo de los resultados de la calculadora
    articulo: ""    // bloque dentro de las páginas de razas
  },

  // 3) Seguro para mascotas — enlace de afiliado (paga por cotización o póliza)
  insuranceUrl: "",
  insuranceName: "",

  // 4) Lista de correo — URL de acción de Formspree, MailerLite, Brevo, etc.
  //    Ejemplo Formspree: "https://formspree.io/f/abcdwxyz"
  newsletterAction: "",

  // 5) Producto digital propio (Gumroad, Hotmart, Lemon Squeezy...)
  productUrl: "",
  productName: "Planificador de gastos para tu mascota (Excel + PDF)",
  productPrice: "$99 MXN"
};
