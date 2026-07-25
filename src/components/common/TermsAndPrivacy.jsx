import React from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiShield, FiLock, FiMail } from "react-icons/fi";

function LegalLayout({ title, icon, lastUpdated, children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark text-gray-800 dark:text-gray-200 transition-colors duration-200 font-sans flex flex-col">
      {/* Premium Header */}
      <header className="h-16 px-6 bg-white dark:bg-brand-sec-dark border-b border-brand-border-light dark:border-white/5 flex items-center justify-between shadow-sm sticky top-0 z-35 backdrop-blur-md bg-white/90 dark:bg-brand-sec-dark/90">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-850 dark:hover:text-white transition cursor-pointer text-xs font-bold font-sans"
        >
          <FiChevronLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-md shadow-brand-teal/20">
            ▲
          </div>
          <span className="text-xs font-extrabold tracking-wider uppercase">SocketChat</span>
        </div>

        <div className="w-16" />
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-3xl w-full mx-auto px-6 py-12 flex flex-col text-left">
        <div className="bg-white dark:bg-brand-card-dark rounded-3xl border border-brand-border-light dark:border-white/5 p-6 sm:p-10 shadow-lg relative overflow-hidden flex-1">
          {/* Decorative light blob */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-teal/5 blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="flex items-center gap-3.5 border-b border-gray-100 dark:border-white/5 pb-6 mb-8">
            <div className="p-3 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-[10px] text-gray-450 mt-1 font-medium font-sans">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Body content */}
          <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-6 text-gray-650 dark:text-gray-300 font-sans">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-brand-border-light dark:border-white/5 text-center text-[10px] text-gray-450 dark:text-zinc-600 bg-white dark:bg-brand-sec-dark font-sans select-none">
        &copy; {new Date().getFullYear()} SocketChat. All rights reserved. &bull; Secure Encrypted Realtime Network.
      </footer>
    </div>
  );
}

export function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      icon={<FiShield size={24} />}
      lastUpdated="July 2026"
    >
      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          1. Acceptance of Terms
        </h3>
        <p>
          By creating an account, logging in, or using the SocketChat application ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Service. These terms constitute a legally binding agreement between you and SocketChat.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          2. User Responsibilities & Conduct
        </h3>
        <p>
          You are solely responsible for maintaining the confidentiality of your credentials (username and password) and for all communications sent from your account. You agree to use the Service in compliance with applicable local, state, and international laws.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          3. Prohibited Activities
        </h3>
        <p>
          You agree not to engage in any of the following prohibited behaviors:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Impersonating other users or attempting to access unauthorized sessions.</li>
          <li>Transmitting unsolicited promotional messages, spam, or malicious code.</li>
          <li>Attempting to interfere with, disrupt, or compromise the Socket.io WebSocket channels or server endpoints.</li>
          <li>Using automated scripts, bots, or scrapers to extract communication data from the client dashboard.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          4. Content Ownership & Permissions
        </h3>
        <p>
          You retain all rights to the message texts, files, and attachments you transmit through the Service. By sending content, you grant SocketChat a limited license to host, transmit, and display that content solely for the purpose of delivering the Service to you and your chat participants. We do not claim ownership or sell your transmission logs.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          5. Messaging & Privacy Policy
        </h3>
        <p>
          SocketChat is designed as a secure, direct-messaging system. While in-transit data is protected, you understand that direct chat logs are synchronized to browser local storage. Your use of the Service is also governed by our Privacy Policy, which outlines information collection and data retention practices.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          6. Account Suspension & Termination
        </h3>
        <p>
          We reserve the right to suspend or terminate your account access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, developers, or server integrity.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          7. Disclaimers & Limitation of Liability
        </h3>
        <p>
          The Service is provided "as is" and "as available" without warranties of any kind. SocketChat does not guarantee that WebSocket connections will remain uninterrupted or that message sync will be 100% latency-free under heavy traffic loads. We shall not be liable for any indirect, incidental, or consequential damages arising from account usage.
        </p>
      </section>

      <section className="space-y-2 pt-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          8. Contact Information
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-3">
          <FiMail className="text-brand-teal" size={16} />
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Legal Operations Support</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-sans">legal@socketchat.com &bull; Response within 48h</p>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      icon={<FiLock size={24} />}
      lastUpdated="July 2026"
    >
      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          1. Information We Collect
        </h3>
        <p>
          To deliver secure realtime chat services, we collect and store:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>Account Data:</strong> Username, display name, email, and password (securely cryptographically hashed using bcryptjs).</li>
          <li><strong>Messages & Media:</strong> Text contents, reactions, file attachments, and metadata timestamps stored in MongoDB for the duration of the conversation.</li>
          <li><strong>Cookies & Session Logs:</strong> Tokens stored in local storage to sustain socket sessions, verify JWT authentication, and avoid redundant logins.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          2. Authentication & Data Security
        </h3>
        <p>
          We employ JWT (JSON Web Tokens) to authenticate API requests and verify socket handshake parameters. Direct messages are securely stored in a restricted database and are only accessible by conversation participants. We implement strict CORS controls and sanitization middleware to reject malicious packet injections.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          3. Data Retention & Deletion
        </h3>
        <p>
          Your conversation logs are preserved on the server so they can synchronize across client devices and tabs. If you delete a conversation or single message, it is marked as deleted or purged permanently from the primary tables.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          4. Third-Party Services
        </h3>
        <p>
          SocketChat operates as an independent self-hosted MERN cluster. We do not transmit, lease, or distribute your messages, logs, files, or demographic indices to third-party marketing services or advertising corporations.
        </p>
      </section>

      <section className="space-y-2 font-sans">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          5. User Rights & Account Deletion
        </h3>
        <p>
          You have the right to request a copy of your account profile data or request complete account erasure. You can request deletion of all messages, contacts, and account credentials from MongoDB. Once processed, this action is irreversible.
        </p>
      </section>

      <section className="space-y-2 pt-2">
        <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-sans">
          6. Contact & Compliance
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-3">
          <FiMail className="text-brand-teal" size={16} />
          <div>
            <p className="font-bold text-gray-800 dark:text-white font-sans">Privacy Officer Helpline</p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-sans">privacy@socketchat.com &bull; Compliance updates</p>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
