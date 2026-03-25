export const MovieCard = ({ movie, color, onEdit, onDelete }) => {
  return (
    <div 
      className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg lg:shadow-xl border border-gray-100 lg:border-0 bg-gradient-to-br from-white/90 to-gray-50 transition-all duration-300 lg:group hover:lg:shadow-2xl hover:lg:-translate-y-1 hover:lg:scale-[1.01]"
      style={{ 
        backgroundImage: `linear-gradient(to bottom right, white 0%, white 50%, ${color.bg}20 100%)`
      }}
    >
      {/* Overlay gradient - desktop only */}
      <div className="absolute inset-0 bg-gradient-to-t from-[color.background]/5 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-500 hidden lg:block" />
      
      <div className="relative flex flex-col lg:flex-row gap-3 lg:gap-4 p-4 lg:p-5 pb-0 lg:pb-12"> {/* Extra pb on desktop */}
        {/* Enhanced Thumbnail with glow - responsive */}
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0 shadow-md lg:shadow-lg ring-1 lg:ring-2 ring-gray-100/50 lg:ring-white/50 transition-all duration-300 lg:group-hover:ring-[color.bg]/30" style={{ backgroundColor: color.bg }}>
          {movie.movie.thumbnail ? (
            <img
              src={movie.movie.thumbnail}
              alt={movie.movie.movieName}
              className="w-full h-full object-cover lg:group-hover:scale-105 lg:transition-transform lg:duration-500"
              onError={e => e.target.style.display = 'none'}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xl lg:text-2xl font-bold shadow-inner"
              style={{ background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})` }}
            >
              {movie.movie.movieName[0]}
            </div>
          )}
          {/* Genre badge - always visible, responsive */}
          <div className="absolute -top-1 -right-1 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full text-xs font-bold shadow-md lg:shadow-lg drop-shadow-sm lg:drop-shadow-md lg:rotate-[-3deg] lg:group-hover:rotate-0 lg:transition-all lg:duration-300" 
               style={{ background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})`, color: color.textColor }}>
            {movie.movie.genre}
          </div>
        </div>

        {/* Info - responsive layout */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 lg:bg-gradient-to-r lg:from-gray-900 lg:to-gray-700 lg:bg-clip-text lg:text-transparent mb-2 lg:mb-1.5 leading-tight lg:group-hover:from-[color.background] lg:group-hover:to-[color.messageColor] lg:transition-all lg:duration-500 truncate">
            {movie.movie.movieName}
          </h3>
          
          {movie.movie.description && (
            <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-3 line-clamp-2 lg:line-clamp-2 leading-relaxed lg:group-hover:text-gray-700 lg:transition-colors">
              {movie.movie.description}
            </p>
          )}

          {/* Bottom info bar - always visible, responsive */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
            {/* Left: user/room - stacked on mobile */}
            <div className="flex gap-1 flex-row items-center gap-4 text-xs lg:text-sm order-2 lg:order-1">
              <div className="flex items-center gap-1 font-semibold" style={{ color: color.messageColor }}>
                <span className="text-lg lg:text-xl">👤</span>
                <span className="truncate">{movie.username}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <span className="text-base lg:text-lg">🏠</span>
                <span className="truncate">{movie.roomName}</span>
              </div>
            </div>
            
            {/* Right: upvote + watch - always visible, right-aligned on mobile */}
            <div className="flex items-center justify-end gap-2 lg:gap-3 order-1 lg:order-2 w-full lg:w-auto mb-2 lg:mb-0">
              {/* Upvote - static with subtle hover, NO arrow */}
              <button className="flex flex-col items-center p-1.5 lg:p-2 rounded-lg lg:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 min-w-[44px]" style={{ 
                backgroundColor: color.bg, 
                border: `1px solid ${color.background}20`,
                color: color.background 
              }}>
                <span className="text-sm lg:text-lg font-bold">{movie.movie.votes}</span>
              </button>
              
              {/* Watch button - always prominent */}
              <a
                href={movie.movie.watchLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 lg:gap-1.5 px-3 lg:px-4 py-2 lg:py-2 rounded-lg lg:rounded-xl font-semibold text-xs lg:text-sm shadow-md lg:shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${color.background}, ${color.messageColor})`, 
                  color: color.textColor 
                }}
              >
                Watch 
                <span className="text-xs lg:text-xs translate-x-0 hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Actions bar - always visible, proper responsive positioning */}
      {(onEdit || onDelete) && (
        <div className="bg-gray-50/90 lg:bg-white/95 backdrop-blur-md border-t border-gray-200 lg:border-[color.bg]/30 pt-3 px-4 lg:pt-3 lg:px-5 pb-4 shadow-md lg:shadow-2xl w-full">
          <div className="flex gap-2 justify-center max-w-full">
            {onEdit && (
              <button
                className="flex-1 max-w-xs py-2 px-4 lg:py-2.5 lg:px-6 text-xs font-bold rounded-lg lg:rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95 border border-gray-200"
                style={{ 
                  backgroundColor: color.bg, 
                  color: color.background 
                }}
                onClick={onEdit}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="flex-1 max-w-xs py-2 px-4 lg:py-2.5 lg:px-6 text-xs font-bold rounded-lg lg:rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95 hover:bg-red-50"
                style={{ color: '#ef4444' }}
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};




