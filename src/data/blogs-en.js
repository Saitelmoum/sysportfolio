const rawBlogs = [
  {
    slug: "performance-s4hana-optimisation",
    titleHtml: "SAP S/4HANA performance optimization: project method",
    titleText: "sap s4hana performance optimization project method",
    descriptionHtml:
      "Complete guide for technical consultants: stakes, anti-patterns, ABAP 7.50+ code, SAP tools, and real cases.",
    descriptionText:
      "complete guide for technical consultants stakes anti patterns abap 7 50 code sap tools real cases",
    date: "2026-01-10",
    tags: ["Performance", "ABAP", "S/4HANA"],
    coverImage: "/profile/perfo.jpg",
    contentText:
      "performance sap s4hana abap sql cds views code pushdown st05 sat sm50 sm66 st22 atc sci dbacokcpit optimization database access internal tables memory runtime clean core abap cloud project real analysis traces indexes buffer reduction volume criteria select join aggregation cds view annotations odata fiori elements monitoring system workload dataset volume business rules transports regression risk quality code review refactoring profiling method production stability tco business impact sla batch online job scheduling handling dumps performance bottlenecks caching hint select single for all entries hashed table sorted table avoid select in loop avoid nested loop avoid select star use package size buffering proper key fields result set size prevention",
    sections: [
      {
        id: "introduction",
        headingHtml: "Introduction &ndash; Why performance is critical in SAP",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    In SAP projects, performance is not a comfort topic. It drives process reliability,
    SLA compliance, and the overall perception of the solution by the business. In
    technical interviews, it often separates a decent developer from a senior consultant.
  </p>
  <p class="muted">
    In S/4HANA, implementation choices show immediately: HANA amplifies good decisions
    (pushdown, targeted queries) and punishes bad ones (loops, SELECT * and unnecessary
    ABAP processing).
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
        headingHtml: "Business and technical stakes",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Impacts are measurable: batch duration, response time, scalability, infrastructure cost,
    and error rates. Technically, this translates to poorly targeted DB queries, oversized
    internal tables, and overly verbose code paths.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Impact</span>
        <span>Business risk</span>
        <span>Technical symptom</span>
      </div>
      <div class="table-row">
        <span>Response time</span>
        <span>Productivity loss</span>
        <span>Slow SQL, app CPU</span>
      </div>
      <div class="table-row">
        <span>Night batch</span>
        <span>Window not met</span>
        <span>Volume, missing index</span>
      </div>
      <div class="table-row">
        <span>Stability</span>
        <span>Recurring incidents</span>
        <span>ST22 dumps, locks</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "db",
        headingHtml: "Optimizing database access",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Golden rule in S/4HANA: let the database work. Pushdown through CDS Views and modern
    Open SQL reduces data volume, network latency, and application load.
  </p>
  <pre class="case-diagram">Recommended flow
User
  |  (UI filters)
  v
CDS View (projection)
  |  (associations, annotations)
  v
CDS View (interface)
  |  (joins, calculations)
  v
HANA database
  |  (pushdown, aggregations)</pre>
  <pre class="code-block">"ABAP 7.50+ : targeted Open SQL and pushdown
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
    In a real project, this simple pushdown divided a sales monitoring screen by 6 by
    replacing ABAP processing with SQL aggregation.
  </p>
  <ul class="list">
    <li>Limit columns and rows from the SELECT.</li>
    <li>Prefer JOINs, GROUP BY, and HAVING on the DB side.</li>
    <li>Check indexes and selectivity of conditions.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "abap",
        headingHtml: "ABAP and internal table optimization",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    ABAP 7.50+ provides cleaner syntax, but performance depends on internal table
    structure, sorting, and reducing loops.
  </p>
  <pre class="code-block">"Internal table suited to the use case
TYPES: BEGIN OF ty_line,
         so_id     TYPE zso_id,
         customer  TYPE kunnr,
         net_total TYPE p LENGTH 16 DECIMALS 2,
       END OF ty_line.

DATA lt_data TYPE HASHED TABLE OF ty_line WITH UNIQUE KEY so_id.</pre>
  <p class="muted">
    Using a HASHED TABLE with a unique key avoids O(n) READ TABLE and secures lookups.
  </p>
  <ul class="list">
    <li>Avoid SELECT inside loops; group reads instead.</li>
    <li>Use READ TABLE ... BINARY SEARCH on sorted tables.</li>
    <li>Reduce volume before any ABAP processing.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "memoire",
        headingHtml: "Memory and runtime optimization",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    In batch processing, memory often becomes the bottleneck. An oversized internal table
    can exhaust work process memory and trigger dumps.
  </p>
  <ul class="list">
    <li>Explicitly FREE large tables after use.</li>
    <li>Avoid unnecessary copies (MOVE-CORRESPONDING on big volumes).</li>
    <li>Load in packages (PACKAGE SIZE) for large extractions.</li>
  </ul>
  <pre class="code-block">"Extraction in packages
SELECT FROM zso_hdr
  FIELDS so_id, customer, net_total
  INTO TABLE @DATA(lt_hdr)
  PACKAGE SIZE 5000.

  "Processing
  CLEAR lt_hdr.
ENDSELECT.</pre>
</div>`,
        ],
      },
      {
        id: "outils",
        headingHtml: "SAP performance analysis tools",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Analysis is tool-driven, not intuition-driven. Start by isolating the symptom, then
    refine with the right tools.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Transaction</span>
        <span>When to use</span>
        <span>Why</span>
      </div>
      <div class="table-row">
        <span>SAT</span>
        <span>ABAP profiling</span>
        <span>Measure CPU time and calls</span>
      </div>
      <div class="table-row">
        <span>ST05</span>
        <span>Suspected slow SQL</span>
        <span>See real queries</span>
      </div>
      <div class="table-row">
        <span>SM50</span>
        <span>Real-time WP view</span>
        <span>Observe active processing</span>
      </div>
      <div class="table-row">
        <span>SM66</span>
        <span>Global server view</span>
        <span>Identify multi-WP bottlenecks</span>
      </div>
      <div class="table-row">
        <span>ST22</span>
        <span>Dumps and errors</span>
        <span>Isolate runtime exceptions</span>
      </div>
      <div class="table-row">
        <span>ATC</span>
        <span>Quality control</span>
        <span>Perf and Clean Core checks</span>
      </div>
      <div class="table-row">
        <span>SCI</span>
        <span>Static analysis</span>
        <span>Spot anti-patterns</span>
      </div>
      <div class="table-row">
        <span>DBACOCKPIT</span>
        <span>DB/HANA context</span>
        <span>Read stats and caches</span>
      </div>
    </div>
  </div>
  <pre class="case-diagram">Quick analysis workflow
User signal
  |-> SAT (ABAP profile)
  |-> ST05 (SQL trace)
  |-> SM50/SM66 (WP)
  |-> ST22 (dump)
  v
Summary + action plan</pre>
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
        headingHtml: "Real project cases",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Here are realistic scenarios encountered on projects, with a reproducible resolution
    approach.
  </p>
  <div class="grid">
    <article class="card incident-card">
      <div class="card-title">MRP batch too long</div>
      <p class="muted">ST05 analysis: SELECT on large table without index.</p>
      <p class="muted">Action: add index + filter by period.</p>
      <p class="muted">Gain: -45% on batch window.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Slow Fiori list</div>
      <p class="muted">SAT: ABAP processing after DB read.</p>
      <p class="muted">Action: CDS View with pushdown aggregations.</p>
      <p class="muted">Gain: response time &lt; 1s.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Memory dump</div>
      <p class="muted">ST22: TSV_TNEW_PAGE_ALLOC_FAILED.</p>
      <p class="muted">Action: package extraction + FREE.</p>
      <p class="muted">Gain: stable batch processing.</p>
    </article>
  </div>
</div>`,
        ],
      },
      {
        id: "anti-patterns",
        headingHtml: "Common anti-patterns",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>SELECT * when 5 fields are enough.</li>
    <li>SELECT inside a loop without caching.</li>
    <li>FOR ALL ENTRIES without checking empty tables.</li>
    <li>Sorting in ABAP when ORDER BY would be enough.</li>
    <li>Standard internal tables for heavy lookups.</li>
  </ul>
  <p class="muted">
    These anti-patterns remain the main causes of red ST05 and saturated SAT traces.
  </p>
</div>`,
        ],
      },
      {
        id: "clean-core",
        headingHtml: "Link to Clean Core and the SAP future",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Performance is a pillar of Clean Core: less custom code, more standard, more published
    APIs. In S/4HANA this means ATC, Released APIs, and ABAP Cloud compliance.
  </p>
  <ul class="list">
    <li>Limit standard modifications to remain upgrade compatible.</li>
    <li>Use CDS Views and SAP-exposed services.</li>
    <li>Validate continuously with ATC + SCI.</li>
  </ul>
  <p class="muted">
    It is also a strong interview argument: you show that performance is an architecture
    topic, not just local tuning.
  </p>
</div>`,
        ],
      },
      {
        id: "conclusion",
        headingHtml: "Conclusion &ndash; Key messages for SAP consultants",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>Start by measuring: SAT and ST05 before any optimization.</li>
    <li>Push calculation to HANA with CDS and modern Open SQL.</li>
    <li>Choose the right internal table structure for the use case.</li>
    <li>Document gains and secure with ATC/SCI.</li>
  </ul>
  <div class="actions">
    <a class="button primary" href="/en/contact">Discuss a performance need</a>
    <a class="button ghost" href="/en/blogs">See other articles</a>
  </div>
</div>`,
        ],
      },
    ],
  },
  {
    slug: "debug-abap",
    titleHtml: "Debugging SAP ABAP: project method, tools, and real cases",
    titleText: "debugging sap abap project method tools and real cases",
    descriptionHtml:
      "Field-tested guide to SAP ABAP debugging: breakpoints, watchpoints, batch, RFC, IDocs, Fiori/OData, and exits.",
    descriptionText:
      "field tested guide to sap abap debugging breakpoints watchpoints batch rfc idocs fiori odata exits",
    date: "2026-01-10",
    tags: ["ABAP", "Debug"],
    coverImage: "/profile/debugg.jpg",
    contentText:
      "debug sap abap breakpoints watchpoints f5 f6 f7 f8 batch sm37 sm50 rfc sm59 idocs we02 we05 bd87 we19 fiori odata gateway dpc_ext exits badi enhancements step by step real case transport context",
    sections: [
      {
        id: "introduction",
        headingHtml: "Introduction &ndash; Why debugging is a key SAP skill",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    In SAP projects, debugging is not a classroom exercise. It is a rapid resolution tool,
    a way to secure fixes, and a practical way to understand SAP standard behavior. In
    technical interviews, the ability to diagnose a bug often matters more than theory.
  </p>
  <p class="muted">
    The goal is simple: isolate the entry point, understand the value that triggers the
    error, and confirm the solution with reproducible proof.
  </p>
  <pre class="case-diagram">Debug mental model
Symptom
  |-> Entry point
  |-> Input data
  |-> Code branch
  |-> Root cause
  v
Fix validated</pre>
</div>`,
        ],
      },
      {
        id: "types-debugger",
        headingHtml: "SAP debugger types",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    SAP offers the classic debugger and the New Debugger. The latter is the standard in
    S/4HANA: richer variable views, class navigation, and more stable breakpoint handling.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Debugger</span>
        <span>Usage</span>
        <span>Advantage</span>
      </div>
      <div class="table-row">
        <span>Classic</span>
        <span>Legacy, simple needs</span>
        <span>Fast access, lightweight</span>
      </div>
      <div class="table-row">
        <span>New Debugger</span>
        <span>Project standard</span>
        <span>Advanced tools, scripts</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "breakpoints",
        headingHtml: "Breakpoints (all types)",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Breakpoints are the foundation. On projects, the right reflex is to pick the correct
    type and execution user.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Type</span>
        <span>When</span>
        <span>Project tip</span>
      </div>
      <div class="table-row">
        <span>Session</span>
        <span>Local execution</span>
        <span>Ideal for SE38/SE80 tests</span>
      </div>
      <div class="table-row">
        <span>External</span>
        <span>RFC, Fiori, Web</span>
        <span>Activate with front-end user</span>
      </div>
      <div class="table-row">
        <span>Static</span>
        <span>Critical code</span>
        <span>Never leave in PROD</span>
      </div>
    </div>
  </div>
  <ul class="list">
    <li>Useful transactions: <strong>/h</strong> to activate debug, <strong>/n</strong> to restart.</li>
    <li>Use conditional breakpoints to filter a specific key.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "watchpoints",
        headingHtml: "Watchpoints and variable analysis",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Watchpoints trigger debug when a variable changes value. Very useful to track overwrites
    or incorrect mappings.
  </p>
  <pre class="code-block">"Example watchpoint
lv_status = 'ERR'.
* Set a watchpoint on lv_status
* Condition: lv_status = 'ERR'</pre>
  <ul class="list">
    <li>Set watchpoints on key fields (status, technical key).</li>
    <li>Verify who writes the value and when.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "step",
        headingHtml: "Step-by-step execution (essential commands)",
        blocksHtml: [
          `<div class="stack">
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Command</span>
        <span>Usage</span>
        <span>When to use</span>
      </div>
      <div class="table-row">
        <span>F5</span>
        <span>Step Into</span>
        <span>Enter a method</span>
      </div>
      <div class="table-row">
        <span>F6</span>
        <span>Step Over</span>
        <span>Skip internal method</span>
      </div>
      <div class="table-row">
        <span>F7</span>
        <span>Step Out</span>
        <span>Leave current level</span>
      </div>
      <div class="table-row">
        <span>F8</span>
        <span>Continue</span>
        <span>Go to next breakpoint</span>
      </div>
    </div>
  </div>
  <p class="muted">
    In interviews, you are expected to clearly explain F5 vs F6 choices depending on
    method complexity.
  </p>
</div>`,
        ],
      },
      {
        id: "classic",
        headingHtml: "Debugging classic ABAP programs",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    For a classic report or transaction, the most effective approach is to place a breakpoint
    at the logical entry point (START-OF-SELECTION, PAI, key function module).
  </p>
  <ul class="list">
    <li>Limit test data to reduce complexity.</li>
    <li>Check selection screen parameters and inputs.</li>
    <li>Isolate critical function modules via SE37.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "batch",
        headingHtml: "Debugging batch jobs",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    Batch jobs are common on projects. Use SM37 to find the job, then SM50 to attach the
    debugger to the work process.
  </p>
  <pre class="case-diagram">Batch step-by-step
SM37 -> select job
  |-> job active
  |-> SM50: select WP
  |-> debugger attached</pre>
  <ul class="list">
    <li>Prepare a reduced job variant for debug.</li>
    <li>Check batch user authorizations.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "rfc",
        headingHtml: "Debugging RFC",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    RFCs often run under a technical user. External debugging is essential to catch the
    real call.
  </p>
  <ul class="list">
    <li>Set the external breakpoint on the RFC user.</li>
    <li>Test the destination in SM59 before debugging.</li>
    <li>Analyze inputs in SE37.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "idoc",
        headingHtml: "Debugging IDocs",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    IDocs are critical flows. Debugging often happens in the inbound or outbound function module.
  </p>
  <div class="card table-card">
    <div class="table">
      <div class="table-row table-header">
        <span>Transaction</span>
        <span>Role</span>
        <span>Usage</span>
      </div>
      <div class="table-row">
        <span>WE02/WE05</span>
        <span>Monitor</span>
        <span>Status, errors</span>
      </div>
      <div class="table-row">
        <span>BD87</span>
        <span>Reprocessing</span>
        <span>Rerun with debug</span>
      </div>
      <div class="table-row">
        <span>WE19</span>
        <span>Test</span>
        <span>Simulate an IDoc</span>
      </div>
    </div>
  </div>
</div>`,
        ],
      },
      {
        id: "fiori",
        headingHtml: "Debugging SAP Fiori / OData",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    In Fiori, debugging goes through the OData service. The external breakpoint must target
    the front-end user. The entry point is often in the DPC_EXT class.
  </p>
  <ul class="list">
    <li>Verify the call via /IWFND/MAINT_SERVICE.</li>
    <li>Debug in GET_ENTITYSET or CREATE_ENTITY.</li>
    <li>Check Gateway logs if needed.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "exits",
        headingHtml: "Debugging exits, BAdIs, and enhancements",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    The goal is to identify the active enhancement. The debugger shows the call chain and
    the exact implementation.
  </p>
  <ul class="list">
    <li>Use breakpoints in active BAdI classes.</li>
    <li>Leverage enhancement tools in SE80.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "environnements",
        headingHtml: "Environment-specific debugging (DEV vs INT/PRD)",
        blocksHtml: [
          `<div class="stack">
  <p class="muted">
    A bug that does not appear in DEV often comes from data, authorizations, customizing,
    or different code versions.
  </p>
  <ul class="list">
    <li>Compare transported versions.</li>
    <li>Check user authorizations.</li>
    <li>Compare real data in SE16N.</li>
  </ul>
</div>`,
        ],
      },
      {
        id: "cas",
        headingHtml: "Common real cases",
        blocksHtml: [
          `<div class="stack">
  <div class="grid">
    <article class="card incident-card">
      <div class="card-title">Sales order creation error</div>
      <p class="muted">Breakpoints on BAdI ME_PROCESS_PO_CUST.</p>
      <p class="muted">Cause: uninitialized field mapping.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Blocked IDoc</div>
      <p class="muted">WE02 + BD87 with debug.</p>
      <p class="muted">Cause: missing mandatory segment.</p>
    </article>
    <article class="card incident-card">
      <div class="card-title">Fiori does not load</div>
      <p class="muted">External breakpoint on DPC_EXT.</p>
      <p class="muted">Cause: wrong type conversion.</p>
    </article>
  </div>
</div>`,
        ],
      },
      {
        id: "bonnes-pratiques",
        headingHtml: "SAP debugging best practices",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>Work with a minimal data set.</li>
    <li>Document entry point and root cause.</li>
    <li>Remove static breakpoints before delivery.</li>
    <li>Do not debug in PROD without formal approval.</li>
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
        headingHtml: "Conclusion &ndash; Key messages for SAP consultants",
        blocksHtml: [
          `<div class="stack">
  <ul class="list">
    <li>A good debug starts with the right entry point.</li>
    <li>External breakpoints are essential for RFC/Fiori.</li>
    <li>WE* and SM* transactions are daily allies.</li>
  </ul>
</div>`,
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
