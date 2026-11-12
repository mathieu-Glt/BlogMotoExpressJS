-- Adminer 6.3.0 PostgreSQL 16.15 dump

DROP TABLE IF EXISTS "public"."author", "public"."category", "public"."comment", "public"."post", "public"."user";

CREATE TABLE "public"."author" (
    "id" serial NOT NULL,
    "firstname" character varying(50) NOT NULL,
    "lastname" character varying(50) NOT NULL,
    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

INSERT INTO "public"."author" ("id", "firstname", "lastname") VALUES
(1,	'Mathieu',	'GILLET'),
(2,	'Robin',	'GILLET'),
(3,	'Sofiane',	'KADI');

CREATE TABLE "public"."category" (
    "id" serial NOT NULL,
    "name" character varying(40) NOT NULL,
    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

INSERT INTO "public"."category" ("id", "name") VALUES
(2,	'FOOTBALL'),
(3,	'BASKETBALL'),
(1,	'SPORTMOTO');

CREATE TABLE "public"."comment" (
    "id" serial NOT NULL,
    "nickname" character varying(30) NOT NULL,
    "contents" text NOT NULL,
    "creationtimestamp" date NOT NULL,
    "post_id" integer NOT NULL,
    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

INSERT INTO "public"."comment" ("id", "nickname", "contents", "creationtimestamp", "post_id") VALUES
(1,	'matLeBg',	'Un pilote prometteur !!',	'2026-11-11',	8),
(2,	'matLeBg',	'Super Pilote !',	'2026-11-11',	8),
(3,	'matLeBg',	'Un pilote qui marquera à jamais l''histoire de  la moto !! Un grand champion !',	'2026-11-11',	1),
(4,	'matLeBg',	'Un pilote qui peut marqué l''histoire de la moto de son empreinte !',	'2026-11-11',	3);

CREATE TABLE "public"."post" (
    "id" serial NOT NULL,
    "title" character varying(100) NOT NULL,
    "contents" text NOT NULL,
    "author_id" integer NOT NULL,
    "categry_id" integer NOT NULL,
    "portrait" character varying,
    "picture" character varying,
    "nationality" character varying,
    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

INSERT INTO "public"."post" ("id", "title", "contents", "author_id", "categry_id", "portrait", "picture", "nationality") VALUES
(2,	'Jorge Lorenzo',	'Jorge Lorenzo Guerrero, né le 4 mai 1987 à Palma, dans l''île de Majorque (Espagne)1, est un pilote de vitesse moto espagnol, double champion du monde 250 cm3 et triple champion du monde MotoGP avec Yamaha en 2010 , 2012 et 2015.

En 2017, Il signe avec Ducati. Il a pour équipier Andrea Dovizioso. En deux ans, il remporte trois victoires, quatre pole positions, montant sept fois sur le podium.

En 2019, un nouveau défi l''attend chez Honda avec comme coéquipier Marc Márquez. Après une année difficile marquée par des blessures et des difficultés d''adaptation avec sa nouvelle machine, il annonce sa retraite sportive avant le dernier grand prix de la saison 2019.',	1,	1,	'/images/jge.jpg',	'/images/jorge.jpg',	NULL),
(1,	'Valentino Rossi',	'Valentino Rossi, né le 16 février 1979 à Urbino en Italie, est un pilote de vitesse moto1.

Il est sacré neuf fois champion du monde en Grand Prix Moto dont sept en catégorie reine (500 cm3, puis Moto GP). Il est surnommé « The Doctor » et porte le numéro 46. Il compte 199 podiums au sein de la discipline.

Pour la saison 2021, il rejoint son compatriote Franco Morbidelli chez Sepang Racing Team, toujours sur une Yamaha.

Le jeudi 5 août 2021, lors d''une conférence de presse exceptionnelle du Grand prix de Styrie en Autriche, il annonce mettre un terme à sa carrière de pilote moto à la fin de la saison, pour se consacrer à la course automobile. Il refuse par la même occasion de courir dans sa propre écurie sur Ducati.',	1,	1,	'/images/val.jpg',	'/images/valentino.jpg',	NULL),
(3,	'Marc Marquez',	'Marc Márquez i Alentà, né le 17 février 1993 à Cervera (province de Lleida, Espagne), est un pilote de vitesse moto espagnol participant au championnat du monde.

Il est détenteur de huit titres de champion du monde : en 2010 dans la catégorie 125 cm3, en 2012 en moto2, en 2013, 2014, 2016, 2017, 2018 et 2019 en MotoGP. Il est également, le plus jeune champion du monde de l''histoire de la catégorie reine. Le 26 mars 2014, il est récompensé lors de la prestigieuse cérémonie des Laureus World Sports Awards, qui honore chaque année les plus grands athlètes de la planète, par le prix de « révélation de l’année »1.

Jeune prodige, il est capable de rattraper sa moto dans des situations désespérées, et détient le plus grand nombre de sauvetages. Ceci est en partie dû à sa position extrême sur la moto : son corps tout entier est en dehors de la selle et son coude (parfois même l''épaule) touche le sol, ce qui l''aide en partie à rattraper sa moto. C''est un style très agressif et très impressionnant dont beaucoup de pilotes souhaitent s''inspirer. Il est aussi le pilote qui détient le record d''angle d''inclinaison (70,8°).',	2,	1,	'/images/mm.jpg',	'/images/marquez.jpg',	NULL),
(8,	'Jorge Martin',	'Jorge Martín Almoguera, dit Jorge Martín, né le 29 janvier 1998 à Madrid, est un pilote de vitesse moto espagnol.

Sacré champion du monde Moto3 avec le team Del Conca Gresini en 2018, il remporte sa première victoire en MotoGP lors du Grand Prix de Styrie 2021, ainsi que la première de Pramac Racing dans la catégorie. En 2023, longtemps en lutte pour le titre, il devient vice-champion du monde MotoGP derrière Francesco Bagnaia. En 2024, il devient champion du monde MotoGP. En 2025, il rejoint l''équipe italienne Aprilia Racing ou il fait une saison peu convaincante.',	1,	1,	'/images/jm.jpg',	'/images/jorgem.jpg',	'Espagnole');

CREATE TABLE "public"."user" (
    "id" serial NOT NULL,
    "email" character varying(120) NOT NULL,
    "password" character varying(120) NOT NULL,
    "role" character varying(10) NOT NULL,
    "firstname" character varying(60) NOT NULL,
    "lastname" character varying(60) NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX user_email_key ON "public"."user" USING btree (email);

INSERT INTO "public"."user" ("id", "email", "password", "role", "firstname", "lastname") VALUES
(1,	'mathieu.gillet@hotmail.fr',	'$2b$10$.sdZHi2.gM5Bp5ojObZkZuQzxKa9c33.J47PpIgcPJPCqRKM8n/Pm',	'user',	'Mathieu',	'GILLET');

ALTER TABLE ONLY "public"."comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY (post_id) REFERENCES "public"."post"(id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY (author_id) REFERENCES "public"."author"(id);
ALTER TABLE ONLY "public"."post" ADD CONSTRAINT "post_categry_id_fkey" FOREIGN KEY (categry_id) REFERENCES "public"."category"(id);

-- 2026-11-12 18:46:16 UTC