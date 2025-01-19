import React, { useEffect, useState } from 'react';
import Review from './Review';
import { useAuth } from './AuthProvider';
import { Input,Button, Rate, Flex, Collapse, CollapseProps } from "antd";

interface ReviewType {
    userID: number;
    rating: number; // Ocena od 0 do 5
    content: string;
    date: string;
  }

  const ReviewList: React.FC<{ productID: number }> = ({ productID }) => {
    
    const { user } = useAuth();  // Pobranie informacji o użytkowniku z kontekstu
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [hasReviewed, setHasReviewed] = useState<boolean>(false); // Sprawdzenie, czy użytkownik już dodał opinię
    const [newReview, setNewReview] = useState({
      userID: 0,
      rating: 0,
      content: '',
    });

    // Obliczanie średniej oceny
    const calculateAverageRating = () => {
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        return reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 'No reviews yet';
    };

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`http://localhost:3000/opinions/${productID}`);
          if (!response.ok) {
            throw new Error('Failed to fetch reviews');
          }
          const data = await response.json();
          const transformedReviews = data.map((opinion: any) => ({
            userID: opinion.UserID,
            rating: opinion.Rating, // Zastąp oceną z bazy, jeśli istnieje
            content: opinion.Content,
            date: opinion.OpinionDate
          }));
          setReviews(transformedReviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
  
      fetchReviews();
    }, [productID]);

    const getCurrentUserID = () => {
      if (user) {
          return user.userID;  // Zwraca userID, jeśli użytkownik jest zalogowany
      } else {
          return -1;  // Jeśli użytkownik nie jest zalogowany, zwraca null
      }
  };

    const handleAddReview = async () => {
      const review = {
        userID: getCurrentUserID(),
        rating: newReview.rating,
        content: newReview.content,
        date: new Date().toISOString(),
      };
  
      // Wysyłanie nowej opinii do backendu
      try {
        const response = await fetch(`http://localhost:3000/opinions/add/${productID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            UserID: review.userID,
            Rating: review.rating,
            Content: review.content
          }),
        });
  
        if (response.ok) {
          setReviews([...reviews, review]);
          setNewReview({ userID: 0, rating: 0, content: '' });
          setHasReviewed(true);
        } else {
          const data = await response.json();
          console.error('Failed to add review:', data.info);
        }
      } catch (error) {
        console.error('Error adding review:', error);
      }
    };

    // Funkcja do sprawdzenia, czy użytkownik dodał już opinię
    const checkIfReviewed = async () => {
      if (user) {
          try {
              const response = await fetch(`http://localhost:3000/opinions/${productID}`);
              if (response.ok) {
                  const data = await response.json();
                  // Sprawdzamy, czy wśród wszystkich opinii istnieje opinia tego użytkownika
                  const userReviewed = data.some((review: any) => review.UserID === user.userID);
                  setHasReviewed(userReviewed); // Jeśli tak, ustawiamy hasReviewed na true
                }
              else {
                  setHasReviewed(false);
              }
          } catch (error) {
              console.error('Error checking review status:', error);
              setHasReviewed(false);
          }
      }
  };

      // Użycie useEffect do załadowania danych
      useEffect(() => {
        if (user) {
            checkIfReviewed();
        }
    }, [user, productID]);

    const dislpayItems: CollapseProps['items'] = [
      {
        key: '1',
        label: 'User Reviews',
        children:
          <div style={{ marginTop: '10px' }}>
              {reviews.map((review, index) => (
                <Review
                  key={index}
                  review={review}
                />
              ))}
              {reviews.length === 0 && <p>No reviews yet. Be the first to add one!</p>}
          </div>
      },
      {
        key: '2',
        label: 'Add a Review',
        children: 
          <div style={{ marginTop: '20px' }}>
          {!user && <p>You must be logged in to add a review.</p>}
          {user && hasReviewed && <p>You have already added a review for this product.</p>}
          {user && !hasReviewed && ( 
            <div style={{ marginTop: '20px' }}>
                <h4>Add a Review</h4>

                <Flex align='center'>
                  <p style={{ marginRight: '20px' }}> Rating:  </p>
                  <Rate
                    defaultValue={5}
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e?.valueOf() || 5})}
                    style={{ display:"flex", marginBottom: '10px' }}
                    />
                </Flex>
                <Input
                  type='text'
                  placeholder="Write your review here"
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  style={{ display: 'block', marginBottom: '10px', width: '100%', height: '80px' }}
                  
                  />
                <Button onClick={handleAddReview} variant='solid' color='primary'>
                  Submit
                </Button>
              </div>
            )}
            </div>
      },
    ];

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '0px' }}>
        <h3>Average Rating: {calculateAverageRating()}</h3>
  
        {/* Lista opinii */}
        <Collapse items={dislpayItems} />
      </div>
    );
};

export default ReviewList;
