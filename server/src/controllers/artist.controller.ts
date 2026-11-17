import { artistService } from "../services";
import { z } from "zod";
import { logger } from "../lib/logger";

const musicSearch = async (req: any, res: any) => {
  const musicSearchSchema = z.object({
    query: z.string().min(1),
    limit: z.coerce.number().int().positive().optional().default(10),
  });
  const validation = musicSearchSchema.safeParse(req.query);

  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid query params",
      details: validation.error.flatten(),
    });
  }

  const { query, limit } = validation.data;

  try {
    const artists = await artistService.musicSearch(query, limit);
    if (!artists) {
      return res.status(404).json({ error: "No artists found" });
    }
    res.json(artists);
  } catch (error) {
    logger.error({ err: error, query: req.query }, "musicSearch failed");
    res.status(500).json({ error: "Failed to search for music" });
  }
};

const getArtistDetails = async (req: any, res: any) => {
  const artistId = req.params.id;
  try {
    const artist = await artistService.getArtistDetails(artistId);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.json(artist);
  } catch (error) {
    logger.error({ err: error, artistId }, "getArtistDetails failed");
    res.status(500).json({ error: "Failed to get artist details" });
  }
};

const getAllArtists = async (req: any, res: any) => {
  try {
    const artists = await artistService.getAllArtists();
    res.json(artists);
  } catch (error) {
    logger.error({ err: error }, "getAllArtists failed");
    res.status(500).json({ error: "Failed to fetch artists" });
  }
};

export const artistController = {
  musicSearch,
  getArtistDetails,
  getAllArtists,
};
