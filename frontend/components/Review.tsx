import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface ReviewType {
    userID: number;
    rating: number; // Ocena od 0 do 5
    content: string;
    date: string;
}

interface ReviewProps {
  review: ReviewType;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
    const { user } = useAuth();  // Pobranie informacji o użytkowniku z kontekstu
    const [username, setUsername] = useState<string>('');  // Stan dla przechowywania nazwy użytkownika
    
    useEffect(() => {
        // Funkcja do pobierania nazwy użytkownika
        async function getUsername(id: number) {
            if (user) {
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
            } else {
                setUsername("Anonymous User");  // Jeśli użytkownik nie jest zalogowany
            }
        }
        
        getUsername(review.userID);  // Wywołanie funkcji po załadowaniu komponentu

    }, [user, review.userID]);  // Uruchomienie useEffect tylko, gdy użytkownik lub ID recenzji się zmienia

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
      <h4>{username}</h4>  {/* Wyświetlenie nazwy użytkownika */}
      <p>Rating: {review.rating}/5</p>
      <p>{review.content}</p>
      <p>Date: {review.date}</p>
    </div>
  );
};

export default Review;
