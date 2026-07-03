"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

function GoogleGlyph() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3a7.4 7.4 0 0 1-11-3.9H.98v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.07 14.19a7.2 7.2 0 0 1 0-4.38V6.72H.98a12 12 0 0 0 0 10.56l4.09-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69.98 6.72l4.09 3.09A7.17 7.17 0 0 1 12 4.75Z"
      />
    </svg>
  );
}

export default function GoogleAuthButton() {
  const [unavailable, setUnavailable] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setUnavailable(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-primary"
      >
        <GoogleGlyph />
        Continue with Google
      </button>
      {unavailable && (
        <p className="mt-2 flex items-start gap-1.5 text-sm text-weak">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Google sign-in isn&apos;t set up on this deployment yet — please
          continue with email and password below.
        </p>
      )}
    </div>
  );
}
