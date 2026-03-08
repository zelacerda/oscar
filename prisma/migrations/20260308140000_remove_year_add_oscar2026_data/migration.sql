-- Remove unique constraint on Category(name, year)
DROP INDEX IF EXISTS "Category_name_year_key";

-- Remove year columns from all tables
ALTER TABLE "Pool" DROP COLUMN IF EXISTS "year";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "year";
ALTER TABLE "Nominee" DROP COLUMN IF EXISTS "year";
ALTER TABLE "Result" DROP COLUMN IF EXISTS "year";

-- Add new unique constraint on Category(name) only
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");

-- ============================================================
-- Oscar 2026 data
-- ============================================================
-- Insert categories and nominees via CTEs
-- GOLD
WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Filme', 'GOLD')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Ed Guiney, Andrew Lowe, Yorgos Lanthimos, Emma Stone, Lars Knudsen', 'Bugonia'),
  ('Chad Oman, Brad Pitt, Dede Gardner, Jeremy Kleiner, Joseph Kosinski, Jerry Bruckheimer', 'F1'),
  ('Guillermo del Toro, J. Miles Dale, Scott Stuber', 'Frankenstein'),
  ('Liza Marshall, Pippa Harris, Nicolas Gonda, Steven Spielberg, Sam Mendes', 'Hamnet'),
  ('Eli Bush, Ronald Bronstein, Josh Safdie, Anthony Katagas, Timothée Chalamet', 'Marty Supreme'),
  ('Adam Somner, Sara Murphy, Paul Thomas Anderson', 'One Battle after Another'),
  ('Emilie Lesclaux', 'The Secret Agent'),
  ('Maria Ekerhovd, Andrea Berentsen Ottmar', 'Sentimental Value'),
  ('Zinzi Coogler, Sev Ohanian, Ryan Coogler', 'Sinners'),
  ('Marissa McMahon, Teddy Schwarzman, Will Janowitz, Ashley Schlaifer, Michael Heimler', 'Train Dreams')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

-- SILVER
WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Direção', 'SILVER')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Chloé Zhao', 'Hamnet'),
  ('Josh Safdie', 'Marty Supreme'),
  ('Paul Thomas Anderson', 'One Battle after Another'),
  ('Joachim Trier', 'Sentimental Value'),
  ('Ryan Coogler', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Ator', 'SILVER')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Timothée Chalamet', 'Marty Supreme'),
  ('Leonardo DiCaprio', 'One Battle after Another'),
  ('Ethan Hawke', 'Blue Moon'),
  ('Michael B. Jordan', 'Sinners'),
  ('Wagner Moura', 'The Secret Agent')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Atriz', 'SILVER')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Jessie Buckley', 'Hamnet'),
  ('Rose Byrne', 'If I Had Legs I''d Kick You'),
  ('Kate Hudson', 'Song Sung Blue'),
  ('Renate Reinsve', 'Sentimental Value'),
  ('Emma Stone', 'Bugonia')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Ator Coadjuvante', 'SILVER')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Benicio Del Toro', 'One Battle after Another'),
  ('Jacob Elordi', 'Frankenstein'),
  ('Delroy Lindo', 'Sinners'),
  ('Sean Penn', 'One Battle after Another'),
  ('Stellan Skarsgård', 'Sentimental Value')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Atriz Coadjuvante', 'SILVER')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Elle Fanning', 'Sentimental Value'),
  ('Inga Ibsdotter Lilleaas', 'Sentimental Value'),
  ('Amy Madigan', 'Weapons'),
  ('Wunmi Mosaku', 'Sinners'),
  ('Teyana Taylor', 'One Battle after Another')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

