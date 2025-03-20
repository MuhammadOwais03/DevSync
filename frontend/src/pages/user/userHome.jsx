import React from 'react'
import CodeEditor from "../../components/CodeEditor.jsx";
import "../../components/styles/codeEditor.css";
import "../../components/styles/userHome.css";
import { useLocation } from "react-router-dom";


const userHome = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const room = queryParams.get("room");



  return (
    <div className='code-editor-container'>
        <CodeEditor room={room}/>
    </div>
  )
}

export default userHome
