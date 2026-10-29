import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The rules for using the KWCA Learning Hub: accounts, courses, payments, certificates and acceptable use.",
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    content: (
      <>
        <p>
          These terms set the rules for using the Conservancies Learning Hub
          (&ldquo;the platform&rdquo;), run by the{" "}
          <strong>Kenya Wildlife Conservancies Association (KWCA)</strong>.
          &ldquo;We&rdquo; and &ldquo;us&rdquo; mean KWCA. &ldquo;You&rdquo;
          means anyone who visits or uses the platform.
        </p>
        <p>
          By creating an account or using the platform, you agree to these
          terms and to our <Link href="/privacy">Privacy Policy</Link>. If you
          do not agree, please do not use the platform.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use the platform",
    content: (
      <>
        <ul>
          <li>
            You must be 18 or over, or have a parent or guardian&rsquo;s consent
            and supervision.
          </li>
          <li>
            The information you give when you register, including your name,
            must be true and accurate. Your certificate is issued in that name.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    content: (
      <>
        <ul>
          <li>Each account is for one person only. Do not share your login.</li>
          <li>
            Keep your password safe. You are responsible for activity on your
            account.
          </li>
          <li>
            Tell us straight away at{" "}
            <a href="mailto:complaints@kwcakenya.com">complaints@kwcakenya.com</a>{" "}
            if you think someone else has used your account.
          </li>
          <li>
            You can ask us to close your account at any time. The{" "}
            <Link href="/privacy#retention">Privacy Policy</Link> explains what
            happens to your data when you do.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "courses",
    title: "Courses and access",
    content: (
      <>
        <ul>
          <li>
            Some lessons are free to preview. Premium lessons, final quizzes and
            certificates may require payment or a subscription.
          </li>
          <li>
            We may update, improve, replace or retire course content to keep it
            accurate and useful. If a course you paid for is removed while your
            access is still active, we will offer you a similar course or a fair
            refund.
          </li>
          <li>
            Course content is for education and training. It is not legal,
            financial or other professional advice for your particular
            situation.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments and refunds",
    content: (
      <>
        <ul>
          <li>
            Current prices are shown in Kenya Shillings (KES) on the{" "}
            <Link href="/pricing">Pricing</Link> page. We may change prices, but
            a change never affects a period you have already paid for.
          </li>
          <li>
            Premium access starts once KWCA confirms your payment. A
            pay-per-course payment unlocks that course. A monthly or annual
            subscription unlocks premium content for that period.
          </li>
          <li>
            Subscriptions do not renew automatically. Your access ends at the end
            of the paid period unless you pay again.
          </li>
          <li>
            <strong>Refunds:</strong> you can ask for a refund within 7 days of
            payment if you have not yet opened the premium lessons or the final
            quiz. We also refund any payment made twice by mistake. To ask for a
            refund, email us with your payment reference.
          </li>
          <li>
            Payments made through M-PESA, Paystack or another provider are also
            subject to that provider&rsquo;s own terms.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "quizzes",
    title: "Quizzes and certificates",
    content: (
      <>
        <ul>
          <li>
            You may take practice quizzes as often as you like. The final quiz
            shows its pass mark and time limit before you start.
          </li>
          <li>
            Quizzes must be your own work. Do not let someone else take a quiz
            for you or share final quiz answers.
          </li>
          <li>
            Certificates show your name, the course and the date issued. Anyone
            can confirm them on the{" "}
            <Link href="/verify-certificate">Verify Certificate</Link> page.
          </li>
          <li>
            We may cancel a certificate if it was obtained by cheating, by
            giving false information, or by breaking these terms.
          </li>
          <li>
            A certificate confirms that you completed a KWCA course. It is not a
            government licence or an academic degree.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>When using the platform, you agree not to:</p>
        <ul>
          <li>
            copy, sell, share or republish course materials, videos or quiz
            questions without our written permission;
          </li>
          <li>
            try to get into parts of the platform or other accounts that you
            are not allowed to use, or interfere with how the platform works;
          </li>
          <li>
            post feedback that is false, offensive, discriminatory or
            unrelated to the course;
          </li>
          <li>use the platform for anything unlawful.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ownership",
    title: "Ownership of content",
    content: (
      <>
        <p>
          Course content, including text, images, videos, quizzes and the KWCA
          name and logo, belongs to KWCA or to the partners who allow us to use
          it. You may use it for your own learning. Lesson notes you are
          offered as downloads are for your personal use and for training within
          your conservancy.
        </p>
        <p>
          If you send us feedback or suggestions, you allow us to use them to
          improve our courses without paying you.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability of the platform",
    content: (
      <>
        <p>
          We work to keep the platform running and accurate. However, it may
          sometimes be unavailable for maintenance or because of problems
          outside our control. We will try to give notice of planned downtime.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          As far as Kenyan law allows, KWCA is not responsible for indirect
          losses that come from using the platform or its content. If we are
          responsible for a loss, our total liability is limited to the amount
          you paid us in the 12 months before the claim. Nothing in these terms
          limits any rights you have under the Consumer Protection Act, 2012 or
          other laws that cannot be excluded.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspending or closing accounts",
    content: (
      <>
        <p>
          We may suspend or close an account that seriously or repeatedly
          breaks these terms. Where it is reasonable, we will contact you first
          and give you a chance to explain. If we close your account without
          good reason, we will refund any unused paid access.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <>
        <p>
          We may update these terms from time to time. The date at the top of
          this page shows when they last changed. If we make important changes,
          we will tell registered learners before they take effect. If you keep
          using the platform after that, you accept the new terms.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These terms are governed by the laws of Kenya. If you have a
          complaint, please contact us first so we can try to resolve it
          together. Any dispute we cannot settle this way will be decided by
          the courts of Kenya.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Using the platform"
      title="Terms and"
      accent="Conditions"
      intro={
        <p>
          The rules for learning on the KWCA Learning Hub. They cover your
          account, courses, payments, quizzes and certificates, and what we
          each agree to.
        </p>
      }
      updated="29 October 2026"
      sections={sections}
      related={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
