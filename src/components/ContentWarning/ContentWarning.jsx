import { AlertTriangle, X } from "lucide-react";

export default function ContentWarning({ onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <h2 className="font-semibold text-gray-800 text-lg">
            Advertencia de contenido
          </h2>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Este testimonio contiene relatos sobre{" "}
          <strong>violencia sexual</strong>. Puede ser difícil de escuchar.
        </p>

        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Puedes elegir continuar, pausar cuando necesites, o escuchar otro
          testimonio. No hay ninguna forma incorrecta de cuidarte.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Quiero continuar
          </button>
          <button
            onClick={onDecline}
            className="w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition-colors"
          >
            Prefiero ver otro testimonio
          </button>
        </div>
      </div>
    </div>
  );
}
