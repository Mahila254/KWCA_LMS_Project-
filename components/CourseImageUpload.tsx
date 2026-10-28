"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import { uploadAdminImage } from "@/lib/uploadImage";

type CourseImageUploadProps = {
  // The course's imageUrl ("" when it has none).
  value: string;
  onChange: (url: string) => void;
};

/**
 * Course cover picture for the admin course forms. Click, drag a file on,
 * or paste an image (Ctrl+V) to upload it to Supabase Storage; the
 * returned public URL becomes the course's imageUrl when the form is
 * saved. A link to an image hosted elsewhere can be pasted instead.
 */
export default function CourseImageUpload({ value, onChange }: CourseImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;

    setError(null);
    setUploading(true);

    try {
      onChange(await uploadAdminImage(file, "courses"));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      onPaste={(event) => {
        const file = Array.from(event.clipboardData.files).find((item) =>
          item.type.startsWith("image/")
        );
        if (file) {
          event.preventDefault();
          upload(file);
        }
      }}
    >
      <label className="mb-2 block font-bold">Course Picture</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          upload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border bg-gray-50">
          <img
            src={value}
            alt="Course picture"
            className="aspect-[16/7] w-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="animate-spin text-[#1E1D59]" size={32} />
            </div>
          )}

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1E1D59] shadow-md hover:bg-gray-50"
            >
              <RefreshCw size={15} />
              Replace
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              aria-label="Remove picture"
              className="rounded-full bg-white p-2 text-red-600 shadow-md hover:bg-red-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            upload(event.dataTransfer.files[0]);
          }}
          disabled={uploading}
          className={`flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragging
              ? "border-[#632854] bg-[#FBEFF4]"
              : "border-gray-300 bg-gray-50 hover:border-[#1E1D59] hover:bg-[#F1EFFA]"
          }`}
        >
          {uploading ? (
            <Loader2 className="mb-3 animate-spin text-[#1E1D59]" size={42} />
          ) : (
            <ImagePlus className="mb-3 text-[#1E1D59]" size={42} />
          )}

          <span className="font-bold text-[#1E1D59]">
            {uploading ? "Uploading..." : "Upload course picture"}
          </span>

          <span className="mt-2 text-sm text-gray-500">
            Click, drag an image here, or paste one with Ctrl+V. PNG, JPG or
            WEBP, up to 5 MB.
          </span>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
      )}

      <div className="mt-3">
        <label className="mb-1 block text-sm font-semibold text-gray-500">
          Or paste an image link
        </label>
        <input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder="https://..."
          className="w-full rounded-xl border px-4 py-2.5 text-sm"
        />
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Shown on course cards and at the top of the course page. A wide
        landscape photo works best.
      </p>
    </div>
  );
}
