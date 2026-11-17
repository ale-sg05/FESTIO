BEGIN;

-- Limpieza de datos
DELETE FROM abono_cliente;
DELETE FROM actuar_festival;
DELETE FROM tipo_abono;
DELETE FROM cliente;
DELETE FROM festival;
DELETE FROM artista;
DELETE FROM empresa;

-- Empresas
INSERT INTO empresa (
  id,
  cif,
  persona,
  correo,
  telefono,
  razon_social,
  domicilio,
  contraseña,
  verificada,
  restringida
) VALUES
(
  '8a3f2c1d-5e6b-4a9c-8d7e-1f2a3b4c5d6e',
  'MC1234567',
  'Laura Gómez',
  'mad@cool.com',
  '600111222',
  'Mad Cool Festival S.L.',
  'Calle Mayor 10, Madrid',
  '123456',
  false,
  false
),
(
  '9b4g3d2e-6f7c-5b0d-9e8f-2g3b4c5d6e7f',
  'B98814502',
  'R. Gil',
  'r.gil@themusicrepublic.es',
  '600333444',
  'The Music Republic Sociedad Limitada',
  'Calle justicia, 4 - 2 a, valencia, 46004, valencia',
  '123456',
  false,
  false
);

-- Artistas
INSERT INTO artista (
  id,
  nombre,
  imagen
) VALUES
(
  '2HcwFjNelS49kFbfvMxQYw',
  'Robbie Williams',
  'https://i.scdn.co/image/ab6761610000e5ebec4b5ff594ae3d7c5622cf23'
),
(
  '2wY79sveU1sp5g7SokKOiI',
  'Sam Smith',
  'https://i.scdn.co/image/ab6761610000e5eb48179dd7f4c7dc49377846e0'
),
(
  '0L8ExT028jH3ddEcZwqJJ5',
  'Red Hot Chili Peppers',
  'https://i.scdn.co/image/ab6761610000e5ebc33cc15260b767ddec982ce8'
),
(
  '6sN51vEARnAAdBw1IKZ8Q9',
  'Liam Gallagher',
  'https://i.scdn.co/image/ab6761610000e5eb957a3f67775248cf2b7c3949'
),
(
  '7jy3rLJdDQY21OgRLCZ9sD',
  'Foo Fighters',
  'https://i.scdn.co/image/ab6761610000e5eb1db35bc9c01d2b1c151e44ce'
),
(
  '3YQKmKGau1PzlVlkL1iodx',
  'Twenty One Pilots',
  'https://i.scdn.co/image/ab6761610000e5eb61a7ea26d33ded218cd1e59d'
),
(
  '1moxjboGR7GNWYIMWsRjgG',
  'Florence + The Machine',
  'https://i.scdn.co/image/ab6761610000e5eb836eb0a7a82eb8f4133ee04d'
),
(
  '6VuMaDnrHyPL1p4EHjYLi7',
  'Charlie Puth',
  'https://i.scdn.co/image/ab6761610000e5eb6721f541fb123145d4cb3ace'
);

-- Festivales
INSERT INTO festival (
  id,
  nombre,
  estado,
  ubicacion,
  aforo,
  descripcion,
  f_inicio,
  f_fin,
  imagen,
  empresa
) VALUES
(
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  'Mad Cool Festival 2026',
  'Activo',
  'Distrito de Villaverde, Madrid Capital',
  50000,
  'Mad Cool es un festival de música que se realiza en Madrid desde el año 2016. El arte, la moda, la gastronomía y el turismo se unen eclécticamente en este festival.',
  DATE '2026-07-08',
  DATE '2026-07-11',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjI5NHwwfDF8cmFuZG9tfHx8fHx8fHx8MTc3Nzc0MDg0MHw&ixlib=rb-4.1.0&q=85',
  '8a3f2c1d-5e6b-4a9c-8d7e-1f2a3b4c5d6e'
);

-- Actuaciones
INSERT INTO actuar_festival (
  festival,
  artista
) VALUES
(
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  '7jy3rLJdDQY21OgRLCZ9sD'
),
(
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  '3YQKmKGau1PzlVlkL1iodx'
),
(
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  '1moxjboGR7GNWYIMWsRjgG'
),
(
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  '6VuMaDnrHyPL1p4EHjYLi7'
);

-- Tipos de abono
INSERT INTO tipo_abono (
  nombre,
  precio,
  stock,
  festival
) VALUES
(
  'Abono General',
  300,
  4000,
  '450ec7c9-0c19-47da-9844-7e7451016c72'
),
(
  'Abono VIP',
  600,
  1000,
  '450ec7c9-0c19-47da-9844-7e7451016c72'
);

-- Clientes
INSERT INTO cliente (
  id,
  correo,
  nombre,
  apellidos,
  dni,
  fecha_nacimiento,
  telefono,
  contraseña
) VALUES
(
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8',
  'hector@torres.com',
  'Héctor',
  'Torres',
  '12345678A',
  DATE '2005-02-26',
  '600555666',
  '123456'
),
(
  'b2c3d4e5-f6a7-5890-b123-c4d5e6f7a8b9',
  'alejandro@martin.com',
  'Alejandro',
  'Martín',
  '87654321B',
  DATE '2000-05-15',
  '699888777',
  '123456'
);

-- Abonos de clientes
INSERT INTO abono_cliente (
  id,
  saldo,
  tipo_abono,
  cliente,
  festival,
  estado
) VALUES
(
  '6521e2ad-0e57-43b4-97f8-81c0743b91ee',
  300,
  'Abono General',
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f7a8',
  '450ec7c9-0c19-47da-9844-7e7451016c72',
  true
);

COMMIT;