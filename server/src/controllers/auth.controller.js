const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { generateTokens, verifyRefreshToken } = require('../utils/tokenUtils');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });
    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};
const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || 'Google User',
          googleId: payload.sub,
          avatarUrl: payload.picture
        }
      });
    }
    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.clearCookie('refreshToken');
    res.status(401).json({ error: 'Refresh failed' });
  }
};
const logout = async (req, res, next) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
module.exports = { signup, login, googleLogin, refresh, logout };
