# Astra Digital Bank - Proje Tanımı ve Detayları

Astra Digital Bank, kullanıcıların tüm bankacılık işlemlerini internet üzerinden güvenli ve hızlı bir şekilde gerçekleştirebildiği modern bir dijital bankacılık web uygulamasıdır.

---

## Teknolojik Altyapı (Tech Stack)
- **Frontend**: React, React Router (v7)
- **Durum Yönetimi (State Management)**: Redux Toolkit (authSlice, accountSlice, cardSlice, investmentSlice)
- **API İletişimi**: Axios ve custom interceptors (JWT simülasyonu için)
- **Tasarım Sistemi**: Vanilla CSS, Glassmorphic UI (Bulanık arka planlar, saydam kartlar), Responsive Grid Layout
- **Mock Sunucu & Veritabanı**: Node.js, Express, JSON-Server (v0.17.4), db.json (veritabanı şeması)
- **İkon Kütüphanesi**: Lucide React

---

## Rol Tabanlı Erişim Denetimi (RBAC)
Sistemde 3 temel kullanıcı rolü tanımlanmıştır ve her rol yalnızca yetki sınırları dahilindeki sayfalara erişebilir:
1. **Müşteri (Customer)**: Hesap bakiyelerini izleme, para transferleri (Havale/EFT/FAST), QR kod üretme ve taratma, fatura ödemeleri, kart limit yönetimi, dondurma ve sanal kart oluşturma, detaylı hesap hareketleri ve kur/yatırım yönetimi.
2. **Banka Görevlisi (Staff)**: Müşteri hesap denetimleri, durum kilitleme/engelleme (Bloke) ve müşteri destek taleplerini yanıtlama.
3. **Sistem Yöneticisi (Admin)**: Bankadaki toplam sermaye durumu, olay günlükleri (audit logs), banka personeli atama/silme ve sistem faiz/kur spread oranlarını dinamik yönetme.

---

## Dosya ve Dizin Yapısı
```
/
├── public/                 # Statik dosyalar
├── src/
│   ├── assets/             # İkonlar ve resimler
│   ├── components/         # Ortak / Paylaşılan UI Component'leri (Sidebar, Navbar, ProtectedRoute)
│   ├── layouts/            # Rol bazlı Dashboard düzenleri (DashboardLayout)
│   ├── pages/              # Sayfa Component'leri
│   │   ├── auth/           # Login, Register
│   │   ├── customer/       # Dashboard, Transfers, Cards, Bills, History, Investments, Settings
│   │   ├── staff/          # StaffDashboard, SupportTickets
│   │   ├── admin/          # AdminDashboard, StaffManagement, SystemSettings
│   │   └── Unauthorized.jsx
│   ├── store/              # Redux Toolkit Slices ve store yapılandırması
│   ├── services/           # Axios Instance & API calls (api.js)
│   ├── App.jsx             # React Router ve yetki korumalı rotalar
│   ├── index.css           # Global CSS Değişkenleri & Tasarım Sistemi
│   └── main.jsx
├── db.json                 # Mock veritabanı (Müşteriler, hesaplar, kartlar, faturalar vb.)
├── server.js               # Özel Express + JSON-Server entegrasyonu (JWT & Auth endpoints)
└── package.json
```

---

## Temel Özellikler
- **Dinamik Kur Güncellemesi**: Admin paneli üzerinden döviz kurları güncellendiğinde, müşterinin yatırım ekranındaki fiyatlar anında güncellenir.
- **Güvenlik Blokesi**: Personel bir müşteriyi bloke ettiğinde, o kullanıcının sisteme giriş yapması backend seviyesinde (`server.js`) anında engellenir.
- **Hediye Bakiye Tanımlama**: Yeni kayıt olan her müşteriye hoş geldin hediyesi olarak 5.000 TL bakiye, vadesiz hesap ve debit kart otomatik tanımlanır.
- **Yazdırılabilir Dekont**: Hesap hareketleri sayfasından tüm işlemlerin detaylı bankacılık dekontu görüntülenebilir, print edilebilir veya `.txt` formatında indirilebilir.
