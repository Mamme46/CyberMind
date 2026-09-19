import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import "../styles/auth.css";

import SecurityIcon from "@mui/icons-material/Security";

function Auth() {

    const [mode, setMode] = useState("login");

    return (

        <div className="auth-container">

            <div className="auth-card">

                <div className="brand">

                    <SecurityIcon fontSize="large" />

                    <h1>CyberMind</h1>

                </div>

                <p className="tagline">AI-Powered Security Operations Center</p>

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