import { useRef, useState } from "react";
import PDFHighlight from "./packages/PDFHighlight";

const PDF_URL = "https://pdfobject.com/pdf/sample.pdf";

function App() {
  const [keyword, setKeyword] = useState("velit");
  const [search, setSearch] = useState("Lorem ipsum");
  const [replace, setReplace] = useState("Hello world");
  const viewer = useRef<PDFHighlight>(null);

  // Typing only repaints the highlight overlay; pages are not re-rendered.
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8 }}>
        <input
          placeholder="Highlight keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => viewer.current?.scrollToMatch()}>Find</button>
        <input
          placeholder="Replace text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="With"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
        />
      </div>
      <PDFHighlight
        ref={viewer}
        url={PDF_URL}
        allowHtml
        debug
        keywords={[keyword].filter(Boolean)}
        replaceTexts={search ? [{ search, replace }] : []}
        styleWrap={{ flex: 1, minHeight: 0 }}
        onStartLoad={() => {
          console.log("start loading");
        }}
        onLoaded={(error) => {
          console.log("end loading", error || "");
        }}
      />
    </div>
  );
}

export default App;
