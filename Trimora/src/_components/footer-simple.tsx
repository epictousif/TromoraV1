import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function TrimoraFooter() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-primary">Trimora</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your trusted platform for booking salon, spa and wellness services locally. Discover and book the best
                beauty and wellness experiences in your area.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@trimora.com</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press-media" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/salons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Salon Booking
                </Link>
              </li>
              <li>
                <Link to="/spas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Spa Services
                </Link>
              </li>
              <li>
                <Link
                  to="/wellness"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Wellness Centers
                </Link>
              </li>
              <li>
                <Link to="/beauty" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Beauty Treatments
                </Link>
              </li>
              <li>
                <Link to="/massage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Massage Therapy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/booking-support"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Booking Support
                </Link>
              </li>
              <li>
                <Link
                  to="/partner-support"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partner Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Follow Us:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/trimora"
                  className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors"
                  aria-label="Follow us on Facebook"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                </a>
                <a
                  href="https://instagram.com/trimora"
                  className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors"
                  aria-label="Follow us on Instagram"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                </a>
                <a
                  href="https://twitter.com/trimora"
                  className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors"
                  aria-label="Follow us on Twitter"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4 text-blue-400" />
                </a>
                <a
                  href="https://youtube.com/trimora"
                  className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors"
                  aria-label="Subscribe to our YouTube channel"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                </a>
                <a
                  href="https://linkedin.com/company/trimora"
                  className="p-2 rounded-full bg-white border hover:bg-gray-50 transition-colors"
                  aria-label="Connect with us on LinkedIn"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4 text-blue-700" />
                </a>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">© 2025 Trimora. All rights reserved.</div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Download our app for the best booking experience</p>
            <div className="flex justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="text-xs">
                  <div>Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="text-xs">
                  <div>Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
