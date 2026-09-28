# PDF Highlight => PDFJS version 3.11.174

```js
type Props = {
  url?: string // pdf file path
  width?: number | string // The width specifies the horizontal size for rendering the PDF,
  scale?: number // The scale controls the zoom level of the PDF when rendering, adjusting its size larger or smaller,
  page?: number //The page refers to the specific page of the PDF to render. If not provided, all pages of the PDF will be rendered.
  pageSearch?: number // The pageSearch refers to the specific page of the PDF where the search will be performed. If not provided, the search will be conducted across all pages.,
  onLoaded?: (error?: any) => void, // Called once the pages currently in view are drawn (pages further down render lazily while scrolling). Receives the error when loading or rendering fails.
  onStartLoad?: (error?: any) => void, // Called when a document (re)load or a full re-render starts. Keyword / highlight / replaceTexts changes only repaint the overlay and do not trigger it.
  keywords?: string[] // The keywords parameter is a list (array) of words or phrases that you want to search for within a PDF document. Matching ignores case, whitespace and line breaks, like a browser's Ctrl+F. These keywords are used to locate specific text within the PDF and highlight them based on the options you've configured (e.g., border or background highlighting), The view scrolls to the first match (like a browser's Ctrl+F) when a document loads and whenever the search changes; call `scrollToMatch()` through a ref to scroll again.
  colorHighlight?: string // Highlight color of replaced text, and of keywords unless colorKeyword is set: a solid fill multiplied over the page (the ink stays dark), or a border with isBorderHighlight. Default = "yellow"
  colorKeyword?: string // Highlight color of keyword matches. Default = colorHighlight
  isBorderHighlight?: boolean // is a flag that allows highlighting keywords by drawing a border around them, instead of changing the background color. This can be useful when you want to visually emphasize the keywords without altering the background style, which can be especially useful for readability or design consistency.,
  styleWrap?: CSSProperties // Is a parameter or property that allows customization of the styles applied to the parent wrapper element that contains the canvas rendering the PDF content.,
  debug?: boolean // Logs to the console: the pdf.js used (version, source, worker), load time and page count, each page's render time and canvas size, one line per painted page (matches per keyword, replaced, reflowed) and the scroll target. Errors are printed even without debug when no onLoaded handles them,
  allowHtml?: boolean, // Adds a transparent, selectable text layer over each page so text can be selected and copied. Default = false
  specialWordRemoves?: string[] // Strings ignored when matching keywords and replaceTexts (e.g. ["-"] to match across hyphenated line breaks). Matching already ignores all whitespace and line breaks,
  maxKeywordLength?: number, // Maximum number of characters (whitespace excluded) of each keyword that is matched. Default = 2000
  pdfjs?: any, // Your own pdf.js, e.g. `import * as pdfjs from "pdfjs-dist"`. Without it, a global `pdfjsLib` already on the page is reused, and only otherwise pdf.js 3.11.174 is loaded from cdnjs. If `GlobalWorkerOptions.workerSrc` is not set, the worker of the same version is loaded from jsdelivr.
  replaceTexts?: { search: string; replace: string; color?: string; background?: string; highlight?: boolean }[], // Replaces text on screen: every occurrence of `search` is covered with `background` and `replace` is drawn in `color` (defaults: the page's own paper and ink colors) with the PDF's embedded font, then marked like a keyword match (colorHighlight / isBorderHighlight) unless `highlight: false`. The paragraph is flowed again like edited text (words wrap, justified text stays justified): a longer replacement pushes the following words on, adding lines below the paragraph and moving the rest of the page down when needed; a shorter one pulls them back. `keywords` match the displayed text, i.e. after replacement. Display only — the PDF file itself is not modified, so do not use it for redaction.
};

import { PDFHighlight } from "@pdf-highlight/react-pdf-highlight";

function App() {
  return (
    <PDFHighlight
      onStartLoad={() => {
        console.log("start loading");
      }}
      onLoaded={() => {
        console.log("end loading");
      }}
      keywords={[
        `facilisis odio sed mi.\nCurabitur suscipit. Nullam vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat eget\npharetra commodo, eros mi condimentum quam,`,
      ]}
      replaceTexts={[{ search: "Lorem ipsum", replace: "Hello world" }]}
      url="https://pdfobject.com/pdf/sample.pdf"
    />
  );
}

export default App;
```
