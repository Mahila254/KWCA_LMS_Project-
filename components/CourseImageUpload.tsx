"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function CourseImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }

  function removeImage() {
    setPreview(null);
  }

  return (
    <div>
      <label className="mb-2 block font-bold">Course Image</label>

      {!preview ? (
        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition hover:border-[#007F73] hover:bg-emerald-50">
          <ImagePlus className="mb-3 text-[#007F73]" size={42} />

          <p className="font-bold text-[#07122E]">
            Upload course cover image
          </p>

          <p className="mt-2 text-sm text-gray-500">
            PNG, JPG, or WEBP recommended
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border bg-gray-50">
          <img
            src={preview}
            alt="Course preview"
            className="h-[260px] w-full object-cover"
          />

          <button
            type="button"
            onClick={removeImage}
            className="absolute right-4 top-4 rounded-full bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">
        This image will appear on course cards and course detail pages.
      </p>
    </div>
  );
}