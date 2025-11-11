import React from 'react';

function Program() {
    return (
        <div className="bg-[#C2A68C] min-h-screen flex flex-col items-center py-6">
            {/* Bagian Atas: Gambar utama dan deskripsi horizontal */}
            <div className="w-11/12 md:w-4/5 flex flex-col md:flex-row items-center md:items-start gap-10 py-8">
                {/* Gambar User (dari attachment), kiri, diperbesar */}
                <img
                    src="/assets/Gemini_Generated_Image_6pk6d96pk6d96pk6.png"
                    alt="Main Program Image"
                    className="w-full md:w-[500px] h-auto rounded-xl shadow-lg"
                />
                {/* Deskripsi Program */}
                <p className="text-center md:text-left text-gray-700 text-xl md:mt-0 mt-6 max-w-xl">
                    Bergabung dengan lebih dari 1.5 juta anggota yang telah belajar bersama di Aeterna. Kembangkan keterampilanmu dan raih karir impianmu bersama kami.
                </p>
            </div>

            {/* Gambar-gambar Pendukung */}
            <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6 w-11/12 md:w-2/3">
                <img
                    src="/assets/Gemini_Generated_Image_304x57304x57304x.png"
                    alt="Image 1"
                    className="w-full md:w-80 h-auto rounded-lg"
                />
                <img
                    src="/assets/Gemini_Generated_Image_b201v4b201v4b201.png"
                    alt="Image 2"
                    className="w-full md:w-80 h-auto rounded-lg"
                />
                <img
                    src="/assets/Gemini_Generated_Image_304x57304x57304x.png"
                    alt="Image 1"
                    className="w-full md:w-80 h-auto rounded-lg"
                />
                <img
                    src="/assets/Gemini_Generated_Image_b201v4b201v4b201.png"
                    alt="Image 2"
                    className="w-full md:w-80 h-auto rounded-lg"
                />
            </div>
        </div>
    );
}

export default Program;
