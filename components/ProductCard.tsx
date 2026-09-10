
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
  variant = 'compact',
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
      bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full group relative cursor-pointer
      shadow-2xs hover:shadow-xs border border-gray-100 hover:border-${accentColor}-200
      ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-10' : ''}
    `}>
      
      {!isAdmin && onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute z-30 p-1.5 sm:p-2 transition-colors top-0 right-0 text-gray-300 hover:text-red-400"
        >
          <Heart 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""} drop-shadow-xs`} 
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
          className="absolute z-20 bg-white/90 rounded-full shadow-xs text-gray-500 hover:text-blue-600 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity top-1 left-1 p-1"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      )}

      <div className="aspect-square w-full relative overflow-hidden bg-gray-50">
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
             absolute top-0 left-0 bg-${accentColor}-500 text-white font-bold rounded-br-lg shadow-xs flex items-center z-10 text-[8px] sm:text-[9px] px-1.5 py-0.5
           `}>
             {product.discountPercentage}
           </div>
        )}
      </div>

      <div className="p-2 pt-1.5 sm:p-2.5 sm:pt-2 flex-1 flex flex-col justify-between">
        <div>
           <h3 className="font-bold text-gray-800 line-clamp-2 text-[10px] sm:text-[11.5px] leading-snug" title={product.productName}>
            {product.productName}
          </h3>
          
          {/* Expiry Date Display if present */}
          {product.expiryDate && (
             <div className="flex items-center gap-1 text-[8.5px] text-gray-400 mt-1">
                <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                <span className="truncate">Bitmə: {new Date(product.expiryDate).toLocaleDateString('az-AZ')}</span>
             </div>
          )}
          
          {hasCheaperAlternative && (
            <div className="mt-1">
              <div className="inline-flex items-center gap-1 bg-green-100 border border-green-200 text-green-700 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-bold">
                <TrendingDown className="w-2.5 h-2.5" />
                Daha Ucuzu Var
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-end justify-between">
          <div className="flex flex-col">
            {product.oldPrice && product.oldPrice !== '---' ? (
              <span className="text-gray-400 line-through text-[8.5px] sm:text-[9.5px] leading-none mb-0.5">
                {product.oldPrice}
              </span>
            ) : null}
            <span className={`font-black text-${accentColor}-600 leading-none text-xs sm:text-sm`}>
              {product.newPrice} <span className="text-[0.7em]">₼</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
