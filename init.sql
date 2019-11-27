
CREATE TABLE users
(
    "userId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    gender character varying(20) NOT NULL,
    "jobRole" character varying(50) NOT NULL,
    department character varying(50) NOT NULL,
    address character varying(255) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY ("userId")
);


INSERT INTO users ("firstName", "lastName", "email", "password", "gender", "jobRole", "department", "address") 
VALUES ('Joseph', 'Jonathan', 'admin@example.com', '$2a$10$T/Nn0VImMC56dyIxoY4d0.J0bZJuQCvsCoAL1GvntCQTNXR6ip0r2', 'male', 'admin', 'DevOps', 'Lagos, Nigeria');


CREATE TABLE articles
(
    "articleId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying(255) NOT NULL,
    article character varying(1000) NOT NULL,
    "createdOn" timestamp(4) without time zone NOT NULL DEFAULT now(),
    "userId" integer NOT NULL,
    CONSTRAINT articles_pkey PRIMARY KEY ("articleId"),
    CONSTRAINT "articles_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users ("userId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE gifs
(
    "gifId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying(255) NOT NULL,
    "imageUrl" character varying(255) NOT NULL,
    "createdOn" timestamp(4) without time zone NOT NULL DEFAULT now(),
    "userId" integer NOT NULL,
    "publicId" character varying(255) NOT NULL,
    CONSTRAINT gifs_pkey PRIMARY KEY ("gifId"),
    CONSTRAINT fk_gif_user FOREIGN KEY ("userId")
        REFERENCES public.users ("userId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);


CREATE TABLE comments
(
    "commentId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    comment character varying NOT NULL,
    "authorId" integer NOT NULL,
    "articleId" integer,
    "gifId" integer,
    "createdOn" timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT comments_pkey PRIMARY KEY ("commentId"),
    CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId")
        REFERENCES public.articles ("articleId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId")
        REFERENCES public.users ("userId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "comments_gifId_fkey" FOREIGN KEY ("gifId")
        REFERENCES public.gifs ("gifId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);