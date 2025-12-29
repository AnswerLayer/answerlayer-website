import React from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  copyright?: string;
}

export function Footer({ 
  sections = [
    {
      title: 'PRODUCT',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Documentation', href: '#docs' }
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' }
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Security', href: '#security' }
      ]
    }
  ],
  copyright = '© 2025 Answer Layer. All rights reserved.'
}: FooterProps) {
  return (
    <footer className="bg-navy-900 text-white border-t-2 border-navy-900">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl mb-4">ANSWER LAYER</h3>
            <p className="text-sm text-gray-400">
              TECHNICAL INFRASTRUCTURE FOR THE MODERN WEB
            </p>
          </div>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-sm mb-4 text-gray-400">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-sm hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              {copyright}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:underline">GITHUB</a>
              <a href="#" className="text-sm hover:underline">TWITTER</a>
              <a href="#" className="text-sm hover:underline">LINKEDIN</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
