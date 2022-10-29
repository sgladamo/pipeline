import "./App.css";
import RootView from "core/RootView";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <RootView />
    </BrowserRouter>
  );
}

export default App;
