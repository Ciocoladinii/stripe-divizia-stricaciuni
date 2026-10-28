# Finwise Chat and Compass — Clar.ai

Prototip de copilot financiar pentru România, exportat din Lovable. Interfața folosește numele **Clar.ai**. Direcția produsului este evaluarea obiectivelor și compararea scenariilor financiare; motorul pentru aceste scenarii nu este încă implementat.

- Repository: https://github.com/Ciocoladinii/stripe-divizia-stricaciuni
- Proiect Lovable: https://lovable.dev/projects/04a77273-740d-4893-a27c-63c18aad84e7
- Sursa importului: `finwise-chat-and-compass(1).zip`, 28 octombrie 2026.

## Ce există

- Onboarding: vârstă, oraș, situație profesională, interval de venit și obiective.
- Chat în română cu răspunsuri streaming și conversații salvate local.
- Seif financiar: import CSV și extragere de text din PDF; categorisire a tranzacțiilor prin AI.
- Grafice de venituri/cheltuieli, indicatori financiari și detectarea unor abonamente recurente.
- Explicații AI pentru textul selectat.
- Solduri bancare și conectare Open Banking **simulate**, plus extras demonstrativ.

Nu există autentificare a utilizatorilor aplicației, bază de date pe server sau conexiune bancară reală. Autentificarea în Lovable/GitHub este separată de aplicație. Indicatorii actuali folosesc inclusiv solduri demonstrative și nu trebuie prezentați drept evaluări verificate ale situației unui utilizator.

## Stack

React 19, TypeScript, TanStack Start/Router, Vite, Tailwind CSS 4, componente shadcn/Radix, Recharts, Zod, AI SDK și PDF.js. Testele folosesc Vitest și Testing Library. Versiunile exacte sunt în `package.json` și `bun.lock`.

## Rulare locală

Folosește Node.js 24 și Bun; `bun.lock` este lockfile-ul furnizat de proiect.

```sh
git clone https://github.com/Ciocoladinii/stripe-divizia-stricaciuni.git
cd stripe-divizia-stricaciuni
bun install --frozen-lockfile
bun run dev
```

Deschide adresa afișată de Vite. Pentru reproducibilitate, păstrează lockfile-ul și nu înlocui automat versiunile dependințelor dacă instalarea eșuează.

### Configurarea AI

Cele trei endpoint-uri citesc pe server variabila `LOVABLE_API_KEY`. Configureaz-o în mediul serverului sau în secret manager-ul platformei de hosting. Local, o poți introduce temporar în terminal, fără să o scrii în comandă sau în repository:

```sh
read -rsp 'LOVABLE_API_KEY: ' LOVABLE_API_KEY
export LOVABLE_API_KEY
printf '\n'
bun run dev
# După oprirea serverului:
unset LOVABLE_API_KEY
```

Nu folosi un prefix `VITE_` pentru această cheie. În lipsa ei, apelurile AI răspund cu o eroare de configurare. Inclusiv încărcarea extrasului demo apelează serviciul AI pentru clasificare.

Modelele configurate în export:

| Endpoint | Rol | Model |
| --- | --- | --- |
| `/api/chat` | Chat streaming | `openai/gpt-6-astra` |
| `/api/explain` | Explicația selecției | `openai/gpt-6-astra` |
| `/api/scan` | Clasificare tranzacții | `google/gemini-3.1-flash-lite` |

Toate apelează Lovable AI Gateway. Disponibilitatea modelelor, creditele și permisiunile trebuie verificate în mediul de rulare; importul GitHub nu le configurează.

## Verificări

```sh
bun run test
bun run lint
bunx tsc --noEmit
bun run build
```

Configurația Vite folosește `@lovable.dev/vite-tanstack-config`, care furnizează pluginurile și build-ul Nitro. Nu dubla pluginurile configurate de acest pachet. Deploy-ul necesită un runtime pentru endpoint-urile server; găzduirea exclusiv statică nu este suficientă pentru AI. Importul în GitHub nu publică automat aplicația.

## Structură

```text
src/routes/             Pagini și rute API
src/lib/ai/             Implementări AI exclusiv server
src/lib/                Profil, tranzacții, KPI, PDF, conversații
src/components/         Componente aplicație și componente UI reutilizabile
src/test/               Teste existente
public/                 Resurse publice și extras demonstrativ
```

## Date și limite ale prototipului

Profilul, tranzacțiile, conversațiile și marcajele abonamentelor sunt salvate în `localStorage`. Acesta nu este un seif criptat și nu oferă sincronizare între dispozitive.

Procesarea nu este integral locală: scanarea trimite descrieri și sume către server și furnizorul AI; chatul trimite mesajele, o parte din profil și sumarul financiar; explicațiile trimit textul selectat. Coloanele suplimentare din CSV, precum contul/IBAN-ul, nu sunt trimise de parser, dar descrierile și textul liber pot conține date personale. Nu folosi extrase reale până la revizuirea fluxului de date și a protecțiilor endpoint-urilor.

Fișierul `public/extras_ING_demo_2026.csv` este fixture-ul demonstrativ furnizat în export. Tot ce se află în `public/` este accesibil vizitatorilor aplicației.

## Colaborare

Acesta este un import al unei arhive, nu o recuperare a istoricului Lovable. Sincronizarea automată Lovable–GitHub trebuie verificată separat în Lovable. Nu rescrie istoricul publicat (`force push`, rebase/amend pe commituri deja publicate). Nu încărca secrete, extrase reale, `node_modules` sau rezultate de build în Git.

Motorul determinist de obiective, scenariile și optimizarea costului AI sunt propuneri pentru etapa următoare, nu funcționalități livrate prin acest import.
