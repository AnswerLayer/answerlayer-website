import React from 'react';

interface HeaderProps {
  logo?: string;
  navItems?: { label: string; href: string }[];
}

export function Header({ 
  logo = 'ANSWER LAYER', 
  navItems = [
    { label: 'PRODUCT', href: '#product' },
    { label: 'DOCUMENTATION', href: '#docs' },
    { label: 'PRICING', href: '#pricing' },
    { label: 'CONTACT', href: '#contact' }
  ]
}: HeaderProps) {
  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <a href="/" className="uppercase tracking-tight hover:no-underline">
              {logo}
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className="uppercase text-sm tracking-wide hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button className="md:hidden border-2 border-navy-900 px-4 py-2 uppercase text-sm hover:bg-navy-900 hover:text-white transition-colors">
            MENU
          </button>
        </div>
      </div>
    </header>
  );
}
