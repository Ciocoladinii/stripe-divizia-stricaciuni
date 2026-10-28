# Finwise Chat and Compass

Aplicație de finanțe personale pentru România, cu interfața **Clar.ai**: chat AI, import de extrase CSV/PDF, sumar de venituri și cheltuieli și identificarea abonamentelor recurente.

## Tehnologii

React · TypeScript · TanStack Start · Tailwind CSS · shadcn/ui · Recharts · AI SDK

## Rulare locală

Ai nevoie de **Node.js 24** și **Bun**.

```sh
git clone https://github.com/Ciocoladinii/stripe-divizia-stricaciuni.git
cd stripe-divizia-stricaciuni
bun install --frozen-lockfile
bun run dev
```

Deschide adresa afișată în terminal. Pentru funcțiile AI, configurează variabila de mediu `LOVABLE_API_KEY` pe server, fără prefixul `VITE_`.

## Comenzi utile

```sh
bun run test     # Teste
bun run lint     # Verificarea stilului de cod
bun run build    # Build pentru producție
```

[Deschide proiectul în Lovable](https://lovable.dev/projects/04a77273-740d-4893-a27c-63c18aad84e7)
