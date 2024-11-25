# PDF Highlight => PDFJS version 3.11.174

```js
type Props = {
  url?: string // pdf file path
  width?: number | string // The width specifies the horizontal size for rendering the PDF,
  scale?: number // The scale controls the zoom level of the PDF when rendering, adjusting its size larger or smaller,
  page?: number //The page refers to the specific page of the PDF to render. If not provided, all pages of the PDF will be rendered.
  pageSearch?: number // The pageSearch refers to the specific page of the PDF where the search will be performed. If not provided, the search will be conducted across all pages.,
  onLoaded?: (error?: any) => void,
  onStartLoad?: (error?: any) => void,
  keywords?: string[] // The keywords parameter is a list (array) of words or phrases that you want to search for within a PDF document. These keywords are used to locate specific text within the PDF and highlight them based on the options you've configured (e.g., border or background highlighting),
  colorHighlight?: string // is a parameter that defines the color used for highlighting keywords in a PDF. It allows you to specify the color of the highlight, which can be either applied to the border (if isBorderHighlight is enabled) or to the background (if isBorderHighlight is disabled).,
  isBorderHighlight?: boolean // is a flag that allows highlighting keywords by drawing a border around them, instead of changing the background color. This can be useful when you want to visually emphasize the keywords without altering the background style, which can be especially useful for readability or design consistency.,
  styleWrap?: CSSProperties // Is a parameter or property that allows customization of the styles applied to the parent wrapper element that contains the canvas rendering the PDF content.,
  debug?: boolean // Is a parameter or flag used to display each step of the search process, providing detailed insights into how results are being generated. It helps developers understand and troubleshoot issues during keyword searching,
  allowHtml?: boolean, // is a parameter or flag that enables rendering and displaying HTML content within the PDF output instead of limiting it to canvas-based rendering. Default = false
  extractLetterSpacing?: number // Is a parameter that allows you to configure the letter spacing to improve the accuracy of keyword searches within a PDF file,
  specialWordRemoves?: string[] // Is an array that specifies which special characters should be removed from a given string or input.,
  maxKeywordLength?: number, //The maxKeywordLength is used to limit the number of characters in each keyword. To optimize, you can split long keywords in the keywords array into smaller keywords based on the maxKeywordLength limit.
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
      url="https://pdfobject.com/pdf/sample.pdf"
    />
  );
}

export default App;
```
