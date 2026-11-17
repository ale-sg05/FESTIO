export interface ArtistImageDto {
  url: string;
  height: number;
  width: number;
}

export interface TopTrackDto {
  id: string;
  name: string;
  album: string;
  durationMs: number;
}

export interface ArtistDto {
  id: string;
  name: string;
  images: ArtistImageDto[];
  topTracks: TopTrackDto[];
}
