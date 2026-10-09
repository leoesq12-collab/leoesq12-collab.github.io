/* Interfaz de las calculadoras y bloques de monetización. */
(function () {
  "use strict";
  var Core = window.PetCore;
  var CFG = window.SITE_CONFIG || {};
  var PRICE_STORE_KEY = "mascotas-precios-v1";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Afiliados ---------- */

  var PRODUCTS = [
    { id: "food", title: "Croquetas de buena calidad", why: "La comida es el gasto más grande: comprar el bulto grande suele salir hasta 30 % más barato por kg.",
      q: function (r) { return r.species === "gato" ? "croquetas gato adulto" : "croquetas perro raza " + r.size; }, when: function () { return true; } },
    { id: "scale", title: "Báscula de cocina digital", why: "Medir la porción en gramos evita sobrealimentar (y gastar de más).",
      q: function () { return "bascula cocina digital gramos"; }, when: function () { return true; } },
    { id: "parasites", title: "Antipulgas y desparasitante", why: "Comprarlo en paquete de 3 o 6 dosis baja el costo mensual.",
      q: function (r) { return r.species === "gato" ? "pipeta antipulgas gato" : "antipulgas perro " + r.size; }, when: function () { return true; } },
    { id: "litter", title: "Arena aglomerante", why: "Rinde más que la arena común y se cambia menos seguido.",
      q: function () { return "arena aglomerante gato"; }, when: function (r) { return r.species === "gato"; } },
    { id: "scratcher", title: "Rascador para gato", why: "Protege tus muebles y le da ejercicio.",
      q: function () { return "rascador gato torre"; }, when: function (r) { return r.species === "gato"; } },
    { id: "bed", title: "Cama ortopédica", why: "Recomendada para razas grandes y perros senior: cuida sus articulaciones.",
      q: function (r) { return "cama ortopedica perro " + r.size; }, when: function (r, i) { return r.species === "perro" && (r.size === "grande" || r.size === "gigante" || i.stage === "senior"); } },
    { id: "brush", title: "Cepillo deslanador", why: "Cepillar en casa reduce las visitas a la estética.",
      q: function (r) { return "cepillo deslanador " + r.species; }, when: function (r, i) { return i.coat !== "corto"; } },
    { id: "slowfeeder", title: "Comedero lento", why: "Ayuda a perros que comen muy rápido o con tendencia al sobrepeso.",
      q: function () { return "comedero lento perro"; }, when: function (r, i) { return r.species === "perro" && i.activity === "baja"; } },
    { id: "kong", title: "Juguete interactivo rellenable", why: "Un solo juguete resistente dura más que muchos baratos.",
      q: function (r) { return r.species === "gato" ? "juguete interactivo gato" : "juguete rellenable perro resistente"; }, when: function () { return true; } },
    { id: "carrier", title: "Transportadora", why: "Indispensable para ir al veterinario.",
      q: function (r) { return "transportadora " + r.species; }, when: function (r) { return r.species === "gato" || r.size === "chica"; } }
  ];

  function storeUrl(country, query) {
    var c = Core.COUNTRIES[country] || Core.COUNTRIES.mx;
    var tags = CFG.amazonTags || {};
    var tag = c.store === "amazon.com.mx" ? tags.mx : c.store === "amazon.es" ? tags.es : tags.us;
    var url = "https://www." + c.store + "/s?k=" + encodeURIComponent(query);
    if (tag) url += "&tag=" + encodeURIComponent(tag);
    return url;
  }

  function productsHtml(result, input, country, max) {
    var list = PRODUCTS.filter(function (p) { return p.when(result, input); }).slice(0, max || 6);
    return '<div class="products">' + list.map(function (p) {
      return '<a class="product" rel="sponsored nofollow noopener" target="_blank" href="' + esc(storeUrl(country, p.q(result))) + '">' +
        "<strong>" + esc(p.title) + "</strong><span>" + esc(p.why) + '</span><em>Ver precios →</em></a>';
    }).join("") + '</div><p class="disclosure">Algunos enlaces son de afiliado: si compras, recibimos una pequeña comisión sin costo extra para ti. Así mantenemos gratis esta herramienta.</p>';
  }

  /* ---------- Bloques reutilizables ---------- */

  function adHtml(slotName) {
    var slot = CFG.adSlots && CFG.adSlots[slotName];
    if (!CFG.adsenseClient || !slot) return "";
    return '<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="' + esc(CFG.adsenseClient) +
      '" data-ad-slot="' + esc(slot) + '" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';
  }
  function activateAds(ctx) {
    var ins = ctx.querySelectorAll("ins.adsbygoogle:not([data-pushed])");
    for (var i = 0; i < ins.length; i++) {
      ins[i].setAttribute("data-pushed", "1");
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* bloqueador de anuncios */ }
    }
  }

  function insuranceHtml() {
    if (!CFG.insuranceUrl) return "";
    return '<div class="cta cta-insurance"><div><strong>Una emergencia veterinaria puede costar más que un año de comida.</strong>' +
      "<span>Cotiza un seguro para tu mascota" + (CFG.insuranceName ? " con " + esc(CFG.insuranceName) : "") + " en 2 minutos.</span></div>" +
      '<a class="btn" rel="sponsored nofollow noopener" target="_blank" href="' + esc(CFG.insuranceUrl) + '">Cotizar seguro</a></div>';
  }

  function productCtaHtml() {
    if (!CFG.productUrl) return "";
    return '<div class="cta cta-product"><div><strong>' + esc(CFG.productName) + "</strong>" +
      "<span>Registra cada gasto, recibe alertas de vacunas y controla tu presupuesto mes a mes.</span></div>" +
      '<a class="btn" target="_blank" rel="noopener" href="' + esc(CFG.productUrl) + '">Obtener por ' + esc(CFG.productPrice) + "</a></div>";
  }

  function newsletterHtml() {
    if (!CFG.newsletterAction) return "";
    return '<form class="cta cta-news" method="POST" action="' + esc(CFG.newsletterAction) + '">' +
      "<div><strong>Recibe gratis la checklist del primer mes con tu mascota</strong>" +
      "<span>Vacunas, compras y trámites, más trucos para ahorrar. Sin spam.</span></div>" +
      '<div class="news-row"><input type="email" name="email" required placeholder="tu@correo.com" aria-label="Correo electrónico">' +
      '<button class="btn" type="submit">Quiero la checklist</button></div></form>';
  }

  window.PetUI = { adHtml: adHtml, activateAds: activateAds, insuranceHtml: insuranceHtml,
    productCtaHtml: productCtaHtml, newsletterHtml: newsletterHtml, productsHtml: productsHtml };

  /* ---------- Calculadora de costos ---------- */

  function loadCustomPrices() {
    try { return JSON.parse(localStorage.getItem(PRICE_STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveCustomPrices(all) {
    try { localStorage.setItem(PRICE_STORE_KEY, JSON.stringify(all)); } catch (e) { /* sin almacenamiento */ }
  }

  function breedOptions(species, selected) {
    return Core.BREEDS.filter(function (b) { return b.species === species; }).map(function (b) {
      return '<option value="' + b.slug + '"' + (b.slug === selected ? " selected" : "") + ">" + esc(b.name) + "</option>";
    }).join("") + '<option value="otro"' + (selected === "otro" ? " selected" : "") + ">Otra raza / mestizo</option>";
  }

  function countryOptions(selected) {
    return Object.keys(Core.COUNTRIES).map(function (k) {
      return '<option value="' + k + '"' + (k === selected ? " selected" : "") + ">" + esc(Core.COUNTRIES[k].name) + " (" + Core.COUNTRIES[k].currency + ")</option>";
    }).join("");
  }

  function readInitialState(el) {
    var p = new URLSearchParams(location.search);
    var breedSlug = el.getAttribute("data-breed") || p.get("raza") || "labrador-retriever";
    var breed = Core.findBreed(breedSlug);
    var species = breed ? breed.species : (p.get("especie") === "gato" ? "gato" : "perro");
    var country = p.get("pais");
    if (!Core.COUNTRIES[country]) country = CFG.defaultCountry || "mx";
    return {
      species: species,
      breed: breed ? breed.slug : "otro",
      weight: Number(p.get("peso")) || (breed ? breed.weight : (species === "gato" ? 4.5 : 15)),
      coat: p.get("pelo") || (breed ? breed.coat : "corto"),
      life: breed ? breed.life : (species === "gato" ? 15 : 12),
      stage: p.get("etapa") || "adulto",
      neutered: p.get("esterilizado") === "1",
      activity: p.get("actividad") || "normal",
      quality: p.get("calidad") || "media",
      country: country,
      grooming: p.get("estetica") !== "0",
      insurance: p.get("seguro") === "1"
    };
  }

  function seg(name, options, value) {
    return '<div class="seg" role="radiogroup">' + options.map(function (o) {
      return '<label><input type="radio" name="' + name + '" value="' + o[0] + '"' + (o[0] === value ? " checked" : "") + "><span>" + o[1] + "</span></label>";
    }).join("") + "</div>";
  }

  function formHtml(s) {
    return '<form class="calc-form" novalidate>' +
      '<div class="field full">' + seg("species", [["perro", "🐶 Perro"], ["gato", "🐱 Gato"]], s.species) + "</div>" +
      '<label class="field"><span>Raza</span><select name="breed">' + breedOptions(s.species, s.breed) + "</select></label>" +
      '<label class="field"><span>Peso adulto (kg)</span><input name="weight" type="number" min="0.5" max="100" step="0.5" inputmode="decimal" value="' + s.weight + '"></label>' +
      '<label class="field"><span>Tipo de pelo</span><select name="coat">' +
        [["corto", "Corto"], ["medio", "Medio"], ["largo", "Largo"]].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === s.coat ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") +
      "</select></label>" +
      '<label class="field"><span>País</span><select name="country">' + countryOptions(s.country) + "</select></label>" +
      '<div class="field"><span>Edad</span>' + seg("stage", [["cachorro", "Cachorro"], ["adulto", "Adulto"], ["senior", "Senior"]], s.stage) + "</div>" +
      '<div class="field"><span>Actividad</span>' + seg("activity", [["baja", "Baja"], ["normal", "Normal"], ["alta", "Alta"]], s.activity) + "</div>" +
      '<div class="field"><span>Calidad del alimento</span>' + seg("quality", [["economica", "Económica"], ["media", "Media"], ["premium", "Premium"]], s.quality) + "</div>" +
      '<div class="field checks">' +
        '<label><input type="checkbox" name="neutered"' + (s.neutered ? " checked" : "") + "> Ya está esterilizado</label>" +
        '<label><input type="checkbox" name="grooming"' + (s.grooming ? " checked" : "") + "> Incluir estética</label>" +
        '<label><input type="checkbox" name="insurance"' + (s.insurance ? " checked" : "") + "> Incluir seguro</label>" +
      "</div>" +
      '<details class="field full prices"><summary>Ajustar precios a mi ciudad</summary><div class="price-grid"></div>' +
        '<button type="button" class="link reset-prices">Restablecer precios</button></details>' +
      "</form>";
  }

  function priceGridHtml(prices, country) {
    var cur = Core.COUNTRIES[country].currency;
    return Object.keys(Core.PRICE_LABELS).map(function (k) {
      return '<label><span>' + esc(Core.PRICE_LABELS[k]) + " (" + cur + ')</span><input type="number" min="0" step="any" data-price="' + k + '" value="' + prices[k] + '"></label>';
    }).join("");
  }

  function resultsHtml(r, s) {
    var m = function (v) { return Core.formatMoney(v, s.country); };
    var max = Math.max.apply(null, r.monthly.map(function (x) { return x.value; }));
    var breed = Core.findBreed(s.breed);
    var who = breed ? breed.name : (r.species === "gato" ? "tu gato" : "tu perro");
    return '<div class="totals">' +
        '<div class="total main"><span>Al mes</span><strong>' + m(r.monthTotal) + "</strong></div>" +
        '<div class="total"><span>Al año</span><strong>' + m(r.yearTotal) + "</strong></div>" +
        '<div class="total"><span>Primer año</span><strong>' + m(r.firstYear) + "</strong><small>incluye gastos iniciales</small></div>" +
        '<div class="total"><span>Toda su vida (~' + r.life + " años)</span><strong>" + m(r.lifetime) + "</strong></div>" +
      "</div>" +
      "<h3>¿En qué se va el dinero cada mes?</h3>" +
      '<ul class="bars">' + r.monthly.slice().sort(function (a, b) { return b.value - a.value; }).map(function (x) {
        return '<li><div class="bar-label"><span>' + esc(x.label) + "</span><b>" + m(x.value) + '</b></div><div class="bar"><i style="width:' + Math.max(3, x.value / max * 100).toFixed(1) + '%"></i></div></li>';
      }).join("") + "</ul>" +
      "<h3>Gastos únicos al llegar a casa</h3>" +
      '<ul class="once">' + r.initial.map(function (x) { return "<li><span>" + esc(x.label) + "</span><b>" + m(x.value) + "</b></li>"; }).join("") + "</ul>" +
      '<p class="food-note">🍽️ ' + esc(who) + " necesita unas <b>" + Math.round(r.kcal) + " kcal</b> al día ≈ <b>" + Math.round(r.gramsDay) +
        ' g de alimento seco</b>. <a href="/mascotas/comida.html?especie=' + r.species + "&peso=" + s.weight + "&etapa=" + s.stage + '">Calcula la porción exacta de tu marca →</a></p>' +
      '<div class="share"><button type="button" class="btn ghost copy-link">🔗 Copiar enlace</button>' +
        '<a class="btn ghost wa" target="_blank" rel="noopener" href="https://wa.me/?text=' +
          encodeURIComponent("Tener un " + who + " cuesta aprox. " + m(r.monthTotal) + " al mes. Calcula el tuyo: " + location.href) + '">Compartir en WhatsApp</a></div>' +
      adHtml("resultados") +
      insuranceHtml() +
      "<h3>Lo que te ayuda a gastar menos</h3>" + productsHtml(r, s, s.country, 6) +
      productCtaHtml() + newsletterHtml() +
      '<p class="disclaimer">Son estimaciones con precios promedio de gama media; cada ciudad y veterinario es distinto. Ajusta los precios arriba para un resultado más exacto. No sustituye la consulta veterinaria.</p>';
  }

  function initCostCalc(el) {
    var state = readInitialState(el);
    var custom = loadCustomPrices();
    var syncUrl = !el.hasAttribute("data-breed");

    el.innerHTML = '<div class="calc-grid"><div class="calc-inputs">' + formHtml(state) + '</div><div class="calc-results" aria-live="polite"></div></div>';
    var form = $(".calc-form", el);
    var out = $(".calc-results", el);
    var grid = $(".price-grid", el);

    function prices() {
      var base = Core.COUNTRIES[state.country].prices;
      var own = custom[state.country] || {};
      var p = {};
      Object.keys(base).forEach(function (k) { p[k] = own[k] != null ? Number(own[k]) : base[k]; });
      return p;
    }

    function render() {
      var r = Core.calculate(state, prices());
      out.innerHTML = resultsHtml(r, state);
      activateAds(out);
      if (syncUrl) {
        var q = new URLSearchParams({ especie: state.species, raza: state.breed, peso: state.weight, pelo: state.coat, etapa: state.stage,
          actividad: state.activity, calidad: state.quality, pais: state.country, esterilizado: state.neutered ? "1" : "0",
          estetica: state.grooming ? "1" : "0", seguro: state.insurance ? "1" : "0" });
        try { history.replaceState(null, "", location.pathname + "?" + q.toString()); } catch (e) { /* file:// */ }
      }
    }

    function renderPrices() { grid.innerHTML = priceGridHtml(prices(), state.country); }

    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-price")) return;
      if (t.name === "species") {
        state.species = t.value;
        var first = Core.BREEDS.filter(function (b) { return b.species === t.value; })[0];
        form.breed.innerHTML = breedOptions(t.value, first.slug);
        applyBreed(first.slug);
      } else if (t.name === "breed") {
        applyBreed(t.value);
      } else if (t.name === "country") {
        state.country = t.value;
        renderPrices();
      } else if (t.type === "checkbox") {
        state[t.name] = t.checked;
      } else if (t.name === "weight") {
        state.weight = Math.min(100, Math.max(0.5, Number(t.value) || state.weight));
      } else if (t.name) {
        state[t.name] = t.value;
      }
      render();
    });
    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-price")) {
        custom[state.country] = custom[state.country] || {};
        custom[state.country][t.getAttribute("data-price")] = Number(t.value) || 0;
        saveCustomPrices(custom);
        render();
      } else if (t.name === "weight" && Number(t.value) > 0) {
        state.weight = Math.min(100, Number(t.value));
        render();
      }
    });
    $(".reset-prices", el).addEventListener("click", function () {
      delete custom[state.country];
      saveCustomPrices(custom);
      renderPrices();
      render();
    });
    out.addEventListener("click", function (e) {
      var b = e.target.closest(".copy-link");
      if (!b) return;
      var done = function () { b.textContent = "✅ Enlace copiado"; setTimeout(function () { b.textContent = "🔗 Copiar enlace"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, function () { prompt("Copia este enlace:", location.href); });
      else prompt("Copia este enlace:", location.href);
    });

    function applyBreed(slug) {
      state.breed = slug;
      var b = Core.findBreed(slug);
      if (b) {
        state.weight = b.weight; state.coat = b.coat; state.life = b.life;
        form.weight.value = b.weight; form.coat.value = b.coat;
      } else {
        state.life = state.species === "gato" ? 15 : 12;
      }
    }

    renderPrices();
    render();
  }

  /* ---------- Calculadora de porciones ---------- */

  function initFoodCalc(el) {
    var p = new URLSearchParams(location.search);
    var s = {
      species: p.get("especie") === "gato" ? "gato" : "perro",
      weight: Number(p.get("peso")) || 10,
      stage: ["cachorro", "adulto", "senior"].indexOf(p.get("etapa")) >= 0 ? p.get("etapa") : "adulto",
      neutered: true, activity: "normal", density: 3600, meals: 2
    };
    el.innerHTML = '<div class="calc-grid"><form class="calc-form" novalidate>' +
      '<div class="field full">' + seg("species", [["perro", "🐶 Perro"], ["gato", "🐱 Gato"]], s.species) + "</div>" +
      '<label class="field"><span>Peso actual (kg)</span><input name="weight" type="number" min="0.5" max="100" step="0.1" inputmode="decimal" value="' + s.weight + '"></label>' +
      '<label class="field"><span>Energía del alimento (kcal/kg)</span><input name="density" type="number" min="2000" max="6000" step="10" value="' + s.density + '"><small>Viene en el costal como “energía metabolizable”.</small></label>' +
      '<div class="field"><span>Edad</span>' + seg("stage", [["cachorro", "Cachorro"], ["adulto", "Adulto"], ["senior", "Senior"]], s.stage) + "</div>" +
      '<div class="field"><span>Actividad</span>' + seg("activity", [["baja", "Baja"], ["normal", "Normal"], ["alta", "Alta"]], s.activity) + "</div>" +
      '<div class="field"><span>Comidas al día</span>' + seg("meals", [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], String(s.meals)) + "</div>" +
      '<div class="field checks"><label><input type="checkbox" name="neutered" checked> Esterilizado</label></div>' +
      '</form><div class="calc-results" aria-live="polite"></div></div>';
    var form = $(".calc-form", el), out = $(".calc-results", el);

    function render() {
      var kcal = Core.dailyKcal(s.species, s.weight, s.stage, s.neutered, s.activity);
      var grams = kcal / s.density * 1000;
      var r = { species: s.species, size: Core.sizeFor(s.species, s.weight) };
      out.innerHTML = '<div class="totals">' +
          '<div class="total main"><span>Al día</span><strong>' + Math.round(grams) + " g</strong></div>" +
          '<div class="total"><span>Por comida (' + s.meals + ")</span><strong>" + Math.round(grams / s.meals) + " g</strong></div>" +
          '<div class="total"><span>Energía diaria</span><strong>' + Math.round(kcal) + " kcal</strong></div>" +
          '<div class="total"><span>Al mes</span><strong>' + (grams * 30.4 / 1000).toFixed(1) + " kg</strong><small>para calcular cuánto te dura el costal</small></div>" +
        "</div>" +
        '<p class="food-note">Una taza medidora estándar contiene aprox. 90–110 g de croquetas: ≈ <b>' + (grams / 100).toFixed(1) +
          " tazas al día</b>. Para ser exacto, pesa la porción con una báscula. Si da premios, réstalos (máx. 10 % de las calorías).</p>" +
        '<p><a class="btn" href="/mascotas/?especie=' + s.species + '">¿Cuánto te cuesta al mes? Calcula todos sus gastos →</a></p>' +
        adHtml("resultados") +
        "<h3>Útil para controlar sus porciones</h3>" + productsHtml(r, { coat: "corto", activity: s.activity, stage: s.stage }, CFG.defaultCountry || "mx", 4) +
        newsletterHtml() +
        '<p class="disclaimer">Cálculo orientativo con la fórmula de requerimiento energético (RER × factor de vida). Cachorros, gestantes, mascotas con sobrepeso o enfermedades necesitan una dieta indicada por su veterinario.</p>';
      activateAds(out);
    }

    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.name === "weight" && Number(t.value) > 0) s.weight = Math.min(100, Number(t.value));
      else if (t.name === "density" && Number(t.value) >= 1000) s.density = Number(t.value);
      else if (t.name === "meals") s.meals = Number(t.value);
      else if (t.name === "neutered") s.neutered = t.checked;
      else if (t.name === "species" || t.name === "stage" || t.name === "activity") s[t.name] = t.value;
      else return;
      render();
    });
    render();
  }

  /* ---------- Bloques estáticos en páginas de contenido ---------- */

  function initSlots() {
    var slots = document.querySelectorAll("[data-slot]");
    for (var i = 0; i < slots.length; i++) {
      var kind = slots[i].getAttribute("data-slot");
      var html = kind === "ad" ? adHtml(slots[i].getAttribute("data-name") || "articulo")
        : kind === "insurance" ? insuranceHtml()
        : kind === "newsletter" ? newsletterHtml()
        : kind === "product" ? productCtaHtml() : "";
      slots[i].innerHTML = html;
      activateAds(slots[i]);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var c = document.getElementById("calc");
    if (c) initCostCalc(c);
    var f = document.getElementById("food-calc");
    if (f) initFoodCalc(f);
    initSlots();
    var links = document.querySelectorAll("a[data-amazon]");
    for (var i = 0; i < links.length; i++) links[i].href = storeUrl(CFG.defaultCountry || "mx", links[i].getAttribute("data-amazon"));
  });
})();
