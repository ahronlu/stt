import React, { useState, useEffect } from "react";
import "./App.css";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "he-IL";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    mic.stop();
    setSavedNotes([...savedNotes, note]);
    setNote("");
  };

  return (
    <div className="container">
      <h1>🐒 מקליטות ונהנות 🎤</h1>
      <div className="box">
        <h2>פתק חדש</h2>
        <button onClick={() => setIsListening((prevState) => !prevState)}>
          {isListening ? <span>עיצרי</span> : <span>הקליטי</span>}
        </button>
        <p>{note}</p>
        <button onClick={handleSaveNote} disabled={!note}>
          💾 שמרי כפתק
        </button>
      </div>
      <div className="box">
        <h2>פתקים שמורים</h2>
        {savedNotes.map((n) => (
          <p key={n}>{n}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
