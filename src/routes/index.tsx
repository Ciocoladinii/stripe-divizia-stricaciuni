import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileSearch, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createThread } from "@/lib/threads";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clar.ai — Copilotul tău financiar" },
      { name: "description", content: "Sfaturi simple despre buget, economisire și obiective, personalizate. Datele tale rămân private." },
      { property: "og:title", content: "Clar.ai — Copilotul tău financiar" },
      { property: "og:description", content: "Înțelege-ți banii, economisește mai ușor — în limba română." },
    ],
  }),
  component: Home,
});

const FEATURES = [
  { icon: MessageSquare, t: "Copilot financiar", d: "Răspunsuri clare despre buget, economisire, datorii și investiții de bază — în română." },
  { icon: FileSearch, t: "Seif financiar", d: "Încarci extrasul și vezi pe ce cheltui și unde poți economisi." },
  { icon: ShieldCheck, t: "Privat din start", d: "Profilul, extrasele și conversațiile rămân în browserul tău." },
];

function Home() {
  const navigate = useNavigate();
  const { profil, ready } = useProfile();
  const chat = () => navigate({ to: "/chat/$threadId", params: { threadId: createThread() } });

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" /> Rethinking Financial Futures
        </div>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          {ready && profil ? <>Salut, {profil.nume}. Banii tăi, <span className="text-primary">mai clari</span>.</> : <>Banii tăi, <span className="text-primary">explicați clar</span>.</>}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Clar.ai e consilierul tău financiar: înțelege situația ta, îți arată pe ce merg banii și îți spune ce pași să faci — fără jargon.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {ready && profil ? (
            <>
              <Button size="lg" onClick={chat}>Întreabă Copilotul <ArrowRight className="size-4" /></Button>
              <Button size="lg" variant="outline" asChild><Link to="/dashboard">Deschide Seiful</Link></Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild><Link to="/onboarding">Creează profil gratuit <ArrowRight className="size-4" /></Link></Button>
              <Button size="lg" variant="outline" onClick={chat}>Încearcă fără profil</Button>
            </>
          )}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
              <div className="mt-4 font-medium">{t}</div>
              <div className="mt-1 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-primary p-6 text-primary-foreground md:p-8">
          <div className="font-display text-xl font-semibold">Sfaturi pe măsura ta</div>
          <p className="mt-1 max-w-2xl text-sm opacity-80">
            La crearea profilului te întrebăm vârsta, orașul, ce lucrezi, cât câștigi și ce obiective ai. Copilotul folosește aceste răspunsuri (fără numele tău) ca să-ți dea recomandări personalizate.
          </p>
        </div>
      </div>
    </div>
  );
}
