ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS accent_color_2 text,
  ADD COLUMN IF NOT EXISTS hero_pattern   text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS roles_style    text DEFAULT 'border_left';
