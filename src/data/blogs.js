const rawBlogs = [
  {
    slug: "performance-s4hana-optimisation",
    titleHtml: "Optimisation performance SAP en S/4HANA : m&eacute;thode projet",
    titleText: "optimisation performance sap en s4hana methode projet",
    descriptionHtml:
      "Article complet pour consultants techniques : enjeux, anti-patterns, code ABAP 7.50+, outils SAP et cas r&eacute;els.",
    descriptionText:
      "article complet pour consultants techniques enjeux anti patterns code abap 7 50 outils sap et cas reels",
    date: "2026-01-10",
    tags: ["Performance", "ABAP", "S/4HANA"],
    coverImage: "/profile/perfo.jpg",
    contentText:
      "performance sap s4hana abap sql cds views code pushdown st05 sat sm50 sm66 st22 atc sci dbacokcpit optimisation acces base donnees tables internes memoire runtime clean core abap cloud projet reel analyse traces indexes buffer reduction volume criteres select join aggregation cds view annotations odata fiori elements monitoring systeme workload dataset volumetrie regles metier transports risques regression qualite code review refactoring profiling methodique production stability tco business impact sla batch online job scheduling handling dumps performance bottlenecks caching hint select single for all entries hashed table sorted table avoid select in loop avoid nested loop avoid select * use package size buffering proper key fields result set size prevention",
    sections: [
      {
        id: "introduction",
        headingHtml: "Introduction &ndash; Pourquoi la performance est critique en SAP",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    En projet SAP, la performance n&rsquo;est pas un sujet de confort. Elle conditionne
    la fiabilit&eacute; des processus, la tenue des SLA, et la perception globale de la
    solution par le m&eacute;tier. En entretien technique, c&rsquo;est souvent le point
    qui s&eacute;pare un d&eacute;veloppeur correct d&rsquo;un consultant senior.
  </p>
  <p class="muted">
    En S/4HANA, les choix d&rsquo;impl&eacute;mentation se voient imm&eacute;diatement :
    HANA amplifie les bons choix (pushdown, requ&ecirc;tes cibl&eacute;es) et punit les
    mauvais (boucles, SELECT * et traitements ABAP inutiles).
  </p>
  <div class="chip-row">
    <span class="chip">ABAP 7.50+</span>
    <span class="chip">S/4HANA</span>
    <span class="chip">CDS Views</span>
    <span class="chip">Code Pushdown</span>
    <span class="chip">Clean Core</span>
  </div>
</div>`,
        ],
      },
      {
        id: "enjeux",
        headingHtml: "Enjeux business et techniques",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Les impacts sont souvent mesurables : temps de traitement batch, temps de r&eacute;ponse
    en transaction, mont&eacute;e en charge, co&ucirc;t d&rsquo;infrastructure et taux
    d&rsquo;erreur. Techniquement, cela se traduit par des requ&ecirc;tes DB mal cibl&eacute;es,
    des tables internes surdimensionn&eacute;es et des parcours de code trop verbeux.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Impact</span>
        <span>Risque m&eacute;tier</span>
        <span>Sympt&ocirc;me technique</span>
      </div>
      <div class="table-row">
        <span>Temps de r&eacute;ponse</span>
        <span>Perte de productivit&eacute;</span>
        <span>SQL lent, CPU applicatif</span>
      </div>
      <div class="table-row">
        <span>Batch nocturne</span>
        <span>Fen&ecirc;tre non tenue</span>
        <span>Volume, absence d&rsquo;index</span>
      </div>
      <div class="table-row">
        <span>Stabilit&eacute;</span>
        <span>Incidents r&eacute;currents</span>
        <span>Dumps ST22, verrous</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "db",
        headingHtml: "Optimisation des acc&egrave;s base de donn&eacute;es",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    R&egrave;gle d&rsquo;or S/4HANA : faire travailler la base. Le code pushdown via
    CDS Views et Open SQL moderne r&eacute;duit le volume de donn&eacute;es, la latence
    r&eacute;seau et la charge applicative.
  </p>
  <pre class="case-diagram">Flux recommand&eacute;
Utilisateur
  |  (filtres UI)
  v
CDS View (projection)
  |  (associations, annotations)
  v
CDS View (interface)
  |  (joins, calculations)
  v
Base HANA
  |  (pushdown, agr&eacute;gations)</pre>
  <pre class="code-block">"ABAP 7.50+ : Open SQL cibl&eacute; et pushdown
SELECT FROM zso_hdr AS hdr
  INNER JOIN zso_itm AS itm
    ON itm~so_id = hdr~so_id
  FIELDS hdr~so_id,
         hdr~customer,
         SUM( itm~net_amount ) AS net_total
  WHERE hdr~status = @lv_status
    AND hdr~created_on BETWEEN @lv_date_from AND @lv_date_to
  GROUP BY hdr~so_id, hdr~customer
  INTO TABLE @DATA(lt_result).</pre>
  <p class="muted">
    Dans un projet r&eacute;el, ce simple pushdown a divis&eacute; par 6 un &eacute;cran
    de suivi des ventes en rempla&ccedil;ant un traitement ABAP par une agr&eacute;gation SQL.
  </p>
  <ul class="list">
    <li>Limiter colonnes et lignes d&egrave;s le SELECT.</li>
    <li>Privil&eacute;gier JOINs, GROUP BY et HAVING c&ocirc;t&eacute; DB.</li>
    <li>Contr&ocirc;ler les index et la s&eacute;lectivit&eacute; des conditions.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "abap",
        headingHtml: "Optimisation ABAP et tables internes",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    ABAP 7.50+ offre des syntaxes plus claires, mais la performance se joue sur
    la structure des tables internes, le tri, et la r&eacute;duction des boucles.
  </p>
  <pre class="code-block">"Table interne adapt&eacute;e au besoin
TYPES: BEGIN OF ty_line,
         so_id     TYPE zso_id,
         customer  TYPE kunnr,
         net_total TYPE p LENGTH 16 DECIMALS 2,
       END OF ty_line.

DATA lt_data TYPE HASHED TABLE OF ty_line WITH UNIQUE KEY so_id.</pre>
  <p class="muted">
    Utiliser une HASHED TABLE avec cl&eacute; unique &eacute;vite des READ TABLE O(n)
    et s&eacute;curise les recherches.
  </p>
  <ul class="list">
    <li>Eviter SELECT dans les boucles, pr&eacute;f&eacute;rer des lectures group&eacute;es.</li>
    <li>Utiliser READ TABLE ... BINARY SEARCH sur table tri&eacute;e.</li>
    <li>R&eacute;duire la volum&eacute;trie avant tout traitement ABAP.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "memoire",
        headingHtml: "Optimisation m&eacute;moire et runtime",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Sur des traitements batch, la m&eacute;moire devient souvent le facteur bloquant.
    Une table interne trop large peut saturer le work process et provoquer des dumps.
  </p>
  <ul class="list">
    <li>Free explicite des tables volumineuses apr&egrave;s usage.</li>
    <li>Eviter les copies inutiles (MOVE-CORRESPONDING sur gros volumes).</li>
    <li>Charger par paquets (PACKAGE SIZE) pour les extractions massives.</li>
  </ul>
  <pre class="code-block">"Extraction par paquets
SELECT FROM zso_hdr
  FIELDS so_id, customer, net_total
  INTO TABLE @DATA(lt_hdr)
  PACKAGE SIZE 5000.

  "Traitement
  CLEAR lt_hdr.
ENDSELECT.</pre>
</div>`,
        ],
      },
      {
        id: "outils",
        headingHtml: "Outils SAP d&rsquo;analyse de performance",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    L&rsquo;analyse se fait avec une approche outill&eacute;e, pas &agrave; l&rsquo;intuition.
    On commence par isoler le sympt&ocirc;me, puis on affine avec les bons outils.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Transaction</span>
        <span>Quand l&rsquo;utiliser</span>
        <span>Pourquoi</span>
      </div>
      <div class="table-row">
        <span>SAT</span>
        <span>Profilage code ABAP</span>
        <span>Mesurer temps CPU et appels</span>
      </div>
      <div class="table-row">
        <span>ST05</span>
        <span>Suspicion SQL lent</span>
        <span>Voir les requ&ecirc;tes r&eacute;elles</span>
      </div>
      <div class="table-row">
        <span>SM50</span>
        <span>Temps r&eacute;el d&rsquo;un WP</span>
        <span>Observer les traitements actifs</span>
      </div>
      <div class="table-row">
        <span>SM66</span>
        <span>Vue globale serveur</span>
        <span>Identifier les goulets multi-WP</span>
      </div>
      <div class="table-row">
        <span>ST22</span>
        <span>Dumps et erreurs</span>
        <span>Isoler les exceptions runtime</span>
      </div>
      <div class="table-row">
        <span>ATC</span>
        <span>Contr&ocirc;le qualit&eacute;</span>
        <span>Checks perf et Clean Core</span>
      </div>
      <div class="table-row">
        <span>SCI</span>
        <span>Analyse statique</span>
        <span>Rep&eacute;rer anti-patterns</span>
      </div>
      <div class="table-row">
        <span>DBACOCKPIT</span>
        <span>Contexte DB/HANA</span>
        <span>Lire les stats et caches</span>
      </div>
    </div>
  </div>
  <pre class="case-diagram">Workflow d&rsquo;analyse rapide
Signal utilisateur
  |-> SAT (profil ABAP)
  |-> ST05 (trace SQL)
  |-> SM50/SM66 (WP)
  |-> ST22 (dump)
  v
Synth&egrave;se + plan d&rsquo;action</pre>
  <div class="actions">
    <a class="button ghost" href="https://help.sap.com/docs/abap-platform" target="_blank" rel="noreferrer">SAP Help Portal ABAP</a>
    <a class="button ghost" href="https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE" target="_blank" rel="noreferrer">SAP Help Portal S/4HANA</a>
    <a class="button ghost" href="https://community.sap.com/topics/abap" target="_blank" rel="noreferrer">SAP Community ABAP</a>
    <a class="button ghost" href="https://community.sap.com/topics/s4hana" target="_blank" rel="noreferrer">SAP Community S/4HANA</a>
  </div>
</div>`,
        ],
      },
      {
        id: "cas",
        headingHtml: "Cas concrets projet",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Voici des sc&eacute;narios r&eacute;alistes rencontr&eacute;s en mission, avec une
    logique de r&eacute;solution reproductible.
  </p>
  <div class="grid">
    <article class="card incident-card">
      <div class="card-title">Batch MRP trop long</div>
      <p class="muted">Analyse ST05 : SELECT sur table large sans index.</p>
      <p class="muted">Action : ajout index + filtre sur p&eacute;riode.</p>
      <p class="muted">Gain : -45% sur la fen&ecirc;tre batch.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Fiori lent en liste</div>
      <p class="muted">SAT : traitement ABAP apr&egrave;s lecture DB.</p>
      <p class="muted">Action : CDS View avec agr&eacute;gations pushdown.</p>
      <p class="muted">Gain : temps de r&eacute;ponse &lt; 1s.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Dump m&eacute;moire</div>
      <p class="muted">ST22 : TSV_TNEW_PAGE_ALLOC_FAILED.</p>
      <p class="muted">Action : extraction par paquets + FREE.</p>
      <p class="muted">Gain : traitement stable en batch.</p>
    </article>
  </div>
</div>`,
        ],
      },
      {
        id: "anti-patterns",
        headingHtml: "Anti-patterns fr&eacute;quents",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>SELECT * alors que 5 champs suffisent.</li>
    <li>SELECT dans une boucle sans mise en cache.</li>
    <li>FOR ALL ENTRIES sans contr&ocirc;le sur table vide.</li>
    <li>Tri c&ocirc;t&eacute; ABAP quand un ORDER BY suffirait.</li>
    <li>Tables internes standard pour des recherches intensives.</li>
  </ul>
  <p class="muted">
    Ces anti-patterns restent les causes principales de ST05 rouge et de SAT
    satur&eacute;.
  </p>
</div>`,
        ],
      },
      {
        id: "clean-core",
        headingHtml: "Lien avec Clean Core et l&rsquo;avenir SAP",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    La performance est un pilier du Clean Core : moins de code custom, plus de
    standard, plus d&rsquo;APIs publi&eacute;es. En S/4HANA, cela passe par ATC,
    les Released APIs et la conformit&eacute; ABAP Cloud.
  </p>
  <ul class="list">
    <li>Limiter les modifications standard pour rester compatible upgrades.</li>
    <li>Utiliser des CDS Views et services expos&eacute;s par SAP.</li>
    <li>Valider en continu via ATC + SCI.</li>
  </ul>
  <p class="muted">
    C&rsquo;est aussi un argument fort en entretien : vous montrez que la performance
    est un sujet d&rsquo;architecture, pas seulement un tuning local.
  </p>
</div>`,
        ],
      },
      {
        id: "conclusion",
        headingHtml: "Conclusion &ndash; Messages cl&eacute;s pour consultants SAP",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>Commencer par mesurer : SAT et ST05 avant toute optimisation.</li>
    <li>Pousser le calcul c&ocirc;t&eacute; HANA via CDS et Open SQL moderne.</li>
    <li>Choisir la bonne structure de tables internes selon l&rsquo;usage.</li>
    <li>Documenter les gains et s&eacute;curiser par ATC/SCI.</li>
  </ul>
  <div class="actions">
    <a class="button primary" href="/contact">Discuter d&rsquo;un besoin perf</a>
    <a class="button ghost" href="/blogs">Voir les autres articles</a>
  </div>
</div>`,
        ],
      },
    ],
  },
  {
    slug: "debug-abap",
    titleHtml: "Debugging SAP ABAP : m&eacute;thode projet, outils et cas r&eacute;els",
    titleText: "debugging sap abap methode projet outils et cas reels",
    descriptionHtml:
      "Article complet et terrain sur le debugging SAP ABAP : breakpoints, watchpoints, batch, RFC, IDocs, Fiori/OData et exits.",
    descriptionText:
      "article complet et terrain sur le debugging sap abap breakpoints watchpoints batch rfc idocs fiori odata exits",
    date: "2026-01-10",
    tags: ["ABAP", "Debug"],
    coverImage: "/profile/debugg.jpg",
    contentText:
      "debug sap abap breakpoints watchpoints f5 f6 f7 f8 batch sm37 sm50 rfc sm59 idocs we02 we05 bd87 we19 fiori odata gateway dpc_ext exits badi enhancements pas a pas cas reel transport context",
    sections: [
      {
        id: "introduction",
        headingHtml: "Introduction &ndash; Pourquoi le debugging est une comp&eacute;tence cl&eacute; en SAP",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    En projet SAP, le debugging n&rsquo;est pas un exercice scolaire. C&rsquo;est un
    outil de r&eacute;solution rapide, de s&eacute;curisation des corrections et
    de compr&eacute;hension r&eacute;elle du standard SAP. En entretien technique,
    la capacit&eacute; &agrave; diagnostiquer un bug vaut souvent plus qu&rsquo;un
    discours th&eacute;orique.
  </p>
  <p class="muted">
    L&rsquo;objectif est simple : isoler le point d&rsquo;entr&eacute;e, comprendre
    la valeur qui d&eacute;clenche l&rsquo;erreur, et confirmer la solution avec des
    preuves reproductibles.
  </p>
  <pre class="case-diagram">Mental model de debug
Sympt&ocirc;me
  |-> Point d&rsquo;entr&eacute;e
  |-> Donn&eacute;es d&rsquo;entr&eacute;e
  |-> Branche de code
  |-> Cause racine
  v
Correction test&eacute;e</pre>
</div>`,
        ],
      },
      {
        id: "types-debugger",
        headingHtml: "Les types de debugger SAP",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    SAP propose le debugger classique et le New Debugger. Le second est la
    r&eacute;f&eacute;rence en S/4HANA : vues variables plus riches, navigation dans
    les classes et activation plus stable des breakpoints.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Debugger</span>
        <span>Usage</span>
        <span>Avantage</span>
      </div>
      <div class="table-row">
        <span>Classique</span>
        <span>Legacy, besoins simples</span>
        <span>Acc&egrave;s rapide, l&eacute;ger</span>
      </div>
      <div class="table-row">
        <span>New Debugger</span>
        <span>Standard projet</span>
        <span>Outils avanc&eacute;s, scripts</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "breakpoints",
        headingHtml: "Les breakpoints (tous les types)",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Les breakpoints sont la base. En projet, les bons r&eacute;flexes sont :
    choisir le type adapt&eacute; et le bon utilisateur pour l&rsquo;ex&eacute;cution.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Type</span>
        <span>Quand</span>
        <span>Astuce projet</span>
      </div>
      <div class="table-row">
        <span>Session</span>
        <span>Ex&eacute;cution locale</span>
        <span>Id&eacute;al pour tests en SE38/SE80</span>
      </div>
      <div class="table-row">
        <span>Externe</span>
        <span>RFC, Fiori, Web</span>
        <span>Activer via le user du front</span>
      </div>
      <div class="table-row">
        <span>Statique</span>
        <span>Code critique</span>
        <span>Ne pas laisser en PROD</span>
      </div>
    </div>
  </div>
  <ul class="list">
    <li>Transactions utiles : <strong>/h</strong> pour activer le debug, <strong>/n</strong> pour relancer.</li>
    <li>Utiliser les breakpoints conditionnels pour filtrer une cl&eacute; pr&eacute;cise.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "watchpoints",
        headingHtml: "Watchpoints et analyse des variables",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Les watchpoints d&eacute;clenchent le debug lorsqu&rsquo;une variable change de
    valeur. Tr&egrave;s utile pour traquer un &eacute;crasement ou un mapping erron&eacute;.
  </p>
  <pre class="code-block">"Exemple de watchpoint
lv_status = 'ERR'.
* Mettre un watchpoint sur lv_status
* Condition: lv_status = 'ERR'</pre>
  <ul class="list">
    <li>Mettre le watchpoint sur un champ cl&eacute; (statut, cl&eacute; technique).</li>
    <li>V&eacute;rifier qui &eacute;crit la valeur et &agrave; quel moment.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "step",
        headingHtml: "Ex&eacute;cution pas &agrave; pas (commandes essentielles)",
        blocksHtml: [
          `<div class="stack">
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Commande</span>
        <span>Usage</span>
        <span>Quand l&rsquo;utiliser</span>
      </div>
      <div class="table-row">
        <span>F5</span>
        <span>Step Into</span>
        <span>Entrer dans une m&eacute;thode</span>
      </div>
      <div class="table-row">
        <span>F6</span>
        <span>Step Over</span>
        <span>Passer sans entrer</span>
      </div>
      <div class="table-row">
        <span>F7</span>
        <span>Step Out</span>
        <span>Sortir du niveau actuel</span>
      </div>
      <div class="table-row">
        <span>F8</span>
        <span>Continue</span>
        <span>Aller au prochain breakpoint</span>
      </div>
    </div>
  </div>
  <p class="muted">
    En entretien, on attend une explication claire du choix F5/F6 selon
    la complexit&eacute; de la m&eacute;thode.
  </p>
</div>`,
        ],
      },
      {
        id: "classic",
        headingHtml: "Debug des programmes ABAP classiques",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Sur un report ou une transaction classique, le plus efficace est de
    placer un breakpoint au point d&rsquo;entr&eacute;e logique (START-OF-SELECTION,
    PAI, module de fonction cl&eacute;).
  </p>
  <ul class="list">
    <li>Limiter les donn&eacute;es de test pour r&eacute;duire la complexit&eacute;.</li>
    <li>V&eacute;rifier les param&egrave;tres d&rsquo;entr&eacute;e et le s&eacute;lection screen.</li>
    <li>Isoler les modules fonctionnels critiques via SE37.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "batch",
        headingHtml: "Debug des jobs batch",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Les jobs batch sont un cas r&eacute;current en projet. On utilise SM37 pour
    retrouver le job, puis SM50 pour attacher le debugger au work process.
  </p>
  <pre class="case-diagram">Pas-&agrave;-pas batch
SM37 -> s&eacute;lection du job
  |-> Job actif
  |-> SM50 : s&eacute;lection du WP
  |-> Debugger attach&eacute;</pre>
  <ul class="list">
    <li>Pr&eacute;voir un variant de job r&eacute;duit pour le debug.</li>
    <li>V&eacute;rifier les autorisations du user batch.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "rfc",
        headingHtml: "Debug des RFC",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Les RFC passent souvent par un user technique. Le debug externe est
    indispensable pour capturer l&rsquo;appel r&eacute;el.
  </p>
  <ul class="list">
    <li>Configurer le breakpoint externe sur l&rsquo;utilisateur RFC.</li>
    <li>Tester la destination dans SM59 avant de debugger.</li>
    <li>Analyser les inputs dans SE37.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "idoc",
        headingHtml: "Debug des IDocs",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    L&rsquo;IDoc est un flux critique. Le debug se fait souvent au niveau
    du module de fonction d&rsquo;inbound ou d&rsquo;outbound.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Transaction</span>
        <span>R&ocirc;le</span>
        <span>Usage</span>
      </div>
      <div class="table-row">
        <span>WE02/WE05</span>
        <span>Monitor</span>
        <span>Statuts, erreurs</span>
      </div>
      <div class="table-row">
        <span>BD87</span>
        <span>Reprocessing</span>
        <span>Relancer avec debug</span>
      </div>
      <div class="table-row">
        <span>WE19</span>
        <span>Test</span>
        <span>Simuler un IDoc</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "fiori",
        headingHtml: "Debug SAP Fiori / OData",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Sur Fiori, le debug passe par le service OData. Le breakpoint externe
    doit viser l&rsquo;utilisateur front. Le point d&rsquo;entr&eacute;e est souvent
    dans la classe DPC_EXT.
  </p>
  <ul class="list">
    <li>V&eacute;rifier l&rsquo;appel via /IWFND/MAINT_SERVICE.</li>
    <li>Debug dans la m&eacute;thode GET_ENTITYSET ou CREATE_ENTITY.</li>
    <li>Valider les logs Gateway si besoin.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "exits",
        headingHtml: "Debug des exits, BAdI et enhancements",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    L&rsquo;objectif est d&rsquo;identifier l&rsquo;enhancement actif. Le debugger
    permet de voir la cha&icirc;ne d&rsquo;appel et d&rsquo;isoler l&rsquo;impl&eacute;mentation.
  </p>
  <ul class="list">
    <li>Utiliser les points d&rsquo;arr&ecirc;t dans les classes BAdI actives.</li>
    <li>Exploiter les outils d&rsquo;enhancement dans SE80.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "environnements",
        headingHtml: "Debug erreurs sp&eacute;cifiques (DEV vs INT/PRD)",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Un bug qui n&rsquo;existe pas en DEV provient souvent de donn&eacute;es,
    autorisations, customizing ou versions de code diff&eacute;rentes.
  </p>
  <ul class="list">
    <li>Comparer les versions transport&eacute;es.</li>
    <li>V&eacute;rifier les autorisations user.</li>
    <li>Comparer la donn&eacute;e r&eacute;elle via SE16N.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "cas",
        headingHtml: "Cas r&eacute;els fr&eacute;quents en projet",
        blocksHtml: [
          `<div class="stack">
  <div class="grid">
    <article class="card incident-card">
      <div class="card-title">Erreur en cr&eacute;ation de commande</div>
      <p class="muted">Breakpoints sur BAdI ME_PROCESS_PO_CUST.</p>
      <p class="muted">Cause : mapping champ non initialis&eacute;.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">IDoc bloqu&eacute;</div>
      <p class="muted">WE02 + BD87 avec debug.</p>
      <p class="muted">Cause : segment obligatoire absent.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Fiori ne charge pas</div>
      <p class="muted">Breakpoint externe DPC_EXT.</p>
      <p class="muted">Cause : conversion type erron&eacute;e.</p>
    </article>
  </div>
</div>`,
        ],
      },
      {
        id: "bonnes-pratiques",
        headingHtml: "Bonnes pratiques de debugging SAP",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>Travailler avec un jeu de donn&eacute;es minimal.</li>
    <li>Documenter le point d&rsquo;entr&eacute;e et la cause racine.</li>
    <li>Supprimer les breakpoints statiques avant livraison.</li>
    <li>Ne pas d&eacute;boguer en PROD sans accord formel.</li>
  </ul>
  <div class="actions">
    <a class="button ghost" href="https://help.sap.com/docs/abap-platform" target="_blank" rel="noreferrer">SAP Help Portal ABAP</a>
    <a class="button ghost" href="https://community.sap.com/topics/abap" target="_blank" rel="noreferrer">SAP Community ABAP</a>
  </div>
</div>`,
        ],
      },
      {
        id: "conclusion",
        headingHtml: "Conclusion &ndash; Messages cl&eacute;s pour consultants SAP",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>Un bon debug commence par le bon point d&rsquo;entr&eacute;e.</li>
    <li>Les breakpoints externes sont essentiels pour RFC/Fiori.</li>
    <li>Les transactions WE* et SM* sont vos alli&eacute;s au quotidien.</li>
  </ul>
</div>`,
        ],
      },
    ],
  },
  /*
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
  */
  /*
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
  */
];

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

export const blogs = rawBlogs.map((blog) => {
  const words = wordCount(blog.contentText || "");
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { ...blog, readingTime };
});

export const getBlogBySlug = (slug) => blogs.find((blog) => blog.slug === slug);
