import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F2FBF8] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold text-[#101828] mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-600 mb-8">
          Login to continue learning.
        </p>

        <form className="space-y-5">
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
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#007F73] font-bold">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}