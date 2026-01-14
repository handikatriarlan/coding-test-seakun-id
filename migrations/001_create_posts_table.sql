CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

INSERT INTO posts (title, content) VALUES
    ('Welcome to My Blog', 'This is my first blog post. Welcome to my journey as a developer!'),
    ('Learning TypeScript', 'TypeScript adds static typing to JavaScript, making code more robust and maintainable.'),
    ('Building RESTful APIs', 'REST (Representational State Transfer) is an architectural style for designing networked applications.')
ON CONFLICT DO NOTHING;
