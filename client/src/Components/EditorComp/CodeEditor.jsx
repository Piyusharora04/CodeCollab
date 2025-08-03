import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { ACTIONS } from "../../Actions";
import LanguageSelector from "../EditorComp/LanguageSelector";

// No changes to imports or the top of the function
function CodeEditor({ socketRef, roomId, onCodeChange, onLanguageChange }) {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const isRemoteChange = useRef(false);

  useEffect(() => {
    if (socketRef.current) {
      // THE FIX IS HERE
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          isRemoteChange.current = true;
          editorRef.current.setValue(code);
          
          // Manually call onCodeChange to update the parent's ref
          // This ensures the compiler has the latest code
          onCodeChange(code);
        }
      });

      // No changes needed for the rest of the listeners
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ lang }) => {
        setLanguage(lang);
        onLanguageChange(lang);
      });
    }

    // Add onCodeChange to the dependency array for correctness
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
    };
  }, [socketRef.current, onCodeChange, onLanguageChange]);

  const handleEditorChange = (newCode) => {
    // This logic remains the same as the previous fix
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    setCode(newCode);
    onCodeChange(newCode);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    onLanguageChange(newLang);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, lang: newLang });
  };


  return (
    <div style={{ height: "600px", display: "flex", flexDirection: "column" }}>
      <LanguageSelector language={language} onSelect={handleLanguageChange} />
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