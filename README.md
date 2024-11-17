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
    - `email` (string): Alamat email pengguna.
    - `username` (string): Nama pengguna unik.
    - `name` (string): Nama lengkap pengguna.
    - `password` (string): Password untuk akun pengguna.
    - `repeat_password` (string): Password untuk akun pengguna.

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
    - `username` (string): Nama pengguna.
    - `password` (string): Password pengguna.

#### Response

- `200 OK`: Login berhasil.
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
  - [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) diterapkan untuk melindungi API dari penyalahgunaan.
  - Enkripsi password menggunakan [bcrypt](https://github.com/kelektiv/node.bcrypt.js).
- **File Upload**: Menggunakan [Multer](https://github.com/expressjs/multer) untuk menangani upload file.
- **Real-Time**: [Socket.IO](https://socket.io/) digunakan untuk fitur forum yang membutuhkan komunikasi real-time antara pengguna.
- **Monitoring**: Menggunakan middleware [response-time](https://github.com/expressjs/response-time) untuk melacak waktu respons API.


### Lisensi
Proyek ini dirilis di bawah [MIT License](https://opensource.org/licenses/MIT). Silakan gunakan dengan bebas sesuai ketentuan lisensi.

---
