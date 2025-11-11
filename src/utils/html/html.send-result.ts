/** Build HTML email for the results — visually improved, inline CSS only */
export function buildResultHtml(opts: {
  examTitle: string;
  participantId: string;
  participantEmail: string;
  score: number;
  totalQuestions: number;
  percent: number;
  timeTakenSeconds?: number;
  answersSummary: {
    index: number;
    selected: number;
    selectedText?: string;
    correctIndex?: number;
    correctText?: string;
    isCorrect?: boolean;
  }[];
  sentAt: Date;
}) {
  const {
    examTitle,
    participantId,
    participantEmail,
    score,
    totalQuestions,
    timeTakenSeconds,
    answersSummary,
    sentAt,
  } = opts;

  const hasTime = Number.isFinite(timeTakenSeconds as number);
  const minutes = hasTime ? Math.floor((timeTakenSeconds as number) / 60) : null;
  const seconds = hasTime ? (timeTakenSeconds as number) % 60 : null;

  const percent =
    typeof opts.percent === "number" && !Number.isNaN(opts.percent)
      ? Math.max(0, Math.min(100, Math.round(opts.percent)))
      : 0;
  const progressWidth = `${percent}%`;

  // color tokens (inline usage to simplify editing)
  const textColor = "#081228"; // stronger main text for contrast
  const muted = "#64748b";
  const accent = "#0369a1";
  const lightCard = "#ffffff";
  const softBg = "#f3f6fb";
  const tableBorder = "#eef6ff";
  const rowAltBg = "linear-gradient(180deg,rgba(245,250,255,0.6),transparent)";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Exam Result</title>
</head>
<body style="margin:0;padding:24px;background:${softBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${textColor};-webkit-font-smoothing:antialiased;">
  <div style="max-width:720px;margin:0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td style="padding:18px 12px;">
          <div style="background:${lightCard};border-radius:12px;overflow:hidden;box-shadow:0 12px 30px rgba(8,18,40,0.06);">
            <!-- Header -->
            <div style="display:flex;align-items:center;gap:14px;padding:18px;background:linear-gradient(90deg,#0ea5e9 0%,#0369a1 100%);color:#ffffff;">
              <div style="width:56px;height:56px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;box-shadow:inset 0 -6px 18px rgba(255,255,255,0.03);">
                EX
              </div>
              <div style="min-width:0;">
                <div style="font-size:16px;font-weight:800;line-height:1;color:#ffffff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  ${escapeHtml(examTitle)} — Result
                </div>
                <div style="font-size:13px;color:rgba(255,255,255,0.92);margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="opacity:0.95">To <strong>${escapeHtml(participantEmail)}</strong></span>
                  <span style="opacity:0.85">•</span>
                  <span style="opacity:0.9">ID: <strong style="font-weight:700;color:rgba(255,255,255,0.95)">${escapeHtml(participantId)}</strong></span>
                </div>
              </div>
              <div style="margin-left:auto;font-size:13px;color:rgba(255,255,255,0.95);background:rgba(255,255,255,0.06);padding:8px 12px;border-radius:8px;font-weight:800;">
                ${percent}%
              </div>
            </div>

            <!-- Body -->
            <div style="padding:18px;background:linear-gradient(180deg,#ffffff,#fbfdff);">
              <!-- Stats row -->
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
                <div style="flex:1 1 160px;background:linear-gradient(180deg,#f8fbff,#eef7ff);border:1px solid ${tableBorder};padding:12px;border-radius:10px;font-weight:700;font-size:13px;color:${textColor};min-width:120px;">
                  Questions <span style="float:right;color:${accent};font-weight:900;">${totalQuestions}</span>
                </div>
                <div style="flex:1 1 160px;background:linear-gradient(180deg,#f8fbff,#eef7ff);border:1px solid ${tableBorder};padding:12px;border-radius:10px;font-weight:700;font-size:13px;color:${textColor};min-width:120px;">
                  Score <span style="float:right;color:${accent};font-weight:900;">${typeof score === 'number' ? `${score}/${totalQuestions}` : `—/${totalQuestions}`}</span>
                </div>
                <div style="flex:1 1 220px;background:linear-gradient(180deg,#f8fbff,#eef7ff);border:1px solid ${tableBorder};padding:12px;border-radius:10px;font-weight:700;font-size:13px;color:${textColor};min-width:160px;">
                  Sent <span style="float:right;color:${muted};font-weight:700;">${escapeHtml(sentAt.toUTCString())}</span>
                </div>
                <div style="flex:1 1 140px;background:linear-gradient(180deg,#f8fbff,#eef7ff);border:1px solid ${tableBorder};padding:12px;border-radius:10px;font-weight:700;font-size:13px;color:${textColor};min-width:120px;">
                  Time <span style="float:right;color:${muted};font-weight:700;">${hasTime ? `${minutes}m ${seconds}s` : '—'}</span>
                </div>
              </div>

              <!-- Performance card -->
              <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;padding:14px;border-radius:12px;background:linear-gradient(180deg,#ffffff,#f7fcff);box-shadow:0 6px 18px rgba(4,12,24,0.04);margin-bottom:16px;">
                <div style="width:96px;min-width:96px;text-align:center;padding:10px;border-radius:10px;background:linear-gradient(180deg,rgba(6,182,212,0.06),rgba(3,105,161,0.03));">
                  <div style="font-size:28px;font-weight:900;color:${accent};">${percent}%</div>
                  <div style="font-size:12px;color:${textColor};margin-top:6px;font-weight:700;">Performance</div>
                </div>
                <div style="flex:1;min-width:180px;">
                  <div style="font-weight:800;color:${textColor};">Overall performance</div>
                  <div style="color:${muted};font-size:13px;margin-top:8px;">
                    You answered <strong style="color:${textColor}">${typeof score === 'number' ? `${score}` : '—'}</strong> of <strong style="color:${textColor}">${totalQuestions}</strong> questions correctly.
                  </div>

                  <div style="margin-top:12px;">
                    <div style="height:14px;background:#e6f9fb;border-radius:999px;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,0.6);">
                      <div style="height:14px;background:linear-gradient(90deg,#06b6d4,#059669);width:${progressWidth};border-radius:999px;"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;margin-top:8px;">
                      <span>${percent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Answers table -->
              <div style="overflow:auto;border-radius:10px;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <thead>
                    <tr>
                      <th style="text-align:left;padding:12px 10px;font-weight:800;color:${textColor};border-bottom:1px solid ${tableBorder};">Q#</th>
                      <th style="text-align:left;padding:12px 10px;font-weight:800;color:${textColor};border-bottom:1px solid ${tableBorder};">Selected</th>
                      <th style="text-align:left;padding:12px 10px;font-weight:800;color:${textColor};border-bottom:1px solid ${tableBorder};">Correct</th>
                      <th style="text-align:left;padding:12px 10px;font-weight:800;color:${textColor};border-bottom:1px solid ${tableBorder};">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${answersSummary
                      .map((a, i) => {
                        const resultLabel = a.isCorrect ? "Correct" : "Wrong";
                        const selectedDisplay =
                          typeof a.selectedText === "string"
                            ? `${a.selectedText}`
                            : typeof a.selected === "number" && a.selected >= 0
                            ? `Choice ${a.selected + 1}`
                            : "—";
                        const correctDisplay =
                          typeof a.correctText === "string"
                            ? `${a.correctText}`
                            : typeof a.correctIndex === "number" && a.correctIndex >= 0
                            ? `Choice ${a.correctIndex + 1}`
                            : "—";

                        const rowBg = i % 2 === 0 ? rowAltBg : "";

                        const badgeStyle = a.isCorrect
                          ? "background:linear-gradient(90deg,#10b981,#059669);color:#ffffff;padding:6px 12px;border-radius:999px;font-weight:800;font-size:13px;display:inline-block;"
                          : "background:linear-gradient(90deg,#ef4444,#b91c1c);color:#ffffff;padding:6px 12px;border-radius:999px;font-weight:800;font-size:13px;display:inline-block;";

                        return `<tr style="${rowBg}">
                          <td style="padding:12px 10px;border-bottom:1px solid #f3f7fb;vertical-align:middle;font-weight:800;color:${accent};width:60px;white-space:nowrap;">${a.index + 1}</td>
                          <td style="padding:12px 10px;border-bottom:1px solid #f3f7fb;vertical-align:middle;color:${textColor};word-break:break-word;max-width:320px;">
                            <div style="font-weight:700;">${escapeHtml(selectedDisplay)}</div>
                          </td>
                          <td style="padding:12px 10px;border-bottom:1px solid #f3f7fb;vertical-align:middle;color:${textColor};word-break:break-word;max-width:320px;">
                            <div style="font-weight:700;">${escapeHtml(correctDisplay)}</div>
                          </td>
                          <td style="padding:12px 10px;border-bottom:1px solid #f3f7fb;vertical-align:middle;">
                            <span style="${badgeStyle}">${escapeHtml(resultLabel)}</span>
                          </td>
                        </tr>`;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding:14px 18px;background:linear-gradient(180deg,#fbfdff,#ffffff);border-top:1px solid #eef4fb;border-bottom-left-radius:12px;border-bottom-right-radius:12px;color:${muted};font-size:13px;">
              If you believe there is an error in your result, reply to this email including your participant ID and the exam code.
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

/** Escape helper */
export function escapeHtml(s: string | undefined | null) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
