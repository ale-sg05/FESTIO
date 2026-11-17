import { prisma } from "../lib/prisma";
import { searchSpotify, getSpotifyArtistDetails } from "../lib/sapi";
import { type ArtistDto } from "../dtos/artist.dto";

const saveArtistToDatabase = async (artist: ArtistDto) => {
  try {
    await prisma.artista.upsert({
      where: { id: artist.id },
      create: {
        id: artist.id,
        nombre: artist.name,
        imagen: artist.images.length > 0 ? artist.images[0].url : "",
      },
      update: {
        nombre: artist.name,
        imagen: artist.images.length > 0 ? artist.images[0].url : "",
      },
    });
  } catch (error) {
    console.error("Error saving artist to database:", error);
  }
};

const musicSearch = async (query: string, limit: number) => {
  try {
    const artists = await searchSpotify(query, limit);
    return artists;
  } catch (error) {
    console.error("Error searching for music:", error);
    throw new Error("Failed to search for music");
  }
};

const getArtistDetails = async (artistId: string) => {
  try {
    const artist = await getSpotifyArtistDetails(artistId);
    await saveArtistToDatabase(artist);
    return artist;
  } catch (error) {
    console.error("Error fetching artist details:", error);
    throw new Error("Failed to fetch artist details");
  }
};

const getAllArtists = async () => {
  try {
    const artists = await prisma.artista.findMany();
    return artists;
  } catch (error) {
    console.error("Error fetching artists from database:", error);
    throw new Error("Failed to fetch artists");
  }
};

export const artistService = {
  musicSearch,
  getArtistDetails,
  getAllArtists,
};
