import React from 'react'
import CodeEditor from "../../components/CodeEditor.jsx";
import "../../components/styles/codeEditor.css";
import "../../components/styles/userHome.css";

const userHome = () => {
  return (
    <div className='code-editor-container'>
        <CodeEditor />
    </div>
  )
}

export default userHome
