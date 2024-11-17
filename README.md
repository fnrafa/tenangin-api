# Tenangin API Documentation

---

## Overview

**Tenangin API** adalah server untuk manajemen pengguna, penyimpanan data, serta file penting lainnya.

---

## Endpoints

### 1. Register User

**POST** `/auth/register`

#### Input

- **Headers**:
    - `Content-Type`: `application/json`
- **Body**:
    - `email` (string, required): Alamat email pengguna.
    - `username` (string, required): Nama pengguna unik.
    - `name` (string, required): Nama lengkap pengguna.
    - `password` (string, required): Password untuk akun pengguna.
    - `repeat_password` (string, required): Password untuk akun pengguna.

#### Response

- `201 Created`: Register berhasil.
- `409 Conflict`: Email, atau Username sudah di gunakan.
- `422 Unprocessable Entity`: Input tidak sesuai.

---

### 2. Login User

**POST** `/auth/login`

#### Input

- **Headers**:
    - `Content-Type`: `application/json`
- **Body**:
    - `username` (string, required): Nama pengguna.
    - `password` (string, required): Password pengguna.

#### Response

- `200 OK`: Login berhasil.
- `401 Unauthorized`: Password tidak sesuai.
- `404 Not Found`: Data pengguna tidak ditemukan.
- `422 Unprocessable Entity`: Input tidak sesuai.

---

### 3. Update Profile

**PATCH** `/user`

#### Input

- **Headers**:
    - `Content-Type`: `application/json`
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Body**:
    - `name` (string): Nama baru pengguna.
    - `username` (string): Username baru pengguna.
    - `email` (string): Email baru pengguna.
    - `character` (string): Karakter pengguna.
    - `badge` (string): Lencana baru pengguna.
    - `password` (string, required): Password lama pengguna untuk verifikasi.
    - `new_password` (string): Password baru pengguna.
    - `repeat_new_password` (string, required if `new_password` exists): Konfirmasi password baru pengguna.

#### Response

- `200 OK`: Profil berhasil diperbarui.
- `401 Unauthorized`: Password lama tidak sesuai.
- `400 Bad Request`: Password baru dan konfirmasi password tidak cocok.
- `422 Unprocessable Entity`: Input tidak sesuai.

---

### 4. Delete Account

**DELETE** `/user`

#### Input

- **Headers**:
    - `Content-Type`: `application/json`
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Body**:
    - `password` (string, required): Password pengguna untuk verifikasi penghapusan akun.

#### Response

- `200 OK`: Akun berhasil dihapus (soft delete).
- `401 Unauthorized`: Password tidak sesuai.
- `422 Unprocessable Entity`: Input tidak sesuai.

---

## Credit

### Teknologi yang Digunakan

- **Framework**: Menggunakan [Express.js](https://expressjs.com/) untuk membangun server API.
- **Database**: Menggunakan [MySQL](https://www.mysql.com/) sebagai sistem manajemen basis data.
- **ORM**: [Prisma](https://www.prisma.io/) digunakan untuk mengelola interaksi dengan database.
- **Authentication**: [JWT](https://jwt.io/) digunakan untuk autentikasi berbasis token.
- **Validasi Input**: Menggunakan [Joi](https://joi.dev/) untuk validasi data pada request.
- **Keamanan**:
    - [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) diterapkan untuk melindungi API dari
      penyalahgunaan.
    - Enkripsi password menggunakan [bcrypt](https://github.com/kelektiv/node.bcrypt.js).
- **File Upload**: Menggunakan [Multer](https://github.com/expressjs/multer) untuk menangani upload file.
- **Real-Time**: [Socket.IO](https://socket.io/) digunakan untuk fitur forum yang membutuhkan komunikasi real-time
  antara pengguna.
- **Monitoring**: Menggunakan middleware [response-time](https://github.com/expressjs/response-time) untuk melacak waktu
  respons API.

### Lisensi

Proyek ini dirilis di bawah [MIT License](https://opensource.org/licenses/MIT). Silakan gunakan dengan bebas sesuai
ketentuan lisensi.

---
