import { ArrowRight } from 'lucide-react'

const PromoBanner = () => {
  const handleClick = () => {
    window.open('https://tunisia-pro-connect-02-84-main-jyny.vercel.app/services', '_blank')
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden rounded-2xl shadow-2xl my-8 sm:my-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center p-6 sm:p-8 md:p-12">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-6 z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            ServiGO
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
            Trouvez rapidement des techniciens qualifiés, ingénieurs et travailleurs pour tous vos besoins professionnels !
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center space-x-2 bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span>Voir Plus</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Image */}
        <div className="relative z-10 hidden lg:block">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop" 
              alt="Professional Workers"
              className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Mobile Image */}
        <div className="relative z-10 lg:hidden">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop" 
            alt="Professional Workers"
            className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 -ml-32 -mb-32"></div>
    </div>
  )
}

export default PromoBanner
