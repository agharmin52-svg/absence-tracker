-- داده‌های نمونه برای توسعه

-- ویدیوهای نمونه
INSERT INTO videos (title, file_name, template_id, duration, thumbnail_uri, content_base64, created_at) VALUES
('Reel 1403/04/12', 'reel-1720778400000.mp4', 'khatereh', 30, 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%22360%22%3E%3Crect%20fill%3D%22%231b1613%22%20width%3D%22240%22%20height%3D%22360%22%2F%3E%3C%2Fsvg%3E', 'Zm9vYmFy', NOW()),
('Reel 1403/04/13', 'reel-1720864800000.mp4', 'daftarcheh', 45, 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%22360%22%3E%3Crect%20fill%3D%22%23ece4d3%22%20width%3D%22240%22%20height%3D%22360%22%2F%3E%3C%2Fsvg%3E', 'YmF6cXV4', NOW()),
('Reel 1403/04/14', 'reel-1720951200000.mp4', 'ghamgin', 60, 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%22360%22%3E%3Crect%20fill%3D%22%230a0e17%22%20width%3D%22240%22%20height%3D%22360%22%2F%3E%3C%2Fsvg%3E', 'cXV1eGNvcQ==', NOW());

-- یادآوری‌های نمونه
INSERT INTO journal_entries (title, reflection, mood, weather, location, created_at) VALUES
('روز خوبی بود', 'امروز یک روز بسیار خوب و معنا‌داری بود. از صبح تا شب لحظه‌های زیبایی را تجربه کردم و احساس سپاس‌گزاری داشتم.', 'خوشحال', 'آفتاب‌دار', 'خانه', NOW() - INTERVAL '1 day'),
('احساسات مختلط', 'امروز احساسات مختلطی داشتم. برخی لحظات شادی‌بخش بودند و برخی غم‌انگیز. اما کلاً یک روز یادگار بود.', 'آرام', 'ابری', 'پارک', NOW() - INTERVAL '2 days'),
('روز سخت', 'امروز یکی از روزهای سخت‌تر بود. با مشکلات متعددی مواجه شدم و توانایی‌های خود را تست کردم.', 'نگران', 'بارانی', 'دفتر', NOW() - INTERVAL '3 days');

-- پیوست‌های نمونه
INSERT INTO attachments (journal_entry_id, type, uri, mime_type, created_at) VALUES
(1, 'photo', 'file:///images/photo1.jpg', 'image/jpeg', NOW() - INTERVAL '1 day'),
(1, 'audio', 'file:///audio/voice1.m4a', 'audio/mp4', NOW() - INTERVAL '1 day'),
(2, 'photo', 'file:///images/photo2.jpg', 'image/jpeg', NOW() - INTERVAL '2 days'),
(3, 'audio', 'file:///audio/voice2.m4a', 'audio/mp4', NOW() - INTERVAL '3 days');

-- برچسب‌های نمونه
INSERT INTO tags (journal_entry_id, tag, created_at) VALUES
(1, 'خوشبختی', NOW() - INTERVAL '1 day'),
(1, 'موفقیت', NOW() - INTERVAL '1 day'),
(2, 'تأمل', NOW() - INTERVAL '2 days'),
(2, 'رشد', NOW() - INTERVAL '2 days'),
(3, 'چالش', NOW() - INTERVAL '3 days'),
(3, 'یادگیری', NOW() - INTERVAL '3 days');
