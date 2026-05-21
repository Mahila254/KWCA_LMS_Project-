import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContinueLearning from "@/components/ContinueLearning";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">

        {/* Hero */}

        <section className="bg-[#edf6f3] py-16">
          <div className="mx-auto max-w-7xl px-6">

            <p className="font-semibold text-[#007F73]">
              Learner Dashboard
            </p>

            <h1 className="mt-3 text-6xl font-bold text-slate-900">
              Welcome back
            </h1>

            <p className="mt-4 text-xl text-gray-600">
              Track your courses, continue lessons, and monitor your learning progress.
            </p>

          </div>
        </section>


        <section className="mx-auto max-w-7xl px-6 py-10">

          {/* Dashboard Cards */}

          <div className="grid gap-5 md:grid-cols-4">

            {/* User Profile */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#007F73] text-2xl font-bold text-white">
                  T
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Timothy Masibo
                  </h2>

                  <p className="text-gray-500">
                    Student
                  </p>
                </div>

              </div>

              <button className="mt-8 w-full rounded-xl border py-3 hover:bg-gray-100">
                Logout
              </button>

            </div>


            {/* Courses */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="text-gray-500">
                Courses Enrolled
              </p>

              <h2 className="mt-5 text-5xl font-bold">
                1
              </h2>

            </div>


            {/* Lessons */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="text-gray-500">
                Lessons Completed
              </p>

              <h2 className="mt-5 text-5xl font-bold">
                4
              </h2>

            </div>


            {/* Progress */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="text-gray-500">
                Overall Progress
              </p>

              <h2 className="mt-5 text-5xl font-bold">
                100%
              </h2>

            </div>

          </div>


          {/* Continue Learning */}

          <div className="mt-8">
            <ContinueLearning />
          </div>


          {/* Courses */}

          <h2 className="mt-12 text-5xl font-bold">
            My Courses
          </h2>


          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {/* Course 1 */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="font-bold text-[#007F73]">
                Module 1
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                What is a conservancy?
              </h3>

              <div className="mt-8 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-full rounded-full bg-[#007F73]"></div>
              </div>

              <p className="mt-4 text-gray-500">
                100% complete
              </p>

            </div>


            {/* Course 2 */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="font-bold text-[#007F73]">
                Module 2
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                How to establish a strong Conservancy
              </h3>

              <div className="mt-8 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[25%] rounded-full bg-[#007F73]"></div>
              </div>

              <p className="mt-4 text-gray-500">
                25% complete
              </p>

            </div>


            {/* Course 3 */}

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <p className="font-bold text-[#007F73]">
                Module 3
              </p>

              <h3 className="mt-4 text-2xl font-bold">
                Managing a Conservancy effectively
              </h3>

              <div className="mt-8 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[10%] rounded-full bg-[#007F73]"></div>
              </div>

              <p className="mt-4 text-gray-500">
                10% complete
              </p>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </>
  );
}