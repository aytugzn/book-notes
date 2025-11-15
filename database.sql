-- Bu dosya, 'booknotes' veritabanını kurmak için gereken tabloları oluşturur.
-- README.md dosyasındaki kurulum talimatları için kullanılır.

-- 1. 'saved_books' tablosu
-- Kullanıcının kaydettiği kitapların listesini tutar.
CREATE TABLE saved_books (
    book_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(10) NOT NULL,
    book_name TEXT,
    book_cover TEXT,
    book_author TEXT,
    PRIMARY KEY (book_id, user_id) -- Bir kullanıcının aynı kitabı listeye birden fazla eklemesini engeller.
);

-- 2. 'book_reviews' tablosu
-- Kaydedilen kitaplara yazılan incelemeleri tutar.
CREATE TABLE book_reviews (
    book_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(10) NOT NULL,
    review TEXT,
    PRIMARY KEY (book_id, user_id), -- Bir kullanıcının aynı kitaba birden fazla inceleme eklemesini engeller.
    FOREIGN KEY (book_id, user_id) REFERENCES saved_books (book_id, user_id) ON DELETE CASCADE -- (İsteğe bağlı ama önerilir)
);