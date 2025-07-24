"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="bg-neutral-900 text-white px-5 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">RAMDAN ARCHIVE</h1>
      {user ? (
        <div className="relative group">
          <img
            src={`https://ui-avatars.com/api/?background=fff&color=000&name=${
              user.email
            }`}
            className="w-8 h-8 rounded-full cursor-pointer"
          />
          <div className="hidden group-hover:block absolute right-0 mt-2 bg-neutral-800 rounded shadow-md">
            <Link href="/profile" className="block px-4 py-2 hover:bg-neutral-700">Profile</Link>
            <Link href="/terms" className="block px-4 py-2 hover:bg-neutral-700">Terms</Link>
            <Link href="/privacy" className="block px-4 py-2 hover:bg-neutral-700">Privacy</Link>
            <Link href="/report" className="block px-4 py-2 hover:bg-neutral-700">Report</Link>
            <button
              className="w-full text-left px-4 py-2 hover:bg-red-700 text-red-400"
              onClick={async () => {
                await supabase.auth.signOut();
                location.reload();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
