
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
  isAdmin?: boolean;
  hasCheaperAlternative?: boolean; 
  isHighlighted?: boolean;
  id?: string;
  onEdit?: () => void;
  onClick?: () => void;
  variant?: 'default' | 'compact';
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
  isAdmin, 
  hasCheaperAlternative,
  isHighlighted,
  id,
  onEdit, 
  onClick,
  variant = 'default',
  isFavorite,
  onToggleFavorite
}) => {
  const [imageError, setImageError] = useState(false);
  const isCompact = variant === 'compact';

  const imageUrl = product.customImageUrl 
    ? product.customImageUrl 
    : `https://tse2.mm.bing.net/th?q=${encodeURIComponent(product.productName + ' product')}&w=200&h=200&c=7&rs=1&p=0`;

  return (
    <div 
      id={id}
      onClick={onClick}
      className={`
      bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${isCompact ? 'h-auto' : 'h-full'} group relative
      ${isCompact 
        ? `shadow-none border border-${accentColor}-100 cursor-pointer` 
        : `shadow-sm hover:shadow-lg border-2 border-${accentColor}-100 hover:border-${accentColor}-300`
      }
      ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-10' : ''}
    `}>
      
      {!isAdmin && onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute z-30 p-2 transition-colors
            ${isCompact ? 'top-0 right-0' : 'top-1 right-1'}
            ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}
          `}
        >
          <Heart 
            className={`
              ${isCompact ? "w-5 h-5" : "w-7 h-7"} 
              ${isFavorite ? "fill-current" : ""} 
              drop-shadow-sm
            `} 
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
          className={`absolute z-20 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-blue-600 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity
            ${isCompact ? 'top-1 left-1 p-1' : 'top-2 left-2 p-1.5'}
          `}
        >
          <Edit2 className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        </button>
      )}

      <div className="aspect-square w-full relative overflow-hidden bg-gray-50">
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={product.productName}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-${accentColor}-50 flex-col gap-1 text-${accentColor}-300`}>
            {getCategoryIcon(product.category, isCompact)}
          </div>
        )}
        
        {product.discountPercentage && (
           <div className={`
             absolute bg-${accentColor}-500 text-white font-bold rounded-br-lg shadow-sm flex items-center z-10
             ${isCompact 
                ? 'top-0 left-0 text-[8px] px-1.5 py-0.5' 
                : 'top-0 left-0 text-xs px-2 py-1'
             }
           `}>
             {product.discountPercentage}
           </div>
        )}
      </div>

      <div className={`${isCompact ? 'p-2 pt-1.5' : 'p-3'} flex-1 flex flex-col`}>
        <div className={isCompact ? 'mb-0.5' : 'mb-1'}>
           {!isCompact && (
             <span className={`text-[9px] font-bold text-${accentColor}-600 uppercase tracking-wider bg-${accentColor}-50 px-1.5 py-0.5 rounded block w-fit mb-1.5`}>
               {product.category}
             </span>
           )}
           <h3 className={`font-bold text-gray-800 line-clamp-2 ${isCompact ? 'text-[10px] sm:text-[11px] leading-snug' : 'text-xs h-8 leading-tight'}`} title={product.productName}>
            {product.productName}
          </h3>
        </div>
        
        {/* Expiry Date Display */}
        {product.expiryDate && !isCompact && (
           <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>Bitmə: {new Date(product.expiryDate).toLocaleDateString('az-AZ')}</span>
           </div>
        )}
        
        {hasCheaperAlternative && !isCompact && (
          <div className="mt-1">
            <div className="inline-flex items-center gap-1 bg-green-100 border border-green-200 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <TrendingDown className="w-3 h-3" />
              Daha Ucuzu Var
            </div>
          </div>
        )}
        
        <div className={`${isCompact ? 'mt-1 pt-1' : 'mt-auto pt-2'} border-t border-${accentColor}-50 flex items-end justify-between`}>
          <div className="flex flex-col">
            {product.oldPrice && product.oldPrice !== '---' ? (
              <span className={`text-gray-400 line-through ${isCompact ? 'text-[9px] leading-none mb-0.5' : 'text-[10px]'}`}>
                {product.oldPrice}
              </span>
            ) : null}
            <span className={`font-black text-${accentColor}-600 leading-none ${isCompact ? 'text-sm' : 'text-base'}`}>
              {product.newPrice} <span className="text-[0.7em]">₼</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
