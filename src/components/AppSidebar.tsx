import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Home, UserRound, LayoutDashboard, MessageSquarePlus, ShieldCheck, Trash2 } from "lucide-react";
import { createThread, deleteThread, useThreads } from "@/lib/threads";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/profile";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
        C
      </div>
      <div className="leading-tight">
        <div className="font-display text-base font-semibold">Clar.ai</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Asistent financiar</div>
      </div>
    </div>
  );
}

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const threads = useThreads();
  const { profil } = useProfile();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };

  const newChat = () => {
    const id = createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col gap-4 bg-sidebar p-3 text-sidebar-foreground">
      <div className="px-2 pt-1">
        <Logo />
      </div>
      <Link
        to="/onboarding"
        onClick={onNavigate}
        className="-mt-2.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
        activeProps={{ className: "bg-sidebar-accent font-medium" }}
      >
        <UserRound className="size-4 shrink-0" />
        <span className="min-w-0 truncate">{profil ? `Profil: ${profil.nume}` : "Creează profil"}</span>
      </Link>
      <button
        onClick={newChat}
        className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 py-2 text-sm font-medium shadow-soft transition-colors hover:bg-sidebar-accent"
      >
        <MessageSquarePlus className="size-4" /> Conversație nouă
      </button>
      <Link
        to="/"
        activeOptions={{ exact: true }}
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
        activeProps={{ className: "bg-sidebar-accent font-medium" }}
      >
        <Home className="size-4" /> Acasă
      </Link>
      <Link
        to="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
        activeProps={{ className: "bg-sidebar-accent font-medium" }}
      >
        <LayoutDashboard className="size-4" /> Seif financiar
      </Link>
      <div className="mt-2 px-3 text-xs font-medium text-muted-foreground">Conversații</div>
      <nav className="-mt-2 flex-1 space-y-0.5 overflow-y-auto">
        {threads.length === 0 && <p className="px-3 text-xs text-muted-foreground">Nicio conversație încă.</p>}
        {threads.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex items-center rounded-lg pr-1 transition-colors hover:bg-sidebar-accent",
              params.threadId === t.id && "bg-sidebar-accent",
            )}
          >
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              onClick={onNavigate}
              className="min-w-0 flex-1 truncate px-3 py-2 text-sm"
            >
              {t.title}
            </Link>
            <button
              aria-label="Șterge conversația"
              onClick={() => {
                deleteThread(t.id);
                if (params.threadId === t.id) navigate({ to: "/" });
              }}
              className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </nav>

      <div className="flex items-start gap-2 rounded-lg bg-success-soft p-3 text-xs text-success-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        <span>Conversațiile rămân doar în acest browser.</span>
      </div>
    </div>
  );
}
