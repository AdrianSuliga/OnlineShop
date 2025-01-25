import React, { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Button, Col, Divider, Form, Input, Row, Select, Typography } from "antd";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

interface DeliveryOption {
  method: string;
  cost: number;
  time: string;
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  discount: number;
  deliveryOption?: DeliveryOption;
}

const CheckoutPage: React.FC = () => {
  const { CartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [deliveryOptions] = useState<DeliveryOption[]>([
    { method: "Kurier", cost: 15.0, time: "1-2 dni robocze" },
    { method: "Paczkomat", cost: 10.0, time: "2-3 dni robocze" },
    { method: "Odbiór osobisty", cost: 0.0, time: "0 dni (natychmiast)" },
    { method: "Bardzo szybki biegacz", cost: 50.0, time: "30 minut" }, // Nowa opcja dostawy
  ]);
  const [totalPrice, setTotalPrice] = useState<number>(0.0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = CartItems.map((item) =>
          fetch(`https://fakestoreapi.com/products/${item.ProductID}`).then((res) => res.json())
        );
        const productsData = await Promise.all(productPromises);

        const discountPromises = productsData.map((product) =>
          fetch(`http://localhost:3000/productdata/${product.id}`)
            .then((res) => res.json())
            .then((data) => data.Discount || 1)
            .catch(() => 1)
        );
        const discounts = await Promise.all(discountPromises);

        const updatedProducts = productsData.map((data, idx) => ({
          id: data.id,
          title: data.title,
          price: data.price,
          quantity: CartItems[idx].Quantity,
          discount: discounts[idx],
        }));

        setProducts(updatedProducts);
        calculateTotalPrice(updatedProducts);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProducts();
  }, [CartItems]);

  const calculateTotalPrice = (products: CartProduct[]) => {
    const total = products.reduce((sum, product) => {
      const productTotal = product.price * product.quantity * product.discount;
      const deliveryCost = product.deliveryOption?.cost || 0;
      return sum + productTotal + deliveryCost;
    }, 0);
    setTotalPrice(total);
  };

  const handleDeliveryChange = (productId: number, option: DeliveryOption) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, deliveryOption: option } : product
    );
    setProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  const handleSubmitOrder = async () => {
    if (user && CartItems.length > 0) {
        try {
            const response = await fetch("http://localhost:3000/orders/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserID: user.userID,
                    ProductsBought: CartItems,
                })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.info);
                clearCart();
                navigate("/");
            } else {
                const err = await response.json();
                alert("Order failed, " + err);
            }
        } catch (err) {
            alert(err);
        }
    } else if (CartItems.length === 0) {
        alert("Cart is empty");
        navigate("/");
    } else {
        alert("You must be logged in to proceed with order");
        navigate("/login");
    }
}

  return (
    <div style={{ padding: "20px" }}>
      <Title>Podsumowanie zamówienia</Title>
      <Divider />
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col span={24} key={product.id}>
            <Row>
              <Col span={12}>
                <Text>{product.title}</Text>
                <p>
                  Cena: {(product.price * product.discount).toFixed(2)} zł | Ilość: {product.quantity}
                </p>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Wybierz opcję dostawy"
                  onChange={(value) =>
                    handleDeliveryChange(
                      product.id,
                      deliveryOptions.find((option) => option.method === value)!
                    )
                  }
                  style={{ width: "100%" }}
                >
                  {deliveryOptions.map((option) => (
                    <Option key={option.method} value={option.method}>
                      {option.method} - {option.cost} zł ({option.time})
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <Divider />
      <Title level={4}>Razem do zapłaty: {totalPrice.toFixed(2)} zł</Title>
      <Divider />
      <Form onFinish={handleSubmitOrder} layout="vertical">
        <Title level={5}>Dane adresowe</Title>
        <Form.Item
          name="address"
          label="Adres dostawy"
          rules={[{ required: true, message: "Wprowadź adres dostawy" }]}
        >
          <Input placeholder="Ulica i numer, np. ul. Przykladowa 123/4" />
        </Form.Item>
        <Form.Item
          name="city"
          label="Miasto"
          rules={[{ required: true, message: "Wprowadź miasto" }]}
        >
          <Input placeholder="Wpisz miasto" />
        </Form.Item>
        <Form.Item
          name="postalCode"
          label="Kod pocztowy"
          rules={[{ required: true, message: "Wprowadź kod pocztowy" }]}
        >
          <Input placeholder="00-000" />
        </Form.Item>
        <Title level={5}>Dane płatności</Title>
        <Form.Item
          name="cardNumber"
          label="Numer karty kredytowej"
          rules={[{ required: true, message: "Wprowadź numer karty kredytowej" }]}
        >
          <Input placeholder="1234 5678 9012 3456" />
        </Form.Item>
        <Form.Item
          name="paymentMethod"
          label="Metoda płatności"
          rules={[{ required: true, message: "Wybierz metodę płatności" }]}
        >
          <Select placeholder="Wybierz metodę płatności">
            <Option value="blik">BLIK</Option>
            <Option value="creditCard">Karta kredytowa</Option>
            <Option value="paypal">PayPal</Option>
          </Select>
        </Form.Item>
        <Divider />
        <Button type="primary" htmlType="submit">
          Złóż zamówienie
        </Button>
      </Form>
    </div>
  );
};

export default CheckoutPage;
