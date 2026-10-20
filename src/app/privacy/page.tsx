import BackButton from "./BackButton";
export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
        <BackButton />
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-sm leading-7 text-gray-700">
  RaiseOn is a fundraising platform operated by Tamara Weber ("RaiseOn,"
  "we," "us," or "our"). This Privacy Policy explains how RaiseOn
  collects, uses, and protects information when individuals use our
  fundraising platform and related services.
</p>

      <div className="space-y-6 text-sm leading-7 text-gray-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Information We Collect
          </h2>
          <p>
            We collect information that you provide when participating in a
            fundraising campaign, such as your name, mobile phone number,
            email address, fundraising activity, and information necessary to
            provide and operate the fundraising platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide and operate the
            fundraising platform, give players and participants access to
            their fundraising dashboards, provide campaign-related
            communications and notifications, and support fundraising
            activities.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            SMS Communications
          </h2>
          <p>
            If you provide your mobile phone number and consent to receive text
            messages, we may send messages related to the player/participant&apos;s
            fundraising participation, including access to the
            player/participant&apos;s dashboard and campaign updates.
          </p>

          <p className="mt-3">
            Message frequency varies. Message and data rates may apply. Reply
            HELP for help or STOP to opt out.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Mobile Information and SMS Consent
          </h2>
<p>
  We do not share, sell, or provide your mobile phone number or
  messaging consent data to third parties or affiliates for marketing
  or promotional purposes.
</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Information Sharing
          </h2>
          <p>
            We may use service providers that help us operate and support the
            fundraising platform. Information is shared only as necessary to
            provide those services or as required by law.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Data Security
          </h2>
          <p>
            We take reasonable measures to protect personal information from
            unauthorized access, use, or disclosure.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Your Choices
          </h2>
          <p>
            You may opt out of SMS messages at any time by replying STOP.
            Reply HELP for assistance.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Contact
          </h2>
          <p>
            Questions about this Privacy Policy or the fundraising platform
            may be directed to the contact information provided by the
            platform.
          </p>
        </section>
      </div>
    </main>
  );
}