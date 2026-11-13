/**
 * Which picture a course shows on the courses page, the course page and
 * its lessons.
 *
 * 1. The picture an admin uploaded for the course always wins.
 * 2. Otherwise, the picture chosen for that course in the site design
 *    (public/images/courses), matched by the course's web address or
 *    its title, so a course created later with the same title picks up
 *    its picture by itself.
 * 3. Otherwise, the general placeholder.
 *
 * The photos are from Unsplash (free to use), saved in the project so
 * they load from our own site.
 */

const PLACEHOLDER = "/images/course-placeholder.jpg";

// Title of the course -> its picture. Also used by the homepage's module
// list (data/modules.ts).
export const COURSE_PICTURES: Record<string, string> = {
  "What is a Conservancy?": "/images/courses/what-is-a-conservancy.jpg",
  "Establishing a Strong Conservancy":
    "/images/courses/establish-strong-conservancy.jpg",
  "Managing a Conservancy Effectively":
    "/images/courses/manage-conservancy-effectively.jpg",
  "Creating Sustainable Revenue": "/images/courses/sustainable-revenue.jpg",
  "Holding a Good Annual General Meeting":
    "/images/courses/annual-general-meeting.jpg",
  "Creating a Credible Carbon Project": "/images/courses/carbon-project.jpg",
  "Writing a Conservancy Management Plan":
    "/images/courses/conservancy-management-plan.jpg",
  // The design uses the community-meeting photo for both of these.
  "Women & Youth in Conservation": "/images/courses/annual-general-meeting.jpg",
  "A Fair Seat at the Table": "/images/courses/annual-general-meeting.jpg",
  "Achieving Greenlisting Status":
    "/images/courses/greenlisting-conservancies.jpg",
};

// "What is a Conservancy?" and "what-is-a-conservancy" both become
// "whatisaconservancy", so a title and a web address can be compared.
const simplify = (text: string) =>
  text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");

const bySimplifiedTitle = new Map(
  Object.entries(COURSE_PICTURES).map(([title, picture]) => [
    simplify(title),
    picture,
  ])
);

export function coursePicture(course: {
  slug: string;
  title: string;
  imageUrl?: string | null;
}) {
  if (course.imageUrl && course.imageUrl.trim() !== "") return course.imageUrl;

  return (
    bySimplifiedTitle.get(simplify(course.title)) ??
    bySimplifiedTitle.get(simplify(course.slug)) ??
    PLACEHOLDER
  );
}
