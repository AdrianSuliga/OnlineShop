import React, { useState } from 'react';
import Review from './Review';

interface ReviewType {
    username: string;
    rating: number; // Ocena od 0 do 5
    description: string;
    date: string;
    likes: number;
    dislikes: number;
  }

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<ReviewType[]>([]);

    const [newReview, setNewReview] = useState({
        username: '',
        rating: 0,
        description: '',
    });

    // Obliczanie średniej oceny
    const calculateAverageRating = () => {
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        return reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 'No reviews yet';
    };

    const handleAddReview = () => {
        const review: ReviewType = {
        ...newReview,
        date: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        };
        setReviews([...reviews, review]);
        setNewReview({ username: '', rating: 0, description: '' });
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginTop: '0px' }}>
        <h3>Average Rating: {calculateAverageRating()}</h3>
  
        {/* Lista opinii */}
        <div style={{ marginTop: '10px' }}>
          {reviews.map((review, index) => (
            <Review
              key={index}
              review={review}
              onLike={() => {
                const updatedReviews = [...reviews];
                updatedReviews[index].likes += 1;
                setReviews(updatedReviews);
              }}
              onDislike={() => {
                const updatedReviews = [...reviews];
                updatedReviews[index].dislikes -= 1;
                setReviews(updatedReviews);
              }}
            />
          ))}
          {reviews.length === 0 && <p>No reviews yet. Be the first to add one!</p>}
        </div>
  
        {/* Formularz dodawania nowej opinii */}
        <div style={{ marginTop: '20px' }}>
          <h4>Add a Review</h4>
          <input
            type="text"
            placeholder="Your name"
            value={newReview.username}
            onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <input
            type="number"
            min="0"
            max="5"
            placeholder="Rating (0-5)"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Description"
            value={newReview.description}
            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', width: '100%', height: '80px' }}
          />
          <button onClick={handleAddReview} style={{ padding: '10px 20px' }}>
            Submit
          </button>
        </div>
      </div>
    );
};

export default ReviewList;
