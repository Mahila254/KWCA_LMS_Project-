import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | KWCA Learning Hub",
  description:
    "How the KWCA Learning Hub collects, uses, protects and keeps your personal data.",
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          The Conservancies Learning Hub (&ldquo;the platform&rdquo;) is run by
          the <strong>Kenya Wildlife Conservancies Association (KWCA)</strong>,
          Seminary Road, off Magadi Road, Karen, Nairobi (P.O. Box 1038 –
          00517, Uhuru Gardens, Nairobi, Kenya).
        </p>
        <p>
          KWCA is the <strong>data controller</strong> for the personal data
          described here. This means we decide why and how your data is used,
          and we are responsible for protecting it under the{" "}
          <strong>Data Protection Act, 2019</strong> of Kenya and its
          regulations.
        </p>
        <p>
          This policy applies to everyone who visits the platform, creates a
          learner account, takes a course, pays for access or verifies a
          certificate.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What information we collect",
    content: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Account details:</strong> your full name, email address,
            gender (you can choose &ldquo;prefer not to say&rdquo;) and a
            password. Your password is handled by our sign-in provider and is
            stored in scrambled (hashed) form. KWCA staff can never see it.
          </li>
          <li>
            <strong>Your consent record:</strong> whether you agreed to our data
            consent statement and the date and time you agreed.
          </li>
          <li>
            <strong>Course feedback:</strong> star ratings and any comments you
            write about a course.
          </li>
          <li>
            <strong>Messages:</strong> anything you send us by email or phone,
            for example a question or a complaint.
          </li>
        </ul>

        <h3>Information created while you learn</h3>
        <ul>
          <li>The courses you enrol in and how far you have progressed.</li>
          <li>
            Your quiz attempts: scores, pass or fail, the date, and the answer
            you chose for each question (so you can review practice quizzes).
          </li>
          <li>Certificates issued to you and their certificate codes.</li>
        </ul>

        <h3>Payment information</h3>
        <ul>
          <li>
            The plan you chose, the amount, currency, payment status and a
            payment reference.
          </li>
          <li>
            We <strong>do not</strong> store card numbers, M-PESA PINs or bank
            passwords. These are handled only by the payment provider.
          </li>
        </ul>

        <h3>Technical information</h3>
        <ul>
          <li>
            Your browser keeps a sign-in session so you stay logged in. Our
            hosting provider keeps short-term technical logs such as IP address,
            browser type and the pages requested. We use these logs only for
            security and to fix faults.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <>
        <p>We use your personal data only to:</p>
        <ul>
          <li>create and manage your learner account and let you sign in;</li>
          <li>
            deliver courses, save your progress and show your quiz results;
          </li>
          <li>issue certificates and let others confirm that they are genuine;</li>
          <li>process payments and unlock premium content;</li>
          <li>answer your questions and handle complaints;</li>
          <li>improve our courses using your feedback and quiz results;</li>
          <li>
            prepare <strong>anonymous, combined statistics</strong> for KWCA,
            its partners and funders. Examples include the number of learners,
            completion rates and the gender balance of learners. These reports
            never name you.
          </li>
          <li>keep the platform secure and prevent misuse.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your data, and we do not use it for
          advertising.
        </p>
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "Our legal basis",
    content: (
      <>
        <p>
          Under the Data Protection Act, 2019, we rely on the following lawful
          bases:
        </p>
        <ul>
          <li>
            <strong>Consent:</strong> you agree to our data consent statement
            when you register. You can withdraw consent at any time (see
            section 8). Doing so will not affect anything we did before you
            withdrew it.
          </li>
          <li>
            <strong>Contract:</strong> to provide the courses, certificates and
            paid access you sign up for.
          </li>
          <li>
            <strong>Legal obligation:</strong> for example, keeping payment
            records as required by Kenyan tax law.
          </li>
          <li>
            <strong>Legitimate interests:</strong> keeping the platform secure
            and improving our training, in ways you would reasonably expect.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who can see your information",
    content: (
      <>
        <ul>
          <li>
            <strong>KWCA platform administrators</strong> can see learner
            accounts, enrolments, progress, quiz results, certificates,
            payments and feedback. They use this only to run the platform and
            support learners.
          </li>
          <li>
            <strong>Anyone with your certificate code</strong> can use{" "}
            <Link href="/verify-certificate">Verify Certificate</Link> to see
            your name, the course title and the issue date. Your email and
            other details are not shown.
          </li>
          <li>
            <strong>Service providers</strong> that run parts of the platform
            for us, under agreements that require them to protect your data:
            <ul>
              <li>Supabase: database, sign-in and file storage;</li>
              <li>Vercel: website hosting;</li>
              <li>
                payment providers such as Safaricom M-PESA or Paystack, when
                you make a payment.
              </li>
            </ul>
          </li>
          <li>
            <strong>Authorities</strong>, when the law requires it, for example
            under a court order.
          </li>
        </ul>
        <p>
          We will not share your personal data with any other organisation
          without your permission.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Storage outside Kenya",
    content: (
      <>
        <p>
          Some of our service providers store data on servers outside Kenya. When
          that happens, we transfer your data only as the Data Protection Act,
          2019 allows. This means using providers that offer appropriate
          safeguards for security and data protection, and relying on your
          consent given at registration.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep your information",
    content: (
      <>
        <ul>
          <li>
            <strong>Account and learning records:</strong> kept for as long as
            your account is open. If you ask us to delete your account, we
            delete these records within 90 days.
          </li>
          <li>
            <strong>Certificate records:</strong> kept after your account
            closes so that employers and partners can still verify your
            certificate. You can ask us to remove them as well.
          </li>
          <li>
            <strong>Payment records:</strong> kept for at least five years, as
            Kenyan tax law requires.
          </li>
          <li>
            <strong>Technical logs:</strong> kept for a short period by our
            hosting provider and then deleted automatically.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Under the Data Protection Act, 2019, you have the right to:</p>
        <ul>
          <li>be told how your personal data is used (this policy);</li>
          <li>get a copy of the personal data we hold about you;</li>
          <li>have wrong or incomplete data corrected;</li>
          <li>have your data deleted;</li>
          <li>object to, or ask us to limit, how we use your data;</li>
          <li>withdraw your consent at any time;</li>
          <li>
            receive your data in a common format that you can move to another
            service.
          </li>
        </ul>
        <p>
          To use any of these rights, email{" "}
          <a href="mailto:complaints@kwcakenya.com">complaints@kwcakenya.com</a>{" "}
          from the email address on your account. We may ask you to confirm
          your identity. We will respond within the time limits set by the Data
          Protection (General) Regulations, 2021.
        </p>
        <p>
          If you are not happy with our response, you can complain to the{" "}
          <strong>Office of the Data Protection Commissioner (ODPC)</strong> at{" "}
          <a href="https://www.odpc.go.ke" target="_blank" rel="noreferrer">
            www.odpc.go.ke
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your information",
    content: (
      <>
        <ul>
          <li>All traffic to the platform is encrypted (HTTPS).</li>
          <li>Passwords are hashed and are never visible to KWCA staff.</li>
          <li>
            The admin area is protected by a separate sign-in. Only authorised
            KWCA staff are given access.
          </li>
          <li>
            Final quiz answers and other sensitive records are never sent to
            your browser unless they are needed.
          </li>
        </ul>
        <p>
          If a data breach puts your personal data at real risk, we will report
          it to the Data Protection Commissioner within 72 hours. We will also
          tell you without delay, as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    content: (
      <>
        <p>
          We only use storage that the platform needs to work. This keeps you
          signed in, remembers your course progress on your device and secures
          the admin area. We do <strong>not</strong> use advertising cookies or
          third-party tracking.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <>
        <p>
          The platform is meant for learners aged 18 and over. Anyone under 18
          may use it only with the consent and supervision of a parent or
          guardian. If you believe a child has registered without that consent,
          contact us and we will delete the account.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <>
        <p>
          We may update this policy when the platform or the law changes. The
          date at the top of this page shows when it last changed. If we make
          important changes, we will tell registered learners by email or on
          the platform before the changes take effect.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy"
      accent="Policy"
      intro={
        <p>
          This policy explains what personal data the KWCA Learning Hub
          collects, why we collect it, who can see it, how long we keep it and
          the rights you have over it.
        </p>
      }
      updated="29 October 2026"
      sections={sections}
      related={{ href: "/terms", label: "Terms and Conditions" }}
    />
  );
}
