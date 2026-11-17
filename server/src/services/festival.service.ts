import { prisma } from "../lib/prisma";
import { type FestivalDto } from "../dtos/festival.dto";
import { artistService } from "./artist.service";

// Validar que hay al menos 3 días hasta el inicio del festival
const validateMinimumDaysBeforeFestival = (festivalStartDate: Date) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const festivalDate = new Date(festivalStartDate);
  festivalDate.setUTCHours(0, 0, 0, 0);

  const daysUntilFestival = Math.ceil(
    (festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilFestival < 3) {
    throw new Error(
      "No se puede editar o cancelar un festival con menos de 3 días para su inicio",
    );
  }
};

const getAllFestivals = async () => {
  const festivales = await prisma.festival.findMany({
    include: {
      actuaciones: true,
    },
  });
  return festivales;
};
const getFestivalById = async (id: string) => {
  const festival = await prisma.festival.findUnique({
    where: { id },
    include: {
      actuaciones: {
        include: {
          artistaRef: {
            select: {
              id: true,
              nombre: true,
              imagen: true,
            },
          },
        },
      },
      tiposAbono: {
        include: {
          abonos: true,
        },
      },
    },
  });

  if (!festival) return null;

  return {
    ...festival,
    actuaciones: festival.actuaciones.map((actuacion) => ({
      ...actuacion.artistaRef,
    })),
  };
};

const createFestival = async (festivalData: FestivalDto) => {
  if (!festivalData) {
    throw new Error("Festival data is required");
  }
  if (await getFestivalById(festivalData.id)) {
    throw new Error("Festival with this ID already exists");
  }
  if (!festivalData.imagen) {
    const festivalImages = await getFestivalImages();
    const randomImage =
      festivalImages[Math.floor(Math.random() * festivalImages.length)];
    festivalData.imagen = randomImage?.urls?.regular ?? festivalData.imagen;
  }
  const newFestival = await prisma.festival.create({
    data: festivalData,
  });
  return newFestival;
};

const deleteFestival = async (id: string) => {
  const festival = await getFestivalById(id);
  if (!festival) {
    throw new Error("Festival not found");
  }
  await prisma.festival.delete({
    where: { id },
  });
};

const updateFestival = async (festivalData: FestivalDto) => {
  if (!festivalData) {
    throw new Error("Festival data is required");
  }
  const existingFestival = await getFestivalById(festivalData.id);
  if (!existingFestival) {
    throw new Error("Festival not found");
  }

  // Validar que hay al menos 3 días hasta el inicio del festival
  validateMinimumDaysBeforeFestival(existingFestival.f_inicio);

  const updatedFestival = await prisma.festival.update({
    where: { id: festivalData.id },
    data: festivalData,
  });
  return updatedFestival;
};

const addArtistToFestival = async (festivalId: string, artistId: string) => {
  const festival = await getFestivalById(festivalId);
  if (!festival) {
    throw new Error("Festival not found");
  }
  const artist = await artistService.getArtistDetails(artistId);
  console.log("Artist details:", artist);
  if (!artist) {
    throw new Error("Artist not found");
  }
  const updatedFestival = await prisma.actuar_festival.create({
    data: {
      festival: festivalId,
      artista: artistId,
    },
  });
  return updatedFestival;
};

const addTicketToFestival = async (
  festivalId: string,
  nombre: string,
  precio: number,
  stock: number,
) => {
  const festival = await getFestivalById(festivalId);
  if (!festival) {
    throw new Error("Festival not found");
  }
  const updatedFestival = await prisma.tipo_abono.create({
    data: {
      nombre,
      precio,
      stock,
      festival: festivalId,
    },
  });
  return updatedFestival;
};

const getFestivalImages = async () => {
  const params = new URLSearchParams({
    query: "festival",
    orientation: "landscape",
    content_filter: "high",
    count: "30",
  });

  const response = await fetch(
    `https://api.unsplash.com/photos/random?${params.toString()}`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
      },
    },
  );
  const images = await response.json();
  if (!response.ok) {
    return [
      {
        id: "default",
        urls: {
          regular:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEwfHxmb3Jlc3R8ZW58MHx8fHwxNjg4ODQ5MDI0&ixlib=rb-4.0.3&q=80&w=1080",
        },
        alt_description: "Default Festival Image",
      },
    ];
  }
  return images.map((img: any) => ({
    id: img.id,
    urls: img.urls,
    alt: img.alt_description || "Festival Image",
  }));
};

const cancelFestival = async (id: string) => {
  const festival = await getFestivalById(id);
  if (!festival) {
    throw new Error("Festival not found");
  }

  // Validar que hay al menos 3 días hasta el inicio del festival
  validateMinimumDaysBeforeFestival(festival.f_inicio);

  const updatedFestival = await prisma.festival.update({
    where: { id },
    data: { estado: "Cancelado" },
  });
  return updatedFestival;
};

export const festivalService = {
  getAllFestivals,
  getFestivalById,
  createFestival,
  deleteFestival,
  updateFestival,
  cancelFestival,
  addArtistToFestival,
  addTicketToFestival,
  getFestivalImages,
};
