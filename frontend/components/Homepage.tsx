import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    return (
        <div style={{ padding: '20px' }}>
        <h1>Simple E-Shop</h1>
        
        {!user ? (
          <button id="navButton"
            onClick={() => navigate('/login')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Zaloguj się
          </button>
        ) : (
          <button id="navButton"
            onClick={logout}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Wyloguj
          </button>
        )}

        

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

        {user ? (
          <button id="navButton"
          onClick={() => navigate('/orderHistory')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Historia Zamówień
        </button>
        ) : null}

        
    </div>
    );
};

export default HomePage;