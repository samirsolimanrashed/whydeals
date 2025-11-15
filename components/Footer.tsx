export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Why Deals</h3>
            <p className="text-gray-400">
              Your one-stop destination for amazing deals from local providers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="/provider/dashboard" className="hover:text-white transition">Provider Dashboard</a>
              </li>
              <li>
                <a href="/admin/dashboard" className="hover:text-white transition">Admin Dashboard</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Email: support@whydeals.com
              <br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Why Deals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

