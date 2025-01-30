import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: "Token tidak tersedia" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.userId,  // Pastikan ini sesuai dengan field yang ada di token
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Token tidak valid" });
  }
};

export const staffMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Autentikasi diperlukan" });
  }

  const allowedRoles = ['STAFF', 'ADMIN'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      msg: "Akses ditolak. Hanya staff yang diizinkan" 
    });
  }

  // Untuk STAFF, hanya izinkan metode GET
  if (req.user.role === 'STAFF' && req.method !== 'GET') {
    return res.status(403).json({ 
      msg: "Akses ditolak. Staff hanya bisa melihat data" 
    });
  }

  next();
};

export const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Autentikasi diperlukan" });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      msg: "Akses ditolak. Hanya admin yang diizinkan" 
    });
  }

  next();
};