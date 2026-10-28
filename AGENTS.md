<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Chat: streaming via `src/routes/api/chat.ts` → `src/lib/ai/chat.server.ts` (Lovable AI Gateway, Responses API); threads live in browser localStorage (`src/lib/threads.ts`), one URL per thread `/chat/$threadId` — keeps financial data off servers (privacy pitch).
- Fiscal rules (CASS thresholds) live in `src/lib/fiscal.ts` with tests in `src/test/fiscal.test.ts`; UI never hardcodes tax math.
- Selected-text explanations are mounted once in the root shell and stream through `/api/explain`; only the selected text is sent, without profile, statement context or persistent storage, to minimize disclosure.
