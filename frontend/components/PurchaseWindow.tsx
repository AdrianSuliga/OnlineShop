import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewList from './ReviewList';
import { Button,Col,Collapse,CollapseProps,Divider,Image, Input, InputNumber, Row } from "antd";
import Product from './Product';
import { useCart } from './CartProvider';

interface ProductIDProps {
  productID: number;
}

const PurchaseWindow: React.FC<ProductIDProps> = ({productID}) => {
  const [stockLvl, setStockLvl] = useState(10); // Ilość do dodania do koszyka
  const [quantity, setQuantity] = useState(1); // Ilość do dodania do koszyka
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchStockLvl = async () => {
        try {
            const response = await fetch(`http://localhost:3000/stocklevel/${productID}`);
            const data = await response.json();
            setStockLvl( data["StockLevel"] || 10 ); // Domyślnie ustawiamy `10`, jeśli `stock` nie jest dostępny
        } catch (error) {
            console.error('Error fetching stock level:', error);
        }
    };

    fetchStockLvl();
  }, [productID]);

  const handleAddToCart = () => {
    if (quantity > stockLvl) {
      alert('Not enough items in stock!');
    } else {
      addToCart({
        ProductID: productID,
        Quantity: quantity,
      })
      alert(`Added ${quantity} item(s) to the cart.`);
      setStockLvl(stockLvl - quantity);
    }
  };

  return (
    <div>
        <p><strong> Magazyn:</strong> {stockLvl} dostepne</p>
        <InputNumber
          type="number"
          min={1}
          max={stockLvl}
          value={quantity}
          onChange={(e) => setQuantity(Number(e?.valueOf()))}
          style={{ width: '60px', marginRight: '10px' }}
        />
        <Button onClick={handleAddToCart} color='primary' variant='solid'>
          Dodaj do Koszyka
        </Button>
    </div>
  );
};

export default PurchaseWindow;
