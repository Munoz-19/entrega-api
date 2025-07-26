CREATE TABLE entregas (
  id SERIAL PRIMARY KEY,
  foto TEXT,
  firma TEXT,
  comentario TEXT,
  checklist JSONB,
  fecha TEXT
);
