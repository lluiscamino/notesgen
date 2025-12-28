import {math, mathHtml} from "micromark-extension-math";
import {executableBlocks, executableBlocksHtml} from "./executable-blocks/index.js";
import {micromark} from "micromark";

export function convertMarkdownToHtml(markdown: string): string {
    const bodyHtml = micromark(markdown, {
        extensions: [math(), executableBlocks()],
        htmlExtensions: [mathHtml(), executableBlocksHtml()]
    });
    return htmlTemplate(bodyHtml);
}

export function htmlTemplate(bodyHtml: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>@page{size: A4;margin:0;padding:10mm}html, body{font-family: "Times New Roman", Georgia, serif;font-size: 11pt;line-height: 1.5;color: #000;background: #fff}h1, h2, h3, h4{font-family: "Helvetica Neue", Arial, sans-serif;font-weight: bold;page-break-after: avoid;page-break-inside: avoid}h1{font-size: 18pt;margin: 1.2em 0 0.6em}h2{font-size: 14pt;margin: 1em 0 0.5em}h3{font-size: 12pt;margin: 0.8em 0 0.4em}p{margin: 0.6em 0;text-align: justify;orphans: 3;widows: 3}.math-display{margin: 1em 0;text-align: center;page-break-inside: avoid}.math-inline{white-space: nowrap}.katex{font-size: 1em}.katex-display{font-size: 1.05em}h1, h2, h3, p, .math-display{break-inside: avoid}a{color: #000;text-decoration: none}a[href]:after{content: " (" attr(href) ")";font-size: 9pt}nav, footer, aside{display: none}blockquote{margin: 1em 1.5em;padding: 0.6em 1em;border-left: 3px solid #000;font-style: italic;background: none;page-break-inside: avoid}blockquote p{margin: 0.4em 0}blockquote blockquote{margin-left: 1em;border-left-width: 2px;font-style: normal}</style>
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}