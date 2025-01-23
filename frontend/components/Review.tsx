import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Button, Col, Divider, Image, InputNumber, Row } from "antd";
import ReviewList from './ReviewList';

interface ReviewType {
    userID: number;
    rating: number; // Ocena od 0 do 5
    content: string;
    date: string;
}

interface ReviewProps {
  review: ReviewType;
  productID: number;
  onReviewDeleted: Function;
}

const Review: React.FC<ReviewProps> = ({ review, productID, onReviewDeleted }) => {
    const { user } = useAuth();  // Pobranie informacji o użytkowniku z kontekstu
    const [username, setUsername] = useState<string>('');  // Stan dla przechowywania nazwy użytkownika
    
    useEffect(() => {
        // Funkcja do pobierania nazwy użytkownika
        async function getUsername(id: number) {
            try {
                    const userResponse = await fetch(`http://localhost:3000/users/${id}`);
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUsername(userData.UserName);  // Ustawienie nazwy użytkownika
                    } else {
                        setUsername("Anonymous User");  // Jeśli coś pójdzie nie tak
                    }
                } catch (error) {
                    setUsername("Anonymous User");  // W razie błędu ustawiamy nazwę na "Anonymous User"
                }
            }
        
        getUsername(review.userID);  // Wywołanie funkcji po załadowaniu komponentu

    }, [user, review.userID]);  // Uruchomienie useEffect tylko, gdy użytkownik lub ID recenzji się zmienia

  const removeReview = async () => {
    try {
      await fetch(`http://localhost:3000/opinions/delete`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RequesterID: user?.userID,
          UserID: review.userID,
          ProductID: productID
        }),
      });
      onReviewDeleted();
    }catch (error) {
      console.error('Error removing review:', error);
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
        <Row gutter={24} style={{marginBottom: "60px"}}> 
        <Col flex={100}>
          <h4>{username}</h4>  {/* Wyświetlenie nazwy użytkownika */}
          <p>Rating: {review.rating}/5</p>
          <p>{review.content}</p>
          <p>Date: {review.date}</p>
        </Col>
        { user?.userID == review.userID ? 
          <Col flex={1} style={{marginTop: "10px", marginBottom: "auto", justifyItems:"right"}}>
              <Button 
                  shape="circle"
                  danger 
                  ghost
                  onClick={() => removeReview()}>
                      X
              </Button>
          </Col>
          :
          <Col flex={1} style={{marginTop: "10px", marginBottom: "auto", justifyItems:"right"}}> </Col>
        }
      </Row>
    </div>
  );
};

export default Review;
