import { useState } from 'react';

export default function RenzoTube() {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Cyber Café Perú 2005",
      channel: "RetroNet",
      views: "12,000 vistas",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "5:30"
    },
    {
      id: 2,
      title: "Motorola Java Portal",
      channel: "J2ME Perú",
      views: "8,400 vistas",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "3:45"
    },
    {
      id: 3,
      title: "Internet Cabina 2005",
      channel: "CabinaNet",
      views: "15,700 vistas",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "7:20"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    channel: '',
    image: '',
    video: '',
    duration: '',
    source: ''
  });

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [activeCommunity, setActiveCommunity] = useState('all');
  const [communities] = useState([
    { id: 'all', name: 'Todos', icon: '🌍' },
    { id: 'tech', name: 'Tecnología', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Música', icon: '🎵' },
    { id: 'art', name: 'Arte', icon: '🎨' }
  ]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleDelete = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const checkContent = (title, channel) => {
    const forbiddenWords = ['violencia', 'violento', 'sensual', 'ilegal', 'pornografía', 'droga', 'arma', 'muerte', 'asesinato'];
    const text = (title + ' ' + channel).toLowerCase();
    return forbiddenWords.some(word => text.includes(word));
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
        image: newVideo.image || 'https://via.placeholder.com/720x405?text=Video+Archivo'
      };
      setVideos([...videos, video]);
      setNewVideo({ title: '', channel: '', image: '', video: '', duration: '', source: '' });
      setVideoFileUrl('');
      setShowModal(false);
    }
  };

  const handleDownload = (videoUrl) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'video.mp4';
    link.click();
  };

  const handleSearchYouTube = () => {
    if (searchTerm.trim()) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`, '_blank');
    }
  };

  const handleSearchGoogle = () => {
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm + ' video')}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-red-700 text-white font-mono">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-pink-300 bg-gradient-to-r from-purple-900 to-pink-900 shadow-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-pink-300 text-black w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg border-2 border-white">
            R
          </div>
          <h1 className="text-3xl font-bold tracking-wide text-pink-300 drop-shadow-lg">🎥 RenzoTube</h1>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white text-black border-4 border-pink-300 rounded-md px-5 py-2 flex-1 outline-none shadow-lg focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSearchYouTube}
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md font-bold border-2 border-white shadow-lg text-sm"
          >
            YT
          </button>
          <button
            onClick={handleSearchGoogle}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md font-bold border-2 border-white shadow-lg text-sm"
          >
            GG
          </button>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-400 hover:bg-pink-300 text-black transition px-5 py-2 rounded-md font-bold border-2 border-white shadow-lg"
        >
          Subir
        </button>
      </header>

      {/* MODAL PARA SUBIR VIDEO */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-800 to-pink-800 p-6 rounded-md border-4 border-pink-300 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-pink-300 mb-4">Subir Nuevo Video</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="URL del video (YouTube, etc.)"
                value={newVideo.video}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              <label className="block text-sm text-pink-100">Subir video desde archivos</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Título del video"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Canal"
                value={newVideo.channel}
                onChange={(e) => setNewVideo({...newVideo, channel: e.target.value})}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="URL de la imagen (thumbnail)"
                value={newVideo.image}
                onChange={(e) => setNewVideo({...newVideo, image: e.target.value})}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Duración (ej: 5:30)"
                value={newVideo.duration}
                onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})}
                className="w-full bg-white text-black border-2 border-pink-300 rounded px-3 py-2"
              />
              {newVideo.source && (
                <p className="text-pink-200 text-sm">Fuente: {newVideo.source}</p>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddVideo}
                className="flex-1 bg-pink-400 hover:bg-pink-300 text-black py-2 rounded font-bold border-2 border-white"
              >
                Agregar Video
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded font-bold border-2 border-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ADVERTENCIA */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-800 to-orange-800 p-6 rounded-md border-4 border-red-300 shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-300 mb-4">⚠️ Advertencia de Contenido</h2>
            <p className="text-white mb-6">{warningMessage}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowWarning(false);
                  const video = {
                    id: videos.length + 1,
                    ...newVideo,
                    views: "0 vistas"
                  };
                  setVideos([...videos, video]);
                  setNewVideo({ title: '', channel: '', image: '', video: '', duration: '', source: '' });
                  setShowModal(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold border-2 border-white"
              >
                Continuar
              </button>
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded font-bold border-2 border-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <section className="px-6 py-6">
          <div className="bg-black/80 rounded-3xl border-4 border-pink-300 p-5 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-pink-300">Reproduciendo ahora</h2>
                <p className="text-white/80 mt-2">{selectedVideo.title}</p>
                <p className="text-pink-200 text-sm mt-1">{selectedVideo.channel} · {selectedVideo.source || 'Origen'} · {selectedVideo.duration}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-bold border-2 border-white"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-5 rounded-3xl overflow-hidden bg-black">
              {extractYouTubeId(selectedVideo.video) ? (
                <div className="relative pt-[56.25%]">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.video)}`}
                    className="absolute inset-0 w-full h-full"
                    title={selectedVideo.title}
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  controls
                  src={selectedVideo.video}
                  className="w-full h-full"
                >
                  Tu navegador no soporta el reproductor de video integrado.
                </video>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-pink-300 mb-3">Lista de reproducción</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group text-left rounded-2xl overflow-hidden border-2 transition ${selectedVideo.id === video.id ? 'border-pink-300 bg-pink-50/20' : 'border-transparent bg-white/10 hover:border-pink-300 hover:bg-white/20'}`}
                  >
                    <div className="relative h-24 overflow-hidden bg-black">
                      <img
                        src={video.image || 'https://via.placeholder.com/720x405?text=Mini+Video'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-white truncate">{video.title}</p>
                      <p className="text-xs text-pink-200 truncate mt-1">{video.channel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COMUNIDADES */}
      <section className="px-6 py-4 bg-black/40 border-b-2 border-pink-300">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {communities.map((com) => (
            <button
              key={com.id}
              onClick={() => setActiveCommunity(com.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-bold border-2 transition ${
                activeCommunity === com.id
                  ? 'bg-pink-500 border-white text-white'
                  : 'bg-white/10 border-white/30 text-white hover:border-white'
              }`}
            >
              {com.icon} {com.name}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-gradient-to-br from-pink-100 to-purple-100 text-black rounded-md overflow-hidden border-4 border-pink-300 shadow-2xl hover:scale-105 transition duration-300"
            >
              {/* IMAGEN O VIDEO */}
              <div className="relative w-full h-52 bg-black overflow-hidden border-b-4 border-pink-300">
                <img
                  src={video.image || 'https://via.placeholder.com/720x405?text=Video+Archivo'}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold rounded">
                  {video.duration}
                </div>
              </div>

              {/* INFO */}
              <div className="p-4 space-y-2">
                <h2 className="font-bold text-lg leading-tight text-black">
                  {video.title}
                </h2>

                <p className="text-purple-700 text-sm font-bold">
                  {video.channel}
                </p>

                <p className="text-gray-600 text-sm">{video.views}</p>

                {/* BOTONES */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleDownload(video.video)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm"
                  >
                    📥 Descargar
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-md font-bold border-2 border-white transition text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-2xl text-pink-300 font-bold">No se encontraron videos</p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t-4 border-pink-300 text-center text-pink-200 py-6 mt-10 bg-gradient-to-r from-red-800 via-purple-800 to-pink-700 font-bold space-y-2">
        <div>
          <p className="text-lg">🎥 RenzoTube - Tu Plataforma de Videos Retro</p>
          <p className="text-sm text-pink-100">Comunidad de creadores • Videos sin límites • Nostalgia 2005</p>
        </div>
        <p className="text-xs text-pink-300">© 2026 RenzoTube. Todos los derechos reservados. | Hecho con ❤️ por Renzo</p>
      </footer>
    </div>
  );
}