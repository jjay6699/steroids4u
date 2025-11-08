'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InstagramWidget() {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Follow us on Instagram</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        {/* Instagram Profile Header */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-600 p-1">
            <Image
              src="/logo.webp"
              alt="steroids4u.eu_"
              width={64}
              height={64}
              className="w-full h-full rounded-full bg-white p-1"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">steroids4u.eu_</h3>
            <p className="text-sm text-gray-600">Based in EU (European Union) 🇪🇺 Fast Worldwide 🌍</p>
          </div>
        </div>

        {/* Instagram Posts Grid - Using Instagram Embeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Instagram embed iframes - these will auto-load the latest posts */}
          <iframe
            src="https://www.instagram.com/steroids4u.eu_/embed"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          />
          <iframe
            src="https://www.instagram.com/steroids4u.eu_/embed"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          />
          <iframe
            src="https://www.instagram.com/steroids4u.eu_/embed"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          />
          <iframe
            src="https://www.instagram.com/steroids4u.eu_/embed"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="https://www.instagram.com/steroids4u.eu_/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors flex items-center gap-2"
          >
            📷 Follow on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}

