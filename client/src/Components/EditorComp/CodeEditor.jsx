import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { ACTIONS } from "../../Actions";
import LanguageSelector from "../EditorComp/LanguageSelector";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "../../constants";
import axios from "axios";

function CodeEditor({ socketRef, roomId, onCodeChange, onLanguageChange }) {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  
  // A flag to indicate if the change is from a remote source
  const isRemoteChange = useRef(false);

  // Sync code with incoming real-time updates
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          // Set the flag before programmatically changing the editor's value
          isRemoteChange.current = true;
          editorRef.current.setValue(code);
        }
      });

      // No changes needed for these listeners
      socketRef.current.on(ACTIONS.SYNC_CODE, ({ socketId }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
      });

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ lang }) => {
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
    // If the flag is true, it means the change came from the socket.
    // We should ignore it and reset the flag.
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    // Otherwise, this is a local user's change. Proceed to emit.
    setCode(newCode);
    onCodeChange(newCode);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  };

  // No changes needed below this line
  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, lang: newLang });
  };

  // ... (rest of your component is unchanged)

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
    </div>
  );
}

export default CodeEditor;