export default function MaterialVideoPlayer({ videoUrl }) {
  return (
    <div className="lg:col-span-3 bg-black rounded-xl h-[400px] flex items-center justify-center">
      {videoUrl ? (
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          className="w-full h-full rounded-xl object-contain"
        />
      ) : (
        <p className="text-gray-300">Pilih materi untuk diputar...</p>
      )}
    </div>
  );
}
