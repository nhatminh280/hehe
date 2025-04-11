export default function StatCard({ icon, title, value, trend, bgColor }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          <div
            className={`${bgColor} rounded-full w-12 h-12 flex items-center justify-center`}
          >
            {icon}
          </div>

          <div>
            <p className="text-gray-500 font-medium">{title}</p>
            <div className="flex items-center mt-1">
              <h3 className="text-3xl font-bold mr-2 text-gray-800">{value}</h3>
              {trend && (
                <div
                  className={`flex items-center text-sm ${
                    trend.isPositive
                      ? "text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30"
                      : "text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30"
                  } px-2 py-0.5 rounded-full`}
                >
                  {trend.icon}
                  <span className="font-medium">{trend.value}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
