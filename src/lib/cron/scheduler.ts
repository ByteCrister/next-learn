/* Server-only cron scheduler that calls the GET API route every minute.
   Safe to import multiple times: uses a global flag to ensure a single timer.
   Uses server-side fetch, so import from a server component or a route.
*/

import runEventStatusUpdate from "@/lib/cron/runEventStatusUpdate";

type BackoffState = {
  attempts: number;
  nextDelayMs: number;
};

declare global {
  var _eventStatusCronStarted: boolean | undefined;
  var _eventStatusCronTimer: NodeJS.Timeout | undefined;
  var _eventStatusCronBackoff: BackoffState | undefined;
}

const INTERVAL_MS = 60_000; // 1 minute
const INITIAL_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 5 * 60_000; // 5 minutes

function nowIso() {
  return new Date().toISOString();
}

async function callCronRunner() {
  try {
    const json = await runEventStatusUpdate();
    global._eventStatusCronBackoff = { attempts: 0, nextDelayMs: INITIAL_BACKOFF_MS };
    console.log(`[cron ${nowIso()}] update-event-status ok`, (json as { results?: unknown })?.results ?? "");
    return true;
  } catch (err: unknown) {
    const prev = global._eventStatusCronBackoff ?? { attempts: 0, nextDelayMs: INITIAL_BACKOFF_MS };
    const attempts = prev.attempts + 1;
    const nextDelayMs = Math.min(prev.nextDelayMs * 2, MAX_BACKOFF_MS);
    global._eventStatusCronBackoff = { attempts, nextDelayMs };
    console.error(`[cron ${nowIso()}] update-event-status failed attempt=${attempts}`, String(err));
    return false;
  }
}

function scheduleNextRun(delayMs = INTERVAL_MS) {
  if (global._eventStatusCronTimer) {
    clearTimeout(global._eventStatusCronTimer);
    global._eventStatusCronTimer = undefined;
  }

  global._eventStatusCronTimer = setTimeout(async () => {
    const ok = await callCronRunner();
    const backoff = global._eventStatusCronBackoff ?? { attempts: 0, nextDelayMs: INITIAL_BACKOFF_MS };
    const nextDelay = ok ? INTERVAL_MS : backoff.nextDelayMs;
    scheduleNextRun(nextDelay);
  }, delayMs);
}

export function startEventStatusCron() {
  if (typeof window !== "undefined") return;

  if (global._eventStatusCronStarted) return;
  global._eventStatusCronStarted = true;
  global._eventStatusCronBackoff = { attempts: 0, nextDelayMs: INITIAL_BACKOFF_MS };

  (async () => {
    console.log(`[cron ${nowIso()}] starting event status cron`);
    const ok = await callCronRunner();
    const backoff = global._eventStatusCronBackoff ?? { attempts: 0, nextDelayMs: INITIAL_BACKOFF_MS };
    const initialDelay = ok ? INTERVAL_MS : backoff.nextDelayMs;
    scheduleNextRun(initialDelay);
  })();
}

if (typeof window === "undefined") {
  startEventStatusCron();
}

export default startEventStatusCron;
