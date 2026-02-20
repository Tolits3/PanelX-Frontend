// src/pages/TermsOfService.jsx
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-yellow-400 hover:text-yellow-300 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last updated: February 11, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-8 space-y-6 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using PanelX ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">2. Description of Service</h2>
            <p className="leading-relaxed mb-3">
              PanelX is an AI-powered comic creation and reading platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI-generated images for comic panels</li>
              <li>Comic creation tools and editors</li>
              <li>Comic reading and discovery features</li>
              <li>User accounts and profile management</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">3. User Accounts</h2>
            <p className="leading-relaxed mb-3">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">4. Content Ownership & Rights</h2>
            <p className="leading-relaxed mb-3">
              <strong className="text-white">Your Content:</strong> You retain ownership of comics and content you create using PanelX. By using the Service, you grant PanelX a license to host, display, and distribute your content on the platform.
            </p>
            <p className="leading-relaxed mb-3">
              <strong className="text-white">AI-Generated Content:</strong> Images generated using our AI tools are created specifically for you, but are subject to the terms of the underlying AI service providers.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">Prohibited Content:</strong> You may not create or upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">5. Usage Limits & Fair Use</h2>
            <p className="leading-relaxed mb-3">
              We reserve the right to impose reasonable limits on your use of the Service, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Number of AI image generations per day/month</li>
              <li>Storage space for uploaded content</li>
              <li>API rate limits</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Excessive or abusive use may result in temporary or permanent suspension of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">6. Payment & Billing</h2>
            <p className="leading-relaxed mb-3">
              Some features of PanelX may require payment. By purchasing a paid subscription or credits:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You agree to pay all fees associated with your purchase</li>
              <li>Payments are non-refundable except as required by law</li>
              <li>Prices are subject to change with notice</li>
              <li>Subscriptions auto-renew unless cancelled</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">7. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms of Service, illegal activity, or for any other reason at our discretion. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">8. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. AI-GENERATED CONTENT MAY CONTAIN ERRORS OR INACCURACIES.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">9. Limitation of Liability</h2>
            <p className="leading-relaxed">
              PanelX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">10. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">11. Contact</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:support@panelx.com" className="text-yellow-400 hover:underline">
                support@panelx.com
              </a>
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300">
            Privacy Policy
          </Link>
          <span className="text-gray-600">•</span>
          <Link to="/" className="text-yellow-400 hover:text-yellow-300">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}