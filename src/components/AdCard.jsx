import { Link } from 'react-router-dom'
import { MapPin, Calendar, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const AdCard = ({ ad }) => {
  const imageUrl = ad.images && ad.images.length > 0 
    ? ad.images[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image'

  return (
    <Link 
      to={`/ads/${ad.id}`} 
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-3 flex flex-col h-full"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300 pointer-events-none"></div>

      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        <img 
          src={imageUrl} 
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
        
        {/* Premium Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge - Premium Style */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center space-x-1.5 bg-white/95 backdrop-blur-xl text-gray-900 text-xs font-black px-3 py-2 rounded-full shadow-xl border border-white/30 hover:bg-white transition-all duration-300 group-hover:scale-110">
            <Tag size={13} className="text-primary-600" />
            <span>{ad.category}</span>
          </span>
        </div>

        {/* Premium Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-black px-2.5 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
            ⭐ Featured
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-5">
        {/* Title */}
        <h3 className="font-black text-base sm:text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
          {ad.title}
        </h3>

        {/* Price - Premium Gradient */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-600 via-primary-500 to-blue-600 bg-clip-text text-transparent">
              {ad.price.toLocaleString()}
            </p>
            <span className="text-gray-600 font-bold text-sm">TND</span>
          </div>
        </div>

        {/* Location & Time - Modern Layout */}
        <div className="space-y-2.5 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs sm:text-sm text-gray-700 font-bold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600 mr-2.5 flex-shrink-0 group-hover:bg-primary-100 transition-colors">
              <MapPin size={15} />
            </div>
            <span className="truncate">{ad.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-600 font-bold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 mr-2.5 flex-shrink-0 group-hover:bg-gray-200 transition-colors">
              <Calendar size={15} />
            </div>
            <span className="truncate">{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AdCard
