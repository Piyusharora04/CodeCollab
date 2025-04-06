import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { ACTIONS } from "../../Actions";
import LanguageSelector from "../EditorComp/LanguageSelector";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../../constants";
import axios from "axios";

function CodeEditor({ socketRef, roomId, onCodeChange, onLanguageChange}) {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // Sync code with incoming real-time updates
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      });

      socketRef.current.on(ACTIONS.SYNC_CODE, ({ socketId }) => {
        // Send the current code to the new user
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
      });
      

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ lang }) => {
        // console.log("language change detected to ",lang);
        setLanguage(lang);
        onLanguageChange(lang);
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.SYNC_CODE);
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
    };
  }, [socketRef.current]);

  // Handle editor changes
  const handleEditorChange = (newCode) => {
    setCode(newCode);
    onCodeChange(newCode);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  };

  // Store editor reference
  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  // Handle language selection
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, lang: newLang });
    // const newCode = CODE_SNIPPETS[newLang] || "";
    // setCode(newCode);
    // if (editorRef.current) {
    //   editorRef.current.setValue(newCode); // Update Monaco Editor manually
    // }
  };

  // Run code using Piston API
  const runCode = async () => {
    setOutput("Running...");

    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version: LANGUAGE_VERSIONS[language],
        files: [{ content: code }],
      });

      setOutput(response.data.run.output || "No output");
    } catch (error) {
      console.error("Execution Error:", error);
      setOutput("Error running code.");
    }
  };

  return (
    <div style={{ height: "600px", display: "flex", flexDirection: "column" }}>
      {/* Language Selector */}
      <LanguageSelector language={language} onSelect={handleLanguageChange} />

      {/* Code Editor */}
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={{
          autoClosingBrackets: "always",
          formatOnType: true,
          fontSize: 14,
          minimap: { enabled: false },
        }}
      />

      {/* Run Code Button */}
      {/* <button onClick={runCode} style={{ marginTop: "10px", padding: "8px", cursor: "pointer" }}>
        Run Code
      </button> */}

      {/* Output Section */}
      {/* <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#1e1e1e", color: "white" }}>
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div> */}
    </div>
  );
}

export default CodeEditor;
