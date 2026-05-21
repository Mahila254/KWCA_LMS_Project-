import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F2FBF8] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold text-[#101828] mb-2">
          Create Account
        </h1>

        <p className="text-gray-600 mb-8">
          Join the KWCA Learning Hub.
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button className="w-full bg-[#007F73] text-white py-3 rounded-xl font-bold">
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#007F73] font-bold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}