# Data extraction: "Securing Remote Access to Industrial Machines in Belgium and the Netherlands"

Source of truth for every statistical number in the regional report at
`/reports/remote-access-belgium-netherlands`. The numbers themselves live in
`lib/eurostat-data.ts`, typed and cited; this file documents how they were pulled, so
the extraction can be independently reproduced or re-run for a later edition.

Primary source only: Eurostat's own dissemination API, dataset `sbs_sc_ovw`. No number
in the report is estimated, modeled, or carried over from a secondary source. Where a
cross-check (CBS) was reachable, it's recorded below as a cross-check, not as a
replacement source. Where a cross-check (Statbel) could not be resolved to a directly
comparable figure, that's recorded too, and nothing was substituted for it.

## 1. Dataset structure probe

Before querying filtered data, the dataset's dimension codes were confirmed with a
small, cheap query (one country, one NACE code, no size-class filter):

```
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw?format=JSON&lang=EN&geo=BE&nace_r2=C28&sinceTimePeriod=2020
```

Extracted: 2026-10-21. Raw response saved at
`docs/whitepaper-data/eurostat-sbs_sc_ovw-be-c28-structure-probe.json`.

Dimension ids, in order: `freq`, `indic_sbs`, `nace_r2`, `size_emp`, `geo`, `time`.

Relevant category codes confirmed from that probe:

- `indic_sbs`: `ENT_NR` ("Enterprises - number"), `EMP_NR` ("Persons employed - number")
- `size_emp`: `TOTAL`, `0-9`, `10-19`, `20-49`, `50-249`, `GE250`
- `nace_r2` requested: `C26`, `C27`, `C28`, `C29`, `C30`, `C33`
- `geo` requested: `BE`, `NL`
- `time` available at the time of the probe: `2021`-`2024`

## 2. Full filtered extraction

```
GET https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw?format=JSON&lang=EN&geo=BE&geo=NL&nace_r2=C26&nace_r2=C27&nace_r2=C28&nace_r2=C29&nace_r2=C30&nace_r2=C33&indic_sbs=ENT_NR&indic_sbs=EMP_NR&size_emp=TOTAL&size_emp=0-9&size_emp=10-19&size_emp=20-49&size_emp=50-249&size_emp=GE250&sinceTimePeriod=2021
```

