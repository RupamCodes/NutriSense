const jwt = require('jsonwebtoken');
const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email };
  const accessToken = jwt.sign(
    payload, 
    process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production', 
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    payload, 
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production', 
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production');
};
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production');
};
module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken
};
