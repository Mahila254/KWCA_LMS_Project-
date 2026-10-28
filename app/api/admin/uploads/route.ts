import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/adminAuth";

const BUCKET = "lesson-images";
const MAX_BYTES = 5 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * Uploads an admin image to Supabase Storage and returns its public URL:
 * lesson screenshots (the editor inserts them as ![Screenshot](url)) and
 * course pictures (saved as the course's imageUrl). Send folder=courses
 * for course pictures; anything else goes under lessons/.
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API
 * keys → service_role / secret). That key bypasses all database rules,
 * so it must only ever be read here on the server, never in a
 * NEXT_PUBLIC_ variable. The public "lesson-images" bucket is created on
 * the first upload if it doesn't exist yet.
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error:
          "Image uploads aren't set up yet: SUPABASE_SERVICE_ROLE_KEY is missing from the environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image was sent." }, { status: 400 });
    }

    const extension = extensions[file.type];

    if (!extension) {
      return NextResponse.json(
        { error: "Please upload a PNG, JPG, WEBP or GIF image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "That image is larger than 5 MB." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: bucket } = await supabase.storage.getBucket(BUCKET);

    if (!bucket) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_BYTES,
        allowedMimeTypes: Object.keys(extensions),
      });

      if (createError && !/already exists/i.test(createError.message)) {
        throw createError;
      }
    }

    const folder = formData.get("folder") === "courses" ? "courses" : "lessons";
    const month = new Date().toISOString().slice(0, 7);
    const path = `${folder}/${month}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error("Lesson image upload error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading the image." },
      { status: 500 }
    );
  }
}
