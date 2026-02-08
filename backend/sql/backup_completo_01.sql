--
-- PostgreSQL database dump
--

\restrict FrEtDHsjhqthyNYSkX7RZ58Kfu7gDeVQuCK6LSXkOaWC1t5eASK96hhRHw0bbc5

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: proc_delete_user_and_roles(character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.proc_delete_user_and_roles(IN p_login character varying)
    LANGUAGE plpgsql
    AS $$
begin
	
	DELETE FROM users_roles ur where ur.user_id = (select id from users u where login = p_login);
	DELETE FROM users u WHERE u.login = p_login;

end
$$;


ALTER PROCEDURE public.proc_delete_user_and_roles(IN p_login character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id character varying(255) DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    login character varying(255),
    password character varying(255),
    email character varying(50),
    name character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_roles (
    user_id character varying(255) NOT NULL,
    role_id character varying(255) NOT NULL
);


ALTER TABLE public.users_roles OWNER TO postgres;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
0957687d-7083-4d93-8ecb-d9f8682a1de3	USER
4b7fa9e9-adf3-411e-bce0-e3652c2ecc16	ADMIN
9856b4ff-fabc-456d-8405-4c36f5a4d936	MANAGER
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, password, email, name) FROM stdin;
2f66fbb1-bd67-4c6f-ada7-3e73de8648d8	eduarda	$2a$10$1pVTwZu2QRSmpNymEPNUSe6WYVkYftHtQ.zouZ2Uc56e16ZD9ead6	eduardab@gmail.com	Eduarda Bento
\.


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles (user_id, role_id) FROM stdin;
2f66fbb1-bd67-4c6f-ada7-3e73de8648d8	0957687d-7083-4d93-8ecb-d9f8682a1de3
2f66fbb1-bd67-4c6f-ada7-3e73de8648d8	4b7fa9e9-adf3-411e-bce0-e3652c2ecc16
2f66fbb1-bd67-4c6f-ada7-3e73de8648d8	9856b4ff-fabc-456d-8405-4c36f5a4d936
\.


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_roles users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users_roles fk2o0jvgh89lemvvo17cbqvdxaa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdxaa FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users_roles fkj6m8fwv7oqv74fcehir1a9ffy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fkj6m8fwv7oqv74fcehir1a9ffy FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict FrEtDHsjhqthyNYSkX7RZ58Kfu7gDeVQuCK6LSXkOaWC1t5eASK96hhRHw0bbc5

