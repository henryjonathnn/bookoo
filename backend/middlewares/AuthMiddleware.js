import jwt from "jsonwebtoken";

export const auth = {
  // Unified token verification
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },

  // Role-based access control
  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      next();
    };
  }
};