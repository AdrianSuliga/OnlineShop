import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Button, Image } from 'antd';


const NavigationBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    return (
        <div style={{ padding: '20px', display:'flex', flexDirection:'row', alignItems:'center'}}>
        
        {/* logo */}
        <Image
            src="./resources/logo.png"
            alt="prestissimo.com"
            style={{ maxWidth: '100%', height: 'auto', alignItems:'center', cursor:'pointer' }}
            onClick={() => navigate('/')}
            preview={false}
          />

        {/* produkty */}
        <Button id="navButton"
          onClick={() => navigate('/products')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Zobacz Produkty
        </Button>
        
        <p>/</p>

        {/* koszyk */}
        <Button id="navButton"
          onClick={() => navigate('/cart')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Koszyk
        </Button>

        <p>/</p>
        
        {/* hist zamowien */}
        {user ? (
          <Button id="navButton"
            onClick={() => navigate('/orderHistory')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Historia Zamówień
          </Button>
        ) : null}

        {user ? <p>/</p> : null}
        

        {/* logowanie */}
        {!user ? (
          <Button id="navButton"
            onClick={() => navigate('/login')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Zaloguj się
          </Button>
        ) : (
          <Button id="navButton"
            onClick={logout}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Wyloguj
          </Button>
        )}    
    </div>
    );
};

export default NavigationBar;