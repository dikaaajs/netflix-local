"use client";

import { useState, useEffect } from "react";
import type { VideoSeries } from "@/lib/types";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Genre = {
  name: string;
  value: VideoSeries[];
};

interface GenreManagerProps {
  availableSeries: VideoSeries[];
}

export default function GenreManager({ availableSeries }: GenreManagerProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState<string>("");
  const [editingGenre, setEditingGenre] = useState<string | null>(null);
  const [editedGenreName, setEditedGenreName] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Load genres from localStorage on initial render
  useEffect(() => {
    const savedGenres = localStorage.getItem("genres");
    if (savedGenres) {
      setGenres(JSON.parse(savedGenres));
    }
  }, []);

  // Function to add a new genre
  const addGenre = () => {
    if (!newGenreName.trim()) return;

    const newGenre: Genre = { name: newGenreName.trim(), value: [] };

    // Add the new genre to the genres list
    const updatedGenres = [...genres, newGenre];
    setGenres(updatedGenres);

    // Save updated genres to localStorage
    localStorage.setItem("genres", JSON.stringify(updatedGenres));

    setNewGenreName(""); // Reset input field
  };

  // Function to add a video series to an existing genre
  const addToGenre = (genreName: string, video: VideoSeries) => {
    // Check if video already exists in the genre
    const genreToUpdate = genres.find((g) => g.name === genreName);
    if (genreToUpdate && genreToUpdate.value.some((v) => v.id === video.id)) {
      return; // Video already exists in this genre
    }

    const updatedGenres = genres.map((genre) => {
      if (genre.name === genreName) {
        // Add the video to the genre's value array
        return { ...genre, value: [...genre.value, video] };
      }
      return genre;
    });

    setGenres(updatedGenres);

    // Save updated genres to localStorage
    localStorage.setItem("genres", JSON.stringify(updatedGenres));

    setIsAddDialogOpen(false);
  };

  // Function to remove a video from a genre
  const removeFromGenre = (genreName: string, videoId: string) => {
    const updatedGenres = genres.map((genre) => {
      if (genre.name === genreName) {
        return {
          ...genre,
          value: genre.value.filter((video) => video.id !== videoId),
        };
      }
      return genre;
    });

    setGenres(updatedGenres);
    localStorage.setItem("genres", JSON.stringify(updatedGenres));
  };

  // Function to delete a genre
  const deleteGenre = (genreName: string) => {
    const updatedGenres = genres.filter((genre) => genre.name !== genreName);
    setGenres(updatedGenres);
    localStorage.setItem("genres", JSON.stringify(updatedGenres));
  };

  // Function to edit a genre name
  const startEditGenre = (genreName: string) => {
    setEditingGenre(genreName);
    setEditedGenreName(genreName);
  };

  const saveEditGenre = () => {
    if (!editingGenre || !editedGenreName.trim()) return;

    const updatedGenres = genres.map((genre) => {
      if (genre.name === editingGenre) {
        return { ...genre, name: editedGenreName.trim() };
      }
      return genre;
    });

    setGenres(updatedGenres);
    localStorage.setItem("genres", JSON.stringify(updatedGenres));
    setEditingGenre(null);
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Genre Manager</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create New Genre
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 text-white border-neutral-800">
              <DialogHeader>
                <DialogTitle>Create New Genre</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2 mt-4">
                <Input
                  className="bg-neutral-800 border-neutral-700 text-white"
                  value={newGenreName}
                  onChange={(e) => setNewGenreName(e.target.value)}
                  placeholder="Enter genre name"
                />
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={() => {
                    addGenre();
                  }}
                >
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {genres.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900 rounded-lg">
            <p className="text-neutral-400">
              No genres created yet. Create your first genre to organize your
              videos.
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {genres.map((genre) => (
              <AccordionItem
                key={genre.name}
                value={genre.name}
                className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900"
              >
                <div className="flex items-center justify-between px-4">
                  <AccordionTrigger className="py-4 text-lg font-medium hover:no-underline">
                    {editingGenre === genre.name ? (
                      <Input
                        className="bg-neutral-800 border-neutral-700 text-white max-w-xs"
                        value={editedGenreName}
                        onChange={(e) => setEditedGenreName(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditGenre();
                          }
                        }}
                      />
                    ) : (
                      <span>{genre.name}</span>
                    )}
                  </AccordionTrigger>

                  <div className="flex items-center gap-2">
                    {editingGenre === genre.name ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEditGenre();
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Dialog
                          open={isAddDialogOpen}
                          onOpenChange={setIsAddDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                            <DialogHeader>
                              <DialogTitle>
                                Add Video to {genre.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 max-h-[60vh] overflow-y-auto">
                              {availableSeries.map((series) => (
                                <div
                                  key={series.id}
                                  className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-md mb-2"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {series.title}
                                    </p>
                                    <p className="text-sm text-neutral-400">
                                      {series.episodeCount} episodes
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      addToGenre(genre.name, series)
                                    }
                                    disabled={genre.value.some(
                                      (v) => v.id === series.id
                                    )}
                                  >
                                    {genre.value.some((v) => v.id === series.id)
                                      ? "Added"
                                      : "Add"}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditGenre(genre.name);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGenre(genre.name);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <AccordionContent className="px-4 pb-4">
                  {genre.value.length === 0 ? (
                    <p className="text-neutral-400 text-center py-4">
                      No videos in this genre yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {genre.value.map((video) => (
                        <Card
                          key={video.id}
                          className="bg-neutral-800 border-neutral-700"
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="w-16 h-16 bg-neutral-700 rounded flex-shrink-0 flex items-center justify-center">
                              {video.thumbnail ? (
                                <img
                                  src={`/api/thumbnail/${video.id}`}
                                  alt={video.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <span>{video.title.charAt(0)}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1">
                                {video.title}
                              </h4>
                              <p className="text-sm text-neutral-400">
                                {video.episodeCount} episodes
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-400"
                              onClick={() =>
                                removeFromGenre(genre.name, video.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
