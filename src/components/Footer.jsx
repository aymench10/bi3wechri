import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div>
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-bold text-lg inline-block mb-4 shadow-lg">
              Bi3wEchri
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed font-medium">
              Tunisia's leading marketplace for buying and selling. Find great deals or list your items easily.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-white/10 hover:bg-primary-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 border border-white/20">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 border border-white/20">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary-600 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 border border-white/20">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3 text-slate-300">
              <li><Link to="/" className="hover:text-primary-300 transition-colors font-medium">Home</Link></li>
              <li><Link to="/create-ad" className="hover:text-primary-300 transition-colors font-medium">Post Ad</Link></li>
              <li><Link to="/my-ads" className="hover:text-primary-300 transition-colors font-medium">My Ads</Link></li>
              <li><Link to="/favorites" className="hover:text-primary-300 transition-colors font-medium">Favorites</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Categories</h3>
            <ul className="space-y-3 text-slate-300">
              <li><a href="#" className="hover:text-primary-300 transition-colors font-medium">Electronics</a></li>
              <li><a href="#" className="hover:text-primary-300 transition-colors font-medium">Vehicles</a></li>
              <li><a href="#" className="hover:text-primary-300 transition-colors font-medium">Immobilier</a></li>
              <li><a href="#" className="hover:text-primary-300 transition-colors font-medium">Fashion</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Contact Us</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center space-x-3">
                <div className="bg-primary-600/20 p-2 rounded-lg border border-primary-500/30">
                  <Mail size={18} className="text-primary-300" />
                </div>
                <span className="font-medium">support@bi3wechri.tn</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-primary-600/20 p-2 rounded-lg border border-primary-500/30">
                  <Phone size={18} className="text-primary-300" />
                </div>
                <span className="font-medium">+216 21 852 008</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-primary-600/20 p-2 rounded-lg border border-primary-500/30">
                  <MapPin size={18} className="text-primary-300" />
                </div>
                <span className="font-medium">Tunis, Tunisia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-300 text-sm gap-4">
            <p className="font-medium">&copy; {new Date().getFullYear()} Bi3wEchri. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary-300 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-primary-300 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="hover:text-primary-300 transition-colors font-medium">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
