import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import "../styles/auth.css";

function Auth() {

    const [mode, setMode] = useState("login");

    return (

        <div className="auth-container">

            <div className="left-panel">

                <h1>CyberMind</h1>

                <h3>AI-Powered Security Operations Center</h3>

                <ul>

                    <li>📂 Upload and analyze logs</li>

                    <li>🛡️ Detect security threats</li>

                    <li>🔍 Investigate incidents</li>

                    <li>🤖 AI Security Assistant</li>

                    <li>📄 Generate reports</li>

                </ul>

            </div>

            <div className="right-panel">

                <div className="tabs">

                    <button

                        className={mode==="login" ? "active":""}

                        onClick={()=>setMode("login")}

                    >

                        Login

                    </button>

                    <button

                        className={mode==="register" ? "active":""}

                        onClick={()=>setMode("register")}

                    >

                        Register

                    </button>

                </div>

                <AuthForm mode={mode}/>

            </div>

        </div>

    );

}

export default Auth;