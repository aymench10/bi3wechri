import { 
  Laptop, 
  CarFront, 
  Building2, 
  Armchair, 
  ShoppingBag, 
  UserCheck, 
  Settings, 
  MoreHorizontal, 
  Sparkles 
} from 'lucide-react'

const CATEGORIES = [
  { 
    name: 'Informatique et Multimedia', 
    icon: Laptop, 
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-100',
    hoverGradient: 'hover:from-blue-500 hover:to-cyan-600',
    iconColor: 'text-blue-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Vehicles', 
    icon: CarFront, 
    gradient: 'from-red-500 to-orange-600',
    bgGradient: 'from-red-50 to-orange-100',
    hoverGradient: 'hover:from-red-500 hover:to-orange-600',
    iconColor: 'text-red-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Immobilier', 
    icon: Building2, 
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-100',
    hoverGradient: 'hover:from-green-500 hover:to-emerald-600',
    iconColor: 'text-green-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Furniture', 
    icon: Armchair, 
    gradient: 'from-amber-500 to-yellow-600',
    bgGradient: 'from-amber-50 to-yellow-100',
    hoverGradient: 'hover:from-amber-500 hover:to-yellow-600',
    iconColor: 'text-amber-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Fashion', 
    icon: ShoppingBag, 
    gradient: 'from-pink-500 to-rose-600',
    bgGradient: 'from-pink-50 to-rose-100',
    hoverGradient: 'hover:from-pink-500 hover:to-rose-600',
    iconColor: 'text-pink-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Jobs', 
    icon: UserCheck, 
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-100',
    hoverGradient: 'hover:from-purple-500 hover:to-violet-600',
    iconColor: 'text-purple-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Services', 
    icon: Settings, 
    gradient: 'from-indigo-500 to-blue-600',
    bgGradient: 'from-indigo-50 to-blue-100',
    hoverGradient: 'hover:from-indigo-500 hover:to-blue-600',
    iconColor: 'text-indigo-600',
    hoverIconColor: 'group-hover:text-white'
  },
  { 
    name: 'Other', 
    icon: MoreHorizontal, 
    gradient: 'from-slate-500 to-gray-600',
    bgGradient: 'from-slate-50 to-gray-100',
    hoverGradient: 'hover:from-slate-500 hover:to-gray-600',
    iconColor: 'text-slate-600',
    hoverIconColor: 'group-hover:text-white'
  },
]

const FeaturedCategories = ({ onCategoryClick }) => {
  const handleCategoryClick = (categoryName) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName)
    }
  }

  return (
    <div className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-lg border border-gray-100">
      {/* Header with Icon */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
          <Sparkles className="text-white" size={28} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
          Browse by Category
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Find exactly what you're looking for
        </p>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 lg:gap-5 px-4 sm:px-6 lg:px-8">
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative flex flex-col items-center p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-500 bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Icon Container */}
              <div className="relative z-10 mb-3 sm:mb-4">
                <div className={`bg-gradient-to-br ${category.bgGradient} p-4 sm:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon 
                    size={28} 
                    className={`${category.iconColor} ${category.hoverIconColor} transition-colors duration-500 sm:w-8 sm:h-8`} 
                    strokeWidth={2.5} 
                  />
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl"></div>
              </div>
              
              {/* Category Name */}
              <span className="relative z-10 text-xs sm:text-sm font-bold text-gray-800 text-center group-hover:text-white transition-colors duration-500 leading-tight px-2">
                {category.name}
              </span>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FeaturedCategories
