import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { randomUUID } from "crypto";

async function main() {
  console.log("Limpiando base de datos...");

  await prisma.abono_cliente.deleteMany();
  await prisma.tipo_abono.deleteMany();
  await prisma.actuar_festival.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.artista.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.empresa.deleteMany();

  console.log("Insertando empresas...");

  const empresaIdMadCool = randomUUID();
  const empresaIdMusicRepublic = randomUUID();

  await prisma.empresa.createMany({
    data: [
      {
        id: empresaIdMadCool,
        cif: "MC1234567",
        persona: "Laura Gómez",
        correo: "mad@cool.com",
        telefono: "600111222",
        razon_social: "Mad Cool Festival S.L.",
        domicilio: "Calle Mayor 10, Madrid",
        contraseña: await bcrypt.hash("123456", 10),
        verificada: false,
        restringida: false,
      },
      {
        id: empresaIdMusicRepublic,
        cif: "B98814502",
        persona: "R. Gil",
        correo: "r.gil@themusicrepublic.es",
        telefono: "600333444",
        razon_social: "The Music Republic Sociedad Limitada",
        domicilio: "Calle justicia, 4 - 2 a, valencia, 46004, valencia",
        contraseña: await bcrypt.hash("123456", 10),
        verificada: false,
        restringida: false,
      },
    ],
  });

  console.log("Insertando artistas...");

  await prisma.artista.createMany({
    data: [
      {
        id: "2HcwFjNelS49kFbfvMxQYw",
        nombre: "Robbie Williams",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5ebec4b5ff594ae3d7c5622cf23",
      },
      {
        id: "2wY79sveU1sp5g7SokKOiI",
        nombre: "Sam Smith",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb48179dd7f4c7dc49377846e0",
      },
      {
        id: "0L8ExT028jH3ddEcZwqJJ5",
        nombre: "Red Hot Chili Peppers",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5ebc33cc15260b767ddec982ce8",
      },
      {
        id: "6sN51vEARnAAdBw1IKZ8Q9",
        nombre: "Liam Gallagher",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb957a3f67775248cf2b7c3949",
      },
      {
        id: "7jy3rLJdDQY21OgRLCZ9sD",
        nombre: "Foo Fighters",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb1db35bc9c01d2b1c151e44ce",
      },
      {
        id: "3YQKmKGau1PzlVlkL1iodx",
        nombre: "Twenty One Pilots",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb61a7ea26d33ded218cd1e59d",
      },
      {
        id: "1moxjboGR7GNWYIMWsRjgG",
        nombre: "Florence + The Machine",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb836eb0a7a82eb8f4133ee04d",
      },
      {
        id: "6VuMaDnrHyPL1p4EHjYLi7",
        nombre: "Charlie Puth",
        imagen:
          "https://i.scdn.co/image/ab6761610000e5eb6721f541fb123145d4cb3ace",
      },
    ],
  });

  console.log("Insertando festivales...");

  const festivalIdMadCool = "450ec7c9-0c19-47da-9844-7e7451016c72";

  await prisma.festival.createMany({
    data: [
      {
        id: festivalIdMadCool,
        nombre: "Mad Cool Festival 2026",
        estado: "Activo",
        ubicacion: "Distrito de Villaverde, Madrid Capital",
        aforo: 50000,
        descripcion:
          "Mad Cool es un festival de música que se realiza en Madrid desde el año 2016. El arte, la moda, la gastronomía y el turismo se unen eclécticamente en este festival.",
        f_inicio: new Date("2026-07-08"),
        f_fin: new Date("2026-07-11"),
        imagen:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjI5NHwwfDF8cmFuZG9tfHx8fHx8fHx8MTc3Nzc0MDg0MHw&ixlib=rb-4.1.0&q=85",
        empresa: empresaIdMadCool,
      },
    ],
  });

  console.log("Insertando actuaciones...");

  await prisma.actuar_festival.createMany({
    data: [
      {
        festival: festivalIdMadCool,
        artista: "7jy3rLJdDQY21OgRLCZ9sD",
      },
      {
        festival: festivalIdMadCool,
        artista: "3YQKmKGau1PzlVlkL1iodx",
      },
      {
        festival: festivalIdMadCool,
        artista: "1moxjboGR7GNWYIMWsRjgG",
      },
      {
        festival: festivalIdMadCool,
        artista: "6VuMaDnrHyPL1p4EHjYLi7",
      },
    ],
  });

  console.log("Insertando tipos de abono...");

  await prisma.tipo_abono.createMany({
    data: [
      {
        nombre: "Abono General",
        precio: 300,
        stock: 4000,
        festival: festivalIdMadCool,
      },
      {
        nombre: "Abono VIP",
        precio: 600,
        stock: 1000,
        festival: festivalIdMadCool,
      },
    ],
  });

  console.log("Insertando clientes...");

  // Generamos IDs para los clientes
  const clienteIdHector = randomUUID();
  const clienteIdAlejandro = randomUUID();

  await prisma.cliente.createMany({
    data: [
      {
        id: clienteIdHector,
        correo: "hector@torres.com",
        nombre: "Héctor",
        apellidos: "Torres",
        dni: "12345678A",
        fecha_nacimiento: new Date("2005-02-26"),
        telefono: "600555666",
        contraseña: await bcrypt.hash("123456", 10),
      },
      {
        id: clienteIdAlejandro,
        correo: "alejandro@martin.com",
        nombre: "Alejandro",
        apellidos: "Martín",
        dni: "87654321B",
        fecha_nacimiento: new Date("2000-05-15"),
        telefono: "699888777",
        contraseña: await bcrypt.hash("123456", 10),
      },
    ],
  });

  console.log("Insertando abonos de clientes...");

  const abonoId = "6521e2ad-0e57-43b4-97f8-81c0743b91ee";

  await prisma.abono_cliente.createMany({
    data: [
      {
        id: abonoId,
        saldo: 300,
        tipo_abono: "Abono General",
        cliente: clienteIdHector,
        festival: festivalIdMadCool,
        estado: true,
      },
    ],
  });

  console.log("Insertando transacciones...");

  const transaccionId = randomUUID();

  await prisma.transaccion.createMany({
    data: [
      {
        id: transaccionId,
        cantidad: 300,
        moneda: "EUR",
        propietario: clienteIdHector,
      },
    ],
  });

  console.log("Vinculando transacciones con abonos...");

  await prisma.realizar_transaccion.createMany({
    data: [
      {
        abono: abonoId,
        cliente: clienteIdHector,
        festival: festivalIdMadCool,
        tipo_abono: "Abono General",
        transaccion: transaccionId,
        tipo_transaccion: "Compra",
      },
    ],
  });

  console.log("Seed completado correctamente.");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
