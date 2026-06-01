export const metadata = {
  title: "Terms & Conditions - Bubble Buddy",
  description: "Terms and conditions for using Bubble Buddy Smile services",
};

export default function TermsAndConditionsPage() {
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
                Terms & Conditions
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
          {/* Agreement */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using this website and services provided by Bubble Buddy Smile, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Use License */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">2. Use License</h2>
            <p className="text-muted-foreground mb-3">
              Permission is granted to temporarily download one copy of the materials (including information and software) from Bubble Buddy Smile for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Modifying or copying the materials</li>
              <li>• Using the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>• Attempting to decompile or reverse engineer any software contained on Bubble Buddy Smile</li>
              <li>• Removing any copyright or other proprietary notations from the materials</li>
              <li>• Transferring the materials to another person or mirroring the materials on any other server</li>
              <li>• Violating any applicable laws or regulations related to access to the website</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">3. Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on Bubble Buddy Smile are provided on an as is basis. Bubble Buddy Smile makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Limitations of Liability */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">4. Limitations of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall Bubble Buddy Smile or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Bubble Buddy Smile, even if Bubble Buddy Smile or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">5. Accuracy of Materials</h2>
            <p className="text-muted-foreground">
              The materials appearing on Bubble Buddy Smile website could include technical, typographical, or photographic errors. Bubble Buddy Smile does not warrant that any of the materials on its website are accurate, complete, or current. Bubble Buddy Smile may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          {/* Materials License */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">6. Materials License</h2>
            <p className="text-muted-foreground">
              The materials on Bubble Buddy Smile website are protected by copyright and trademark laws. Unauthorized use of the materials is prohibited. You may not sell, transfer, assign, license, sublicense, transmit, or otherwise convey any materials obtained from this website.
            </p>
          </section>

          {/* Product Information */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">7. Product Information & Pricing</h2>
            <p className="text-muted-foreground mb-3">
              We strive to provide accurate product descriptions and pricing information. However:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• We reserve the right to limit quantities and cancel orders</li>
              <li>• Prices are subject to change without notice</li>
              <li>• Product availability is not guaranteed</li>
              <li>• We reserve the right to refuse any order</li>
              <li>• Colors and images may vary slightly from actual products</li>
            </ul>
          </section>

          {/* Order & Payment */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">8. Order & Payment Terms</h2>
            <p className="text-muted-foreground mb-3">
              By placing an order, you represent that:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• You are at least 18 years of age or older</li>
              <li>• The information provided is accurate and complete</li>
              <li>• You have the right to use the payment method provided</li>
              <li>• The transaction does not violate any applicable law</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We accept various payment methods including credit cards, debit cards, and digital payment systems. All transactions are secured and encrypted. Payment must be received before order fulfillment.
            </p>
          </section>

          {/* Shipping & Delivery */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">9. Shipping & Delivery</h2>
            <p className="text-muted-foreground mb-3">
              Shipping timelines are estimates only. We are not responsible for delays caused by:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Weather conditions</li>
              <li>• Natural disasters or unforeseen events</li>
              <li>• Customs or government regulations</li>
              <li>• Incorrect delivery address provided by customer</li>
              <li>• Third-party carrier delays</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Risk of loss passes to you upon delivery to your address. We recommend requesting a signature confirmation for high-value orders.
            </p>
          </section>

          {/* Returns & Refunds */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">10. Returns & Refunds Policy</h2>
            <p className="text-muted-foreground mb-3">
              Our return policy is as follows:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Returns must be initiated within 7 days of delivery</li>
              <li>• Products must be unused, unopened, and in original packaging</li>
              <li>• Return shipping costs are the customer responsibility unless the error was ours</li>
              <li>• Refunds are processed within 5-7 business days after receipt and inspection</li>
              <li>• Custom or personalized products cannot be returned</li>
              <li>• Items purchased during promotions are final sale</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              For defective or damaged products, please contact us within 48 hours of delivery with photographic evidence.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">11. Intellectual Property Rights</h2>
            <p className="text-muted-foreground">
              All content on the Bubble Buddy Smile website, including text, graphics, logos, images, and software, is the property of Bubble Buddy Smile or its content suppliers and is protected by international copyright laws. Unauthorized use is prohibited.
            </p>
          </section>

          {/* User Conduct */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">12. User Conduct</h2>
            <p className="text-muted-foreground mb-3">
              You agree not to engage in any conduct that restricts or inhibits anyone use or enjoyment of the website. Prohibited behavior includes:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Harassing or causing distress or inconvenience to any person</li>
              <li>• Offensive behavior or language</li>
              <li>• Disrupting the normal flow of dialogue within our website communities</li>
              <li>• Interfering with or disrupting servers or networks</li>
              <li>• Attempting to gain unauthorized access to systems</li>
            </ul>
          </section>

          {/* Account Responsibility */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">13. Account Responsibility</h2>
            <p className="text-muted-foreground mb-3">
              When you create an account, you are responsible for:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Maintaining the confidentiality of your password</li>
              <li>• All activities that occur under your account</li>
              <li>• Notifying us of any unauthorized use of your account</li>
              <li>• Keeping your information accurate and up-to-date</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          {/* Limitation of Warranties */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">14. Limitation of Warranties</h2>
            <p className="text-muted-foreground">
              BUBBLE BUDDY SMILE AND ITS SUPPLIERS PROVIDE THE WEBSITE AND SERVICES AS IS WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
            </p>
          </section>

          {/* Indemnification */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">15. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless Bubble Buddy Smile, its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, and expenses arising out of or related to your use of the website or breach of these terms.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">16. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the website immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms. Upon termination, your right to use the website will immediately cease.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">17. Changes to Terms</h2>
            <p className="text-muted-foreground">
              Bubble Buddy Smile reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following any such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4 rounded-[2rem] border border-border bg-card/50 p-8 backdrop-blur-lg">
            <h2 className="text-3xl font-bold">18. Governing Law & Contact</h2>
            <p className="text-muted-foreground mb-6">
              These Terms and Conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
            <p className="text-muted-foreground mb-3">
              For questions about these Terms & Conditions, please contact us:
            </p>
            <div className="space-y-3 ml-4">
              <p className="text-foreground">
                <strong>Bubble Buddy Smile</strong>
              </p>
              <p className="text-muted-foreground">
                Email: support@buddybubble.com<br />
                Phone: +91 98888 88727<br />
                Address: Private Label Cosmetics Manufacturing, India
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
