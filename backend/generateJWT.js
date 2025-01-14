import jwt from 'jsonwebtoken';

const secretKey = 'sekretnyKlucz';

export const generateToken = (userID) => {
  return jwt.sign({ userID }, secretKey, { expiresIn: '1y' });
};

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userID = decoded.userID;
    next();
  });
};