-- BRONZE
WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Roteiro Original', 'BRONZE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Robert Kaplow', 'Blue Moon'),
  ('Jafar Panahi, Nader Saïvar, Shadmehr Rastin, Mehdi Mahmoudian', 'It Was Just an Accident'),
  ('Ronald Bronstein, Josh Safdie', 'Marty Supreme'),
  ('Eskil Vogt, Joachim Trier', 'Sentimental Value'),
  ('Ryan Coogler', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Roteiro Adaptado', 'BRONZE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Will Tracy', 'Bugonia'),
  ('Guillermo del Toro', 'Frankenstein'),
  ('Chloé Zhao, Maggie O''Farrell', 'Hamnet'),
  ('Paul Thomas Anderson', 'One Battle after Another'),
  ('Clint Bentley, Greg Kwedar', 'Train Dreams')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Animação', 'BRONZE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Ugo Bienvenu, Félix de Givry, Sophie Mas, Natalie Portman', 'Arco'),
  ('Madeline Sharafian, Domee Shi, Adrian Molina, Mary Alice Drumm', 'Elio'),
  ('Maggie Kang, Chris Appelhans, Michelle L.M. Wong', 'KPop Demon Hunters'),
  ('Maïlys Vallade, Liane-Cho Han, Nidia Santiago, Henri Magalon', 'Little Amélie or the Character of Rain'),
  ('Jared Bush, Byron Howard, Yvett Merino', 'Zootopia 2')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Filme Internacional', 'BRONZE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Brasil', 'The Secret Agent'),
  ('França', 'It Was Just an Accident'),
  ('Noruega', 'Sentimental Value'),
  ('Espanha', 'Sirāt'),
  ('Tunísia', 'The Voice of Hind Rajab')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

-- BASE
WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Fotografia', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Dan Laustsen', 'Frankenstein'),
  ('Darius Khondji', 'Marty Supreme'),
  ('Michael Bauman', 'One Battle after Another'),
  ('Autumn Durald Arkapaw', 'Sinners'),
  ('Adolpho Veloso', 'Train Dreams')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Edição', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Stephen Mirrione', 'F1'),
  ('Ronald Bronstein, Josh Safdie', 'Marty Supreme'),
  ('Andy Jurgensen', 'One Battle after Another'),
  ('Olivier Bugge Coutté', 'Sentimental Value'),
  ('Michael P. Shawver', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Design de Produção', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Tamara Deverell, Shane Vieau', 'Frankenstein'),
  ('Fiona Crombie, Alice Felton', 'Hamnet'),
  ('Jack Fisk, Adam Willis', 'Marty Supreme'),
  ('Florencia Martin, Anthony Carlino', 'One Battle after Another'),
  ('Hannah Beachler, Monique Champagne', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Figurino', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Deborah L. Scott', 'Avatar: Fire and Ash'),
  ('Kate Hawley', 'Frankenstein'),
  ('Malgosia Turzanska', 'Hamnet'),
  ('Miyako Bellizzi', 'Marty Supreme'),
  ('Ruth E. Carter', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Maquiagem e Cabelo', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Mike Hill, Jordan Samuel, Cliona Furey', 'Frankenstein'),
  ('Kyoko Toyokawa, Naomi Hibino, Tadashi Nishimatsu', 'Kokuho'),
  ('Ken Diaz, Mike Fontaine, Shunika Terry', 'Sinners'),
  ('Kazu Hiro, Glen Griffin, Bjoern Rehbein', 'The Smashing Machine'),
  ('Thomas Foldberg, Anne Cathrine Sauerberg', 'The Ugly Stepsister')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhores Efeitos Visuais', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Joe Letteri, Richard Baneham, Eric Saindon, Daniel Barrett', 'Avatar: Fire and Ash'),
  ('Ryan Tudhope, Nicolas Chevallier, Robert Harrington, Keith Dawson', 'F1'),
  ('David Vickery, Stephen Aplin, Charmaine Chan, Neil Corbould', 'Jurassic World Rebirth'),
  ('Charlie Noble, David Zaretti, Russell Bowen, Brandon K. McLaughlin', 'The Lost Bus'),
  ('Michael Ralla, Espen Nordahl, Guido Wolter, Donnie Dean', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Som', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo, Juan Peralta', 'F1'),
  ('Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke, Brad Zoern', 'Frankenstein'),
  ('José Antonio García, Christopher Scarabosio, Tony Villaflor', 'One Battle after Another'),
  ('Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor, Steve Boeddeker', 'Sinners'),
  ('Amanda Villavieja, Laia Casanovas, Yasmina Praderas', 'Sirāt')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Trilha Sonora Original', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Jerskin Fendrix', 'Bugonia'),
  ('Alexandre Desplat', 'Frankenstein'),
  ('Max Richter', 'Hamnet'),
  ('Jonny Greenwood', 'One Battle after Another'),
  ('Ludwig Goransson', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Canção Original', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('"Dear Me" — Diane Warren', 'Diane Warren: Relentless'),
  ('"Golden" — EJAE, Mark Sonnenblick, Joong Gyu Kwak, Yu Han Lee, Hee Dong Nam, Jeong Hoon Seo, Teddy Park', 'KPop Demon Hunters'),
  ('"I Lied To You" — Raphael Saadiq, Ludwig Goransson', 'Sinners'),
  ('"Sweet Dreams Of Joy" — Nicholas Pike', 'Viva Verdi!'),
  ('"Train Dreams" — Nick Cave, Bryce Dessner', 'Train Dreams')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Curta de Animação', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Florence Miailhe, Ron Dyens', 'Butterfly'),
  ('Nathan Engelhardt, Jeremy Spears', 'Forevergreen'),
  ('Chris Lavis, Maciek Szczerbowski', 'The Girl Who Cried Pearls'),
  ('John Kelly, Andrew Freedman', 'Retirement Plan'),
  ('Konstantin Bronzit', 'The Three Sisters')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Curta Live Action', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Meyer Levinson-Blount, Oron Caspi', 'Butcher''s Stain'),
  ('Lee Knight, James Dean', 'A Friend of Dorothy'),
  ('Julia Aks, Steve Pinder', 'Jane Austen''s Period Drama'),
  ('Sam A. Davis, Jack Piatt', 'The Singers'),
  ('Alexandre Singh, Natalie Musteata', 'Two People Exchanging Saliva')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Documentário', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Andrew Jarecki, Charlotte Kaufman', 'The Alabama Solution'),
  ('Ryan White, Jessica Hargrave, Tig Notaro, Stef Willen', 'Come See Me in the Good Light'),
  ('Sara Khaki, Mohammadreza Eyni', 'Cutting through Rocks'),
  ('David Borenstein, Pavel Talankin, Helle Faber, Alžběta Karásková', 'Mr. Nobody against Putin'),
  ('Geeta Gandbhir, Alisa Payne, Nikon Kwantu, Sam Bisbee', 'The Perfect Neighbor')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Curta-Documentário', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Joshua Seftel, Conall Jones', 'All the Empty Rooms'),
  ('Craig Renaud, Juan Arredondo', 'Armed Only with a Camera: The Life and Death of Brent Renaud'),
  ('Hilla Medalia, Sheila Nevins', 'Children No More: "Were and Are Gone"'),
  ('Christalyn Hampton, Geeta Gandbhir', 'The Devil Is Busy'),
  ('Alison McAlpine', 'Perfectly a Strangeness')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;

WITH cat AS (
  INSERT INTO "Category" ("id", "name", "tier")
  VALUES (gen_random_uuid()::text, 'Melhor Casting', 'BASE')
  ON CONFLICT ("name") DO UPDATE SET "tier" = EXCLUDED."tier"
  RETURNING "id"
)
INSERT INTO "Nominee" ("id", "name", "movie", "categoryId")
SELECT gen_random_uuid()::text, nom.name, nom.movie, cat.id FROM cat, (VALUES
  ('Nina Gold', 'Hamnet'),
  ('Jennifer Venditti', 'Marty Supreme'),
  ('Cassandra Kulukundis', 'One Battle after Another'),
  ('Gabriel Domingues', 'The Secret Agent'),
  ('Francine Maisler', 'Sinners')
) AS nom(name, movie)
ON CONFLICT DO NOTHING;
