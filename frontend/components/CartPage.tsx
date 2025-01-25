import React, { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Button, Col, Divider, Image, InputNumber, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.tsx";
const { Title, Text } = Typography;

interface CartProductDetails {
    id: number,
    title: string,
    description: string,
    category: string,
    price: number,
    image: string,
    stock: number,
    quantity: number,
    discount: number
}

const CartPage = () => {
    const { CartItems, editCartItem, removeFromCart, clearCart } = useCart();
    const [Products, setProducts] = useState<CartProductDetails[]>([]);
    const [TotalPrice, setTotalPrice] = useState<number>(0.0);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            let sum = 0.0;
            try {
                const productPromises = CartItems.map((item) =>
                    fetch(`https://fakestoreapi.com/products/${item.ProductID}`)
                    .then((res) => res.json())
                );
                const productsData = await Promise.all(productPromises);
                
                // Pobierz zniżki dla każdego produktu
                const discountPromises = productsData.map((product) =>
                    fetch(`http://localhost:3000/productdata/${product.id}`)
                    .then((res) => res.json())
                    .then((data) => data.Discount) // Zakładając, że odpowiedź zawiera Discount
                    .catch(() => 1) // Jeśli nie uda się pobrać zniżki, przypisz 1 (brak zniżki)
                );
        
                const discounts = await Promise.all(discountPromises);
        
                const updatedData: CartProductDetails[] = productsData.map((data, idx) => ({
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    image: data.image,
                    stock: data.stock,
                    quantity: CartItems[idx].Quantity,
                    discount: discounts[idx] || 1 // Przypisz zniżkę z odpowiedzi
                }));
        
                updatedData.forEach((data) => {
                    sum += data.price * data.discount * data.quantity;
                });
                sum = parseFloat(sum.toFixed(2));
                setProducts(updatedData);
                setTotalPrice(sum);
            } catch (error) {
                console.error("Error fetching product details: ", error);
            }
        };

        fetchProducts();
    }, [CartItems]);

    const productRepresentation = Products.map((product) => {
        return (
                <Row gutter={24} style={{marginBottom: "60px"}}>
                    <Col span={2}/>
                    <Col span={2}>
                        <Image 
                            src={product.image}
                            alt={product.title}
                            style={{ alignItems: 'center' }}
                        />
                    </Col>
                    <Col span={10} style={{marginTop: "auto", marginBottom: "auto"}}>
                        <Link to={`/products/${product.id}`} style={{color:'#3f48cc'}}>
                            <h2 style={{fontSize: '16px', textAlign: "justify", color: `#3f48cc`}}>
                                {product.title}
                            </h2>
                        </Link>
                        <p>{product.description}</p>
                    </Col>
                    <Col span={3} style={{marginTop: "auto", marginBottom: "auto"}}>
                        <h2>Cena za sztukę</h2>
                        {(product.discount == 1.0) ?
                        <p> <strong>Cena:</strong> {product.price} zł </p>
                        :
                        <div>
                        <div style={{ margin: "10px 0" }}>
                                <Text delete style={{ marginRight: 8 }}>
                                {product.price.toFixed(2)} zł
                                </Text>
                                <Text strong style={{ color: "red" }}>
                                {(product.price*product.discount).toFixed(2)} zł
                                </Text>
                            </div>
                            <Text type="secondary" style={{ display: "block", marginBottom: 10, color: "red" }}>
                                Promocja: {((1-product.discount)*100).toFixed(0)}% taniej!
                            </Text>

                            </div>
                        }
                    </Col>
                    <Col span={3} style={{marginTop: "auto", marginBottom: "auto"}}>
                        <h2>Ilość</h2>
                        <InputNumber 
                            min={1}
                            max={product.stock}
                            defaultValue={product.quantity}
                            onChange={(value) => {
                                if (value === null) {
                                    value = 0
                                }
                        
                                editCartItem(product.id, value);
                            }}
                        />
                    </Col>
                    <Col span={1} style={{marginTop: "auto", marginBottom: "auto"}}>
                        <Button 
                            shape="circle"
                            danger 
                            ghost
                            onClick={() => removeFromCart(product.id)}>
                                X
                        </Button>
                    </Col>
                    <Col span={2}/>
                </Row>
    )});

    async function handlePayment() {
        if (user && CartItems.length > 0) {
            navigate("/checkout");
            // try {
            //     const response = await fetch("http://localhost:3000/orders/add", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             UserID: user.userID,
            //             ProductsBought: CartItems,
            //         })
            //     }); 

            //     if (response.ok) {
            //         const result = await response.json();
            //         alert(result.info);
            //         clearCart();
            //         navigate("/");
            //     } else {
            //         const err = await response.json();
            //         alert("Order failed, " + err);
            //     }
            // } catch (err) {
            //     alert(err);
            // }
        } else if (CartItems.length === 0) {
            alert("Cart is empty");
            navigate("/");
        } else {
            alert("You must be logged in to proceed with order");
            navigate("/login");
        }
    }

    if(user){
        return (
            <div id="cart_container">
                <Row gutter={24}>
                    <Col span={2}/>
                    <Col span={19}>
                        <h1 style={{fontSize: "40px"}} >Your Cart</h1>
                    </Col>
                    <Col span={3}/>
                </Row>
                <Divider />
                {productRepresentation}
                <Row gutter={24}>
                    <Col span={14}/>
                    <Col span={7}>
                        <h2>Do zapłaty: {TotalPrice} PLN</h2>    
                        <Button onClick={handlePayment} color='primary' variant='solid'>
                            Opłać zamówienie
                        </Button>
                    </Col>
                    <Col span={3}/>
                </Row>
                <Divider />
            </div>
        );
    } else {
        navigate("/");
    }
    
};

export default CartPage;

