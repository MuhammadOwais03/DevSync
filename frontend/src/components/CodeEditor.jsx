import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useSocketStore } from "../store/useSocketStore";

const CodeEditor = () => {
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [cursors, setCursors] = useState({});
  const editorRef = useRef(null);

  const {
    connectSocket,
    socket,
    code,
    userInput,
    language,
    output,
    setCode,
    setUserInput,
    setLanguage,
    setOutput,
  } = useSocketStore();

  // Connect socket only once
  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket]);

  // Setup socket listeners once
  useEffect(() => {
    if (!socket) return;

    const handleOutput = (data) => {
      console.log(data);
      setOutput(data, "output");
      if (data.trim().endsWith(":")) {
        setWaitingForInput(true);
      }
    };

    const handleAcceptCode = (val) => {
      console.log(val);
      setCode(val);
    };

    const handleAcceptOutput = (val) => {
      console.log(val);
      setOutput(val, "output");
    };

    const handleCursorUpdate = ({ userId, position }) => {
      console.log("Socket yodate", position);
      setCursors((prev) => ({ ...prev, [userId]: position }));
    };

    const handleDone = () => setWaitingForInput(false);

    // Attach events
    socket.on("output", handleOutput);
    socket.on("acceptCode", handleAcceptCode);
    socket.on("acceptOutput", handleAcceptOutput);
    socket.on("done", handleDone);
    // Listen for cursor updates
    socket.on("cursorUpdate", handleCursorUpdate);

    return () => {
      // Cleanup listeners on unmount
      socket.off("output", handleOutput);
      socket.off("acceptCode", handleAcceptCode);
      socket.off("acceptOutput", handleAcceptOutput);
      socket.off("done", handleDone);
    };
  }, [socket]);

  const runCode = () => {
    console.log("Running Code...");
    setOutput("", null);
    socket.emit("runCode", { code, language });
  };

  const sendInput = () => {
    socket.emit("sendInput", userInput);
    setUserInput("");
    setWaitingForInput(false);
  };

  const codeOnChange = (value) => {
    setCode(value);
    console.log(value);
    socket.emit("codeChange", value, socket.id);
  };

  const handleEditorDidMount = (editor, monaco) => {
    console.log("✅ Editor Mounted!"); // Confirm `onMount` fires
    console.log("🛠 Editor Instance:", editor);
    console.log("🛠 Monaco Instance:", monaco);

    if (!editor) {
      console.error("❌ handleEditorDidMount received NULL editor!");
      return;
    }

    editorRef.current = editor;
    console.log("🎯 Updated editorRef:", editorRef);

    if (!socket) {
      console.warn("⚠️ Socket not initialized yet!");
      return;
    }

    editor.onDidChangeCursorPosition((event) => {
      const position = event.position;
      console.log("✏️ Cursor Position:", position);

      socket.emit("cursorMove", { userId: socket.id, position });
    });
  };

  useEffect(() => {
    console.log(editorRef);
  }, [editorRef]);

  const decorationsRef = useRef([]);

  useEffect(() => {
    if (!editorRef.current || !socket?.id) return;

    console.log("Enyet", cursors);

    const editor = editorRef.current;
    const userId = socket.id; // Get the local user's socket ID

    const decorations = Object.entries(cursors)
      .filter(([id]) => id !== userId) // Exclude local user
      .map(([id, position]) => ({
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column + 1
        ),
        options: {
          className: "remote-cursor",
        },
      }));

    // Update decorations properly
    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    );
  }, [cursors, socket?.id]);

  return (
    <div className="editor-container">
      <div className="coding">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        {socket ? ( // Only render the Editor if socket is ready
          <Editor
            height="300px"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => codeOnChange(value || "")}
            onMount={handleEditorDidMount} // ✅ Ensure this exists
          />
        ) : (
          <p>Loading Editor...</p>
        )}
      </div>

      <div className="output-container">
        <button onClick={runCode}>Run Code</button>
        <pre className="text-white">{output}</pre>

        {waitingForInput && (
          <div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input..."
            />
            <button
              onClick={() => {
                sendInput();
                setOutput(userInput, "input");
              }}
            >
              Submit Input
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
