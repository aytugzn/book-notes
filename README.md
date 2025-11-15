# BookNotes: Kitap İnceleme ve Takip Uygulaması

BookNotes, kullanıcıların [OpenLibrary API](https://openlibrary.org/) aracılığıyla kitapları aramasına, kişisel bir listeye kaydetmesine ve bu kitaplar için kendi incelemelerini yazmasına olanak tanıyan bir full-stack web uygulamasıdır.Bu proje, öğrenme sürecimde edindiğim bilgileri pekiştirmek amacıyla yapılmıştır.

Bu proje, modern bir web uygulamasının iki temel parçasını göstermek için iki ayrı Node.js sunucusu olarak tasarlanmıştır:
1.  **Backend API (`api.js`)**: Veritabanı işlemleri (PostgreSQL) ve harici API iletişimi için.
2.  **Frontend Sunucusu (`server.js`)**: Kullanıcı arayüzünü (EJS şablonları) render etmek ve Backend API ile konuşmak için.


## 🌟 Temel Özellikler

* **Harici API Entegrasyonu**: OpenLibrary API'sini kullanarak kitap arama ve "Çok Satanlar" listesini çekme.
* **Veritabanı İşlemleri**: PostgreSQL veritabanı kullanarak favori kitapları ve kişisel incelemeleri kaydetme.
* **Tam CRUD Fonksiyonelliği**: Kullanıcılar kendi kitap incelemelerini **Oluşturabilir**, **Okuyabilir**, **Güncelleyebilir** ve **Silebilir** (Create, Read, Update, Delete).
* **İki Katmanlı Mimari**: Veri mantığını (`api.js`) ve görünüm mantığını (`server.js`) ayıran temiz bir sunucu yapısı.
* **Duyarlı (Responsive) Tasarım**: `main.css` ve `bookinfo.css` dosyalarında CSS Grid, Flexbox ve detaylı media query'ler kullanılarak oluşturulmuş, mobil öncelikli (mobile-first) bir arayüz.

## 💻 Kullanılan Teknolojiler

* **Backend API (`api.js`)**
    * Node.js
    * Express.js
    * PostgreSQL (node-pg)
    * Dotenv (Güvenli ortam değişkenleri için)
* **Frontend Sunucusu (`server.js`)**
    * Node.js
    * Express.js
    * EJS (Embedded JavaScript Templates)
    * Axios (API istekleri için)
    * Body-Parser
* **Styling (`main.css` & `bookinfo.css`)**
    * Özel (Custom) CSS
    * CSS Grid & Flexbox
    * Detaylı Media Query'ler (Responsive Tasarım)

---

## 🎨 CSS ve Duyarlı (Responsive) Tasarım

Bu projenin arayüzü, `server.js` tarafından sunulan iki ana sayfa için iki ayrı CSS dosyasıyla (`main.css` ve `bookinfo.css`) sıfırdan oluşturulmuştur.

* **Modern Layout Teknikleri**: Arayüz, `.navbar` ve `.book-info` gibi karmaşık bileşenlerde **CSS Grid** ve kart listeleme (`.card-wrapper`) gibi dinamik alanlarda **Flexbox** kullanılarak yapılandırılmıştır.
* **Mobile-First Yaklaşımı**: Tasarım, en küçük ekran (576px altı) için optimize edilmiştir.
* **Kırılma Noktaları (Breakpoints)**: Arayüzün farklı cihazlarda (mobil, tablet, desktop) düzgün görünmesi için `576px`, `768px`, `992px` ve `1200px` ekran genişliklerinde media query'ler kullanılmıştır.
* **Dinamik Arayüz**: Ekran boyutu küçüldükçe:
    * Navbar, arama çubuğunu ve logo'yu dikey olarak yeniden hizalar.
    * Kitap kartları tam genişliğe yayılır.
    * Butonlardaki metinler gizlenir ve sadece ikonlar gösterilir (örneğin `.show-eye` ve `.btn-add p`).

---

## 🚀 Yerel (Local) Kurulum ve Çalıştırma

Bu projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

**Gereksinimler:**
* Node.js
* PostgreSQL

1.  **Projeyi klonlayın:**
    ```sh
    git clone [https://github.com/senin-kullanici-adin/proje-adin.git](https://github.com/senin-kullanici-adin/proje-adin.git)
    cd proje-adin
    ```

2.  **Gerekli paketleri yükleyin:**
    ```sh
    npm install
    ```

3.  **PostgreSQL Veritabanını Kurun:**
    * `booknotes` adında yeni bir veritabanı oluşturun.
    * Veritabanı şemasını (tabloları) oluşturmak için `database.sql` (veya benzeri) dosyanızı çalıştırın. (Not: Eğer bir SQL dosyanız yoksa, tabloların manuel oluşturulması gerekir).

4.  **`.env` Dosyasını Oluşturun:**
    Projenin ana dizininde `.env` adında bir dosya oluşturun ve içine PostgreSQL bağlantı bilgilerinizi girin:
    ```
    DB_USER=postgres
    DB_PASS=senin_sifren
    DB_HOST=localhost
    DB_NAME=booknotes
    DB_PORT=5432
    ```

5.  **Sunucuları Başlatın:**
    Bu proje iki sunucuya sahiptir. İkisini de ayrı terminallerde çalıştırmanız gerekir:

    * **API Sunucusu (Terminal 1):**
        ```sh
        node api.js
        ```
    * **Frontend Sunucusu (Terminal 2):**
        ```sh
        node server.js
        ```

6.  Tarayıcınızda `http://localhost:3000` adresini açın.

---

## ⚠️ Önemli Not (Disclaimer)

Bu proje, full-stack geliştirme, iki katmanlı mimari ve veritabanı yönetimi temellerini öğrenmek ve sergilemek amacıyla geliştirilmiş bir **portfolyo projesidir.**

* **Güvenlik (SQL Injection):** Proje, PostgreSQL sorgularında **parameterized query** (`$1`, `$2` kullanımı) yöntemini kullanarak **SQL Injection saldırılarına karşı korunmuştur.**
* **Güvenlik (Diğer):** Kullanıcı tarafından girilen inceleme metinlerinin render edilmesi sırasında Cross-Site Scripting (XSS) saldırılarını önlemek için ekstra bir "sanitization" (temizleme) işlemi uygulanmamıştır.
* **Kimlik Doğrulama (Authentication):** Uygulama, `user_id = 1` olarak sabitlenmiş bir **tek kullanıcılı modda** çalışmaktadır. Herhangi bir kullanıcı giriş (login) veya kayıt (register) sistemi bulunmamaktadır.
* **Kullanım Amacı:** Yukarıdaki nedenlerden dolayı bu proje, canlı (production) kullanıma uygun değildir ancak API tasarımı, veritabanı bağlantısı ve EJS ile dinamik sayfa oluşturma konularındaki yetkinlikleri göstermek için güçlü bir örnektir.