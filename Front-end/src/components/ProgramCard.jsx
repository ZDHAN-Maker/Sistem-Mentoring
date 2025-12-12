export default function ProgramCard({
  title,
  mentor,
  level,
  duration,
  rating,
  reviews,
  price,
  thumbnailText = "UI/UX",
  onDetail,
  onRegister
}) {
  return (
    <div className="bg-[#f7efe5] border-[6px] border-[#5a4635] rounded-3xl p-6 w-[340px] shadow-lg">
      
      {/* Thumbnail */}
      <div className="w-full flex justify-center mb-4">
        <div className="bg-[#2d2b29] w-40 h-28 rounded-xl shadow-md flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {thumbnailText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="text-sm text-[#3a2f23] leading-relaxed">
        <p className="font-semibold text-base mb-2">
          Nama Program: “{title}”
        </p>

        <p>
          <span className="font-semibold">Mentor :</span> {mentor}
        </p>

        <p>
          <span className="font-semibold">Level :</span> {level}
        </p>

        <p>
          <span className="font-semibold">Durasi :</span> {duration}
        </p>

        <p className="flex items-center gap-1">
          <span className="font-semibold">Rating :</span>
          <span className="text-yellow-500">⭐⭐⭐⭐</span>
          <span>{rating} ({reviews} ulasan)</span>
        </p>

        <p>
          <span className="font-semibold">Harga :</span> Rp {price}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onDetail}
          className="bg-[#5a4635] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#4a3a2c] transition"
        >
          Detail Program
        </button>
        <button
          onClick={onRegister}
          className="bg-[#5a4635] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#4a3a2c] transition"
        >
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
}
