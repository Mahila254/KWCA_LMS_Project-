import { prisma } from "@/lib/prisma";

/*
 * The graphs on the admin Reports page. Drawn on the server as plain
 * SVG and HTML (no chart library, nothing to download), in the theme's
 * chart colours, so they follow light and dark mode.
 *
 * - Activity over 12 weeks: new learners, enrolments and certificates.
 * - Where learners stop: how many finished each lesson of a course.
 * - Hardest quiz questions: the ones fewest learners get right.
 * - Final quiz pass rate, per course.
 *
 * Every mark has a tooltip (hover or long-press), each chart has a short
 * sentence saying what it shows, and the trend has a table view.
 */

type Dated = { createdAt: Date };

type Props = {
  learners: Dated[];
  enrollments: (Dated & { progress: number; course: { id: string; title: string } })[];
  certificates: { issuedAt: Date }[];
  quizResults: { quizType: string; passed: boolean; course: { id: string; title: string } }[];
  courses: { id: string; title: string; lessons: { id: string }[] }[];
};

const WEEKS = 12;
const DAY = 24 * 60 * 60 * 1000;

/** Monday 00:00 UTC of the week a date falls in. */
function weekStart(date: Date) {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
  return day.getTime();
}

const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default async function ReportCharts({
  learners,
  enrollments,
  certificates,
  quizResults,
  courses,
}: Props) {
  // ---- Activity over the last 12 weeks -------------------------------
  const thisWeek = weekStart(new Date());
  const weeks = Array.from({ length: WEEKS }, (_, i) => thisWeek - (WEEKS - 1 - i) * 7 * DAY);
  const perWeek = (dates: Date[]) =>
    weeks.map((start) => dates.filter((date) => weekStart(date) === start).length);

  const series = [
    { name: "New learners", color: "var(--chart-1)", values: perWeek(learners.map((item) => item.createdAt)) },
    { name: "Enrolments", color: "var(--chart-2)", values: perWeek(enrollments.map((item) => item.createdAt)) },
    { name: "Certificates", color: "var(--chart-3)", values: perWeek(certificates.map((item) => item.issuedAt)) },
  ];

  // ---- Where learners stop -------------------------------------------
  const dropOff = courses
    .map((course) => {
      const enrolled = enrollments.filter((item) => item.course.id === course.id);
      const lessons = course.lessons.length;
      // Progress is saved as the share of lessons finished, so it turns
      // back into a lesson count.
      const finished = enrolled.map((item) => Math.round((item.progress / 100) * lessons));
      return {
        title: course.title,
        enrolled: enrolled.length,
        lessons: Array.from({ length: Math.min(lessons, 12) }, (_, i) =>
          finished.filter((count) => count >= i + 1).length
        ),
      };
    })
    .filter((course) => course.enrolled > 0 && course.lessons.length > 0)
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 3);

  // ---- Hardest quiz questions ----------------------------------------
  // The answers of recent attempts (kept out of every other query).
  const attempts = await prisma.quizResult.findMany({
    orderBy: { createdAt: "desc" },
    take: 400,
    select: { answers: true, quizType: true, course: { select: { title: true } } },
  });

  const questionStats = new Map<
    string,
    { question: string; course: string; quiz: string; answered: number; correct: number }
  >();

  for (const attempt of attempts) {
    if (!Array.isArray(attempt.answers)) continue;

    for (const answer of attempt.answers as Record<string, unknown>[]) {
      if (!answer || typeof answer.questionId !== "string" || typeof answer.question !== "string") continue;
      const entry = questionStats.get(answer.questionId) ?? {
        question: answer.question,
        course: attempt.course.title,
        quiz: attempt.quizType === "FINAL" ? "Final quiz" : "Practice quiz",
        answered: 0,
        correct: 0,
      };
      entry.answered += 1;
      if (answer.isCorrect === true) entry.correct += 1;
      questionStats.set(answer.questionId, entry);
    }
  }

  // A question needs a few answers before its share means anything.
  const enoughAnswers = [...questionStats.values()].filter((item) => item.answered >= 3);
  const hardest = (enoughAnswers.length ? enoughAnswers : [...questionStats.values()])
    .map((item) => ({ ...item, share: Math.round((item.correct / item.answered) * 100) }))
    .sort((a, b) => a.share - b.share || b.answered - a.answered)
    .slice(0, 6);

  // ---- Final quiz pass rate by course --------------------------------
  const passByCourse = courses
    .map((course) => {
      const finals = quizResults.filter(
        (item) => item.course.id === course.id && item.quizType === "FINAL"
      );
      const passed = finals.filter((item) => item.passed).length;
      return {
        title: course.title,
        attempts: finals.length,
        passed,
        share: finals.length ? Math.round((passed / finals.length) * 100) : 0,
      };
    })
    .filter((course) => course.attempts > 0)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 6);

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-2">
      <ChartCard
        className="lg:col-span-2"
        title="Activity over the last 12 weeks"
        description="New learner accounts, course enrolments and certificates issued, week by week."
      >
        <TrendChart weeks={weeks} series={series} />
      </ChartCard>

      <ChartCard
        title="Where learners stop"
        description="How many enrolled learners finished each lesson. A sharp fall between two lessons shows where people drop out."
      >
        {dropOff.length === 0 ? (
          <Empty>No enrolments yet. This fills in as learners work through lessons.</Empty>
        ) : (
          <div className="space-y-7">
            {dropOff.map((course) => (
              <div key={course.title}>
                <p className="font-bold">{course.title}</p>
                <p className="mb-3 text-sm text-gray-500">{plural(course.enrolled, "learner")} enrolled</p>
                <div className="space-y-2">
                  {course.lessons.map((count, index) => (
                    <Bar
                      key={index}
                      label={`Lesson ${index + 1}`}
                      share={(count / course.enrolled) * 100}
                      value={`${count} of ${course.enrolled}`}
                      tooltip={`${count} of ${plural(course.enrolled, "enrolled learner")} finished lesson ${index + 1} (${Math.round((count / course.enrolled) * 100)}%)`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      <div className="grid gap-6">
        <ChartCard
          title="Hardest quiz questions"
          description="The questions the fewest learners answered correctly. They may need a clearer lesson, or clearer wording."
        >
          {hardest.length === 0 ? (
            <Empty>No quiz answers recorded yet.</Empty>
          ) : (
            <ol className="space-y-4">
              {hardest.map((item, index) => (
                <li key={index}>
                  <p className="line-clamp-2 text-sm font-semibold leading-6" title={item.question}>
                    {item.question}
                  </p>
                  <p className="mb-1.5 text-xs text-gray-500">
                    {item.course} · {item.quiz}
                  </p>
                  <Bar
                    share={item.share}
                    value={`${item.share}% correct`}
                    tooltip={`${item.correct} of ${plural(item.answered, "answer")} correct (${item.share}%)`}
                  />
                </li>
              ))}
            </ol>
          )}
        </ChartCard>

        <ChartCard
          title="Final quiz pass rate"
          description="The share of final quiz attempts that passed, for each course."
        >
          {passByCourse.length === 0 ? (
            <Empty>No final quiz attempts yet.</Empty>
          ) : (
            <div className="space-y-4">
              {passByCourse.map((course) => (
                <div key={course.title}>
                  <p className="mb-1.5 text-sm font-semibold">{course.title}</p>
                  <Bar
                    share={course.share}
                    value={`${course.share}% · ${course.passed} of ${course.attempts}`}
                    tooltip={`${course.passed} of ${plural(course.attempts, "attempt")} passed (${course.share}%)`}
                  />
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  className = "",
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-3xl bg-surface p-6 shadow-sm sm:p-8 ${className}`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-1 mb-6 max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-600">{children}</p>;
}

/** One horizontal bar: a thin mark with its value written beside it. */
function Bar({
  label,
  share,
  value,
  tooltip,
}: {
  label?: string;
  share: number;
  value: string;
  tooltip: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm" title={tooltip}>
      {label && <span className="w-20 shrink-0 text-gray-600">{label}</span>}
      <span className="h-2.5 min-w-0 flex-1 rounded-r-sm bg-gray-100">
        <span
          className="block h-full rounded-r-sm bg-chart-1"
          style={{ width: `${Math.max(0, Math.min(100, share))}%` }}
        />
      </span>
      <span className="w-36 shrink-0 text-right font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function TrendChart({
  weeks,
  series,
}: {
  weeks: number[];
  series: { name: string; color: string; values: number[] }[];
}) {
  const width = 760;
  const height = 280;
  const left = 34;
  const right = 132;
  const top = 14;
  const bottom = 30;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const highest = Math.max(...series.flatMap((item) => item.values));
  // A round top value, at least 4 so a quiet platform isn't a flat line.
  const max = Math.max(4, Math.ceil(highest / 4) * 4);
  const x = (index: number) => left + (index / (weeks.length - 1)) * plotWidth;
  const y = (value: number) => top + plotHeight - (value / max) * plotHeight;
  const ticks = [0, max / 2, max];
  const total = series.reduce((sum, item) => sum + item.values.reduce((a, b) => a + b, 0), 0);

  // End labels, nudged apart so equal values don't overprint.
  const labels = series
    .map((item) => ({ ...item, last: item.values[item.values.length - 1], at: y(item.values[item.values.length - 1]) }))
    .sort((a, b) => a.at - b.at);
  for (let i = 1; i < labels.length; i++) {
    if (labels[i].at - labels[i - 1].at < 16) labels[i].at = labels[i - 1].at + 16;
  }
  const overflow = labels[labels.length - 1].at - (top + plotHeight);
  if (overflow > 0) labels.forEach((label) => (label.at -= overflow));

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
        {series.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full" style={{ background: item.color }} />
            {item.name}
          </li>
        ))}
      </ul>

      {total === 0 && (
        <p className="mb-3 text-sm text-gray-600">Nothing recorded in these 12 weeks yet.</p>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Weekly activity for the last ${weeks.length} weeks. ${series
          .map((item) => `${item.name}: ${item.values.reduce((a, b) => a + b, 0)} in total`)
          .join("; ")}.`}
        className="w-full"
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={left + plotWidth}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text x={left - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">
              {tick}
            </text>
          </g>
        ))}

        {weeks.map((start, index) =>
          index % 2 === 1 || index === weeks.length - 1 ? (
            <text
              key={start}
              x={x(index)}
              y={height - 8}
              textAnchor={index === weeks.length - 1 ? "end" : "middle"}
              fontSize="12"
              fill="var(--muted)"
            >
              {shortDate.format(start)}
            </text>
          ) : null
        )}

        {series.map((item) => (
          <polyline
            key={item.name}
            points={item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ")}
            fill="none"
            stroke={item.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {labels.map((item) => (
          <g key={item.name}>
            <circle
              cx={x(weeks.length - 1)}
              cy={y(item.last)}
              r="4.5"
              fill={item.color}
              stroke="var(--surface)"
              strokeWidth="2"
            />
            <text x={x(weeks.length - 1) + 12} y={item.at + 4} fontSize="12.5" fill="var(--ink)">
              <tspan fontWeight="700">{item.last}</tspan> {item.name.toLowerCase()}
            </text>
          </g>
        ))}

        {/* One tall hit area per week, for the tooltip. */}
        {weeks.map((start, index) => (
          <rect
            key={start}
            x={x(index) - plotWidth / (weeks.length - 1) / 2}
            y={top}
            width={plotWidth / (weeks.length - 1)}
            height={plotHeight}
            fill="transparent"
          >
            <title>
              {`Week of ${shortDate.format(start)}: ${series
                .map((item) => `${item.values[index]} ${item.name.toLowerCase()}`)
                .join(", ")}`}
            </title>
          </rect>
        ))}
      </svg>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-bold text-accent">View as a table</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead className="text-gray-500">
              <tr>
                <th className="py-1.5 pr-4 font-semibold">Week of</th>
                {series.map((item) => (
                  <th key={item.name} className="py-1.5 pr-4 font-semibold">
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {weeks.map((start, index) => (
                <tr key={start} className="border-t border-gray-100">
                  <td className="py-1.5 pr-4">{shortDate.format(start)}</td>
                  {series.map((item) => (
                    <td key={item.name} className="py-1.5 pr-4">
                      {item.values[index]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
