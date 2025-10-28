import { Heart, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-green-600 fill-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mumbies</span>
            </div>
            <p className="text-gray-600 text-sm">
              Every purchase supports animal rescues and shelters. Shop with purpose.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop?category=food" className="text-gray-600 hover:text-green-600">Food</a></li>
              <li><a href="/shop?category=treats" className="text-gray-600 hover:text-green-600">Treats</a></li>
              <li><a href="/shop?category=toys" className="text-gray-600 hover:text-green-600">Toys</a></li>
              <li><a href="/shop?category=accessories" className="text-gray-600 hover:text-green-600">Accessories</a></li>
              <li><a href="/brands" className="text-gray-600 hover:text-green-600">All Brands</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Our Mission</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/impact" className="text-gray-600 hover:text-green-600">Our Impact</a></li>
              <li><a href="/rescues" className="text-gray-600 hover:text-green-600">Partner Rescues</a></li>
              <li><a href="/partner/apply" className="text-gray-600 hover:text-green-600">Become a Partner</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-green-600">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/account" className="text-gray-600 hover:text-green-600">My Account</a></li>
              <li><a href="/help" className="text-gray-600 hover:text-green-600">Help Center</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-green-600">Contact Us</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-green-600">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-green-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Mumbies. Every purchase makes a difference.</p>
        </div>
      </div>
    </footer>
  );
}
