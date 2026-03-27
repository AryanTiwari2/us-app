import React, { useState, useEffect } from "react";
import { apiConfig, colorMap, constants } from "../constants";
import Cookies from "universal-cookie";
import { cookieName } from "../constants";
import { showAlert } from "../utils";
import axios from "axios";
import { MovieCard } from "./MovieCard";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];

export default function Movies({ colorKey = "blue", roomName, userName, setLoading, getSignOut, userType }) {


  const emptyForm = {
    movieName: "", watchLink: "", genre: "",
    votes: 0, thumbnail: "", description: ""
  };

  const color = colorMap[colorKey] || colorMap["blue"];
  const cookies = new Cookies();

  const [showModal, setShowModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");
  const [movieView, setMovieView] = useState("room"); // "all" | "mine" | "room"
  const [moviesByUser, setMoviesByUser] = useState([]);
  const [moviesByRoom, setMoviesByRoom] = useState([]);

  // Permission checks
  const canDelete = userType === "ADMIN" || userType === "MODERATOR";
  const canEdit = (movie) =>
    movie.username === userName && movie.roomName === roomName;

  const openAdd = () => { setEditMovie(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
  const openEdit = (m) => {
    setEditMovie(m);
    setForm({
      movieName: m.movie.movieName,
      watchLink: m.movie.watchLink,
      genre: m.movie.genre,
      votes: m.movie.votes,
      thumbnail: m.movie.thumbnail,
      description: m.movie.description,
    });
    setErrors({});
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditMovie(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.movieName.trim()) e.name = "Required";
    if (!form.watchLink.trim()) e.link = "Required";
    if (!form.genre) e.genre = "Required";
    return e;
  };

  const sourceMovies =
    movieView === "mine" ? moviesByUser :
      movieView === "room" ? moviesByRoom :
        [];

  const filtered = sourceMovies.filter(m => {
    const gMatch = filterGenre === "All" || m.movie.genre === filterGenre;
    const sMatch = m.movie.movieName.toLowerCase().includes(search.toLowerCase());
    return gMatch && sMatch;
  });

  const createMovie = async () => {
    try {
      const token = cookies.get(cookieName.authToken);
      const response = await axios({
        url: apiConfig.backendbaseUrl + apiConfig.path.createMovie,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        data: form
      });
      return response.data;
    } catch (error) {
      console.error("Error creating movie:", error);
      showAlert({
        type: "error",
        message: error?.response?.data?.message
      });
    }
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    if (editMovie) {
      await handleUpdate(editMovie.movie.id);
    } else {
      await createMovie();
    }
    await getMovies();
    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      const token = cookies.get(cookieName.authToken);
      await axios({
        url: apiConfig.backendbaseUrl + apiConfig.path.deleteMovie + "/" + id,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token }
      });
      await getMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
      showAlert({
        type: "error",
        message: error?.response?.data?.message
      });
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = cookies.get(cookieName.authToken);
      const response = await axios({
        url: apiConfig.backendbaseUrl + apiConfig.path.updateMovie + "/" + id,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        data: form
      });
      return response.data;
    } catch (error) {
      console.error("Error updating movie:", error);
      showAlert({
        type: "error",
        message: error?.response?.data?.message
      });
    }
  };

  const getMoviesByRoomName = async () => {
    try {
      const token = cookies.get(cookieName.authToken);
      const response = await axios({
        url: apiConfig.backendbaseUrl + apiConfig.path.getMoviesByRoomName,
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'token': token }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by room name:", error);
      getSignOut();
    }
  };

  const getMoviesByUserName = async () => {
    try {
      const token = cookies.get(cookieName.authToken);
      const response = await axios({
        url: apiConfig.backendbaseUrl + apiConfig.path.getMoviesByUserName,
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'token': token }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movies by username:", error);
      getSignOut();
    }
  };

  const getMovies = async () => {
    setLoading(true);
    const response1 = await getMoviesByUserName();
    const response2 = await getMoviesByRoomName();
    setMoviesByUser(response1 || []);
    setMoviesByRoom(response2 || []);
    setLoading(false);
  };

  useEffect(() => {
    getMovies();
  }, [roomName, userName]);

  return (
    <div className="h-full rounded-2xl p-2 lg:p-5 shadow-2xl" style={{ backgroundColor: color.bg }}>
      <div className="shadow-2xl rounded-2xl h-full overflow-hidden lg:rounded-3xl" style={{ background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})` }}>

        {/* Header - responsive sizing */}
        <div className="pt-3 lg:pt-6 pb-3 lg:pb-4 sticky top-0 z-10 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm">
          <h3 className="text-xl lg:text-2xl font-bold text-center leading-tight mb-0.5 lg:mb-1 bg-gradient-to-r from-white via-white/80 to-transparent bg-clip-text" style={{ color: color.textColor }}>
            {userName}
          </h3>
          <h4 className="text-base lg:text-lg font-semibold text-center tracking-wide opacity-90" style={{ color: color.textColor }}>
            {roomName}
          </h4>
        </div>

        {/* Main Panel */}
        <div className="flex flex-col h-[calc(100%-3.5rem)] lg:h-[calc(100%-6rem)] rounded-2xl -mt-2 lg:-mt-4 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/50 lg:rounded-3xl">

          {/* Search + Filters + Add */}
          <div className="px-4 lg:px-6 pb-4 lg:pb-5 pt-4 lg:pt-6 flex flex-col gap-3 lg:gap-4">

            {/* Search + Add - responsive */}
            <div className="flex gap-2 lg:gap-3 items-center bg-white/50 rounded-2xl p-1 shadow-lg border border-[color.bg]/30" style={{ backgroundColor: color.bg }}>
              <input
                className="flex-1 bg-white rounded-xl lg:rounded-2xl px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none shadow-sm focus:shadow-md transition-all duration-300 placeholder-gray-400"
                style={{
                  border: `2px solid transparent`,
                  color: color.messageColor,
                  boxShadow: `0 4px 20px ${color.background}10`
                }}
                placeholder="Search movies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})`, color: color.textColor }}
                onClick={openAdd}
              >
                + Add
              </button>
            </div>

            {/* View Toggle - responsive */}
            <div className="flex rounded-2xl shadow-lg overflow-hidden bg-white/50 border border-[color.bg]/30" style={{ boxShadow: `0 8px 25px ${color.background}15` }}>
              {[["room", "Room"], ["mine", "Mine"]].map(([val, label]) => (
                <button
                  key={val}
                  className="flex-1 py-2.5 lg:py-3 px-3 lg:px-4 transition-all duration-300 font-bold relative overflow-hidden group text-sm lg:text-base"
                  style={{
                    background: movieView === val ? `linear-gradient(135deg, ${color.background}, ${color.messageColor})` : 'transparent',
                    color: movieView === val ? color.textColor : color.messageColor,
                    boxShadow: movieView === val ? `0 4px 15px ${color.background}30` : 'none'
                  }}
                  onClick={() => setMovieView(val)}
                >
                  {movieView === val && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  )}
                  {label}
                </button>
              ))}
            </div>

            {/* Genre Filter - responsive */}
            <div className="relative">
              <select
                className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base focus:outline-none bg-white shadow-lg hover:shadow-xl transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10 lg:pr-12"
                style={{
                  border: `2px solid ${color.bg}`,
                  color: color.messageColor,
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(color.messageColor)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  boxShadow: `0 4px 20px ${color.background}10`
                }}
                value={filterGenre}
                onChange={e => setFilterGenre(e.target.value)}
              >
                <option value="All">All Genres</option>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>

            <p className="text-xs lg:text-sm text-gray-500 text-right font-medium tracking-wide">
              {filtered.length} movies found
            </p>
          </div>

          {/* Movie List - responsive scrollbar */}
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4 lg:pb-6 max-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-20rem)] flex flex-col gap-2 lg:gap-3 scrollbar-thin scrollbar-thumb-[color.bg]/50 scrollbar-track-white/50 [-webkit-scrollbar-thumb:rounded] [-webkit-scrollbar-track:rounded] snap-y snap-mandatory">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] py-8 snap-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: color.bg }}>
                    <span className="text-2xl lg:text-3xl" style={{ color: color.background }}>🎬</span>
                  </div>
                  <p className="text-base lg:text-lg font-semibold text-gray-500 mb-1">No movies found</p>
                  <p className="text-gray-400 text-sm">Add one to get started!</p>
                </div>
              ) : (
                filtered.map(movie => (
                  <div key={movie.movie.id} className="snap-center w-full h-auto">
                    <MovieCard
                      movie={movie}
                      color={color}
                      onEdit={canEdit(movie) ? () => openEdit(movie) : null}
                      onDelete={canDelete || canEdit(movie) ? () => handleDelete(movie.movie.id) : null}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Modal - fully responsive */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 backdrop-blur-sm" style={{ background: `rgba(0,0,0,0.4)` }}>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-md lg:max-w-2xl max-h-[95vh] overflow-hidden border border-white/50">
            <div className="flex items-center justify-between px-5 lg:px-8 py-4 lg:py-6 bg-gradient-to-r from-white/50 to-white/20 border-b border-white/50">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text" style={{
                backgroundImage: `linear-gradient(135deg, ${color.background}, ${color.messageColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {editMovie ? "Edit Movie" : "Add Movie"}
              </h2>
              <button
                className="p-2 lg:p-3 rounded-xl lg:rounded-2xl hover:bg-white/50 transition-all duration-200 hover:scale-110 text-lg lg:text-xl backdrop-blur-sm"
                onClick={closeModal}
                style={{ color: color.messageColor }}
              >
                ✕
              </button>
            </div>

            <div className="px-5 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <FormField label="Movie Name *" error={errors.name}>
                <input
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md"
                  style={{ border: `2px solid ${errors.name ? '#ef4444' : color.bg}`, color: color.messageColor }}
                  placeholder="e.g. Inception"
                  value={form.movieName}
                  onChange={e => setForm({ ...form, movieName: e.target.value })}
                />
              </FormField>

              <FormField label="Watch Link *" error={errors.link}>
                <input
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md"
                  style={{ border: `2px solid ${errors.link ? '#ef4444' : color.bg}`, color: color.messageColor }}
                  placeholder="https://..."
                  value={form.watchLink}
                  onChange={e => setForm({ ...form, watchLink: e.target.value })}
                />
              </FormField>

              <FormField label="Genre *" error={errors.genre}>
                <select
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md appearance-none bg-no-repeat bg-right pr-10 lg:pr-12"
                  style={{
                    border: `2px solid ${errors.genre ? '#ef4444' : color.bg}`,
                    color: color.messageColor,
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(color.messageColor)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                  }}
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                >
                  <option value="">Select genre</option>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </FormField>

              <FormField label="Initial Votes">
                <input
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md"
                  style={{ border: `2px solid ${color.bg}`, color: color.messageColor }}
                  type="number" min="0"
                  value={form.votes}
                  onChange={e => setForm({ ...form, votes: parseInt(e.target.value) || 0 })}
                />
              </FormField>

              <FormField label="Thumbnail URL" className="lg:col-span-2">
                <input
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md"
                  style={{ border: `2px solid ${color.bg}`, color: color.messageColor }}
                  placeholder="https://image-url.com/..."
                  value={form.thumbnail}
                  onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                />
              </FormField>

              <FormField label="Description" className="lg:col-span-2">
                <textarea
                  className="w-full rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-base lg:text-lg font-medium shadow-lg focus:shadow-xl focus:outline-none transition-all duration-300 hover:shadow-md resize-vertical min-h-[80px] lg:min-h-[100px]"
                  style={{ border: `2px solid ${color.bg}`, color: color.messageColor }}
                  placeholder="Short description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </FormField>
            </div>

            <div className="px-5 lg:px-8 py-4 lg:py-6 border-t border-white/30 bg-gradient-to-r from-white/50 to-white/20 flex flex-col sm:flex-row justify-end gap-3 lg:gap-3">
              <button
                className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-base lg:text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200"
                style={{ color: color.messageColor }}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-base lg:text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})`, color: color.textColor }}
                onClick={handleSubmit}
              >
                {editMovie ? "Save Changes" : "Add Movie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, error, className, children }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="block text-xs lg:text-sm font-semibold text-gray-700 tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs lg:text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}