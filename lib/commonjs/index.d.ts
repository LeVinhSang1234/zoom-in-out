declare module "@pdf-highlight/react-pdf-highlight" {
  import { Component, CSSProperties } from "react";
  export type ReplaceText = {
    search: string; // Text to find (matching ignores whitespace and line breaks, like keywords)
    replace: string; // Text drawn instead; "" only covers the original
    color?: string; // Text color, default: the page's ink color
    background?: string; // Color covering the original glyphs, default: the page's paper color
  };
  type Props = {
    url?: string; // pdf file path
    width?: number | string; // The width specifies the horizontal size for rendering the PDF,
    scale?: number; // Minimum render scale; pages are rasterized at the container width x devicePixelRatio when that is larger,
    page?: number; //The page refers to the specific page of the PDF to render. If not provided, all pages of the PDF will be rendered (lazily, as they scroll into view).
    pageSearch?: number; // The pageSearch refers to the specific page of the PDF where the search will be performed. If not provided, the search will be conducted across all pages.,
    onLoaded?: (error?: any) => void; // Called once the pages currently in view are drawn. Receives the error when loading or rendering fails.
    onStartLoad?: (error?: any) => void; // Called when a document (re)load or a full re-render starts. Keyword / highlight / replaceTexts changes only repaint the overlay and do not trigger it.
    keywords?: string[]; // Words or phrases to highlight. Every occurrence is highlighted; matching ignores whitespace and line breaks and uses the displayed text (after replaceTexts).
    colorHighlight?: string; // Highlight color, applied to the background or to the border (isBorderHighlight). Default "yellow"
    isBorderHighlight?: boolean; // Draws a border around matches instead of a translucent background.
    styleWrap?: CSSProperties; // Styles for the wrapper element that contains the pages.
    debug?: boolean; // Logs the number of matches / replaced slices per page and page render errors to the console.
    allowHtml?: boolean; // Adds a transparent, selectable text layer over each page so text can be selected and copied. Default = false
    specialWordRemoves?: string[]; // Strings ignored when matching keywords and replaceTexts (e.g. ["-"] to match across hyphenated line breaks).
    maxKeywordLength?: number; // Maximum number of characters (whitespace excluded) of each keyword that is matched. Default = 2000
    replaceTexts?: ReplaceText[]; // Replaces text on screen and marks it like a keyword match. A longer replacement is flowed into its paragraph like typed text; only when the paragraph has no line left is it scaled down. Display only: the PDF file itself is not modified, so do not use it for redaction.
    pdfjs?: any; // Your own pdf.js, e.g. `import * as pdfjs from "pdfjs-dist"`. Without it a global pdfjsLib is reused, and only otherwise pdf.js 3.11.174 is loaded from cdnjs.
  };

  export class PDFHighlight extends Component<Props> {}
}
