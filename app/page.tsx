"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("likes", { ascending: false });
    setPhotos(data || []);
  }

  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/x-matroska"];
    if (!allowed.includes(file.type)) return alert("Format tidak diizinkan!");

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(Date.now() + "_" + file.name, file);

    if (error) return alert("Gagal upload: " + error.message);

    const publicUrl = supabase.storage
      .from("photos")
      .getPublicUrl(data.path).data.publicUrl;

    await supabase.from("photos").insert([
      {
        user_id: user.id,
        url: publicUrl,
        type: file.type.includes("video") ? "video" : "image",
        likes: 0,
      },
    ]);

    alert("✅ Upload berhasil!");
    loadPhotos();
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-5">
        {user && (
          <div className="bg-neutral-900 p-4 rounded mb-4">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.mkv"
              onChange={handleUpload}
              className="text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="bg-neutral-900 p-2 rounded">
              {p.type === "video" ? (
                <video src={p.url} controls className="rounded" />
              ) : (
                <img src={p.url} className="rounded" />
              )}
              <p className="text-sm mt-1">❤️ {p.likes} Likes</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
