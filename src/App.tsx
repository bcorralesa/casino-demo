import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './routes/Welcome';
import AgeVerification from './routes/AgeVerification';
import Result from './routes/Result';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/verify" element={<AgeVerification />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
