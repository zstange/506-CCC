import React from "react";
import logo from './logo.svg';
import CreateAccount from './CreateAccount'
import './App.css';

function App() {

  // TESTING SERVER /API
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  // TESTING SERVER /API


  return (
    <div className="App">
      <header className="App-header">
        <CreateAccount />
      </header>
    </div>
  );
}

export default App;
