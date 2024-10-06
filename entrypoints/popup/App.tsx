import wxtLogo from '/wxt.svg';
import './App.css';

function App() {

  return (
    <>
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
      </div>
      <h1>Quick AI reply for LinkedIn</h1>
    </>
  );
}

export default App;
