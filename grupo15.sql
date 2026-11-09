--
-- PostgreSQL database dump
--

\restrict I7xWp2QEHddsdsImMIyaYHJMGhymb4k8XdIiY1pHiuylSNZwkaN84YbusrpGCHs

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-17 21:12:02 CEST

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
-- TOC entry 863 (class 1247 OID 25484)
-- Name: estado_festival; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_festival AS ENUM (
    'Activo',
    'Cancelado'
);


ALTER TYPE public.estado_festival OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 25601)
-- Name: tipo_transaccion; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_transaccion AS ENUM (
    'Compra',
    'Recarga'
);


ALTER TYPE public.tipo_transaccion OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 25569)
-- Name: abono_cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.abono_cliente (
    id character varying(255) NOT NULL,
    saldo numeric(10,2) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tipo_abono character varying(255) NOT NULL,
    cliente character varying(255) NOT NULL,
    festival character varying(255) NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.abono_cliente OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25519)
-- Name: actuar_festival; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actuar_festival (
    festival character varying(255) NOT NULL,
    artista character varying(255) NOT NULL
);


ALTER TABLE public.actuar_festival OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25510)
-- Name: artista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artista (
    id character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    imagen text
);


ALTER TABLE public.artista OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 25554)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    apellidos character varying(255) NOT NULL,
    dni character varying(9) NOT NULL,
    fecha_nacimiento date NOT NULL,
    telefono character varying(15) NOT NULL,
    "contraseña" character varying(255) NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25464)
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    id text NOT NULL,
    cif character varying(9) NOT NULL,
    persona character varying(255) NOT NULL,
    correo character varying(255) NOT NULL,
    telefono character varying(15) NOT NULL,
    razon_social text NOT NULL,
    domicilio text NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    verificada boolean DEFAULT false NOT NULL,
    restringida boolean DEFAULT false NOT NULL
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25489)
-- Name: festival; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.festival (
    id character varying(255) NOT NULL,
    nombre character varying(255) NOT NULL,
    estado public.estado_festival NOT NULL,
    ubicacion text NOT NULL,
    aforo integer NOT NULL,
    descripcion text NOT NULL,
    f_inicio date NOT NULL,
    f_fin date NOT NULL,
    imagen text,
    empresa text,
    CONSTRAINT festival_estado_check CHECK ((estado = ANY (ARRAY['Activo'::public.estado_festival, 'Cancelado'::public.estado_festival])))
);


ALTER TABLE public.festival OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25618)
-- Name: realizar_transaccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realizar_transaccion (
    abono character varying(255) NOT NULL,
    cliente character varying(255) NOT NULL,
    festival character varying(255) NOT NULL,
    tipo_abono character varying(255) NOT NULL,
    transaccion character varying(255) NOT NULL,
    tipo_transaccion public.tipo_transaccion NOT NULL
);


ALTER TABLE public.realizar_transaccion OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25538)
-- Name: tipo_abono; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipo_abono (
    nombre character varying(255) NOT NULL,
    precio numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    festival character varying(255) NOT NULL
);


