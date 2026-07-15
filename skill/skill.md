# Astra Bank Geliştirme Yöntemleri ve Teknik Beceriler (Skillset)

Bu proje geliştirilirken uygulanan ve gelecekteki geliştirmelerde referans alınacak teknik beceriler ve yazılım mimarisi pratikleri aşağıda özetlenmiştir.

---

## 1. Çoklu State Senkronizasyonu (Redux Toolkit Thunks)
Dijital bankacılıkta bir işlem (örneğin döviz alımı veya fatura ödemesi) birden fazla veritabanı tablosunun ve durum diliminin güncellenmesini gerektirir. Projede bu durum, tek bir async thunk içinde sıralı API çağrıları ile çözülmüştür:
```javascript
// Örnek: Döviz Alım Thunk Akışı (TRY -> Döviz)
// 1. Gönderen hesabın (TRY) bakiyesini PATCH ile düşürür.
await api.patch(`/accounts/${tryAccountId}`, { balance: newTryBalance });

// 2. Alıcı hesabın (USD) bakiyesini PATCH ile artırır.
await api.patch(`/accounts/${targetAccountId}`, { balance: newTargetBalance });

// 3. Portföy detayını güncellemek için /investments kaydı oluşturur/günceller.
await api.post('/investments', { ... });

// 4. İşlem geçmişi için /transactions tablosuna çift yönlü hareket ekler.
await api.post('/transactions', { ... }); // Çıkış
await api.post('/transactions', { ... }); // Giriş
```

---

## 2. Güvenli API Simülasyonu ve JWT Mimarisi
İstemci ile sunucu arasındaki oturum güvenliğini simüle etmek için `btoa()` ve `atob()` fonksiyonları ile Base64 şifrelemeli mock token altyapısı kurulmuştur:
- **Token Oluşturma (Sunucu)**:
  `const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));`
- **İstek Kontrolü (Axios Interceptor)**:
  Axios interceptor'ı, `localStorage` içindeki token'ı okuyarak her isteğe `Authorization: Bearer <token>` başlığını otomatik ekler.
- **Token Çözümleme (Sunucu Middleware)**:
  Sunucu, gelen her istek başlığındaki token'ı `atob()` ile çözerek kullanıcının kimliğini doğrular.

---

## 3. Glassmorphic UI & Premium CSS Kodlama Kuralları
Görsel lüks hissi uyandırmak amacıyla saf CSS ile cam efekti (Glassmorphism) ve neon ışımalar uygulanmıştır:
- **Bulanıklık ve Saydamlık**:
  `background: rgba(17, 24, 39, 0.65); backdrop-filter: blur(14px); border: 1px solid rgba(255, 255, 255, 0.06);`
- **Aura Animasyonları**:
  Kör noktada yavaşça dalgalanan mavi ve yeşil dairesel gradyan auraları (`@keyframes float-aura`).
- **Özel Kaydırma Çubuğu**:
  Sayfa genelinde tarayıcı varsayılanı yerine şık, ince ve koyu scrollbar tasarımları.

---

## 4. CSS Print Media Queries ile Dekont Yazdırma
Müşterinin işlem dekontunu resmi bir makbuz gibi yazdırabilmesi için CSS medya sorguları kullanılmıştır. Yazdırma penceresi tetiklendiğinde gereksiz tüm ekran elemanları (Sidebar, Navbar, Butonlar) gizlenir ve sadece dekont çerçevesi siyah-beyaz formda yazdırılmaya hazır hale getirilir:
```css
@media print {
  body * {
    visibility: hidden; /* Her şeyi gizle */
  }
  #receipt-printable-frame, #receipt-printable-frame * {
    visibility: visible; /* Sadece dekontu göster */
    color: black !important;
  }
  .no-print {
    display: none !important;
  }
}
```
