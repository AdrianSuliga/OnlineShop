import React from 'react';

interface ReviewType {
    username: string;
    rating: number; // Ocena od 0 do 5
    description: string;
    date: string;
    likes: number;
    dislikes: number;
}
interface ReviewProps {
  review: ReviewType;
  onLike: () => void;
  onDislike: () => void;
}

const Review: React.FC<ReviewProps> = ({ review, onLike, onDislike }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
      <h4>{review.username}</h4>
      <p>Rating: {review.rating}/5</p>
      <p>{review.description}</p>
      <p>Date: {review.date}</p>
      <button onClick={onLike} style={{ marginRight: '10px' }}>
        👍 {review.likes}
      </button>
      <button onClick={onDislike}>👎 {review.dislikes}</button>
    </div>
  );
};

export default Review;