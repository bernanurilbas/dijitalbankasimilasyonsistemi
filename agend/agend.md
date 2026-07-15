# Astra Bank Geliştirme Takvimi ve Yol Haritası (Agenda)

Bu dosya, Astra Digital Bank projesinin mevcut durumunu, tamamlanan geliştirme fazlarını ve gelecekte yapılması planlanan genişletme adımlarını içerir.

---

## Tamamlanan Aşamalar (Milestones)

### Faz 1: Altyapı ve Veri Modeli ── (Tamamlandı)
- Vite React projesi kuruldu ve gerekli bağımlılıklar yüklendi.
- `db.json` şeması (kullanıcılar, hesaplar, kartlar, işlemler, faturalar, kurlar) çıkarıldı.
- `server.js` ile Express tabanlı auth endpoints ve JWT token taklit middleware'i yazıldı.
- `index.css` üzerinde global CSS değişkenleri ve koyu mod glassmorphism teması tanımlandı.

### Faz 2: Oturum ve Koruma Düzeni ── (Tamamlandı)
- Redux Store (`authSlice`) ve Axios API entegrasyonu tamamlandı.
- `ProtectedRoute` ile rol tabanlı yönlendirme kontrolü sağlandı.
- Giriş (Login) ve Hoş Geldin bakiyesi tanımlayan Kayıt (Register) sayfaları yazıldı.
- Sidebar, Navbar ve mobil responsive düzenler bir araya getirildi.

### Faz 3: Müşteri Finansal Akışları ── (Tamamlandı)
- Transfer ekranı: Havale, EFT, FAST limit kontrolleri ve QR kod mock okuma simülatörü geliştirildi.
- Kartlarım: Kart bloke etme, limit güncelleme ve dinamik sanal kart oluşturma thunk'ları yazıldı.
- Faturalar: Bekleyen faturaları sorgulama ve TL hesaplarından tek tıkla ödeme akışı bağlandı.
- Hesap Geçmişi: Arama, kur ve tarihe göre filtreleme ile yazdırılabilir resmi dekont modalı kuruldu.

### Faz 4: Yönetim & Personel Panelleri ── (Tamamlandı)
- Personel Paneli: Müşteri hesaplarını denetleme, bloke/aktif toggle durum kontrolü ve destek taleplerini yanıtlayarak kapatma akışı yazıldı.
- Admin Paneli: Banka sermaye istatistikleri, personel atama/görevden alma ve döviz kurlarını dinamik değiştirerek müşteri ekranlarına yansıtma entegrasyonu tamamlandı.

---

## Gelecek Yol Haritası (Future Roadmap)

Astra Bank'ın daha da profesyonelleşmesi için planlanan sonraki aşamalar:

1. **Gerçek Veritabanı ve API Entegrasyonu**:
   - JSON-Server yerine Node.js (NestJS veya Express) + PostgreSQL/MongoDB veritabanına geçiş yapılması.
   - Şifrelerin veritabanında `bcrypt` ile şifrelenmesi ve gerçek JWT (JSON Web Token) kimlik doğrulamasına geçilmesi.

2. **Gerçek Zamanlı Veri Akışı (WebSockets)**:
   - Döviz ve altın kurlarının 15 saniyede bir polling yöntemiyle çekilmesi yerine, `Socket.io` ile gerçek zamanlı piyasa fiyat akışının sağlanması.

3. **Gelişmiş Grafik Kütüphaneleri**:
   - Varlık dağılımı ve aylık gelir/gider harcama analizleri için `Recharts` kütüphanesi entegre edilerek etkileşimli pasta ve çizgi grafiklerinin sunulması.

4. **Çift Faktörlü Doğrulama (2FA) Simülasyonu**:
   - Giriş işlemlerinde e-posta veya telefona tek kullanımlık doğrulama kodu (OTP) gönderim simülatörünün dahil edilmesi.

5. **PDF İndirme Desteği**:
   - Dekontların `.txt` yerine `jspdf` kütüphanesi ile doğrudan resmi görünümlü PDF formatında indirilmesi.
