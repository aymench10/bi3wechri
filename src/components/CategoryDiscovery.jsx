import { ChevronRight } from 'lucide-react'

const CATEGORY_SECTIONS = [
  {
    title: 'Véhicules',
    categoryKey: 'Vehicles',
    categories: [
      { name: 'Motos', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop' },
      { name: 'Voitures', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop' },
      { name: 'Camions', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop' },
      { name: 'Pièces de rechange', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop' },
    ]
  },
  {
    title: 'Immobilier',
    categoryKey: 'Real Estate',
    categories: [
      { name: 'Maison et Villa', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop' },
      { name: 'Magasins', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop' },
      { name: 'Colocations', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop' },
      { name: 'Location de vacances', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop' },
    ]
  },
  {
    title: 'Informatique et Multimédias',
    categoryKey: 'Informatique et Multimedia',
    categories: [
      { name: 'Appareils Photos', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop' },
      { name: 'Télévisions', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop' },
      { name: 'Ordinateurs Portables', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop' },
      { name: 'Téléphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' },
    ]
  },
  {
    title: 'Habillement et bien-être',
    categoryKey: 'Fashion',
    categories: [
      { name: 'Vêtement pour enfants', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop' },
      { name: 'Bijoux', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop' },
      { name: 'Vêtements', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop' },
      { name: 'Produits de beauté', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop' },
    ]
  }
]

const CategoryDiscovery = ({ onCategoryClick }) => {
  const handleCategoryClick = (categoryKey) => {
    if (onCategoryClick) {
      onCategoryClick(categoryKey)
    }
    // Scroll to ads section
    setTimeout(() => {
      const adsSection = document.getElementById('ads-section')
      if (adsSection) {
        adsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Découvrez notre univers
          </h2>
          <button 
            onClick={() => handleCategoryClick('All')}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm sm:text-base font-semibold transition-colors group"
          >
            <span className="hidden sm:inline">Afficher plus</span>
            <span className="sm:hidden">Plus</span>
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CATEGORY_SECTIONS.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-3 sm:space-y-4">
              {/* Section Title */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                {section.title}
              </h3>
              
              {/* Category Cards */}
              <div className="grid grid-cols-2 gap-3">
                {section.categories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryClick(section.categoryKey)}
                    className="group relative overflow-hidden rounded-xl aspect-square shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Text */}
                    <div className="absolute inset-0 flex items-end p-2 sm:p-3">
                      <span className="text-white font-semibold text-xs sm:text-sm leading-tight drop-shadow-lg">
                        {category.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* View More Link */}
              <button 
                onClick={() => handleCategoryClick(section.categoryKey)}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-3 group"
              >
                Voir plus
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryDiscovery
