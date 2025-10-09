export const Footer = () => {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <img src="/favicon.png" alt="Shalean Logo" className="w-5 h-5" />
              <span>Shalean</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional cleaning services across Cape Town. Quality you can trust.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/services" className="hover:text-primary transition-colors">Standard Cleaning</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Deep Cleaning</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Move In/Out</a></li>
              <li><a href="/services" className="hover:text-primary transition-colors">Specialized Services</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Our Team</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cape Town, South Africa</li>
              <li>info@shalean.co.za</li>
              <li>+27 21 123 4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Shalean Cleaning Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
