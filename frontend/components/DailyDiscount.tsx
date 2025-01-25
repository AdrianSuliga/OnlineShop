import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Row, Col } from "antd";

const { Title, Text } = Typography;

// Typ produktu z fakestoreapi
type ProductType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

// Funkcja do generowania seeda z daty
const generateSeed = (date: Date, offset: number) => {
  return (date.getDate() + offset) % 20; // Zakładamy 20 produktów na fakestoreapi
};

const DailyDiscount: React.FC<{ offset: number }> = ({ offset }) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const dateSeed = generateSeed(new Date(), offset);
        const response = await fetch("https://fakestoreapi.com/products");
        const data: ProductType[] = await response.json();

        const selectedProduct = data[dateSeed];
        setProduct(selectedProduct);

        // Stały procent promocji na podstawie seeda
        const randomDiscount = 10 + (dateSeed * 5) % 41; // Procent od 10% do 50%
        setDiscount(randomDiscount);

        try {
            const response = await fetch(`http://localhost:3000/productdata/${selectedProduct.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ discount: (1-randomDiscount/100).toFixed(2) }),
            });
      
            if (response.ok) {
              console.log("Zniżka została zaktualizowana pomyślnie!");
            } else {
              const errorData = await response.json();
              console.error(errorData.error || "Błąd aktualizacji zniżki.");
            }
          } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
          }

      } catch (error) {
        console.error("Błąd podczas pobierania produktu:", error);
      }
    };

    fetchProduct();
  }, [offset]);

  if (!product) {
    return <Text>Ładowanie produktu dnia...</Text>;
  }

  const discountedPrice = (product.price * (1 - discount / 100)).toFixed(2);

  return (
    <Card
      title={<Title level={4}>Oferta dnia!</Title>}
      bordered={false}
      style={{ width: 300, margin: "20px auto", textAlign: "center", backgroundColor: "#f9f9f9" }}
      cover={<img alt={product.title} src={product.image} style={{ height: 200, objectFit: "contain" }} />}
    >
      <Title level={5}>{product.title}</Title>
      <Text>{product.category}</Text>
      <div style={{ margin: "10px 0" }}>
        <Text delete style={{ marginRight: 8}}>
          {product.price.toFixed(2)} zł
        </Text>
        <Text strong style={{ color: "red" }}>
          {discountedPrice} zł
        </Text>
      </div>
      <Text type="secondary" style={{ display: "block", marginBottom: 10, color: "red" }}>
        Promocja: {discount}% taniej!
      </Text>
      <Button type="primary" href={`/products/${product.id}`}>
        Zobacz produkt
      </Button>
    </Card>
  );
};

export default DailyDiscount;
