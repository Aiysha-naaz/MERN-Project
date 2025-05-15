// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AddAgent from './components/AddAgent';
import AgentLeads from './components/AgentLeads';
import AllAgentLeads from './components/AllAgentLeads';
import AgentTasksCount from './components/AgentTasksCount';
// import AgentLeadsPage from './components/AgentLeadsPage';
import UploadCSV from './components/UploadCSV';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} /> 
          {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}

          <Route path="/add-agent" element={<AddAgent />} />
           <Route path="/upload" element={<UploadCSV />}/>
             <Route path="/all-agent-leads" element={<AllAgentLeads />} />
          <Route path="/leads/:agentId" element={<AgentLeads />} />  
          <Route path="/task-distribution" element={<AgentTasksCount />} />

          {/* <Route path="/leads/:agentId" element={<AgentLeadsPage />} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