ALTER TABLE public.tipo_abono OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 25605)
-- Name: transaccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaccion (
    id character varying(255) NOT NULL,
    cantidad numeric(10,2) NOT NULL,
    moneda character varying(3) NOT NULL,
    propietario character varying(255) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transaccion OWNER TO postgres;

--
-- TOC entry 3893 (class 0 OID 25569)
-- Dependencies: 225
-- Data for Name: abono_cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.abono_cliente VALUES ('6521e2ad-0e57-43b4-97f8-81c0743b91ee', 300.00, '2026-05-14 22:08:07.563', 'Abono General', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', true);
INSERT INTO public.abono_cliente VALUES ('ba8cf886-6200-4fec-a155-aa074cac4cf3', 0.00, '2026-05-16 00:09:05.154', 'Abono General', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '72dd6e41-7318-404c-a76a-c283b94579e8', false);
INSERT INTO public.abono_cliente VALUES ('54922d91-b774-40a6-8fcb-b739f8353d32', 10000001.00, '2026-05-14 22:15:36.832', 'Abono VIP', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', false);


--
-- TOC entry 3890 (class 0 OID 25519)
-- Dependencies: 222
-- Data for Name: actuar_festival; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.actuar_festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', '7jy3rLJdDQY21OgRLCZ9sD');
INSERT INTO public.actuar_festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', '3YQKmKGau1PzlVlkL1iodx');
INSERT INTO public.actuar_festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', '1moxjboGR7GNWYIMWsRjgG');
INSERT INTO public.actuar_festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', '6VuMaDnrHyPL1p4EHjYLi7');
INSERT INTO public.actuar_festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', '4q3ewBCX7sLwd24euuV69X');


--
-- TOC entry 3889 (class 0 OID 25510)
-- Dependencies: 221
-- Data for Name: artista; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.artista VALUES ('2HcwFjNelS49kFbfvMxQYw', 'Robbie Williams', 'https://i.scdn.co/image/ab6761610000e5ebec4b5ff594ae3d7c5622cf23');
INSERT INTO public.artista VALUES ('2wY79sveU1sp5g7SokKOiI', 'Sam Smith', 'https://i.scdn.co/image/ab6761610000e5eb48179dd7f4c7dc49377846e0');
INSERT INTO public.artista VALUES ('0L8ExT028jH3ddEcZwqJJ5', 'Red Hot Chili Peppers', 'https://i.scdn.co/image/ab6761610000e5ebc33cc15260b767ddec982ce8');
INSERT INTO public.artista VALUES ('6sN51vEARnAAdBw1IKZ8Q9', 'Liam Gallagher', 'https://i.scdn.co/image/ab6761610000e5eb957a3f67775248cf2b7c3949');
INSERT INTO public.artista VALUES ('7jy3rLJdDQY21OgRLCZ9sD', 'Foo Fighters', 'https://i.scdn.co/image/ab6761610000e5eb1db35bc9c01d2b1c151e44ce');
INSERT INTO public.artista VALUES ('3YQKmKGau1PzlVlkL1iodx', 'Twenty One Pilots', 'https://i.scdn.co/image/ab6761610000e5eb61a7ea26d33ded218cd1e59d');
INSERT INTO public.artista VALUES ('1moxjboGR7GNWYIMWsRjgG', 'Florence + The Machine', 'https://i.scdn.co/image/ab6761610000e5eb836eb0a7a82eb8f4133ee04d');
INSERT INTO public.artista VALUES ('6VuMaDnrHyPL1p4EHjYLi7', 'Charlie Puth', 'https://i.scdn.co/image/ab6761610000e5eb6721f541fb123145d4cb3ace');
INSERT INTO public.artista VALUES ('4q3ewBCX7sLwd24euuV69X', 'Bad Bunny', 'https://i.scdn.co/image/ab6761610000e5eb81f47f44084e0a09b5f0fa13');


--
-- TOC entry 3892 (class 0 OID 25554)
-- Dependencies: 224
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cliente VALUES ('449fdd4b-74d0-44e8-8b39-312a83c6d4ac', 'hector@torres.com', 'Héctor', 'Torres', '12345678A', '2005-02-26', '600555666', '$2b$10$nMzZuJFDmuaZCOC0CTt.OOzWbACm.TunzTkqAmrZC/20a.wYYWU5u');
INSERT INTO public.cliente VALUES ('1fec50aa-2ea4-4efd-9d59-836f8f3a401e', 'alejandro@martin.com', 'Alejandro', 'Martín', '87654321B', '2000-05-15', '699888777', '$2b$10$9bAoA7HJI456THwfOUCaXe.fo4SMLwJ.zOlkArZL9IlxHM3vvZuee');
INSERT INTO public.cliente VALUES ('e36ccc3b-8a03-41ac-ad5a-00a24c8d1114', 'fiesta@john.com', 'Fiestero', 'John', '12345678A', '2000-02-01', '657885821', '$2b$10$Xr.g27BWOq51oxN8Vy6ixO7o7zkQRVpNaE4rcsR4mPWEp2VcfTIKC');
INSERT INTO public.cliente VALUES ('e12c4d54-3b5d-427a-818f-451f5ef54f65', 'john@dd.com', 'J', 'S', '12345678A', '2000-02-01', '658858521', '$2b$10$7XurZLVrYIF6sgwbxF7BDO.nbmX9dI3VecF.1ig9Ujlk7iViaXqQC');


--
-- TOC entry 3887 (class 0 OID 25464)
-- Dependencies: 219
-- Data for Name: empresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresa VALUES ('b6fa7619-def8-4e4f-b456-fa210ed50716', 'B98814502', 'R. Gil', 'r.gil@themusicrepublic.es', '600333444', 'The Music Republic Sociedad Limitada', 'Calle justicia, 4 - 2 a, valencia, 46004, valencia', '$2b$10$ETHO1ps4icw1xbpo8hU35.zQXd3zTqhXtT9BDBr9E9NAPinDpcPme', true, false);
INSERT INTO public.empresa VALUES ('d4685596-a0aa-4f28-b57e-0830b0b027ec', 'MC1234567', 'Laura Gómez', 'mad@cool.com', '600111222', 'Mad Cool Festival S.L.', 'Calle Mayor 10, Madrid', '$2b$10$M0tDhW3UwrRwQ4hI7FdUnudcfijfRdummKuJeNG49y5fKx/o2VEkG', true, false);


--
-- TOC entry 3888 (class 0 OID 25489)
-- Dependencies: 220
-- Data for Name: festival; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.festival VALUES ('eebd5a67-a1db-4edb-ae6e-abba9588ed66', 'Festival Intern', 'Cancelado', 'Beni', 100000, 'Festival internacional', '2026-05-18', '2026-05-21', 'https://images.unsplash.com/photo-1551883709-2516220df0bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjI5NHwwfDF8cmFuZG9tfHx8fHx8fHx8MTc3ODg4OTk2Nnw&ixlib=rb-4.1.0&q=80&w=1080', NULL);
INSERT INTO public.festival VALUES ('72dd6e41-7318-404c-a76a-c283b94579e8', 'Dib 2028', 'Cancelado', 'mam', 11212, 'A', '2029-05-05', '2027-05-05', 'https://images.unsplash.com/photo-1544924751-8acb02fb5331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjI5NHwwfDF8cmFuZG9tfHx8fHx8fHx8MTc3ODg5MDA0Mnw&ixlib=rb-4.1.0&q=80&w=1080', NULL);
INSERT INTO public.festival VALUES ('450ec7c9-0c19-47da-9844-7e7451016c72', 'Mad Cool Festival 2026', 'Cancelado', 'Distrito de Villaverde, Madrid Capital', 50000, 'Mad Cool es un festival de música que se realiza en Madrid desde el año 2016. El arte, la moda, la gastronomía y el turismo se unen eclécticamente en este festival.', '2026-07-08', '2026-07-11', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjI5NHwwfDF8cmFuZG9tfHx8fHx8fHx8MTc3Nzc0MDg0MHw&ixlib=rb-4.1.0&q=85', 'd4685596-a0aa-4f28-b57e-0830b0b027ec');


--
-- TOC entry 3895 (class 0 OID 25618)
-- Dependencies: 227
-- Data for Name: realizar_transaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.realizar_transaccion VALUES ('6521e2ad-0e57-43b4-97f8-81c0743b91ee', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', 'Abono General', 'e6d0201f-17ef-437a-87ec-2eade1fa0532', 'Compra');
INSERT INTO public.realizar_transaccion VALUES ('54922d91-b774-40a6-8fcb-b739f8353d32', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', 'Abono VIP', '75fffce3-372a-48c3-a14f-d44bd0bc9f1e', 'Compra');
INSERT INTO public.realizar_transaccion VALUES ('54922d91-b774-40a6-8fcb-b739f8353d32', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', 'Abono VIP', '1df71376-5dba-4e7a-929e-554c1244ec2d', 'Recarga');
INSERT INTO public.realizar_transaccion VALUES ('54922d91-b774-40a6-8fcb-b739f8353d32', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '450ec7c9-0c19-47da-9844-7e7451016c72', 'Abono VIP', 'b291c4be-818a-4140-a74c-e8b6d1486bbc', 'Recarga');
INSERT INTO public.realizar_transaccion VALUES ('ba8cf886-6200-4fec-a155-aa074cac4cf3', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '72dd6e41-7318-404c-a76a-c283b94579e8', 'Abono General', '306ac853-e63d-4309-8ab9-8e60adfbe695', 'Compra');


--
-- TOC entry 3891 (class 0 OID 25538)
-- Dependencies: 223
-- Data for Name: tipo_abono; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tipo_abono VALUES ('Abono General', 300.00, 4000, '450ec7c9-0c19-47da-9844-7e7451016c72');
INSERT INTO public.tipo_abono VALUES ('Abono VIP', 600.00, 999, '450ec7c9-0c19-47da-9844-7e7451016c72');
INSERT INTO public.tipo_abono VALUES ('Abono Super VIP', 1000.00, 1000, '450ec7c9-0c19-47da-9844-7e7451016c72');
INSERT INTO public.tipo_abono VALUES ('Abono General', 1000.00, 999, '72dd6e41-7318-404c-a76a-c283b94579e8');


--
-- TOC entry 3894 (class 0 OID 25605)
-- Dependencies: 226
-- Data for Name: transaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaccion VALUES ('e6d0201f-17ef-437a-87ec-2eade1fa0532', 300.00, 'EUR', '449fdd4b-74d0-44e8-8b39-312a83c6d4ac', '2026-05-14 22:08:07.565');
INSERT INTO public.transaccion VALUES ('75fffce3-372a-48c3-a14f-d44bd0bc9f1e', 600.00, 'EUR', 'Manolo', '2026-05-14 22:15:36.865');
INSERT INTO public.transaccion VALUES ('1df71376-5dba-4e7a-929e-554c1244ec2d', 1.00, 'EUR', 'Manolo', '2026-05-14 23:44:14.295');
INSERT INTO public.transaccion VALUES ('b291c4be-818a-4140-a74c-e8b6d1486bbc', 10000000.00, 'EUR', 'Manolo', '2026-05-14 23:45:04.638');
INSERT INTO public.transaccion VALUES ('306ac853-e63d-4309-8ab9-8e60adfbe695', 1000.00, 'EUR', 'Manolo', '2026-05-16 00:09:05.154');


--
-- TOC entry 3726 (class 2606 OID 25584)
-- Name: abono_cliente abono_cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abono_cliente
    ADD CONSTRAINT abono_cliente_pkey PRIMARY KEY (id, cliente, festival, tipo_abono);


--
-- TOC entry 3720 (class 2606 OID 25527)
-- Name: actuar_festival actuar_festival_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actuar_festival
    ADD CONSTRAINT actuar_festival_pkey PRIMARY KEY (festival, artista);


--
-- TOC entry 3718 (class 2606 OID 25518)
-- Name: artista artista_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artista
    ADD CONSTRAINT artista_pkey PRIMARY KEY (id);


--
-- TOC entry 3724 (class 2606 OID 25568)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- TOC entry 3714 (class 2606 OID 25482)
-- Name: empresa empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresa_pkey PRIMARY KEY (id);


--
-- TOC entry 3716 (class 2606 OID 25504)
-- Name: festival festival_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.festival
    ADD CONSTRAINT festival_pkey PRIMARY KEY (id);


--
-- TOC entry 3730 (class 2606 OID 25630)
-- Name: realizar_transaccion realizar_transaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realizar_transaccion
    ADD CONSTRAINT realizar_transaccion_pkey PRIMARY KEY (abono, cliente, festival, tipo_abono, transaccion);


--
-- TOC entry 3722 (class 2606 OID 25548)
-- Name: tipo_abono tipo_abono_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_abono
    ADD CONSTRAINT tipo_abono_pkey PRIMARY KEY (nombre, festival);


--
-- TOC entry 3728 (class 2606 OID 25617)
-- Name: transaccion transaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT transaccion_pkey PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 25590)
-- Name: abono_cliente abono_cliente_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abono_cliente
    ADD CONSTRAINT abono_cliente_cliente_fkey FOREIGN KEY (cliente) REFERENCES public.cliente(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3736 (class 2606 OID 25595)
-- Name: abono_cliente abono_cliente_festival_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abono_cliente
    ADD CONSTRAINT abono_cliente_festival_fkey FOREIGN KEY (festival) REFERENCES public.festival(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3737 (class 2606 OID 25585)
-- Name: abono_cliente abono_cliente_tipo_abono_festival_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abono_cliente
    ADD CONSTRAINT abono_cliente_tipo_abono_festival_fkey FOREIGN KEY (tipo_abono, festival) REFERENCES public.tipo_abono(nombre, festival) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3732 (class 2606 OID 25533)
-- Name: actuar_festival actuar_festival_artista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actuar_festival
    ADD CONSTRAINT actuar_festival_artista_fkey FOREIGN KEY (artista) REFERENCES public.artista(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3733 (class 2606 OID 25528)
-- Name: actuar_festival actuar_festival_festival_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actuar_festival
    ADD CONSTRAINT actuar_festival_festival_fkey FOREIGN KEY (festival) REFERENCES public.festival(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3731 (class 2606 OID 25505)
-- Name: festival festival_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.festival
    ADD CONSTRAINT festival_empresa_fkey FOREIGN KEY (empresa) REFERENCES public.empresa(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3738 (class 2606 OID 25631)
-- Name: realizar_transaccion realizar_transaccion_abono_cliente_festival_tipo_abono_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realizar_transaccion
    ADD CONSTRAINT realizar_transaccion_abono_cliente_festival_tipo_abono_fkey FOREIGN KEY (abono, cliente, festival, tipo_abono) REFERENCES public.abono_cliente(id, cliente, festival, tipo_abono) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3739 (class 2606 OID 25636)
-- Name: realizar_transaccion realizar_transaccion_transaccion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realizar_transaccion
    ADD CONSTRAINT realizar_transaccion_transaccion_fkey FOREIGN KEY (transaccion) REFERENCES public.transaccion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3734 (class 2606 OID 25549)
-- Name: tipo_abono tipo_abono_festival_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipo_abono
    ADD CONSTRAINT tipo_abono_festival_fkey FOREIGN KEY (festival) REFERENCES public.festival(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-05-17 21:12:02 CEST

--
-- PostgreSQL database dump complete
--

\unrestrict I7xWp2QEHddsdsImMIyaYHJMGhymb4k8XdIiY1pHiuylSNZwkaN84YbusrpGCHs

