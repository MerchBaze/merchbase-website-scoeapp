import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg mb-4">MerchBase</h3>
            <p className="text-muted-foreground text-sm">
              Building websites that attract clients, build trust, and outshine your competition.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/assessment" className="text-muted-foreground hover:text-accent transition-colors font-semibold">Free Assessment</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog?category=Web+Design" className="text-muted-foreground hover:text-foreground transition-colors">Web Design Tips</Link></li>
              <li><Link to="/blog?category=SEO" className="text-muted-foreground hover:text-foreground transition-colors">SEO Strategies</Link></li>
              <li><Link to="/blog?category=Marketing" className="text-muted-foreground hover:text-foreground transition-colors">Marketing Insights</Link></li>
              <li><Link to="/blog?category=Case+Studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-muted-foreground text-sm">
              Email: hello@merchbase.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MerchBase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
