import './App.css';
import { Logo } from './components/Logo';
import { PhotoList } from './pages/PhotoList';

function App() {
    return (
        <>
            <header>
                <Logo />
            </header>
            <main className="column">
                <PhotoList />
            </main>
        </>
    );
}

export default App;
