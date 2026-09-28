declare module "@pdf-highlight/react-pdf-highlight" {
  import { Component, CSSProperties } from "react";
  export type ReplaceText = {
    search: string; // Text to find (matching ignores case, whitespace and line breaks, like keywords)
    replace: string; // Text drawn instead; "" only covers the original
    color?: string; // Text color, default: the page's ink color
    background?: string; // Color covering the original glyphs, default: the page's paper color
    highlight?: boolean; // false: do not mark the replaced text like a keyword match. Default true
  };
  type Props = {
    url?: string; // pdf file path
    width?: number | string; // The width specifies the horizontal size for rendering the PDF,
    scale?: number; // Minimum render scale; pages are rasterized at the container width x devicePixelRatio when that is larger,
    page?: number; //The page refers to the specific page of the PDF to render. If not provided, all pages of the PDF will be rendered (lazily, as they scroll into view).
    pageSearch?: number; // The pageSearch refers to the specific page of the PDF where the search will be performed. If not provided, the search will be conducted across all pages.,
    onLoaded?: (error?: any) => void; // Called once the pages currently in view are drawn. Receives the error when loading or rendering fails.
    onStartLoad?: (error?: any) => void; // Called when a document (re)load or a full re-render starts. Keyword / highlight / replaceTexts changes only repaint the overlay and do not trigger it.
    keywords?: string[]; // Words or phrases to highlight. Every occurrence is highlighted; matching ignores case, whitespace and line breaks and uses the displayed text (after replaceTexts). The view scrolls to the first match (like a browser's Ctrl+F) when a document loads and whenever the search changes; call `scrollToMatch()` through a ref to scroll again.
    colorHighlight?: string; // Highlight color of replaced text, and of keywords unless colorKeyword is set: a solid fill multiplied over the page (the ink stays dark), or a border with isBorderHighlight. Default "yellow"
    colorKeyword?: string; // Highlight color of keyword matches. Default colorHighlight
    isBorderHighlight?: boolean; // Draws a border around matches (keywords and replaced text) instead of a solid background.
    styleWrap?: CSSProperties; // Styles for the wrapper element that contains the pages.
    debug?: boolean; // Logs to the console: the pdf.js used (version, source, worker), load time and page count, each page's render time and canvas size, one line per painted page (matches per keyword, replaced, reflowed) and the scroll target. Errors are printed even without debug when no onLoaded handles them.
    allowHtml?: boolean; // Adds a transparent, selectable text layer over each page so text can be selected and copied. Default = false
    specialWordRemoves?: string[]; // Strings ignored when matching keywords and replaceTexts (e.g. ["-"] to match across hyphenated line breaks).
    maxKeywordLength?: number; // Maximum number of characters (whitespace excluded) of each keyword that is matched. Default = 2000
    replaceTexts?: ReplaceText[]; // Replaces text on screen and marks it like a keyword match. The paragraph is flowed again like edited text: a longer replacement pushes the following words on (adding lines below the paragraph and moving the rest of the page down when needed), a shorter one pulls them back. Display only: the PDF file itself is not modified, so do not use it for redaction.
    pdfjs?: any; // Your own pdf.js, e.g. `import * as pdfjs from "pdfjs-dist"`. Without it a global pdfjsLib is reused, and only otherwise pdf.js 3.11.174 is loaded from cdnjs.
  };

  export class PDFHighlight extends Component<Props> {
    // Scrolls to the first keyword match (e.g. from a "find" button via a ref).
    // Resolves whether a match was found.
    scrollToMatch(): Promise<boolean>;
  }
}
