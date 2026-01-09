const rawBlogs = [
  {
    slug: "rap-architecture",
    titleHtml: "Architecture RAP : structurer un service robuste",
    titleText: "architecture rap structurer un service robuste",
    descriptionHtml:
      "Comment organiser les artefacts RAP (tables, CDS, BDEF, service binding) pour un flux propre, testable et maintenable.",
    descriptionText:
      "comment organiser les artefacts rap tables cds bdef service binding pour un flux propre testable et maintenable",
    date: "2024-08-12",
    tags: ["RAP", "Architecture"],
    coverImage: "",
    contentText:
      "Architecture RAP tables CDS BDEF service binding separation du modele et de l ui bonnes pratiques testabilite",
    sections: [
      {
        id: "contexte",
        headingHtml: "Contexte",
        bodyHtml: [
          "Le challenge RAP est de garder une s&eacute;paration claire entre les couches, tout en facilitant l&rsquo;&eacute;volution de l&rsquo;application.",
        ],
      },
      {
        id: "structure",
        headingHtml: "Structure recommand&eacute;e",
        bodyHtml: [
          "Je d&eacute;coupe syst&eacute;matiquement les objets en tables de persistance, CDS Interface (ZI), CDS Projection (ZC), BDEF, et service binding OData V4.",
        ],
        listHtml: [
          "ZI pour le mod&egrave;le s&eacute;mantique stable",
          "ZC pour l&rsquo;exposition UI et les annotations",
          "BDEF pour les r&egrave;gles transactionnelles",
        ],
      },
      {
        id: "bonne-pratique",
        headingHtml: "Bonnes pratiques",
        bodyHtml: [
          "Des conventions de nommage et une documentation minimaliste suffisent &agrave; garder un projet lisible pour l&rsquo;&eacute;quipe.",
        ],
      },
    ],
  },
  {
    slug: "debug-abap",
    titleHtml: "Debug ABAP efficace : m&eacute;thode et r&eacute;flexes",
    titleText: "debug abap efficace methode et reflexes",
    descriptionHtml:
      "Un guide court pour isoler rapidement un probl&egrave;me ABAP avec des r&egrave;gles simples et reproductibles.",
    descriptionText:
      "un guide court pour isoler rapidement un probleme abap avec des regles simples et reproductibles",
    date: "2024-07-29",
    tags: ["ABAP", "Debug"],
    coverImage: "",
    contentText:
      "debug abap breakpoints watchpoints isolation du flux tests data set minimal",
    sections: [
      {
        id: "cadre",
        headingHtml: "Cadre de d&eacute;bug",
        bodyHtml: [
          "Je commence par limiter la port&eacute;e : un dataset minimal, un flux fonctionnel clair, et un point d&rsquo;entr&eacute;e unique.",
        ],
      },
      {
        id: "reflexes",
        headingHtml: "R&eacute;flexes utiles",
        listHtml: [
          "Valider les donn&eacute;es d&rsquo;entr&eacute;e avant le traitement",
          "Utiliser les watchpoints sur les champs sensibles",
          "Comparer les versions de code dans le transport",
        ],
      },
      {
        id: "resultat",
        headingHtml: "R&eacute;sultat attendu",
        bodyHtml: [
          "Un diagnostic pr&eacute;cis, une correction cibl&eacute;e, et une note rapide pour &eacute;viter la r&eacute;gression.",
        ],
      },
    ],
  },
  {
    slug: "performance-abap",
    titleHtml: "Performance SAP : 7 r&eacute;flexes ABAP pour &eacute;viter ST05 rouge",
    titleText: "performance sap 7 reflexes abap pour eviter st05 rouge",
    descriptionHtml:
      "Des r&egrave;gles simples pour limiter les acc&egrave;s DB, profiler proprement et garder un code fluide.",
    descriptionText:
      "des regles simples pour limiter les acces db profiler proprement et garder un code fluide",
    date: "2024-07-12",
    tags: ["ABAP", "Performance"],
    coverImage: "",
    contentText:
      "performance abap st05 sat select optimise buffer indexes reduction du volume",
    sections: [
      {
        id: "signal",
        headingHtml: "Signaux &agrave; surveiller",
        listHtml: [
          "Multiples SELECT dans des boucles",
          "Tri lourds c&ocirc;t&eacute; ABAP au lieu de SQL",
          "Volume inutilement large",
        ],
      },
      {
        id: "actions",
        headingHtml: "Actions rapides",
        listHtml: [
          "Limiter les colonnes et les lignes",
          "Pr&eacute;f&eacute;rer les jointures c&ocirc;t&eacute; DB",
          "Tracer avec ST05 et SAT",
        ],
      },
    ],
  },
  {
    slug: "odata-pitfalls",
    titleHtml: "OData V2/V4 : pi&egrave;ges fr&eacute;quents et checklist",
    titleText: "odata v2 v4 pieges frequents et checklist",
    descriptionHtml:
      "Une checklist simple pour &eacute;viter les erreurs de m&eacute;tadonn&eacute;es et les incoh&eacute;rences de service.",
    descriptionText:
      "une checklist simple pour eviter les erreurs de metadonnees et les incoherences de service",
    date: "2024-06-28",
    tags: ["OData", "RAP", "Fiori"],
    coverImage: "",
    contentText:
      "odata metadata annotations types exposure binding checks ui consistency",
    sections: [
      {
        id: "checklist",
        headingHtml: "Checklist rapide",
        listHtml: [
          "Valider les annotations critiques",
          "Contr&ocirc;ler les types et les unit&eacute;s",
          "Tester les endpoints avant l&rsquo;UI",
        ],
      },
      {
        id: "exemple",
        headingHtml: "Exemple concret",
        bodyHtml: [
          "Une incoh&eacute;rence de criticality peut bloquer l&rsquo;ouverture de l&rsquo;application. Un check du $metadata suffit souvent &agrave; corriger rapidement.",
        ],
      },
    ],
  },
  {
    slug: "alv-patterns",
    titleHtml: "ALV moderne : patterns r&eacute;utilisables",
    titleText: "alv moderne patterns reutilisables",
    descriptionHtml:
      "Structurer un ALV propre avec des patterns simples : layout, variantes, toolbar et performance.",
    descriptionText:
      "structurer un alv propre avec des patterns simples layout variantes toolbar et performance",
    date: "2024-06-10",
    tags: ["ABAP", "ALV"],
    coverImage: "",
    contentText:
      "alv patterns layout fieldcatalog variantes toolbar callbacks performance",
    sections: [
      {
        id: "structure",
        headingHtml: "Structure type",
        bodyHtml: [
          "Un module de pr&eacute;paration des donn&eacute;es, un module d&rsquo;affichage et un bloc de layout suffisent pour un ALV lisible.",
        ],
      },
      {
        id: "bonus",
        headingHtml: "Bonus",
        listHtml: [
          "Garder les variantes utilisateur",
          "Proposer une toolbar claire",
          "Eviter les colonnes inutiles",
        ],
      },
    ],
  },
  {
    slug: "transport-strategy",
    titleHtml: "Strat&eacute;gie de transports SAP : s&eacute;curiser les mises en prod",
    titleText: "strategie de transports sap securiser les mises en prod",
    descriptionHtml:
      "Une approche simple pour r&eacute;duire les risques en STMS et fiabiliser les mises en production.",
    descriptionText:
      "une approche simple pour reduire les risques en stms et fiabiliser les mises en production",
    date: "2024-05-22",
    tags: ["SAP", "Transports"],
    coverImage: "",
    contentText:
      "strategie transports sap stms dependencies checks rollback plan",
    sections: [
      {
        id: "risques",
        headingHtml: "Risques classiques",
        listHtml: [
          "Ordres mal s&eacute;quenc&eacute;s",
          "D&eacute;pendances non identifi&eacute;es",
          "Fen&ecirc;tres de prod trop courtes",
        ],
      },
      {
        id: "strategie",
        headingHtml: "Strat&eacute;gie recommand&eacute;e",
        bodyHtml: [
          "Je planifie les transports par lot, j&rsquo;ajoute un check syst&eacute;matique des d&eacute;pendances et je garde un plan de rollback clair.",
        ],
      },
    ],
  },
];

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

export const blogs = rawBlogs.map((blog) => {
  const words = wordCount(blog.contentText || "");
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { ...blog, readingTime };
});

export const getBlogBySlug = (slug) => blogs.find((blog) => blog.slug === slug);
