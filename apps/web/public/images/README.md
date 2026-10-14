# Website images

Drop image files here and they appear on the site automatically — no code
changes needed. The database already stores these paths, so the moment a file
exists at the right path the placeholder is replaced by the real image.

Files must be named to match the **slug** of the item they belong to.

## Where each image goes

| What | Path | Example |
| --- | --- | --- |
| Hero (home page) | `images/hero.jpg` | `images/hero.jpg` |
| Products | `images/products/<slug>.jpg` | `images/products/bullet-4mp-poe.jpg` |
| Packages | `images/packages/<slug>.jpg` | `images/packages/recommended.jpg` |
| Solutions | `images/solutions/<slug>.jpg` | `images/solutions/shops.jpg` |
| Projects (before) | `images/projects/<slug>-before.jpg` | `images/projects/farm-gate-solar-before.jpg` |
| Projects (after) | `images/projects/<slug>-after.jpg` | `images/projects/farm-gate-solar-after.jpg` |
| Blog covers | `images/blog/<slug>.jpg` | `images/blog/dvr-vs-nvr.jpg` |
| Testimonials | `images/testimonials/<key>.jpg` | `images/testimonials/priya-n.jpg` |

## Finding the exact paths

Every card shows a placeholder with the exact path it expects, for example
`/images/products/bullet-4mp-poe.jpg`. Save your image to that path (relative to
this `public/` folder) and refresh.

## Format tips

- Use `.jpg` (the seed paths assume `.jpg`).
- Landscape, roughly 4:3 for product/package cards and 16:9 for hero, projects
  and blog covers.
- Around 1200–1600px wide is plenty; keep files under ~300KB for fast loading.

## Current slugs to shoot for

**Products:** `bullet-4mp-poe`, `dome-4mp-poe`, `dome-8mp-4k`,
`bullet-8mp-colorvu`, `ptz-5mp-optical-zoom`, `floodlight-2k`,
`dome-vandal-5mp`, `bullet-solar-4g`, `camera-analog-2mp`, `dvr-4ch-1080p`,
`dvr-8ch-4mp`, `nvr-8ch-poe-4k`, `nvr-16ch-poe-4k`, `hdd-purple-1tb`,
`hdd-purple-4tb`, `hdd-purple-8tb`, `monitor-22-fhd`, `monitor-27-fhd`,
`video-doorbell-2k`, `intercom-2wire`, `poe-injector`, `switch-8-port-poe`,
`psu-12v-10a`, `cat6-cable-305`, `bnc-connectors-pack`, `junction-box`,
`mount-wall-bracket`, `surge-protector`.

**Packages:** `basic`, `recommended`, `premium`.

**Solutions:** `home`, `shops`, `offices`, `warehouses`.

**Projects:** `family-home-front-door`, `restaurant-till-and-door`,
`boutique-retail-chain`, `distribution-warehouse`,
`professional-office-suite`, `farm-gate-solar` (each with `-before` / `-after`).

**Blog:** `dvr-vs-nvr`, `how-many-cameras`, `night-vision-explained`,
`cctv-storage-guide`, `poe-vs-analogue`.

**Testimonials:** `priya-n`, `daniel-r`, `maria-s`, `owen-t`, `hannah-k`,
`raj-p`, `ellen-b`, `tom-w`.
