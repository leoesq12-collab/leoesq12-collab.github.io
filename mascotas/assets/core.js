/*
 * Datos y lógica de cálculo. Sin dependencias del navegador:
 * lo usan la web (window.PetCore) y el generador de páginas (Node).
 */
(function (root) {
  "use strict";

  // Precios de referencia por país, en moneda local. Son estimaciones de gama media
  // y el usuario puede ajustarlas en la calculadora.
  var COUNTRIES = {
    mx: { name: "México", currency: "MXN", locale: "es-MX", store: "amazon.com.mx",
      prices: { foodKg: 80, vetVisit: 500, vaccinesYear: 1200, antiparasiticMonth: 200, grooming: 350,
        insuranceMonth: 300, toysMonth: 200, litterMonth: 250, sterilization: 2000, microchip: 400, starterKit: 1500 } },
    es: { name: "España", currency: "EUR", locale: "es-ES", store: "amazon.es",
      prices: { foodKg: 4.5, vetVisit: 40, vaccinesYear: 80, antiparasiticMonth: 10, grooming: 30,
        insuranceMonth: 20, toysMonth: 10, litterMonth: 12, sterilization: 250, microchip: 40, starterKit: 120 } },
    co: { name: "Colombia", currency: "COP", locale: "es-CO", store: "amazon.com",
      prices: { foodKg: 18000, vetVisit: 70000, vaccinesYear: 180000, antiparasiticMonth: 45000, grooming: 50000,
        insuranceMonth: 50000, toysMonth: 30000, litterMonth: 40000, sterilization: 300000, microchip: 80000, starterKit: 250000 } },
    cl: { name: "Chile", currency: "CLP", locale: "es-CL", store: "amazon.com",
      prices: { foodKg: 5000, vetVisit: 25000, vaccinesYear: 50000, antiparasiticMonth: 12000, grooming: 20000,
        insuranceMonth: 15000, toysMonth: 10000, litterMonth: 10000, sterilization: 90000, microchip: 20000, starterKit: 80000 } },
    pe: { name: "Perú", currency: "PEN", locale: "es-PE", store: "amazon.com",
      prices: { foodKg: 18, vetVisit: 60, vaccinesYear: 150, antiparasiticMonth: 40, grooming: 50,
        insuranceMonth: 60, toysMonth: 30, litterMonth: 35, sterilization: 300, microchip: 60, starterKit: 250 } },
    us: { name: "Estados Unidos", currency: "USD", locale: "es-US", store: "amazon.com",
      prices: { foodKg: 6, vetVisit: 70, vaccinesYear: 150, antiparasiticMonth: 25, grooming: 60,
        insuranceMonth: 40, toysMonth: 20, litterMonth: 20, sterilization: 300, microchip: 50, starterKit: 200 } }
  };

  var PRICE_LABELS = {
    foodKg: "Alimento seco (por kg, gama media)",
    vetVisit: "Consulta veterinaria",
    vaccinesYear: "Vacunas al año",
    antiparasiticMonth: "Antipulgas y desparasitante (mes, talla chica)",
    grooming: "Estética / baño profesional (sesión)",
    insuranceMonth: "Seguro para mascotas (mes)",
    toysMonth: "Juguetes, premios y accesorios (mes)",
    litterMonth: "Arena para gato (mes)",
    sterilization: "Esterilización (talla chica)",
    microchip: "Microchip",
    starterKit: "Kit inicial: cama, plato, correa, transportadora"
  };

  // weight: kg adulto promedio · coat: corto | medio | largo · life: años de esperanza de vida
  var BREEDS = [
    { slug: "chihuahua", name: "Chihuahua", species: "perro", weight: 2.5, coat: "corto", life: 15 },
    { slug: "yorkshire-terrier", name: "Yorkshire Terrier", species: "perro", weight: 3, coat: "largo", life: 14 },
    { slug: "pomerania", name: "Pomerania", species: "perro", weight: 2.5, coat: "largo", life: 14 },
    { slug: "caniche-toy", name: "Caniche (Poodle) toy", species: "perro", weight: 3, coat: "largo", life: 15 },
    { slug: "maltes", name: "Bichón Maltés", species: "perro", weight: 3.5, coat: "largo", life: 14 },
    { slug: "shih-tzu", name: "Shih Tzu", species: "perro", weight: 6, coat: "largo", life: 13 },
    { slug: "schnauzer-miniatura", name: "Schnauzer miniatura", species: "perro", weight: 7, coat: "medio", life: 14 },
    { slug: "dachshund", name: "Dachshund (salchicha)", species: "perro", weight: 8, coat: "corto", life: 14 },
    { slug: "pug", name: "Pug", species: "perro", weight: 8, coat: "corto", life: 13 },
    { slug: "bulldog-frances", name: "Bulldog Francés", species: "perro", weight: 11, coat: "corto", life: 11 },
    { slug: "beagle", name: "Beagle", species: "perro", weight: 11, coat: "corto", life: 13 },
    { slug: "cocker-spaniel", name: "Cocker Spaniel", species: "perro", weight: 13, coat: "largo", life: 13 },
    { slug: "border-collie", name: "Border Collie", species: "perro", weight: 18, coat: "medio", life: 13 },
    { slug: "husky-siberiano", name: "Husky Siberiano", species: "perro", weight: 23, coat: "medio", life: 13 },
    { slug: "bulldog-ingles", name: "Bulldog Inglés", species: "perro", weight: 23, coat: "corto", life: 9 },
    { slug: "labrador-retriever", name: "Labrador Retriever", species: "perro", weight: 30, coat: "corto", life: 12 },
    { slug: "golden-retriever", name: "Golden Retriever", species: "perro", weight: 30, coat: "largo", life: 11 },
    { slug: "boxer", name: "Bóxer", species: "perro", weight: 30, coat: "corto", life: 11 },
    { slug: "pastor-aleman", name: "Pastor Alemán", species: "perro", weight: 32, coat: "medio", life: 11 },
    { slug: "rottweiler", name: "Rottweiler", species: "perro", weight: 45, coat: "corto", life: 10 },
    { slug: "gran-danes", name: "Gran Danés", species: "perro", weight: 60, coat: "corto", life: 8 },
    { slug: "gato-domestico", name: "Gato doméstico (mestizo)", species: "gato", weight: 4.5, coat: "corto", life: 15 },
    { slug: "siames", name: "Siamés", species: "gato", weight: 4, coat: "corto", life: 15 },
    { slug: "persa", name: "Persa", species: "gato", weight: 4.5, coat: "largo", life: 14 },
    { slug: "british-shorthair", name: "British Shorthair", species: "gato", weight: 5.5, coat: "corto", life: 15 },
    { slug: "bengali", name: "Bengalí", species: "gato", weight: 5, coat: "corto", life: 14 },
    { slug: "ragdoll", name: "Ragdoll", species: "gato", weight: 6, coat: "largo", life: 14 },
    { slug: "maine-coon", name: "Maine Coon", species: "gato", weight: 7, coat: "largo", life: 13 },
    { slug: "esfinge", name: "Esfinge (Sphynx)", species: "gato", weight: 4, coat: "corto", life: 13 }
  ];

  var SIZE_NAMES = { chica: "chica", mediana: "mediana", grande: "grande", gigante: "gigante" };
  var SIZE_MULT = { chica: 1, mediana: 1.3, grande: 1.7, gigante: 2.2 };
  var GROOM_SIZE = { chica: 1, mediana: 1.25, grande: 1.6, gigante: 2 };

  function sizeFor(species, kg) {
    if (species === "gato") return "chica";
    if (kg < 10) return "chica";
    if (kg < 25) return "mediana";
    if (kg < 45) return "grande";
    return "gigante";
  }

  function findBreed(slug) {
    for (var i = 0; i < BREEDS.length; i++) if (BREEDS[i].slug === slug) return BREEDS[i];
    return null;
  }

  // Energía diaria (kcal) con la fórmula RER = 70 · peso^0.75 y factores de mantenimiento.
  function dailyKcal(species, kg, stage, neutered, activity) {
    var rer = 70 * Math.pow(kg, 0.75);
    var f;
    if (species === "gato") {
      f = stage === "cachorro" ? 2.5 : stage === "senior" ? 1.1 : (neutered ? 1.2 : 1.4);
      f *= activity === "baja" ? 0.9 : activity === "alta" ? 1.15 : 1;
    } else {
      f = stage === "cachorro" ? 2.5 : stage === "senior" ? 1.4 : (neutered ? 1.6 : 1.8);
      f *= activity === "baja" ? 0.85 : activity === "alta" ? 1.3 : 1;
    }
    return rer * f;
  }

  var FOOD_KCAL_PER_KG = {
    perro: { economica: 3300, media: 3600, premium: 3900 },
    gato: { economica: 3500, media: 3800, premium: 4000 }
  };
  var QUALITY_PRICE = { economica: 0.6, media: 1, premium: 1.8 };

  /*
   * input: { species, breed, weight, coat, life, stage, neutered, activity, quality,
   *          insurance, grooming }
   * prices: objeto con las mismas claves que COUNTRIES.xx.prices
   */
  function calculate(input, prices) {
    var species = input.species === "gato" ? "gato" : "perro";
    var kg = Math.max(0.5, Number(input.weight) || 1);
    var size = sizeFor(species, kg);
    var sm = SIZE_MULT[size];
    var quality = QUALITY_PRICE[input.quality] ? input.quality : "media";

    var kcal = dailyKcal(species, kg, input.stage, input.neutered, input.activity);
    var gramsDay = kcal / FOOD_KCAL_PER_KG[species][quality] * 1000;
    var kgMonth = gramsDay * 30.4 / 1000;

    var monthly = [];
    function add(key, label, value) { if (value > 0) monthly.push({ key: key, label: label, value: value }); }

    add("food", "Alimento (" + Math.round(gramsDay) + " g/día)", kgMonth * prices.foodKg * QUALITY_PRICE[quality]);

    var visits = input.stage === "adulto" ? 1 : input.stage === "cachorro" ? 3 : 2;
    add("vet", "Veterinario y vacunas (prorrateado)", (visits * prices.vetVisit + prices.vaccinesYear) / 12);
    add("parasites", "Antipulgas y desparasitante", prices.antiparasiticMonth * (species === "gato" ? 0.9 : sm));

    if (input.grooming) {
      var sessions = species === "gato"
        ? (input.coat === "largo" ? 0.33 : 0)
        : (input.coat === "largo" ? 1 : input.coat === "medio" ? 0.5 : 0.25);
      add("grooming", "Estética y baños", sessions * prices.grooming * GROOM_SIZE[size]);
    }
    if (species === "gato") add("litter", "Arena sanitaria", prices.litterMonth);
    add("toys", "Juguetes, premios y accesorios", prices.toysMonth * (species === "gato" ? 0.8 : Math.min(sm, 1.5)));
    if (input.insurance) {
      add("insurance", "Seguro para mascotas", prices.insuranceMonth * (species === "gato" ? 0.8 : size === "grande" || size === "gigante" ? 1.2 : 1));
    }

    var initial = [];
    initial.push({ key: "kit", label: "Kit inicial (cama, platos, correa, transportadora)", value: prices.starterKit * (species === "gato" ? 1 : Math.min(sm, 1.6)) });
    initial.push({ key: "chip", label: "Microchip", value: prices.microchip });
    if (!input.neutered) {
      initial.push({ key: "sterilization", label: "Esterilización", value: prices.sterilization * (species === "gato" ? 0.7 : sm) });
    }

    var monthTotal = monthly.reduce(function (s, x) { return s + x.value; }, 0);
    var initialTotal = initial.reduce(function (s, x) { return s + x.value; }, 0);
    var life = Number(input.life) || (species === "gato" ? 15 : 12);

    return {
      species: species,
      size: size,
      kcal: kcal,
      gramsDay: gramsDay,
      monthly: monthly,
      initial: initial,
      monthTotal: monthTotal,
      yearTotal: monthTotal * 12,
      initialTotal: initialTotal,
      firstYear: monthTotal * 12 + initialTotal,
      life: life,
      lifetime: monthTotal * 12 * life + initialTotal
    };
  }

  function formatMoney(value, country) {
    var c = COUNTRIES[country] || COUNTRIES.mx;
    try {
      return new Intl.NumberFormat(c.locale, { style: "currency", currency: c.currency, maximumFractionDigits: 0 }).format(value);
    } catch (e) {
      return c.currency + " " + Math.round(value).toLocaleString();
    }
  }

  var api = {
    COUNTRIES: COUNTRIES,
    PRICE_LABELS: PRICE_LABELS,
    BREEDS: BREEDS,
    SIZE_NAMES: SIZE_NAMES,
    findBreed: findBreed,
    sizeFor: sizeFor,
    dailyKcal: dailyKcal,
    calculate: calculate,
    formatMoney: formatMoney
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PetCore = api;
})(typeof window !== "undefined" ? window : this);
