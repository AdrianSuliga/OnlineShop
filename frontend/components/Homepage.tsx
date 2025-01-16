import React from 'react';
import { Button, Row, Col, Card, Typography, Space, Divider, Image } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  // Mock danych produktów
  // const recommendProducts = [
  // ];

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: 'darkblue',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <Title level={1} style={{ color: '#fff' }}>
          Witaj w Prestissimo.com!
        </Title>
        <Text style={{ fontSize: '18px', color: '#d9d9d9' }}>
          Twój ulubiony sklep z najlepszymi ofertami i najszybszą dostawą.
        </Text>
        <br />
        <Button
          type="primary"
          size="large"
          style={{ marginTop: '20px', backgroundColor: '#b83dba' }}
        >
          <Link to="/products">Przeglądaj produkty</Link>
        </Button>
      </div>

      {/* Sekcja polecanych produktów */}
      {/* <div style={{ marginBottom: '40px' }}>
        <Title level={2}>Polecane produkty</Title>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <Card
                hoverable
                cover={<img alt={product.title} src={product.image} />}
                style={{ borderRadius: '8px' }}
              >
                <Card.Meta
                  title={product.title}
                  description={
                    <Space direction="vertical">
                      <Text>{product.description}</Text>
                      <Text strong>Cena: {product.price} PLN</Text>
                      <Button type="primary">
                        <Link to={`/products/${product.id}`}>Zobacz więcej</Link>
                      </Button>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div> */}

      {/* Sekcja O nas */}
      <div style={{ marginBottom: '40px' }}>
        <Title level={2}>O nas</Title>
        <Text style={{ fontSize: '16px' }}>
          Prestissimo to sklep zrodzony z potrzeby szybszego tempa! Nasza nazwa inspirowana tempem 200 BPM 
          wyraża nasze podejście do dostarczania produktów – 1.7 razy szybciej niż konkurencja (tak, patrzymy na Ciebie, Allegro). 
          W świecie, gdzie czas to pieniądz, oferujemy wszystko, czego potrzebujesz, zanim zdążysz powiedzieć „dostawa ekspresowa”.
        </Text>
      </div>

      {/* Sekcja autorów */}
      <Divider />
      <div style={{ marginBottom: '40px' }}>
        <Title level={2}>Autorzy</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card title="Dominik" bordered>
              <Text> Autor Strony Głównej, sekcji Produkty i systemu dodawania opinii.</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Adrian" bordered>
              <Text> Twórca backendu, oraz sekcji Koszyk </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Filip" bordered>
              <Text> Autor systemu logowania oraz sekcji Historia Zamowień z funkcjonalnością pobierania.</Text>
            </Card>
          </Col>
        </Row>

        <Divider />
        
        <div style={{ marginBottom: '40px' }}>
        <Title level={2} style={{paddingBottom:'30px'}}>Użyte technologie</Title>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={12} sm={8} md={6}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              alt="React"
              preview={false}
              style={{ width: '80px', margin: '0', display: 'block' }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Image
              src="./resources/antd logo.png"
              alt="Ant Design"
              preview={false}
              style={{ maxWidth: '100px', margin: '0', display: 'flex' }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Image
              src="https://cdn.worldvectorlogo.com/logos/typescript.svg"
              alt="TypeScript"
              preview={false}
              style={{ maxWidth: '100px', margin: 'auto', display: 'block' }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
              alt="Node.js"
              preview={false}
              style={{ maxWidth: '100px', margin: 'auto', display: 'block' }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png"
              alt="Express.js"
              preview={false}
              style={{ maxWidth: '100px', margin: 'auto', display: 'block' }}
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/3/38/SQLite370.svg"
              alt="SQLite"
              preview={false}
              style={{ maxWidth: '100px', margin: 'auto', display: 'block' }}
            />
          </Col>
        </Row>
      </div>

      </div>
    </div>
  );
};

export default HomePage;
