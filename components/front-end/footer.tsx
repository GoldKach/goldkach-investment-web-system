import { Facebook, Instagram, Youtube, MessageCircle, Music } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-navy-dark border-t border-golden/20 mt-20">
      <div className="px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-golden font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@moviechamp.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Cinema Street</p>
              <p>Los Angeles, CA 90028</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-golden font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/mobile" className="block text-muted-foreground hover:text-golden transition-colors">
                Mobile App
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-golden transition-colors">
                About Us
              </Link>
              <Link href="/help" className="block text-muted-foreground hover:text-golden transition-colors">
                Help Center
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-golden transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-golden font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light hover:bg-golden/20 border border-golden/30 hover:border-golden flex items-center justify-center transition-all duration-300 group"
              >
                <Facebook className="w-5 h-5 text-golden group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light hover:bg-golden/20 border border-golden/30 hover:border-golden flex items-center justify-center transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-golden group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light hover:bg-golden/20 border border-golden/30 hover:border-golden flex items-center justify-center transition-all duration-300 group"
              >
                <Youtube className="w-5 h-5 text-golden group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light hover:bg-golden/20 border border-golden/30 hover:border-golden flex items-center justify-center transition-all duration-300 group"
              >
                <Music className="w-5 h-5 text-golden group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-navy-light hover:bg-golden/20 border border-golden/30 hover:border-golden flex items-center justify-center transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 text-golden group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Download App */}
          <div className="space-y-4">
            <h3 className="text-golden font-semibold text-lg mb-4">Get the App</h3>
            <p className="text-sm text-muted-foreground mb-4">Watch movies on the go with our mobile app</p>
            <Link
              href="/mobile"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-golden to-golden-light text-navy-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-golden/30 transition-all duration-300 text-sm"
            >
              Download Now
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-golden/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Movie Champ. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Designed by <span className="text-golden font-semibold">Owen</span> with{" "}
            <span className="text-red-500 animate-pulse">♥</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
