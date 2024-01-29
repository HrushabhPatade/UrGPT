import React, { useState, useEffect, useRef } from "react";
import "../styles/Document.css";
import UrGPT from "../assets/UrGPT_logo.png";
import cross from "../assets/cross.png";
import pdf from "../assets/PDF.png";
import { Link, useNavigate } from "react-router-dom";

const Document = () => {
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
    const url = nurl + "get_titles/2";
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
    const url = nurl + "chat/docqna/";
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
    const url = nurl + "get_titles/2";

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
    const url = nurl + "delete_conversation/2/";
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
    const url = nurl + "get_data/2/";
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

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const uploadPDFs = async (files) => {
    console.log(files);
    try {
      const formData = new FormData();

      Array.from(files).forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      setSelectedFiles(Array.from(files));

      const url = nurl + "upload_pdf/";
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error("Failed to upload PDFs:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading PDFs:", error);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setFile(files);
    console.log(file);
  };

  const pdfUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      for (var i = 0; i < file.length; i++) {
        formData.append("files", file[i]);
      }
      console.log(formData);
      const url = nurl + "upload_pdf/";
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(result);
      } else {
        console.error("Failed to upload PDFs:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading PDFs:", error);
    }
  };

  // File Upload

  return (
    <>
      <div className="doc">
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
            <div className="list">
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
          <div className="mode">
            <label>
              <div
                className="fileUpload"
                // onDrop={handleDrop}
                // onDragOver={handleDragOver}
              >
                {/*  */}
                {selectedFiles.length == 0 && (
                  <p style={{ marginBottom: "5px" }}>
                    Drag and Drop PDF files ...
                  </p>
                )}
                {selectedFiles.length == 0 && (
                  <>
                    <img src={pdf} />
                    <br />
                    {/*  */}

                    {/* <label className="uploadpdf" >
                    Select */}
                    {/* </label> */}
                  </>
                )}
                {/* Display uploaded file names */}
                {selectedFiles.length > 0 && (
                  <div>
                    <p style={{ marginTop: "5px" }}>Uploaded Files:</p>
                    <ul style={{ overflowY: "scroll", height: "16vh" }}>
                      {selectedFiles.map((fileName, index) => (
                        <p className="pdfName" key={index}>
                          {fileName}
                          <div className="icon">
                            <img src={cross} width="10px" />
                          </div>
                        </p>
                      ))}
                    </ul>
                    {/* <button className="uploadButton">Upload</button> */}
                  </div>
                )}
              </div>
              <form>
                <input
                  type="file"
                  name="filesupload"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </form>
            </label>
            <input className="serverUpload" onClick={pdfUpload} type="submit" />
          </div>
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
              {/* {data.map((a)=>{
                  <p>{a.response}</p>  
                })} */}
              {/* <p className="response" style={{ whiteSpace: "pre-line" }}>
                  {data.ai_responce}
                </p> */}
              {conversation.map((a) => (
                <>
                  <h3
                    className="p3"
                    key={a.id}
                    style={{ alignItems: "center" }}
                  >
                    {a.user_response}
                  </h3><br/>
                  <p
                    className="response container p-4"
                    style={{ whiteSpace: "pre-line" }}
                    dangerouslySetInnerHTML={{ __html: a.ai_response }}
                  >
                    {/* {a.ai_response} */}
                  </p><br/><br/>
                </>
              ))}
              <h3>{prompt}</h3><br/>
              <p style={{ whiteSpace: "pre-line", marginTop: "5px" }}>{text}</p><br/><br/>
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

export default Document;
