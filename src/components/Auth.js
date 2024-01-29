import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Auth = () => {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rusername, setRusername] = useState("");
  const [password1, setPassword1] = useState("");
  const [email, setEmail] = useState("");

  const [warn, setWarn] = useState("");

  const Change = () => {
    setAuth(!auth);
  };

  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (!localStorage.getItem("link")) {
        localStorage.clear();
        var link = window.prompt("Enter API End Point");
        localStorage.setItem("link", link);
      }
    }, 1000);
  }, []);

  //Login

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = localStorage.getItem("link");

    // Perform API call for authentication and get the token
    try {
      const response = await fetch(url + "token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token (example using local storage)
        console.log(data);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", username);
        // Redirect to chat page
        // history.push("/chat");
        nav("/chat");
      } else {
        console.error("Login failed");
        setWarn("Login Fail");
      }
    } catch (error) {
      console.error("Login error:", error);
      setWarn("Login error:", error);
    }
  };

  //login

  // signup

  const handleSignup = async (e) => {
    e.preventDefault();
    const url = localStorage.getItem("link");

    try {
      const response = await fetch(url + "register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: rusername,
          hashed_password: password1,
          email: email,
        }),
      });

      if (response.ok) {
        alert("User created");
        nav("/");
      } else {
        alert("Try Another username");
      }
    } catch (error) {
      console.error("SignUp error:", error);
    }
  };
  //signup

  return (
    <>
      <div className="auth">
        <div className="authform">
          {auth == true ? (
            <>
              <form onSubmit={handleLogin}>
                <h2 style={{ color: "white", marginBottom: "5px" }}>Login</h2>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="username"
                />
                <br />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="password"
                />
                <br />
                <input type="submit" className="submit" />
                <p
                  style={{
                    color: "white",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Don't have account ?{" "}
                  <b style={{ cursor: "pointer" }} onClick={Change}>
                    Register now
                  </b>
                </p>
              </form>
              <br />
              <p style={{ color: "red" }}>{warn}</p>
            </>
          ) : (
            <>
              <form onSubmit={handleSignup}>
                <h2 style={{ color: "white", marginBottom: "5px" }}>
                  Register
                </h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="username"
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="username"
                  value={rusername}
                  onChange={(e) => setRusername(e.target.value)}
                />
                <br />
                <input
                  type="password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  placeholder="Password"
                  className="username"
                />
                <br />
                <input type="submit" className="submit" />
                <p
                  style={{
                    color: "white",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Go back to{" "}
                  <b style={{ cursor: "pointer" }} onClick={Change}>
                    Login Page
                  </b>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Auth;
