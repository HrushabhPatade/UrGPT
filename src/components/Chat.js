import React, { useState, useEffect } from "react";
import UrGPT from "../assets/UrGPT_logo.png";
import "../styles/Chat.css";
import { Link, useNavigate } from "react-router-dom";

const Chat = () => {
  const [inputData, setInputData] = useState("");
  const [titles, setTitles] = useState([]);
  const [state, setState] = useState(false);
  const [newChat, setNewChat] = useState(true);
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState("");
  const [conversation, setConversation] = useState([]);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("username");
  const nurl = localStorage.getItem("link");

  const nav = useNavigate();

  function format(data) {
    const res = data[0].ai_response;
    const codeRegex = /```([\s\S]*?)```/g;
    const formattedResponse = res.replace(
      codeRegex,
      (_, code) => `<pre>${code}</pre>`
    );
    return (data[0].ai_response = formattedResponse);
  }

  // Title Funtion

  useEffect(() => {
    const url = nurl + "get_titles/1";
    console.log(url);
    // Fetch the titles from an API endpoint
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "any",
      },
      // body: JSON.stringify({ sentence: inputData }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the titles state with the fetched data
        setTitles(data.reverse());
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching titles:", error);
      });
  }, [state]);

  // Title Funtion

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = nurl + "chat/";
    setPrompt(inputData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "any",
        },

        body: newChat
          ? JSON.stringify({ prompt: inputData })
          : JSON.stringify({ prompt: inputData, title: title }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const decodedValue = decoder.decode(value);
        setText((prevText) => prevText + decodedValue);
      }
      // setNewChat(false);
      setState(!state);
      setText("");
      setPrompt("");
      setInputData("");
      console.log(titles[0].title);
      var temp = await get_latest_title();

      titleTransfer(e, temp);
      // If 'data.title' is available in the response, handle it accordingly
    } catch (error) {
      // Handle errors here
      console.error("Error:", error);
    }
  };

  const get_latest_title = () => {
    const url = nurl + "get_titles/1";

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "any",
      },
      // body: JSON.stringify({ title: title }), // Make sure 'title' is defined
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          data.reverse();
          return data[0].title;
        } else {
          // Handle the case where the response is empty or doesn't contain titles
          return null;
        }
      })
      .catch((error) => {
        // Handle fetch errors
        console.error("Error fetching latest title:", error);
        return null;
      });
  };

  const deleteConversation = (e, title) => {
    e.preventDefault();
    const url = nurl + "delete_conversation/1/";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "any",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNewChat(true);
        setConversation([]);
        setState(!state);
        console.log(data);
        alert(data.message);
      });
  };

  const titleTransfer = (e, title) => {
    e.preventDefault();
    console.log(title);
    setTitle(title);
    const url = nurl + "get_data/1/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "any",
      },
      body: JSON.stringify({ title: title }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // format(data);
        setConversation(data);
        console.log(conversation);
        setNewChat(false);
      });
  };

  return (
    <>
      <div className="chat">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <img src={UrGPT} width="60px" />
            <h2>UrGPT</h2>
          </div>
          <div className="newChat">
            <p
              onClick={() => {
                setConversation([]);
                setNewChat(true);
                setTitle("");
              }}
            >
              New Chat
            </p>
          </div>
          <div className="chatHistory">
            <p>Recent</p>

            <div className="list" style={{ height: "77vh" }}>
              {titles.map((item) => (
                <div key={item.id} className="listItem">
                  <div
                    className="chatName"
                    onClick={(e) => titleTransfer(e, item.title)}
                  >
                    {item.title}
                  </div>
                  <div
                    className="delete"
                    onClick={(e) => deleteConversation(e, item.title)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="22"
                      height="22"
                      viewBox="0,0,256,256 "
                    >
                      <g
                        fill="#ffffff"
                        fill-rule="nonzero"
                        stroke="none"
                        stroke-width="1"
                        stroke-linecap="butt"
                        stroke-linejoin="miter"
                        stroke-miterlimit="10"
                        stroke-dasharray=""
                        stroke-dashoffset="0"
                        font-family="none"
                        font-weight="none"
                        font-size="none"
                        text-anchor="none"
                        style={{ mixBlendMode: "normal" }}
                      >
                        <g transform="scale(10.66667,10.66667)">
                          <path d="M10.80664,2c-0.517,0 -1.01095,0.20431 -1.37695,0.57031l-0.42969,0.42969h-5c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h16c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-5l-0.42969,-0.42969c-0.365,-0.366 -0.85995,-0.57031 -1.37695,-0.57031zM4.36523,7l1.52734,13.26367c0.132,0.99 0.98442,1.73633 1.98242,1.73633h8.24805c0.998,0 1.85138,-0.74514 1.98438,-1.74414l1.52734,-13.25586z"></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mode"></div>
        </div>
        {/* Sidebar */}

        {/* Main */}

        <div className="main">
          <div className="navbar">
            <button
              className="toggleButton"
              onClick={() => {
                nav("/chat");
              }}
            >
              Chat
            </button>
            <button
              className="toggleButton"
              onClick={() => {
                nav("/docQnA");
              }}
            >
              DocQnA
            </button>
            <button
              className="toggleButton "
              onClick={() => {
                nav("/webQnA");
              }}
            >
              WebQnA
            </button>
          </div>
          <div className="conversions">
            <div
              className="scroll-container m-2"
              style={{ height: "74vh", overflow: "auto" }}
            >
              {conversation.map((a) => (
                <>
                  <h3
                    className="p3 "
                    key={a.id}
                    style={{ alignItems: "center" }}
                  >
                    {a.user_response}
                  </h3>
                  <br />
                  <p
                    className="response container p-4"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: a.ai_response }}
                  ></p>
                  <br />
                  <br />
                </>
              ))}
              <h3>{prompt}</h3>
              <br />
              <p style={{ whiteSpace: "pre-line", marginTop: "5px" }}>{text}</p>
              <br />
              <br />
            </div>
          </div>
          <div className="questionBar">
            <form className="qform">
              <input
                className="query"
                placeholder="Ask..."
                value={inputData}
                onChange={(event) => {
                  setInputData(event.target.value);
                }}
                type="text"
              />
              <input
                className="send"
                value="Send"
                type="submit"
                onClick={handleSubmit}
              ></input>
            </form>
          </div>
        </div>

        {/* Main */}
      </div>
    </>
  );
};

export default Chat;
