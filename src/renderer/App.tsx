import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './Splash';
import 'gestalt/dist/gestalt.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
      </Routes>
    </Router>
  );
}
