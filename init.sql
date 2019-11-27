CREATE TABLE books
(
    id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    author character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT books_pkey PRIMARY KEY (id)
);

INSERT INTO books (author, title)
VALUES  ('J.K. Rowling', 'Harry Potter');