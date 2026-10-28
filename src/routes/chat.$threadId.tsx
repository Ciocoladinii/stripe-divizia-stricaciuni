import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { loadProfile, profilPentruAI } from "@/lib/profile";
import { seifPentruAI } from "@/lib/kpi";
import { loadStatement } from "@/lib/statement";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Landmark, PiggyBank, FileText, ShieldCheck } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { clearPending, getThread, saveMessages } from "@/lib/threads";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Copilot financiar — Clar.ai" },
      { name: "description", content: "Conversație cu copilotul financiar Clar.ai despre buget și economisire." },
      { property: "og:title", content: "Copilot financiar — Clar.ai" },
      { property: "og:description", content: "Sfaturi simple despre buget, economisire și obiective." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  return (
    <ClientOnly fallback={null}>
      <ChatWindow key={threadId} threadId={threadId} />
    </ClientOnly>
  );
}

const SUGGESTIONS = [
  { icon: Landmark, text: "Cum îmi împart salariul? Explică-mi regula 50/30/20." },
  { icon: FileText, text: "Cât să pun deoparte lunar pentru un fond de urgență?" },
  { icon: PiggyBank, text: "Cum scap de abonamentele și cheltuielile recurente inutile?" },
  { icon: ShieldCheck, text: "Vreau să încep să investesc mici sume. De unde încep?" },
];

function ChatWindow({ threadId }: { threadId: string }) {
  const initial = useMemo(() => getThread(threadId), [threadId]);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: () => {
    const p = loadProfile();
    return { threadId, profil: profilPentruAI(p), seif: seifPentruAI(loadStatement(), p?.varsta) };
  } }), [threadId]);
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initial?.messages ?? [],
    transport,
    onError: (e) => toast.error(e.message || "Eroare de rețea. Încearcă din nou."),
  });
  const busy = status === "submitted" || status === "streaming";
  const sentPending = useRef(false);

  useEffect(() => {
    if (status === "ready" || status === "error") {
      if (messages.length) saveMessages(threadId, messages);
    }
  }, [messages, status, threadId]);

  useEffect(() => {
    const prompt = initial?.pendingPrompt;
    if (sentPending.current || !prompt) return;
    const t = setTimeout(() => {
      sentPending.current = true;
      clearPending(threadId);
      void sendMessage({ text: prompt });
    }, 50);
    return () => clearTimeout(t);
  }, [initial, threadId, sendMessage]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    void sendMessage({ text });
  };

  const composer = (
    <PromptInput onSubmit={(m) => send(m.text)} className="rounded-2xl bg-card shadow-soft">
      <PromptInputTextarea autoFocus placeholder="Întreabă orice despre buget, economisire și obiective..." />
      <PromptInputFooter>
        <PromptInputTools>
          <span className="px-2 text-xs text-muted-foreground">Nu introduce IBAN sau date personale</span>
        </PromptInputTools>
        <PromptInputSubmit status={status} onStop={stop} />
      </PromptInputFooter>
    </PromptInput>
  );

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <h1 className="mb-2 text-center font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Cu ce te pot ajuta azi?
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Copilot financiar pentru România · Educație financiară
          </p>
          {composer}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                onClick={() => send(s.text)}
                className="flex items-start gap-3 rounded-xl border bg-card p-3 text-left text-sm transition-colors hover:bg-accent"
              >
                <s.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-8">
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    m.role === "assistant" ? <MessageResponse key={i}>{p.text}</MessageResponse> : <span key={i} className="whitespace-pre-wrap">{p.text}</span>
                  ) : p.type === "reasoning" && p.text ? (
                    <details key={i} className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Raționament</summary>
                      <p className="mt-1 whitespace-pre-wrap">{p.text}</p>
                    </details>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <div className="flex gap-1 py-2" aria-label="Se gândește">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl px-4 pb-4">
        {composer}
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Clar.ai poate greși. Răspunsurile sunt educație financiară, nu sfat contabil, juridic sau de investiții personalizat.
        </p>
      </div>
    </div>
  );
}
