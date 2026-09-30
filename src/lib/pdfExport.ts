/**
 * Formats agent synthesis output into an elegant, audit-ready HTML document
 * for PDF printing or sharing.
 */
export function buildAgentPdfHtml(agentName: string, date: string, content: string): string {
  // Convert basic markdown headers/lists to styled HTML
  const formattedHtml = content
    .replace(/^# (.*$)/gim, '<h1 class="heading-1">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="heading-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="heading-3">$1</h3>')
    .replace(/^\- (.*$)/gim, '<li class="list-item">$1</li>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '<div class="paragraph-gap"></div>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Nexus Impact AI - ${agentName}</title>
  <style>
    @page {
      margin: 20mm;
      size: letter;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      font-size: 11pt;
      margin: 0;
      padding: 24px;
      background: #ffffff;
    }
    .header-bar {
      border-bottom: 2px solid #0d9488;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 20pt;
      font-weight: 800;
      color: #070d1e;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 9pt;
      color: #0d9488;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .meta-box {
      text-align: right;
    }
    .agent-pill {
      display: inline-block;
      background: #f0fdfa;
      border: 1px solid #ccfbf1;
      color: #0f766e;
      font-size: 9pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-date {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 4px;
    }
    .heading-1 {
      font-size: 15pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .heading-2 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #134e4a;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    .heading-3 {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 6px;
    }
    .list-item {
      margin-left: 18px;
      margin-bottom: 4px;
      color: #1e293b;
    }
    .paragraph-gap {
      height: 10px;
    }
    .content-box {
      background: #fafbfc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div>
      <div class="brand-title">Nexus Impact AI</div>
      <div class="brand-sub">Agents for Social Impact · Official Intelligence Dossier</div>
    </div>
    <div class="meta-box">
      <div class="agent-pill">${agentName} Agent</div>
      <div class="meta-date">Generated: ${date}</div>
    </div>
  </div>

  <div class="content-box">
    ${formattedHtml}
  </div>

  <div class="footer">
    <div>Confidential & Proprietary · Non-Profit & Humanitarian Field Deployment</div>
    <div>Nexus Impact AI Pro · Certified Intelligence Output</div>
  </div>
</body>
</html>`;
}

/**
 * Web implementation of PDF export using standard print dialog
 */
export async function exportAgentPdfWeb(agentName: string, date: string, content: string): Promise<void> {
  const html = buildAgentPdfHtml(agentName, date, content);

  // Create an invisible iframe to print cleanly without UI distortion
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) throw new Error('Could not access print frame.');

  doc.open();
  doc.write(html);
  doc.close();

  // Wait for resources to load before triggering print
  await new Promise((resolve) => setTimeout(resolve, 350));
  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
}
