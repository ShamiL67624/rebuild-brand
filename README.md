# IndianOil — Premium Next.js redesign

An independent website concept with an ivory, IndianOil orange, and navy palette, responsive photographic grids, an interactive Three.js energy sculpture, and a globe connecting international locations.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run build
npm start
```

## Features

- Responsive header, SVG brand emblem, and mobile navigation
- Three manually controlled hero stories with floating photo cards
- Reflective 3D energy sculpture with pointer interaction, orbiting details, and a static fallback
- Content search dialog, including browser-supported voice input
- Customer service shortcuts, business tabs with keyboard controls, and announcement filters
- Photography throughout the customer, business, sustainability, people, and news sections
- Scroll reveals, subtle card tilt, decorative orbital animation, and a redesigned footer
- Sustainability, global presence, and support sections
- Lazy-loaded React Three Fiber scenes, offscreen rendering pause, reduced-motion handling, and WebGL fallback
- Local photographs and supplied investor/scam-alert graphics

## Structure

- `app/page.tsx`: homepage content
- `app/globals.css`: palette, responsive layouts, and visual styling
- `components/Interactive.tsx`: hero, business explorer, updates, and global presence
- `components/EnergyEmblem.tsx`: interactive 3D hero sculpture
- `components/EnergyEmblem.module.css`: sculpture fallback and surrounding details
- `components/Scene.tsx`: interactive Three.js globe
- `components/PageMotion.tsx`: progressive scroll reveals and pointer card tilt
- `components/Header.tsx`: navigation, search, and voice input
- `lib/content.ts`: typed business, announcement, and subsidiary data

## Checks

```sh
npm run typecheck
npm run build
# With the development server running and Google Chrome installed:
node scripts/smoke.mjs
```

The browser check saves desktop, tablet, and mobile screenshots in `artifacts/`. Set `BASE_URL` to test a server running on a different port.

## Content and assets

This is an independent design concept, not an official IndianOil service. Content is based on the user-provided brief and [IndianOil](https://iocl.com/). Customer transactions and applications lead to external services; no authentication or application backend is included. Announcements are sample content from the brief and are not live feeds. General corporate links point to the official homepage where a specific destination has not been established.

Photography: [industrial plant](https://images.unsplash.com/photo-1516937941344-00b4e0337589) and [solar panels](https://images.unsplash.com/photo-1508514177221-188b1cf16e9d) from Unsplash. The original investor and scam-alert graphics were supplied in `photo/`. Google Fonts provides DM Sans and Manrope, with system font fallbacks. Images are illustrative and do not identify a particular IndianOil facility. The decorative globe uses simplified coastline silhouettes.

Implementation references: [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading) and [React Three Fiber Canvas](https://r3f.docs.pmnd.rs/api/canvas).

Recruitment reference photo: [team working together](https://images.unsplash.com/photo-1521737711867-e3b97375f902) from Unsplash, stored locally as `public/images/recruitment-team.jpg`. This is an illustrative workplace image.

Additional illustrative photographs, downloaded locally from Unsplash: [wind energy](https://images.unsplash.com/photo-1466611653911-95081537e5b7), [forest](https://images.unsplash.com/photo-1441974231531-c6227db76b6e), [motoring](https://images.unsplash.com/photo-1503376780353-7e6692767b70), [city](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab), [home](https://images.unsplash.com/photo-1494526585095-c41746248156), and [research](https://images.unsplash.com/photo-1532094349884-543bc11b234d). These are reference images, not claims that the pictured properties, people, or facilities belong to IndianOil.
