import { useState } from "react";

import {

    login,

    register

} from "../../api/auth.api";

import { useNavigate } from "react-router-dom";

function AuthForm({mode}){

    const navigate=useNavigate();

    const [username,setUsername]=useState("");

    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");

    const [error,setError]=useState("");

    async function handleSubmit(e){

        e.preventDefault();

        try{

            if(mode==="register"){

                await register(

                    username,

                    email,

                    password

                );

            }

            const data=await login(

                email,

                password

            );

            localStorage.setItem(

                "token",

                data.token

            );

            navigate("/dashboard");

        }

        catch (err) {

    console.log(err);

    console.log(err.response);

    console.log(err.response?.data);

    setError(

        err.response?.data?.message ||

        "Authentication failed."

    );

}

    }

    return(

        <form

            className="auth-form"

            onSubmit={handleSubmit}

        >

            {

                mode==="register" &&

                <input

                    type="text"

                    placeholder="Username"

                    value={username}

                    onChange={(e)=>setUsername(e.target.value)}

                />

            }

            <input

                type="email"

                placeholder="Email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

            />

            <input

                type="password"

                placeholder="Password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

            />

            {

                error &&

                <p className="error">

                    {error}

                </p>

            }

            <button>

                {

                    mode==="login"

                    ?

                    "Login"

                    :

                    "Create account"

                }

            </button>

        </form>

    );

}

export default AuthForm;