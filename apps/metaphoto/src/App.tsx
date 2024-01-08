import './App.css';
import { Logo } from './components/Logo';
import { PhotoDetails } from './pages/PhotoDetails';
import { PhotoList } from './pages/PhotoList';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <>
            <header className="flex items-center justify-center">
                <Logo />
            </header>
            <main className="column">
                <Routes>
                    <Route path="/" element={<PhotoList />} />
                    <Route path="/:id" element={<PhotoDetails />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
