import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              Bi3wEchri
            </div>
            <p className="text-gray-400 mb-4">
              Tunisia's leading marketplace for buying and selling. Find great deals or list your items easily.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-700 p-2 rounded-full hover:bg-primary-600 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/create-ad" className="hover:text-primary-400 transition-colors">Post Ad</Link></li>
              <li><Link to="/my-ads" className="hover:text-primary-400 transition-colors">My Ads</Link></li>
              <li><Link to="/favorites" className="hover:text-primary-400 transition-colors">Favorites</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Electronics</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Vehicles</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Immobilier</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Fashion</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary-500" />
                <span>support@bi3wechri.tn</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary-500" />
                <span>+216 21 852 008</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} className="text-primary-500" />
                <span>Tunis, Tunisia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Bi3wEchri. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
