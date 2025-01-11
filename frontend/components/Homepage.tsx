import { useNavigate } from 'react-router-dom'; // Import stylów

const HomePage = () => {
    const navigate = useNavigate();
    
    return (
        <div style={{ padding: '20px' }}>
        <h1>Simple E-Shop</h1>

        <button id="navButton"
          onClick={() => navigate('/login')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Zaloguj się
        </button>

        <button id="navButton"
          onClick={() => navigate('/products')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Zobacz Produkty
        </button>
        
        <button id="navButton"
          onClick={() => navigate('/basket')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Koszyk
        </button>

        <button id="navButton"
          onClick={() => navigate('/orderHist')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Historia Zamówień
        </button>
    </div>
    );
};

export default HomePage;