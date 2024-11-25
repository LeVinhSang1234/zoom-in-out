import { useState } from "react";
import PDFHighlight from "./packages/PDFHighlight";

function App() {
  const [url] = useState("https://pdfobject.com/pdf/sample.pdf");

  const keywords = [
    `facilisis odio sed mi.\nCurabitur suscipit. Nullam vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat eget\npharetra commodo, eros mi condimentum quam,`,
  ];

  return (
    <>
      <PDFHighlight
        allowHtml
        debug
        onStartLoad={() => {
          console.log("start loading");
        }}
        onLoaded={() => {
          console.log("end loading");
        }}
        keywords={keywords}
        url={url}
      />
    </>
  );
}

export default App;
