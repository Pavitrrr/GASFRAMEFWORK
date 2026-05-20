import { Logo } from './Logo';
import { Link } from 'react-router';
import { Github, Twitter, MessageCircle, BookOpen } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
    { icon: BookOpen, href: '#', label: 'Docs' },
  ];

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Claim Badges', path: '/claim' },
        { label: 'Leaderboard', path: '/leaderboard' },
        { label: 'My Profile', path: '/profile' },
        { label: 'History', path: '/history' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', path: '#' },
        { label: 'API Reference', path: '#' },
        { label: 'Tutorials', path: '#' },
        { label: 'Blog', path: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '#' },
        { label: 'Careers', path: '#' },
        { label: 'Press Kit', path: '#' },
        { label: 'Contact', path: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] backdrop-blur-[20px] bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 max-w-sm">
              The future of professional certification. Earn, own, and showcase verified credentials
              as blockchain-backed NFTs.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-200"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4
                className="text-sm mb-4"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.path.startsWith('#') ? (
                      <a
                        href={link.path}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 SkillStamp. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
