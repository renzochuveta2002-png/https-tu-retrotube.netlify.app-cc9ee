import { useState, useEffect } from 'react';

export default function RetroTube2005() {
  // VIDEOS
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Cyber Café Perú 2005",
      channel: "RetroNet",
      views: "12,000 vistas",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "5:30",
      liked: false,
      liked_count: 234
    },
    {
      id: 2,
      title: "Motorola Java Portal",
      channel: "J2ME Perú",
      views: "8,400 vistas",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "3:45",
      liked: false,
      liked_count: 156
    },
    {
      id: 3,
      title: "Internet Cabina 2005",
      channel: "CabinaNet",
      views: "15,700 vistas",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "7:20",
      liked: false,
      liked_count: 445
    }
  ]);

  // ESTADOS PRINCIPALES
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchMode, setSearchMode] = useState('local');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState('all');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  
  // NUEVAS FUNCIONES ESENCIALES
  const [favorites, setFavorites] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([
    { id: 1, name: 'Mi Playlist', videos: [] }
  ]);

  const [newVideo, setNewVideo] = useState({
    title: '',
    channel: '',
    image: '',
    video: '',
    duration: '',
    source: ''
  });

  const [communities] = useState([
    { id: 'all', name: 'Todos', icon: '🌍' },
    { id: 'tech', name: 'Tecnología', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Música', icon: '🎵' },
    { id: 'art', name: 'Arte', icon: '🎨' }
  ]);

  // CARGAR FAVORITOS Y HISTORIAL DEL LOCAL STORAGE
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedHistory = JSON.parse(localStorage.getItem('watchHistory')) || [];
    setFavorites(savedFavorites);
    setWatchHistory(savedHistory);
  }, []);

  // GUARDAR FAVORITOS EN LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // GUARDAR HISTORIAL EN LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  // NOTIFICACIONES TEMPORALES
  const showNotif = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // BÚSQUEDA
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults(null);
      setSearchMode('local');
      return;
    }
    setSearchMode('local');
  };

  const handleSearchYouTubeDirect = () => {
    if (searchTerm.trim()) {
      setSearchMode('youtube');
      setSearchResults({ type: 'youtube', query: searchTerm });
    }
  };

  const handleSearchGoogleDirect = () => {
    if (searchTerm.trim()) {
      setSearchMode('google');
      setSearchResults({ type: 'google', query: searchTerm });
    }
  };

  const handleBackToLocal = () => {
    setSearchMode('local');
    setSearchResults(null);
  };

  // YOUTUBE
  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const extractYouTubeInfo = (url) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      return {
        title: `Video de YouTube (${videoId})`,
        channel: 'Canal de YouTube',
        image: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        video: url,
        duration: 'Desconocida',
        source: 'YouTube'
      };
    }
    return null;
  };

  const handleVideoUrlChange = (url) => {
    setNewVideo({ ...newVideo, video: url });
    const info = extractYouTubeInfo(url);
    if (info) {
      setNewVideo({ ...newVideo, ...info });
    }
  };

  // CONTENIDO
  const checkContent = (title, channel) => {
    const forbiddenWords = ['violencia', 'violento', 'sensual', 'ilegal', 'pornografía', 'droga', 'arma', 'muerte', 'asesinato'];
    const text = (title + ' ' + channel).toLowerCase();
    return forbiddenWords.some(word => text.includes(word));
  };

  // SUBIR VIDEO
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (videoFileUrl) {
      URL.revokeObjectURL(videoFileUrl);
    }
    setVideoFileUrl(url);
    setNewVideo({
      ...newVideo,
      video: url,
      title: newVideo.title || file.name.replace(/\.[^/.]+$/, ''),
      channel: newVideo.channel || 'Archivo local',
      source: 'Archivo local',
      duration: newVideo.duration || 'Desconocida',
      image: newVideo.image || 'https://via.placeholder.com/720x405?text=Video+Archivo'
    });
  };

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.channel && newVideo.video) {
      if (checkContent(newVideo.title, newVideo.channel)) {
        setWarningMessage('Advertencia: El contenido parece contener material sensible o potencialmente ilegal. ¿Deseas continuar?');
        setShowWarning(true);
        return;
      }
      const video = {
        id: videos.length + 1,
        ...newVideo,
        views: "0 vistas",
        image: newVideo.image || 'https://via.placeholder.com/720x405?text=Video+Archivo',
        liked: false,
        liked_count: 0
      };
      setVideos([...videos, video]);
      setNewVideo({ title: '', channel: '', image: '', video: '', duration: '', source: '' });
      setVideoFileUrl('');
      setShowModal(false);
      showNotif('✅ Video agregado correctamente');
    }
  };

  // DESCARGAR
  const handleDownload = (videoUrl) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'video.mp4';
    link.click();
    showNotif('📥 Descarga iniciada');
  };

  // ELIMINAR
  const handleDelete = (id) => {
    setVideos(videos.filter(v => v.id !== id));
    showNotif('🗑️ Video eliminado');
  };

  // FAVORITOS - NUEVA FUNCIÓN ESENCIAL
  const toggleFavorite = (video) => {
    const isFavorited = favorites.some(fav => fav.id === video.id);
    
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== video.id));
      showNotif('❌ Removido de favoritos');
    } else {
      setFavorites([...favorites, video]);
      showNotif('⭐ Agregado a favoritos');
    }

    // Actualizar like count
    const updatedVideos = videos.map(v => {
      if (v.id === video.id) {
        return {
          ...v,
          liked: !v.liked,
          liked_count: v.liked ? v.liked_count - 1 : v.liked_count + 1
        };
      }
      return v;
    });
    setVideos(updatedVideos);
  };

  const isFavorited = (videoId) => favorites.some(fav => fav.id === videoId);

  // HISTORIAL DE REPRODUCCIÓN - NUEVA FUNCIÓN ESENCIAL
  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    
    const existingHistory = watchHistory.filter(h => h.id !== video.id);
    const newHistory = [{ ...video, watchedAt: new Date().toISOString() }, ...existingHistory].slice(0, 20);
    setWatchHistory(newHistory);
  };

  // RENDERIZAR VIDEOS FAVORITOS
  const renderFavorites = () => {
    if (favorites.length === 0) {
      return <p className="text-center text-pink-300 py-10">No tienes favoritos aún</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {favorites.map((video) => (
          <div key={video.id} className="bg-gradient-to-br from-pink-100 to-purple-100 text-black rounded-md overflow-hidden border-4 border-pink-300 shadow-2xl hover:scale-105 transition duration-300">
            <div className="relative w-full h-52 bg-black overflow-hidden border-b-4 border-pink-300">
              <img src={video.image} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">⭐ FAV</div>
            </div>
            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg leading-tight text-black">{video.title}</h2>
              <p className="text-purple-700 text-sm font-bold">{video.channel}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handlePlayVideo(video)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm">Ver</button>
                <button onClick={() => toggleFavorite(video)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm">💔 Quitar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // RENDERIZAR HISTORIAL
  const renderHistory = () => {
    if (watchHistory.length === 0) {
      return <p className="text-center text-pink-300 py-10">No hay historial aún</p>;
    }
    return (
      <div className="p-6 space-y-3">
        {watchHistory.map((video) => (
          <div key={video.id} className="bg-gray-800 p-4 rounded-lg border-l-4 border-pink-400 hover:bg-gray-700 transition cursor-pointer" onClick={() => handlePlayVideo(video)}>
            <h3 className="text-white font-bold">{video.title}</h3>
            <p className="text-pink-200 text-sm">{video.channel}</p>
            <p className="text-gray-400 text-xs mt-1">Visto hace {new Date(video.watchedAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-red-700 text-white font-mono">
      {/* NOTIFICACIÓN */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-[999]">
          {showNotification}
        </div>
      )}

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-pink-300 bg-gradient-to-r from-purple-900 to-pink-900 shadow-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-pink-300 text-black w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-white">R</div>
          <h1 className="text-3xl font-bold tracking-wide text-pink-300 drop-shadow-lg">🎥 RetroTube 2005</h1>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input type="text" placeholder="Buscar videos..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="bg-white text-black border-4 border-pink-300 rounded-md px-5 py-2 flex-1 outline-none shadow-lg focus:ring-2 focus:ring-pink-500" />
          {searchMode === 'local' && (
            <>
              <button onClick={handleSearchYouTubeDirect} className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md font-bold border-2 border-white shadow-lg text-sm transition" title="Buscar en YouTube">YT</button>
              <button onClick={handleSearchGoogleDirect} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md font-bold border-2 border-white shadow-lg text-sm transition" title="Buscar en Google">GG</button>
            </>
          )}
          {searchMode !== 'local' && <button onClick={handleBackToLocal} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md font-bold border-2 border-white shadow-lg text-sm transition" title="Volver">← Atrás</button>}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowFavorites(!showFavorites)} className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-md font-bold border-2 border-white transition" title="Favoritos">⭐</button>
          <button onClick={() => setShowHistory(!showHistory)} className="bg-purple-500 hover:bg-purple-400 text-white px-3 py-2 rounded-md font-bold border-2 border-white transition" title="Historial">📺</button>
          <button onClick={() => setShowModal(true)} className="bg-pink-400 hover:bg-pink-300 text-black transition px-5 py-2 rounded-md font-bold border-2 border-white shadow-lg">Subir</button>
        </div>
      </header>

      {/* SECCIÓN FAVORITOS */}
      {showFavorites && (
        <section className="bg-gradient-to-r from-red-900 to-pink-900 border-b-4 border-pink-300 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-pink-300">⭐ MIS FAVORITOS ({favorites.length})</h2>
            <button onClick={() => setShowFavorites(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold">Cerrar</button>
          </div>
          {renderFavorites()}
        </section>
      )}

      {/* SECCIÓN HISTORIAL */}
      {showHistory && (
        <section className="bg-gradient-to-r from-purple-900 to-blue-900 border-b-4 border-blue-300 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-blue-300">📺 HISTORIAL DE REPRODUCCIÓN ({watchHistory.length})</h2>
            <button onClick={() => setShowHistory(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold">Cerrar</button>
          </div>
          {renderHistory()}
        </section>
      )}

      {/* MODAL SUBIR VIDEO */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-pink-800 p-6 rounded-md border-4 border-pink-300 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-pink-300 mb-4">Subir Nuevo Video</h2>
            <div className="space-y-4">
              <input type="text" placeholder="URL del video (YouTube, etc.)" value={newVideo.video} onChange={(e) => handleVideoUrlChange(e.target.value)} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
              <label className="block text-sm text-pink-100">Subir video desde archivos</label>
              <input type="file" accept="video/*" onChange={handleFileUpload} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
              <input type="text" placeholder="Título del video" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
              <input type="text" placeholder="Canal" value={newVideo.channel} onChange={(e) => setNewVideo({...newVideo, channel: e.target.value})} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
              <input type="text" placeholder="URL de la imagen" value={newVideo.image} onChange={(e) => setNewVideo({...newVideo, image: e.target.value})} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
              <input type="text" placeholder="Duración (ej: 5:30)" value={newVideo.duration} onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})} className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleAddVideo} className="flex-1 bg-pink-400 hover:bg-pink-300 text-black py-2 rounded font-bold border-2 border-white transition">Agregar</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded font-bold border-2 border-white transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADVERTENCIA */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-800 to-orange-800 p-6 rounded-md border-4 border-red-300 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-300 mb-4">⚠️ Advertencia</h2>
            <p className="text-white mb-6">{warningMessage}</p>
            <div className="flex gap-2">
              <button onClick={() => { setShowWarning(false); const video = { id: videos.length + 1, ...newVideo, views: "0 vistas" }; setVideos([...videos, video]); setNewVideo({ title: '', channel: '', image: '', video: '', duration: '', source: '' }); setShowModal(false); }} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold border-2 border-white transition">Continuar</button>
              <button onClick={() => setShowWarning(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded font-bold border-2 border-white transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* BÚSQUEDA YOUTUBE */}
      {searchMode === 'youtube' && searchResults && (
        <section className="px-6 py-6 bg-black/40 border-b-4 border-red-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-red-400">🎬 YouTube: "{searchResults.query}"</h2>
            <button onClick={handleBackToLocal} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold border-2 border-white transition">← Volver</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-black rounded-lg overflow-hidden border-2 border-red-400 hover:border-red-300 hover:scale-105 transition">
                <div className="h-40 bg-red-900 flex items-center justify-center"><p className="text-red-200 text-sm">Resultado {i}</p></div>
                <div className="p-3">
                  <p className="text-white font-bold text-sm truncate">Video "{searchResults.query}" #{i}</p>
                  <button onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchResults.query)}`, '_blank')} className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white py-1 rounded text-xs font-bold border border-white transition">Ver en YouTube</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BÚSQUEDA GOOGLE */}
      {searchMode === 'google' && searchResults && (
        <section className="px-6 py-6 bg-black/40 border-b-4 border-blue-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-400">🔍 Google: "{searchResults.query}"</h2>
            <button onClick={handleBackToLocal} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold border-2 border-white transition">← Volver</button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-blue-900/40 rounded-lg p-4 border-l-4 border-blue-400 hover:bg-blue-900/60 transition">
                <p className="text-blue-300 font-bold text-sm">Resultado {i}: {searchResults.query}</p>
                <button onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchResults.query)}`, '_blank')} className="mt-2 text-blue-400 hover:text-blue-300 text-xs font-bold underline transition">Ir a Google →</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* REPRODUCTOR VIDEO */}
      {selectedVideo && (
        <section className="px-6 py-6">
          <div className="bg-black/80 rounded-3xl border-4 border-pink-300 p-5 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div><h2 className="text-2xl font-bold text-pink-300">Reproduciendo ahora</h2><p className="text-white/80 mt-2">{selectedVideo.title}</p></div>
              <button onClick={() => setSelectedVideo(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-bold border-2 border-white transition">Cerrar</button>
            </div>
            <div className="mt-5 rounded-3xl overflow-hidden bg-black">
              {extractYouTubeId(selectedVideo.video) ? (
                <div className="relative pt-[56.25%]">
                  <iframe src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.video)}`} className="absolute inset-0 w-full h-full" title={selectedVideo.title} allowFullScreen />
                </div>
              ) : (
                <video controls src={selectedVideo.video} className="w-full h-full">Tu navegador no soporta video</video>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => toggleFavorite(selectedVideo)} className={`flex-1 py-2 rounded font-bold border-2 border-white transition ${isFavorited(selectedVideo.id) ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'} text-white`}>{isFavorited(selectedVideo.id) ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}</button>
              <button onClick={() => handleDownload(selectedVideo.video)} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold border-2 border-white transition">📥 Descargar</button>
            </div>
          </div>
        </section>
      )}

      {/* COMUNIDADES */}
      <section className="px-6 py-4 bg-black/40 border-b-2 border-pink-300">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {communities.map((com) => (
            <button key={com.id} onClick={() => setActiveCommunity(com.id)} className={`whitespace-nowrap px-4 py-2 rounded-full font-bold border-2 transition ${activeCommunity === com.id ? 'bg-pink-500 border-white text-white' : 'bg-white/10 border-white/30 text-white hover:border-white'}`}>
              {com.icon} {com.name}
            </button>
          ))}
        </div>
      </section>

      {/* VIDEOS */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="bg-gradient-to-br from-pink-100 to-purple-100 text-black rounded-md overflow-hidden border-4 border-pink-300 shadow-2xl hover:scale-105 transition duration-300">
              <div className="relative w-full h-52 bg-black overflow-hidden border-b-4 border-pink-300">
                <img src={video.image} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold rounded">{video.duration}</div>
              </div>
              <div className="p-4 space-y-2">
                <h2 className="font-bold text-lg leading-tight text-black">{video.title}</h2>
                <p className="text-purple-700 text-sm font-bold">{video.channel}</p>
                <p className="text-gray-600 text-sm">{video.views} • ❤️ {video.liked_count}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handlePlayVideo(video)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm">Ver</button>
                  <button onClick={() => toggleFavorite(video)} className={`flex-1 py-2 rounded-md font-bold border-2 border-white transition text-sm ${isFavorited(video.id) ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'} text-white`}>{isFavorited(video.id) ? '❤️' : '🤍'}</button>
                  <button onClick={() => handleDownload(video.video)} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm">📥</button>
                  <button onClick={() => handleDelete(video.id)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm">🗑️</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20"><p className="text-2xl text-pink-300 font-bold">No se encontraron videos</p></div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t-4 border-pink-300 text-center text-pink-200 py-6 mt-10 bg-gradient-to-r from-red-800 via-purple-800 to-pink-700 font-bold space-y-2">
        <div>
          <p className="text-lg">🎥 RetroTube 2005 - Tu Plataforma de Videos Retro</p>
          <p className="text-sm text-pink-100">Comunidad de creadores • Videos sin límites • Nostalgia 2005</p>
        </div>
        <p className="text-xs text-pink-300">© 2026 RetroTube 2005. Todos los derechos reservados. | Plataforma libre de anuncios</p>
      </footer>
    </div>
  );
}
