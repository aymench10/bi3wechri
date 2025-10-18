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
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img 
          src={imageUrl} 
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center space-x-1 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            <Tag size={12} />
            <span>{ad.category}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
          {ad.title}
        </h3>

        {/* Price */}
        <div className="mb-3 sm:mb-4">
          <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            {ad.price.toLocaleString()} TND
          </p>
        </div>

        {/* Location & Time */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 mr-2">
              <MapPin size={14} className="sm:w-4 sm:h-4 text-gray-600" />
            </div>
            <span className="font-medium truncate">{ad.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 mr-2">
              <Calendar size={14} className="sm:w-4 sm:h-4 text-gray-500" />
            </div>
            <span className="truncate">{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default AdCard
