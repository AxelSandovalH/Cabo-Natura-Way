"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, ImageIcon } from "lucide-react";

const BUCKET = "product-images";
const MAX_MB  = 5;

interface Props {
  currentUrl?: string | null;
  emoji?: string;
  /** Hidden input name that will carry the URL to the server action */
  inputName?: string;
}

export default function ImageUpload({
  currentUrl,
  emoji = "🌿",
  inputName = "image_url",
}: Props) {
  const [url, setUrl]         = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const fileRef               = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_MB} MB.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext  = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (err: any) {
      setError(err?.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected if needed
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleRemove() {
    setUrl(null);
    setError(null);
  }

  return (
    <div className="space-y-2">
      {/* Hidden input carries the URL to the server action */}
      <input type="hidden" name={inputName} value={url ?? ""} />

      {/* Preview area */}
      <div className="relative w-full aspect-square max-w-[200px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center group">
        {url ? (
          <>
            <Image
              src={url}
              alt="Product image"
              fill
              className="object-cover"
              sizes="200px"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-opacity opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </>
        ) : (
          <div className="text-center">
            <span className="text-5xl block mb-2">{emoji}</span>
            <p className="text-[11px] text-gray-400">No photo yet</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-[#2D5016] border-t-transparent rounded-full animate-spin" />
            <p className="text-[11px] text-[#2D5016] font-medium">Uploading…</p>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2D5016] hover:text-[#C4602A] disabled:opacity-50 transition-colors"
        >
          {url ? (
            <><ImageIcon className="w-3.5 h-3.5" /> Change photo</>
          ) : (
            <><Upload className="w-3.5 h-3.5" /> Upload photo</>
          )}
        </button>
        <span className="text-[11px] text-gray-400">JPG, PNG, WebP · max {MAX_MB} MB</span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />

      {error && (
        <p className="text-[12px] text-red-500">{error}</p>
      )}
    </div>
  );
}
