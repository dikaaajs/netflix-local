export const getGenresForSeries = (seriesId: string) => {
  const genres = localStorage.getItem("genres");
  const parsedGenres = genres ? JSON.parse(genres) : null;
  if (!parsedGenres) return []; // Return empty array if genres are not found
  return parsedGenres
    .filter((genre: any) =>
      genre.value.some((video: any) => video.id === seriesId)
    )
    .map((genre: any) => genre.name); // Ambil hanya nama genre
};
