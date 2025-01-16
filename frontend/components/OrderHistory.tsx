import React, { useEffect, useState } from 'react';
import { useAuth } from "./AuthProvider";

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
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <div key={order.OrderID} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>Order ID: {order.OrderID}</h3>
              <p>Order Date: {formatDate(order.OrderDate)}</p>
              <div>
                {order.ProductsBought.map((product, index) => {
                  const details = productDetails[product.productID];
                  return details ? (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <img src={details.image} alt={details.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                      <span>{details.title}</span>
                      <span> - Quantity: {product.quantity}</span>
                    </div>
                  ) : (
                    <p key={index}>Loading product details...</p>
                  );
                })}
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;
