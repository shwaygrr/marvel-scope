import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CharacterDetailView from './routes/CharacterDetailView.jsx';
import ComicDetailView from './routes/ComicDetailView.jsx';

import NotFound from './routes/NotFound.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<NotFound/>}/>
      <Route index={true} path="/" element={<App />} />
      <Route index={false} path="/character/:character" element={<CharacterDetailView />} />
      <Route index={false} path="/comic/:comic" element={<ComicDetailView />} />
    </Routes>
  </BrowserRouter>
);
