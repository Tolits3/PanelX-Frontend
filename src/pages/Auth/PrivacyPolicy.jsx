// src/pages/PrivacyPolicy.jsx
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-yellow-400 hover:text-yellow-300 text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: February 11, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-8 space-y-6 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Email address, username, password</li>
              <li><strong>Profile Information:</strong> Bio, avatar/profile picture, user preferences</li>
              <li><strong>Content:</strong> Comics you create, images you generate, comments, and interactions</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely by our payment providers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Information Automatically Collected</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>Create and manage your account</li>
              <li>Generate AI images based on your prompts</li>
              <li>Process payments and prevent fraud</li>
              <li>Send important updates about the Service</li>
              <li>Respond to your support requests</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">3. Information Sharing & Disclosure</h2>
            <p className="leading-relaxed mb-3">
              We do NOT sell your personal information. We may share information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Providers:</strong> AI API providers (Hugging Face), payment processors, hosting services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">4. Data Storage & Security</h2>
            <p className="leading-relaxed mb-3">
              <strong className="text-white">Where We Store Data:</strong> Your data is stored on secure servers. User-generated content is stored both locally and in cloud storage.
            </p>
            <p className="leading-relaxed mb-3">
              <strong className="text-white">Security Measures:</strong> We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure password hashing (Firebase Authentication)</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and authentication</li>
            </ul>
            <p className="leading-relaxed mt-3 text-yellow-200">
              ⚠️ However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">5. Your Rights & Choices</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your content and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="leading-relaxed mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@panelx.com" className="text-yellow-400 hover:underline">privacy@panelx.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">6. AI-Generated Content</h2>
            <p className="leading-relaxed mb-3">
              <strong className="text-white">Important Note:</strong> When you use our AI image generation features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your text prompts are sent to third-party AI providers (e.g., Hugging Face)</li>
              <li>These providers may use prompts to improve their models</li>
              <li>Generated images are processed through their systems</li>
              <li>We do not control how these providers handle data</li>
            </ul>
            <p className="leading-relaxed mt-3">
              By using AI features, you acknowledge these third-party interactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">7. Cookies & Tracking</h2>
            <p className="leading-relaxed mb-3">We use cookies to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze how you use the Service</li>
              <li>Improve performance and user experience</li>
            </ul>
            <p className="leading-relaxed mt-3">
              You can disable cookies in your browser settings, but some features may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">8. Children's Privacy</h2>
            <p className="leading-relaxed">
              PanelX is not intended for users under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">9. International Users</h2>
            <p className="leading-relaxed">
              If you are accessing PanelX from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">10. Changes to Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on the Service. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-400 mb-3">11. Contact Us</h2>
            <p className="leading-relaxed">
              For privacy-related questions or concerns, contact us at:
              <br />
              <a href="mailto:privacy@panelx.com" className="text-yellow-400 hover:underline">
                privacy@panelx.com
              </a>
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link to="/terms" className="text-yellow-400 hover:text-yellow-300">
            Terms of Service
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