import "./App.css";
import BusinessDashboard from "./components/BusinessDashboard";
import ResidentDashboard from "./components/residentCommunity/residentDashboard/ResidentDashboard";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      {/* <BusinessDashboard /> */}
      <ResidentDashboard></ResidentDashboard>
    </div>
  );
}

export default App;
