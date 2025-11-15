export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
          <p className="text-sm text-green-600 mt-2">↑ 5% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Providers</h3>
          <p className="text-3xl font-bold text-purple-600">89</p>
          <p className="text-sm text-green-600 mt-2">↑ 3% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Active Deals</h3>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-600 mt-2">No change</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-orange-600">$234,567</p>
          <p className="text-sm text-green-600 mt-2">↑ 15% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600">john.doe@example.com</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Customer</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-gray-600">jane.smith@example.com</p>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Provider</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">Bob Johnson</p>
                <p className="text-sm text-gray-600">bob.johnson@example.com</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Customer</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Alice Williams</p>
                <p className="text-sm text-gray-600">alice.williams@example.com</p>
              </div>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Provider</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Deals</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">Premium Coffee Subscription</p>
                <p className="text-sm text-gray-600">Coffee Corner</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">Fitness Gym Membership</p>
                <p className="text-sm text-gray-600">FitZone Gym</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold">Restaurant Dinner for Two</p>
                <p className="text-sm text-gray-600">Bella Vista Restaurant</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Spa Day Package</p>
                <p className="text-sm text-gray-600">Serenity Spa</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Approval Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Provider Approval Queue</h2>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            3 Pending
          </span>
        </div>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Coffee Corner</h3>
                <p className="text-sm text-gray-600">coffee@example.com</p>
                <p className="text-sm text-gray-500 mt-1">Categories: Food & Beverage</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                  Reject
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700">Premium coffee shop offering specialty coffee subscriptions...</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">Digital Marketing Pro</h3>
                <p className="text-sm text-gray-600">marketing@example.com</p>
                <p className="text-sm text-gray-500 mt-1">Categories: Marketing Services</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm">
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                  Reject
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700">Full-service digital marketing agency...</p>
          </div>
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Category Management</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            Add Category
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Food & Beverage', 'Fitness', 'Dining', 'Wellness', 'Education', 'Beauty', 'Marketing Services'].map((cat) => (
            <div key={cat} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{cat}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm">
                  Edit
                </button>
                <button className="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm">
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-gray-600 text-sm mb-2">Deals by Category</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Food & Beverage</span>
                <span className="text-sm font-semibold">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fitness</span>
                <span className="text-sm font-semibold">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Dining</span>
                <span className="text-sm font-semibold">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Wellness</span>
                <span className="text-sm font-semibold">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Other</span>
                <span className="text-sm font-semibold">26</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm mb-2">User Growth</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">This Month</span>
                <span className="text-sm font-semibold text-green-600">+62</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Month</span>
                <span className="text-sm font-semibold">+58</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Quarter</span>
                <span className="text-sm font-semibold text-green-600">+185</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-600 text-sm mb-2">Revenue Trends</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">This Month</span>
                <span className="text-sm font-semibold text-green-600">$45,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Month</span>
                <span className="text-sm font-semibold">$39,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">This Quarter</span>
                <span className="text-sm font-semibold text-green-600">$134,567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

