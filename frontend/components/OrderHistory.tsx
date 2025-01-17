import React, { useEffect, useState } from 'react';
import { useAuth } from "./AuthProvider";
import { Card, Typography, List, Avatar, Spin, Alert } from 'antd';
import './OrderHistory.css';

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
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (loading) {
    return <Spin tip="Loading orders..." style={{ display: 'block', margin: '20px auto' }} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="order-history-container">
      <Title level={2} style={{ color: 'white', textAlign: 'center' }}>Order Details</Title>
      {orders.length === 0 ? (
        <Alert message="No orders found" type="info" showIcon style={{ margin: '20px auto' }} />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={orders}
          renderItem={(order) => (
            <List.Item>
              <Card
                title={<Text style={{ color: '#fff' }}>Order ID: {order.OrderID}</Text>}
                bordered={false}
                style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid transparent', borderImage: 'linear-gradient(135deg, #3b3b98, #1e293b) 1' }}
              >
                <Text style={{ color: '#d1d5db' }}>Order Date: {formatDate(order.OrderDate)}</Text>
                <List
                  itemLayout="horizontal"
                  dataSource={order.ProductsBought}
                  renderItem={(product) => {
                    const details = productDetails[product.productID];
                    return details ? (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={details.image} style={{ border: '2px solid', borderImage: 'linear-gradient(135deg, #3b3b98, #1e293b) 1' }} />}
                          title={<Text style={{ color: '#fff' }}>{details.title}</Text>}
                          description={<Text style={{ color: '#9ca3af' }}>Quantity: {product.quantity}</Text>}
                        />
                      </List.Item>
                    ) : (
                      <List.Item>Loading product details...</List.Item>
                    );
                  }}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default OrderHistory;
