const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6">
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-400 mb-6">Last updated: September 2025</p>
        <p className="text-gray-300 mb-4">
          Serene is designed with privacy-first principles. We do not collect
          personal identifiers like your name or email. Your content stays on
          your device, encrypted where supported. This placeholder page can be
          replaced with your finalized policy content.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>No account required; anonymous by default.</li>
          <li>On-device storage for journals and chat logs.</li>
          <li>Anonymous progress tracking.</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;
