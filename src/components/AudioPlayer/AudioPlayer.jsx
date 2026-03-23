import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer({ titulo, duracion, transcript, audioSrc, onPlayingChange, dark = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying]               = useState(false);
  const [progress, setProgress]             = useState(0);
  const [muted, setMuted]                   = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentTime, setCurrentTime]       = useState(0);
  const [audioDuration, setAudioDuration]   = useState(0);
  const [volume, setVolume]                 = useState(1);

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate    = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onEnded          = () => { setPlaying(false); onPlayingChange?.(false); };

    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended",          onEnded);

    return () => {
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended",          onEnded);
    };
  }, [audioSrc]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      onPlayingChange?.(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        onPlayingChange?.(true);
      } catch (e) {
        console.warn("No se pudo reproducir el audio:", e);
      }
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const handleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e) => {
    const val  = Number(e.target.value);
    setVolume(val);
    const audio = audioRef.current;
    if (audio) audio.volume = val;
  };

  const displayDuration = audioDuration ? formatTime(audioDuration) : duracion;

  const txt    = dark ? "rgba(249,249,249,0.9)"  : "#374151";
  const txtSub = dark ? "rgba(249,249,249,0.55)" : "#6B7280";
  const track  = dark ? "rgba(255,255,255,0.2)"  : "#e9d5ff";
  const border = dark ? "rgba(255,255,255,0.2)"  : "#e9d5ff";

  return (
    <div className="rounded-2xl space-y-3" style={{ background: "transparent" }}>
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
      )}

      {/* Título */}
      <div className="flex items-center gap-2">
        <div
          className={playing ? "pulse-dot" : ""}
          style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: dark ? "#E7D6D3" : "#c084fc", flexShrink: 0 }}
        />
        <span className="text-sm font-medium" style={{ color: txt }}>{titulo}</span>
      </div>

      {/* Barra de progreso */}
      <div
        className="w-full h-2 rounded-full cursor-pointer relative"
        style={{ backgroundColor: track }}
        onClick={handleSeek}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            background: dark
              ? "linear-gradient(to right, #E7D6D3, #A7B1B3)"
              : "linear-gradient(to right, #a855f7, #ec4899)",
          }}
        />
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow"
            style={{
              background: dark
                ? "linear-gradient(to right, #A7B1B3, #586E7D)"
                : "linear-gradient(to right, #a855f7, #ec4899)",
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="text-xs" style={{ color: txtSub }}>
            {formatTime(currentTime)} / {displayDuration}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleMute} style={{ color: txtSub }} className="hover:opacity-70 transition-opacity">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          {/* Regulador de volumen */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            style={{
              width: 64,
              accentColor: dark ? "#E7D6D3" : "#a855f7",
              cursor: "pointer",
            }}
          />
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: dark ? "#E7D6D3" : "#9333ea" }}
          >
            {showTranscript ? "Ocultar texto" : "Leer transcripción"}
          </button>
        </div>
      </div>



      {showTranscript && (
        <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${border}` }}>
          <p className="text-sm font-medium mb-2" style={{ color: txt }}>Transcripción:</p>
          <div className="text-sm leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto pr-1" style={{ color: txtSub }}>
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
}
