export const getGenresForSeries = (seriesId: string) => {
  const genres = localStorage.getItem("genres");
  const parsedGenres = genres ? JSON.parse(genres) : null;
  console.log(parsedGenres);
  return parsedGenres
    .filter((genre: any) =>
      genre.value.some((video: any) => video.id === seriesId)
    )
    .map((genre: any) => genre.name); // Ambil hanya nama genre
};
