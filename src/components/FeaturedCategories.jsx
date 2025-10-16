import { Smartphone, Car, Home, Sofa, Shirt, Briefcase, Wrench, Package } from 'lucide-react'

const CATEGORIES = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { name: 'Vehicles', icon: Car, color: 'bg-red-100 text-red-600' },
  { name: 'Real Estate', icon: Home, color: 'bg-green-100 text-green-600' },
  { name: 'Furniture', icon: Sofa, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Jobs', icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { name: 'Services', icon: Wrench, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Other', icon: Package, color: 'bg-gray-100 text-gray-600' },
]

const FeaturedCategories = ({ onCategoryClick }) => {
  return (
    <div className="py-12 bg-white rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-600">Find exactly what you're looking for</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 px-6">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.name}
              onClick={() => onCategoryClick(category.name)}
              className="flex flex-col items-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-300 hover:-translate-y-1 group"
            >
              <div className={`${category.color} p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                <Icon size={32} strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-primary-600 transition-colors">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedCategories
