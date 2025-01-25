import React, { useEffect, useState } from 'react';
import CSS from "csstype";
import { useAuth } from "./AuthProvider";
import { Card, Typography, List, Avatar, Spin, Alert, Button } from 'antd';
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface Product {
  productID: string;
  quantity: number;
}

interface Order {
  OrderID: string;
  OrderDate: string;
  ProductsBought: Product[];
}

interface ProductDetails {
  id: string;
  title: string;
  image: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<{ [key: string]: ProductDetails }>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/orders/details/${user.userID}`);
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data.Orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const productIDs = new Set<string>();

      orders.forEach((order) => {
        order.ProductsBought.forEach((product) => {
          productIDs.add(product.productID);
        });
      });

      try {
        const responses = await Promise.all(
          Array.from(productIDs).map((productID) =>
            fetch(`https://fakestoreapi.com/products/${productID}`).then((res) => res.json())
          )
        );
        const details: { [key: string]: ProductDetails } = {};
        responses.forEach((product: ProductDetails) => {
          details[product.id] = product;
        });
        setProductDetails(details);
      } catch (err) {
        console.error('Error fetching product details:', err);
      }
    };

    if (orders.length > 0) {
      fetchProductDetails();
    }
  }, [orders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };


  function downloadOrders(orders: Order[], filename: string): void {
    const textContent = orders
      .map(
        (order) =>
          `Order ID: ${order.OrderID}\nOrder Date: ${order.OrderDate}\nProducts:\n` +
          order.ProductsBought
            .map(
              (product) =>
                `  - Product ID: ${product.productID}, Quantity: ${product.quantity}`
            )
            .join("\n") +
          "\n"
      )
      .join("\n====================\n");
  
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    URL.revokeObjectURL(url);
  }


  if (loading) {
    return <Spin tip="Loading orders..." style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const h1Styles: CSS.Properties = {
    right: 0,
    bottom: "2rem",
    paddingLeft: "10%",
    paddingRight: "10%",
    fontSize: "1.5rem",
  };

  if(user){
    return (
      <div style={h1Styles}>
          <div>
              <Title level={2}>
                  Historia zamówień
              </Title>
              
              <Button onClick={() => downloadOrders(orders, "orders.txt")} htmlType="button">
                        Download orders
              </Button>
              <br></br><br></br>
              {orders.length === 0 ? (
                  <Alert
                      message="Brak zamówień"
                      type="info"
                      showIcon
                  />
              ) : (
                  <List
                      grid={{ gutter: 16, column: 1 }}
                      dataSource={orders}
                      renderItem={(order) => (
                          <List.Item>
                              <Card
                                  title={
                                      <Text>
                                          Numer zamówienia: {order.OrderID}
                                      </Text>
                                  }
                              >
                                  <Text>
                                      Data zamówienia: {formatDate(order.OrderDate)}
                                  </Text>
                                  <List
                                      itemLayout="horizontal"
                                      dataSource={order.ProductsBought}
                                      renderItem={(product) => {
                                          const details = productDetails[product.productID];
                                          return details ? (
                                              <List.Item>
                                                  <List.Item.Meta
                                                      avatar={
                                                          <Avatar
                                                              src={details.image}
                                                          />
                                                      }
                                                      title={
                                                          <Text>
                                                              {details.title}
                                                          </Text>
                                                      }
                                                      description={
                                                          <Text>
                                                              Ilość: {product.quantity}
                                                          </Text>
                                                      }
                                                  />
                                              </List.Item>
                                          ) : (
                                              <List.Item>Ładowanie...</List.Item>
                                          );
                                      }}
                                  />
                              </Card>
                          </List.Item>
                      )}
                  />
              )}
          </div>
      </div>
  );
  } else {
    navigate("/");
  }
  
};


export default OrderHistory;
