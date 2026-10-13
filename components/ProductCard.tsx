
import React, { useState } from 'react';
import { DiscountProduct, ProductCategory } from '../types';
import { 
  Apple, 
  Beef, 
  Milk, 
  Wheat, 
  Coffee, 
  Cookie, 
  SprayCan, 
  Sparkles, 
  Home, 
  Baby, 
  Package,
  Edit2,
  TrendingDown,
  Heart,
  Clock
} from 'lucide-react';

interface ProductCardProps {
  product: DiscountProduct;
  accentColor: string;
  catalogEndDate?: string;
  hideCountdown?: boolean;
  isAdmin?: boolean;
  hasCheaperAlternative?: boolean; 
  isHighlighted?: boolean;
  id?: string;
  onEdit?: () => void;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'mini';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const getCategoryIcon = (category: ProductCategory, isCompact: boolean) => {
  const iconClass = isCompact ? "w-3 h-3" : "w-5 h-5"; 
  switch (category) {
    case 'Meyvə & Tərəvəz': return <Apple className={iconClass} />;
    case 'Ət & Toyuq': return <Beef className={iconClass} />;
    case 'Süd & Səhər Yeməyi': return <Milk className={iconClass} />;
    case 'Qida & Paxlalılar': return <Wheat className={iconClass} />;
    case 'İçkilər': return <Coffee className={iconClass} />;
    case 'Qəlyanaltı': return <Cookie className={iconClass} />;
    case 'Təmizlik': return <SprayCan className={iconClass} />;
    case 'Şəxsi Baxım': return <Sparkles className={iconClass} />;
    case 'Ev & Həyat': return <Home className={iconClass} />;
    case 'Uşaq': return <Baby className={iconClass} />;
    default: return <Package className={iconClass} />;
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  accentColor, 
  catalogEndDate,
  hideCountdown = false,
  isAdmin, 
  hasCheaperAlternative,
  isHighlighted,
  id,
  onEdit, 
  onClick, 
  variant = 'compact',
  isFavorite,
  onToggleFavorite
}) => {
  const [imageError, setImageError] = useState(false);
  const isMini = variant === 'mini';
  const isCompact = variant === 'compact' || isMini;

  const imageUrl = product.customImageUrl 
    ? product.customImageUrl 
    : `https://tse2.mm.bing.net/th?q=${encodeURIComponent(product.productName + ' product')}&w=200&h=200&c=7&rs=1&p=0`;

  return (
    <div 
      id={id}
      onClick={onClick}
      className={`
      bg-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full group relative cursor-pointer
      shadow-2xs hover:shadow-xs border border-gray-100 hover:border-${accentColor}-200
      ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-10' : ''}
    `}>
      
      {!isAdmin && onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute z-30 transition-colors top-0 right-0 text-gray-300 hover:text-red-400 ${isMini ? 'p-1' : 'p-1.5 sm:p-2'}`}
        >
          <Heart 
            className={`${isMini ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4 sm:w-5 sm:h-5"} ${isFavorite ? "fill-red-500 text-red-500" : ""} drop-shadow-xs`} 
            strokeWidth={2} 
          />
        </button>
      )}

      {isAdmin && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
          }}
          className="absolute z-20 bg-white/90 rounded-full shadow-xs text-gray-500 hover:text-blue-600 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity top-1 left-1 p-0.5 sm:p-1"
        >
          <Edit2 className={isMini ? "w-2.5 h-2.5 sm:w-3 sm:h-3" : "w-3 h-3"} />
        </button>
      )}

      <div className={`${isMini ? 'aspect-[4/3]' : 'aspect-square'} w-full relative overflow-hidden bg-gray-50`}>
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={product.productName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-${accentColor}-50 flex-col gap-1 text-${accentColor}-300`}>
            {getCategoryIcon(product.category, true)}
          </div>
        )}
        
        {product.discountPercentage && (
           <div className={`
             absolute top-0 left-0 bg-${accentColor}-500 text-white font-bold rounded-br-lg shadow-xs flex items-center z-10
             ${isMini ? 'text-[7.5px] sm:text-[8.5px] px-1.5 py-0.5' : 'text-[8px] sm:text-[9px] px-1.5 py-0.5'}
           `}>
             {product.discountPercentage}
           </div>
        )}
      </div>

      <div className={`${isMini ? 'p-1.5 pt-1 sm:p-2 sm:pt-1.5' : 'p-2 pt-1.5 sm:p-2.5 sm:pt-2'} flex-1 flex flex-col justify-between`}>
        <div>
           <h3 className={`font-bold text-gray-800 line-clamp-2 ${isMini ? 'text-[9.5px] sm:text-[11px] leading-snug' : 'text-[10px] sm:text-[11.5px] leading-snug'}`} title={product.productName}>
            {product.productName}
          </h3>
          
          
          {hasCheaperAlternative && (
            <div className={isMini ? "mt-0.5" : "mt-1"}>
              <div className={`inline-flex items-center gap-0.5 sm:gap-1 bg-green-100 border border-green-200 text-green-700 rounded font-bold ${isMini ? 'px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px]' : 'px-1.5 py-0.5 text-[8.5px] sm:text-[9.5px]'}`}>
                <TrendingDown className={isMini ? "w-2 h-2" : "w-2.5 h-2.5"} />
                {isMini ? 'Ucuz' : 'Daha Ucuzu Var'}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between gap-1">
          {/* Left: Prices */}
          <div className="flex items-baseline gap-1.5 flex-nowrap whitespace-nowrap overflow-hidden min-w-0">
            <span className={`font-black text-${accentColor}-600 leading-none text-[15px] sm:text-base shrink-0 whitespace-nowrap`}>
              {product.newPrice} <span className="text-[0.75em] font-bold">₼</span>
            </span>
            {product.oldPrice && product.oldPrice !== '---' && (
              <span className="text-gray-400 line-through leading-none font-semibold text-[11px] sm:text-xs shrink-0 whitespace-nowrap">
                {product.oldPrice}
              </span>
            )}
          </div>

          {/* Right: Clock Icon & Remaining Days badge (hidden when hideCountdown is true) */}
          {!hideCountdown && (() => {
            const rawEndDate = product.expiryDate || catalogEndDate;
            let daysLeft: number | null = null;
            if (rawEndDate) {
              const target = new Date(rawEndDate);
              if (!isNaN(target.getTime())) {
                const now = new Date();
                const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const targetMid = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
                daysLeft = Math.round((targetMid - todayMid) / (1000 * 60 * 60 * 24));
              }
            }

            // Colors based on user spec:
            // 1g (<=1) -> red
            // 2g (==2) -> yellow/amber
            // 3g and above (>=3) -> black
            let badgeStyle = "text-gray-900 bg-gray-100 border-gray-200";
            let iconColor = "text-gray-500";
            if (daysLeft !== null) {
              if (daysLeft <= 1) {
                badgeStyle = "text-red-700 bg-red-50 border-red-200/90";
                iconColor = "text-red-600";
              } else if (daysLeft === 2) {
                badgeStyle = "text-amber-800 bg-amber-50 border-amber-300";
                iconColor = "text-amber-600";
              } else {
                badgeStyle = "text-gray-900 bg-gray-100 border-gray-200";
                iconColor = "text-gray-700";
              }
            }

            return (
              <div 
                className="flex items-center gap-0.5 sm:gap-1 shrink-0 select-none"
                title={rawEndDate ? `Endirimin bitməsinə qalan gün: ${daysLeft !== null && daysLeft >= 0 ? `${daysLeft} gün` : 'Bitib'}` : 'Müddətsiz endirim'}
              >
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0">
                  <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${iconColor}`} strokeWidth={2.2} />
                </div>
                {daysLeft !== null && (
                  <span className={`text-[9px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded border leading-none shrink-0 ${badgeStyle}`}>
                    {daysLeft <= 0 ? '0g' : `${daysLeft}g`}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
