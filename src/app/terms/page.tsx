import BackButton from "./BackButton";
export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
        <BackButton />
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

      <div className="space-y-6 text-sm leading-7 text-gray-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Fundraising Platform
          </h2>
          <p>
            This fundraising platform allows organizations, players,
            participants, and their parents or guardians to participate in
            fundraising campaigns, manage fundraising activities, and access
            campaign-related information.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            SMS Messaging
          </h2>
          <p>
            By providing your mobile phone number and consenting to receive
            text messages, you agree to receive messages related to the
            player/participant&apos;s fundraising participation. Messages may
            include access to the player/participant&apos;s dashboard and
            campaign-related updates and notifications.
          </p>

          <p className="mt-3">
            Message frequency varies. Message and data rates may apply.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Opting Out and Getting Help
          </h2>

          <p>
            <strong>Reply STOP to opt out of text messages at any time.</strong>
          </p>

          <p className="mt-2">
            <strong>Reply HELP for help.</strong>
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Message Delivery
          </h2>
          <p>
            Carriers are not liable for any delayed or undelivered messages.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Privacy
          </h2>
          <p>
            Your use of the fundraising platform and SMS messaging is also
            subject to our{" "}
            /privacy
              Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Acceptable Use
          </h2>
          <p>
            Users agree to use the fundraising platform only for legitimate
            fundraising activities and must not misuse the platform, interfere
            with its operation, or use it for unlawful purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Service Availability
          </h2>
          <p>
            We may update, modify, or discontinue features of the fundraising
            platform as the service evolves.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Support
          </h2>
          <p>
            For assistance with the fundraising platform or SMS messages,
            contact the support information provided by the platform or reply
            HELP to an SMS message.
          </p>
        </section>
      </div>
    </main>
  );
}