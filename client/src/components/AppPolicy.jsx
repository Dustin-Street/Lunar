import React from "react";

export default function AppPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 h-svh overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> March 8, 2026
      </p>

      <p className="mb-4 text-wrap">
        This is a personal journaling application Beta or prototype, and is not
        intended to be viewed as a final product. This Privacy Policy explains
        how we collect, use, and protect your information when you use the
        application. By using Lunar, you agree to the collection and use of
        information in accordance with this policy. If you do not agree with
        this policy, please do not use the application.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Email Address:</strong> Used for account creation,
          authentication, and communication.
        </li>
        <li>
          <strong>Username:</strong> Used for identification within the
          application.
        </li>
        <li>
          <strong>Journal Content:</strong> All journal entries, moods, and
          personal reflections you create.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">
        How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          To provide and maintain the journaling service within the application
          under the terms of this policy.
        </li>
        <li>
          To authenticate your account and try to ensure you are the owner of
          the account.
        </li>
        <li>
          To store and display your journal entries as accurately as possible.
        </li>
        <li> passwords are encrypted for security, to try to prevent being accessed by unauthorized parties </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
      <p className="mb-4">
        We implement reasonable security measures to protect your data. However,
        please note that no method of transmission over the internet or
        electronic storage is 100% secure.

        this being early in development proper security measures may not be fully tested, or implemented and we recommend not storing sensitive information. We are not responsible for any data loss or security breaches.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
      <p className="mb-4">
        We do not sell, trade, or otherwise transfer your personal information
        to third parties without your consent or permission, except as required
        by law.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
      <p className="mb-4">
        Your data is retained as long as your account is active. You can delete
        your account and associated data at any time, all associated data will
        be permanently deleted from our servers.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Access your personal data.</li>
        <li>Correct inaccurate data.</li>
        <li>Delete your account and data.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">No Support</h2>
      <ul>
        <li>
          No technical support is provided for this Beta or prototype
          application.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Disclaimer</h2>
      <p className="mb-4 text-red-600 font-semibold">
        This application is provided for personal use only. We do not guarantee
        the security, reliability, or continued operation of the service. Use at
        your own risk. We are not responsible for any data loss or security
        breaches. as this is a Beta or prototype, we recommend not storing
        sensitive information.
        <br />
        <br />
        We reserve the right to modify or discontinue the application at any
        time. We are not liable for any damages arising from the use or
        inability to use the application, including but not limited to data
        loss, privacy breaches, or any other issues that may arise from using
        the application.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </p>
    </div>
  );
}
