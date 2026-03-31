export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm bg-linear-30 from-gray-700 to-gray-900 opacity-85">
      <div className="bg-gray-900 text-amber-100 p-8 rounded-2xl shadow-2xl border border-amber-200 animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}
