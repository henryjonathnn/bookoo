import jwt from "jsonwebtoken";

export const auth = {
  verifyToken: async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.sendStatus(401);
    }
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.sendStatus(403);
    }
  },

  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.sendStatus(401);
      }

      // Ubah array role menjadi huruf besar untuk perbandingan
      const allowedRoles = roles.map(role => role.toUpperCase());
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.sendStatus(403);
      }

      next();
    };
  }
};