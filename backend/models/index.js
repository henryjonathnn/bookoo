import User from "./UserModel.js";
import Buku from "./BukuModel.js";
import Peminjaman from "./PeminjamanModel.js";
import Rating from "./RatingModel.js";
import Notifikasi from "./NotifikasiModel.js";
import Bookmark from "./BookmarkModel.js";
import Suka from "./SukaModel.js";

// Relasi User
User.hasMany(Peminjaman, { as: "peminjaman", foreignKey: "id_user" });
User.hasMany(Peminjaman, { as: "handledPeminjaman", foreignKey: "id_staff" });
User.hasMany(Bookmark, {
  foreignKey: "id_user",
});
User.hasMany(Suka, {
  foreignKey: "id_user",
});
User.hasMany(Rating, {
  foreignKey: "id_user",
});
User.hasMany(Notifikasi, {
  foreignKey: "id_user",
});

// Relasi Buku
Buku.hasMany(Peminjaman, {
  foreignKey: "id_buku",
});
Buku.hasMany(Bookmark, {
  foreignKey: "id_buku",
});
Buku.hasMany(Suka, {
  foreignKey: "id_buku",
});
Buku.hasMany(Rating, {
  foreignKey: "id_buku",
});

// Relasi Peminjaman
Peminjaman.belongsTo(User, {
  as: "user",
  foreignKey: "id_user",
});
Peminjaman.belongsTo(User, {
  as: "staff",
  foreignKey: "id_staff",
});
Peminjaman.belongsTo(Buku, {
  foreignKey: "id_buku",
});
Peminjaman.hasMany(Notifikasi, {
  foreignKey: "id_peminjaman",
});

// Relasi Bookmark
Bookmark.belongsTo(User, {
  foreignKey: "id_user",
});
Bookmark.belongsTo(Buku, {
  foreignKey: "id_buku",
});

// Relasi Rating
Rating.belongsTo(User, {
  foreignKey: "id_user",
});
Rating.belongsTo(Buku, {
  foreignKey: "id_buku",
});

// Relasi Suka
Suka.belongsTo(User, {
  foreignKey: "id_user",
});
Suka.belongsTo(Buku, {
  foreignKey: "id_buku",
});

// Relasi Notifikasi
Notifikasi.belongsTo(User, {
  foreignKey: "id_user",
});
Notifikasi.belongsTo(Peminjaman, {
  foreignKey: "id_peminjaman",
});

export { User, Buku, Peminjaman, Bookmark, Suka, Rating, Notifikasi };