import React, { useState } from "react";

import "./App.css";
import Modal from "./components/Model";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="App">
      <div className="top-nav">View Audience</div>
      <button className="save-button" onClick={() => setShowModal(true)}>
        Save Segment
      </button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
