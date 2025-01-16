import { Col, Collapse, CollapseProps, Row, Image, Divider } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PurchaseWindow from './PurchaseWindow';

interface ProductType {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface ProductProps {
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const navigate = useNavigate();

  const productData: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Szybkie Zakupy',
      children: <PurchaseWindow productID={product.id}/>
    },
    {
      key: '2',
      label: 'Opis Produktu',
      children: <p>{product.description}</p>,
    },
    {
      key: '3',
      label: 'Opinie',
      children: (
        <Link
          to={`/products/${product.id}`}
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          Przejdź do strony produktu
        </Link>
      ),
    },
  ];

  return (
    <div className="gradientBackground" id="productBackground">
      <Divider />

      <Row gutter={24} align="top">
        {/* Kolumna obrazka */}
        <Col span={4} style={{ alignItems: 'center'}}>
          <Image
            src={product.image}
            alt={product.title}
            style={{    
              maxWidth: '100%',
              height: 'auto',
              alignItems:'center',
              color: 'white',
            }}
          />
        </Col>

        {/* Kolumna opisu */}
        <Col span={16}>
            <Link to={`/products/${product.id}`} style={{color:'#3f48cc'}}>
              <h2>{product.title}</h2>
            </Link>
          <p>
            <strong>Cena:</strong> {product.price} PLN
          </p>
          <Collapse items={productData} defaultActiveKey={[]} />
        </Col>
      </Row>

      <Divider />
    </div>
  );
};

export default Product;