- Extracted: 2026-10-21
- Dataset label (from the response's own `label` field): "Enterprise statistics by
  size class and NACE Rev. 2 activity (from 2021 onwards)"
- Dataset's own `updated` timestamp (from the response): 2026-09-30T11:00:00+0200
- Source agency (from the response's own `source` field): ESTAT
- Raw response (568 cells, JSON-stat 2.0) saved at
  `docs/whitepaper-data/eurostat-sbs_sc_ovw-be-nl-2021-2024.json`
- Latest year with complete data for every requested geo x NACE x indicator x
  size-class combination: **2024**. (8 cells for Belgium/2022, confined to NACE C26
  and C30, `EMP_NR` and `ENT_NR`, `TOTAL` and `GE250`, are flagged confidential (`|C`)
  in the raw response and carry no value; none of them fall in the 2024 figures the
  report uses.)

## 3. 2024 figures used in the report (Eurostat `sbs_sc_ovw`)

Enterprise counts (`ENT_NR`) by size class, and persons employed (`EMP_NR`, total),
Belgium and the Netherlands, 2024, extracted 2026-10-21:

| Geo | NACE | 0-9 | 10-19 | 20-49 | 50-249 | 250+ | Total enterprises | Persons employed (total) | Share with 50+ employed |
|---|---|---|---|---|---|---|---|---|---|
| BE | C28 Machinery and equipment n.e.c. | 907 | 96 | 133 | 95 | 16 | 1,247 | 32,271 | 8.90% |
| BE | C26 Computer, electronic, optical | - | - | - | 27 | 10 | 380 | 10,085 | 9.74% |
| BE | C27 Electrical equipment | - | - | - | 23 | 10 | 505 | 11,738 | 6.53% |
| BE | C29 Motor vehicles, trailers | - | - | - | 26 | 15 | 499 | 26,118 | 8.22% |
| BE | C30 Other transport equipment | - | - | - | 7 | 5 | 187 | 6,114 | 6.42% |
| BE | C33 Repair and installation of machinery | - | - | - | 64 | 12 | 4,679 | 23,097 | 1.62% |
| NL | C28 Machinery and equipment n.e.c. | 2,846 | 339 | 331 | 324 | 46 | 3,886 | 107,705 | 9.52% |
| NL | C26 Computer, electronic, optical | - | - | - | 74 | 15 | 1,889 | 29,803 | 4.71% |
| NL | C27 Electrical equipment | - | - | - | 58 | 18 | 1,427 | 26,263 | 5.33% |
| NL | C29 Motor vehicles, trailers | - | - | - | 44 | 14 | 930 | 21,675 | 6.24% |
| NL | C30 Other transport equipment | - | - | - | 39 | 15 | 1,564 | 19,765 | 3.45% |
| NL | C33 Repair and installation of machinery | - | - | - | 114 | 17 | 14,762 | 54,565 | 0.89% |

"Share with 50+ employed" = (enterprises in `50-249` + enterprises in `GE250`) /
enterprises in `TOTAL`, computed directly from the three extracted counts above, exact
arithmetic, not a model or an estimate. 0-9/10-19/20-49 columns are shown in full only
for C28 (the report's size-class chart); the other five NACE codes are shown in the
report's comparison table with just the total, the persons-employed figure, and the
50+ share, per the brief's "also C26, C27, C29, C30 and C33 if available" instruction.

## 4. Cross-checks

### CBS (Netherlands) — reachable, broadly corroborates

Table `81589NED`, "Bedrijven; bedrijfstak" (Statistics Netherlands' own enterprise
register, not the EU structural business survey): filtered to SBI code "28
Machine-industrie" (identifier `336500` in this table's own coding), latest available
period (`2026KW04`, explicitly marked provisional by CBS itself), summing the "50 tot
100 werkzame personen" (`WP19096`) and "100 werkzame personen of meer" (`WP19098`)
measures against "Totaal bedrijven" (`M000201`).

```
GET https://datasets.cbs.nl/odata/v1/CBS/81589NED/Observations?$filter=BedrijfstakkenBranchesSBI2008 eq '336500' and Perioden eq '2026KW04' and (Measure eq 'M000201' or Measure eq 'WP19096' or Measure eq 'WP19098')
```

- Extracted: 2026-10-21
- Raw response saved at `docs/whitepaper-data/cbs-81589ned-sbi28-2026kw04.json`
- Result: 3,565 total enterprises; 170 with 50-100 employed; 200 with 100+ employed
  (50+ total: 370)

This is a different measurement than Eurostat's: CBS's own quarterly business
register, a point-in-time count as of the first day of the quarter, versus Eurostat's
annual structural business statistics survey. The totals differ (3,565 vs. 3,886) for
that reason, and 2026KW04 is explicitly provisional per CBS. The **50-plus-employee
enterprise count is nearly identical (370 vs. 370)**, which is treated in the report
as order-of-magnitude corroboration of the Eurostat figure, not as a second
independent data point averaged into it. The report's own number, throughout, is the
Eurostat one.

### Statbel (Belgium) — reachable, no comparable figure resolved

Statbel's open-data portal (`statbel.fgov.be/en/open-data`) and its PxWeb-based
`bestat.statbel.fgov.be/bestat/api/views` endpoint both returned valid responses
(HTTP 200) when queried on 2026-10-21. A candidate view, "Actieve onderneming naar
grootteklasse van het aantal werknemers, 2021-" (`ce755635-6c25-4967-92ef-f2a0f0df4c27`
in that API), looked like the right comparison, but its underlying data table could
not be resolved to an actual NACE-28-filtered, size-class-broken-out figure through
that same API within this extraction pass. **No Belgian cross-check number is used
in the report.** The report's Belgian figures rest on Eurostat alone. This is stated
on the sources and methodology page, not papered over.

## 5. What is deliberately not in the report

- No year other than 2024 is shown for the enterprise/size-class figures, since 2024
  is the latest year with complete data for every geo x NACE combination requested.
- No Luxembourg figures: the brief asked for Belgium and the Netherlands only.
- No estimate, projection, or modeled number anywhere: every figure in the report
  traces to one of the extractions above, or to a `lib/compliance-ledger.ts` /
  `lib/country-report.ts` entry for the regulatory dates and country-authority facts
  (unchanged from the existing site, not re-derived here).
- No Statbel-sourced number, for the reason given above.

## 6. How this maps to the code

- `lib/eurostat-data.ts` — typed constants for every number in section 3 above, each
  carrying its dataset code, NACE code, geo, year, and the 2026-10-21 extraction date,
  plus the CBS cross-check figures from section 4. This is the only file the report's
  components read enterprise/size-class numbers from.
- `scripts/check-claims.mjs` — `lib/eurostat-data.ts` is on the `DATE_ALLOWLIST` and
  `OT_FILES` list for the same reason `lib/compliance-ledger.ts` is: it's the one place
  a literal date is allowed, because it's the file everything else must reference
  through an expression instead of retyping.
