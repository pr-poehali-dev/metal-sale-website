-- Создание таблицы категорий металлопродукции
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы прайс-листа металлопродукции
CREATE TABLE IF NOT EXISTS price_list (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    specs TEXT,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'тонна',
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка данных категорий
INSERT INTO categories (name, icon, description, sort_order) VALUES
('Листовой металл', 'Square', 'Листы, рулоны, плиты', 1),
('Трубы', 'Circle', 'Круглые, профильные, бесшовные', 2),
('Арматура', 'Grid3x3', 'Стержневая, композитная', 3),
('Профили', 'Columns3', 'Балки, швеллеры, уголки', 4);

-- Вставка данных прайс-листа
INSERT INTO price_list (category_id, name, specs, price, unit, sort_order) VALUES
(1, 'Лист стальной 3мм', '1500x6000 мм, Ст3', 52500.00, 'тонна', 1),
(2, 'Труба профильная', '40x40x2 мм', 48200.00, 'тонна', 2),
(3, 'Арматура А500С', 'Ø12 мм', 54800.00, 'тонна', 3),
(4, 'Швеллер горячекатаный', '№10, 12м', 56100.00, 'тонна', 4),
(1, 'Лист оцинкованный', '1250x2500, 0.5мм', 68900.00, 'тонна', 5),
(4, 'Уголок равнополочный', '50x50x5 мм', 51300.00, 'тонна', 6);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_price_list_active ON price_list(is_active);
CREATE INDEX idx_price_list_category ON price_list(category_id);