
export const metadata = {
  title: "Privacy Policy - Bubble Buddy",
  description: "Privacy policy for Bubble Buddy Smile cosmetic products",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border bg-card/50 backdrop-blur-lg">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Last updated: June 1, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">1. Introduction</h2>
            <p className="text-muted-foreground">
              Bubble Buddy Smile (we, us, our, or Company) operates the website and mobile applications. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            <p className="text-muted-foreground">
              We are committed to maintaining your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          {/* Information Collection */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">2. Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground mb-3">We may collect the following personal information from you:</p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• Name and email address</li>
                  <li>• Shipping and billing address</li>
                  <li>• Phone number</li>
                  <li>• Payment information (processed securely)</li>
                  <li>• Account login credentials</li>
                  <li>• Preferences and interests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Automatic Information</h3>
                <p className="text-muted-foreground mb-3">We may automatically collect certain technical information when you access our website:</p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>• IP address and location data</li>
                  <li>• Browser type and version</li>
                  <li>• Device type and identifiers</li>
                  <li>• Pages visited and time spent on them</li>
                  <li>• Referring URLs and exit pages</li>
                  <li>• Cookies and tracking pixels</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Third-Party Information</h3>
                <p className="text-muted-foreground">
                  We may receive information about you from third-party services including payment processors, delivery partners, and marketing platforms.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Information */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-3">We use the information we collect for various purposes:</p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Processing and fulfilling your orders</li>
              <li>• Sending order confirmations and updates</li>
              <li>• Providing customer support and responding to inquiries</li>
              <li>• Personalizing your shopping experience</li>
              <li>• Sending promotional emails and newsletters (with your consent)</li>
              <li>• Improving our website and services</li>
              <li>• Detecting and preventing fraudulent activities</li>
              <li>• Complying with legal obligations</li>
              <li>• Analyzing website performance and user behavior</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">4. Information Sharing & Disclosure</h2>
            <p className="text-muted-foreground mb-3">
              We may share your information with third parties only in the following circumstances:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• <strong>Service Providers:</strong> We share data with delivery partners, payment processors, and other service providers who assist us in operating our website and conducting our business.</li>
              <li>• <strong>Legal Requirements:</strong> We may disclose personal data if required by law or in response to valid requests from government authorities.</li>
              <li>• <strong>Protection of Rights:</strong> We may disclose information to protect our rights, privacy, safety, or property.</li>
              <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not sell, rent, or lease your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security audits.
            </p>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">6. Cookies & Tracking Technologies</h2>
            <p className="text-muted-foreground mb-3">
              We use cookies and similar tracking technologies to enhance your experience on our website:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• <strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li>• <strong>Persistent Cookies:</strong> Cookies that remain on your device for specified periods</li>
              <li>• <strong>Analytics:</strong> To understand how users interact with our website</li>
              <li>• <strong>Marketing:</strong> To deliver targeted advertisements and track campaign performance</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your access to certain features of our website.
            </p>
          </section>

          {/* User Rights */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">7. Your Rights & Choices</h2>
            <p className="text-muted-foreground mb-3">You have the right to:</p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• <strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
              <li>• <strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li>• <strong>Portability:</strong> Request transfer of your data in a structured format</li>
              <li>• <strong>Withdraw Consent:</strong> Withdraw consent for processing of your data</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at the address provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">8. Third-Party Links</h2>
            <p className="text-muted-foreground">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external websites. We recommend reviewing their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">9. Childrens Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that a child under 13 has provided us with personal data, we will take steps to delete such information.
            </p>
          </section>

          {/* Policy Changes */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">10. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the updated policy on our website. Your continued use of our Service constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="space-y-3 mt-6 ml-4">
              <p className="text-foreground">
                <strong>Bubble Buddy Smile</strong>
              </p>
              <p className="text-muted-foreground">
                Email: bubblebuddysmile.team@gmail.com<br />
                Phone: +91 98888 88727<br />
                Address: Tricity Plaza, 316, Peer Muchalla Rd, Sector 20, Zirakpur, Sanauli, Punjab 140603
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
