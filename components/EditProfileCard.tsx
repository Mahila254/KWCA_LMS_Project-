"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle, KeyRound, Loader2, Lock, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import { PASSWORD_RESET_EMAILS_ENABLED } from "@/lib/features";

type EditProfileCardProps = {
  name: string | null;
  gender: string | null;
  email: string;
  // A certificate is printed with the learner's name, so it's fixed once
  // one is issued (the server enforces this too).
  nameLocked: boolean;
  onSaved: (details: { name: string; gender: string }) => void;
};

/** Lets a learner correct their name and gender, and change their password. */
export default function EditProfileCard({
  name,
  gender,
  email,
  nameLocked,
  onSaved,
}: EditProfileCardProps) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(name ?? "");
  const [genderInput, setGenderInput] = useState(gender ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await authFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: nameInput, gender: genderInput }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "We couldn't save your details.");
        return;
      }

      // Keeps the login details in step, which also updates the name in the
      // header. The database copy is already saved, so a failure here is
      // only cosmetic and shouldn't report the save as failed.
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: data.name, gender: data.gender },
      });

      if (metadataError) {
        console.error("Login details not updated:", metadataError);
      }

      setNameInput(data.name);
      onSaved({ name: data.name, gender: data.gender });
      setEditing(false);
      setSaved(true);
    } catch (submitError) {
      console.error(submitError);
      setError("We couldn't save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl bg-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Details</h2>
          {saved && !editing && (
            <p role="status" className="mt-1 flex items-center gap-2 text-sm font-bold text-green-700">
              <CheckCircle size={16} />
              Your details have been saved.
            </p>
          )}
        </div>

        {!editing && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setNameInput(name ?? "");
                setGenderInput(gender ?? "");
                setError("");
                setSaved(false);
                setEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover"
            >
              <Pencil size={16} />
              Edit Details
            </button>

            {PASSWORD_RESET_EMAILS_ENABLED && (
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-bold hover:bg-gray-50"
              >
                <KeyRound size={16} />
                Change Password
              </Link>
            )}
          </div>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className="mb-2 block font-bold">
              Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              disabled={nameLocked}
              maxLength={100}
              className="w-full rounded-xl border px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            />

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {nameLocked ? (
                <>
                  <Lock size={13} className="mr-1 inline" />
                  Your name is on an issued certificate, so it can&rsquo;t be
                  changed here. To correct it, email{" "}
                  <a
                    href="mailto:complaints@kwcakenya.com"
                    className="font-bold text-accent underline-offset-2 hover:underline"
                  >
                    complaints@kwcakenya.com
                  </a>
                  .
                </>
              ) : (
                "This is the name printed on your certificates, so please check the spelling."
              )}
            </p>
          </div>

          <div>
            <label htmlFor="profile-gender" className="mb-2 block font-bold">
              Gender
            </label>

            <select
              id="profile-gender"
              value={genderInput}
              onChange={(event) => setGenderInput(event.target.value)}
              className="w-full rounded-xl border bg-surface px-4 py-3 outline-none"
            >
              <option value="" disabled>
                Choose an option
              </option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">
              Your email address ({email}) is your login and can&rsquo;t be
              changed here.
            </p>

            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
