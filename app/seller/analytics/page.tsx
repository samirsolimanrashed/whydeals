export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Total Views</h3>
          <p className="text-3xl font-bold text-primary-blue">12,450</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-indigo-600">892</p>
          <p className="text-sm text-green-600 mt-2">↑ 15% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Total Shares</h3>
          <p className="text-3xl font-bold text-pink-600">156</p>
          <p className="text-sm text-green-600 mt-2">↑ 22% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Total Purchases</h3>
          <p className="text-3xl font-bold text-purple-600">342</p>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-green-600">2.75%</p>
          <p className="text-sm text-green-600 mt-2">↑ 0.5% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Click-Through Rate</h3>
          <p className="text-3xl font-bold text-cyan-600">7.16%</p>
          <p className="text-sm text-green-600 mt-2">↑ 0.3% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-orange-600">$89.50</p>
          <p className="text-sm text-red-600 mt-2">↓ 3% from last month</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-600">$30,609</p>
          <p className="text-sm text-green-600 mt-2">↑ 5% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Top Performing Deals</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold dark:text-foreground">Premium Coffee Subscription</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">123 purchases</p>
              </div>
              <span className="text-green-600 font-semibold">$4,917</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold dark:text-foreground">Fitness Gym Membership</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">89 purchases</p>
              </div>
              <span className="text-green-600 font-semibold">$13,349</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold dark:text-foreground">Restaurant Dinner for Two</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">67 purchases</p>
              </div>
              <span className="text-green-600 font-semibold">$5,359</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold dark:text-foreground">Spa Day Package</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">45 purchases</p>
              </div>
              <span className="text-green-600 font-semibold">$5,399</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Revenue by Category</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">Food & Beverage</span>
                <span className="text-sm font-semibold dark:text-foreground">$4,917</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-blue h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">Fitness</span>
                <span className="text-sm font-semibold dark:text-foreground">$13,349</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">Dining</span>
                <span className="text-sm font-semibold dark:text-foreground">$5,359</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">Wellness</span>
                <span className="text-sm font-semibold dark:text-foreground">$5,399</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 pb-3 border-b">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm dark:text-gray-300">
                <span className="font-semibold dark:text-foreground">Premium Coffee Subscription</span> - New purchase
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">2 minutes ago</p>
            </div>
            <span className="text-sm font-semibold text-green-600">+$39.99</span>
          </div>
          <div className="flex items-center space-x-4 pb-3 border-b">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm dark:text-gray-300">
                <span className="font-semibold dark:text-foreground">Fitness Gym Membership</span> - New purchase
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">15 minutes ago</p>
            </div>
            <span className="text-sm font-semibold text-green-600">+$149.99</span>
          </div>
          <div className="flex items-center space-x-4 pb-3 border-b">
            <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm dark:text-gray-300">
                <span className="font-semibold dark:text-foreground">Restaurant Dinner for Two</span> - Deal created
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm dark:text-gray-300">
                <span className="font-semibold dark:text-foreground">Spa Day Package</span> - New purchase
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
            </div>
            <span className="text-sm font-semibold text-green-600">+$119.99</span>
          </div>
        </div>
      </div>
    </div>
  )
}

