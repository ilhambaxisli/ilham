
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import GroupedProductCard from './components/GroupedProductCard';
import ScannerModal from './components/ScannerModal';
import AdminLoginModal from './components/AdminLoginModal';
import Banner from './components/Banner';
import BannerEditorModal from './components/BannerEditorModal';
import AddMarketModal from './components/AddMarketModal';
import EditMarketModal from './components/EditMarketModal';
import EditProductModal from './components/EditProductModal';
import DatabaseModal from './components/DatabaseModal';
import ProductDetailModal from './components/ProductDetailModal';
import SocialDealsModal from './components/SocialDealsModal';
import { MarketData, DiscountProduct, BannerData, SupabaseConfig, Catalog, FavoriteItem } from './types';
import * as supabaseService from './services/supabase';
import { RefreshCw, ShoppingBag, ArrowRight, Loader2, Plus, Trash2, Search, Database, Home, ChevronRight, Store, LayoutList, XCircle, ChevronUp, ChevronDown, Edit, Calendar, Clock, AlertTriangle, CheckCircle2, ShoppingCart, TrendingDown, ArrowLeft, Heart, RotateCcw, Instagram, X, ChevronLeft, Sparkles, ExternalLink, Tag, Percent } from 'lucide-react';

const INITIAL_MARKETS: MarketData[] = [
  {
    id: 'araz',
    name: 'Araz Market',
    lastUpdated: new Date().toISOString(),
    products: [],
    catalogs: [], 
    url: 'https://b7x9kq.arazmarket.az/storage/discount-journal/file/01KADDADDGMJZ39KJDHA1R3H38.pdf',
    themeColor: 'amber', 
    logoPlaceholder: 'A',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Araz_Supermarket_Logo.svg',
    instagramPosts: []
  },
  {
    id: 'oba',
    name: 'Oba Market',
    lastUpdated: new Date().toISOString(),
    products: [],
    catalogs: [],
    url: 'https://oba.az/endirim-jurnali/', 
    themeColor: 'green',
    logoPlaceholder: 'O',
    logoUrl: 'https://seeklogo.com/images/O/oba-market-logo-3626297371-seeklogo.com.png',
    instagramPosts: []
  }
];

const INITIAL_BANNER_1: BannerData = {
  id: 'banner-1',
  isVisible: false,
  title: '',
  imageUrl: '',
  link: ''
};

const INITIAL_BANNER_2: BannerData = {
  id: 'banner-2',
  isVisible: false,
  title: '',
  imageUrl: '',
  link: ''
};

const DEFAULT_SUPABASE_URL = "https://rnqdjdxokcpfwsqkzrfu.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWRqZHhva2NwZndzcWt6cmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODY0NDAsImV4cCI6MjA3OTY2MjQ0MH0.d1PsO4oMCU2SWDdey5yjVmVzet2uXwKbgbEkQJ9CJFM";

const CartLoading = () => (
  <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
    <div className="mb-6 relative">
      <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
      <ShoppingCart className="w-20 h-20 text-green-600 animate-spin" strokeWidth={1.5} />
    </div>
    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">endirim<span className="text-green-600">.net</span></h2>
    <p className="text-sm text-gray-500 mt-2 font-medium animate-pulse">Yüklənir...</p>
  </div>
);

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const clean = url.split('?')[0].replace(/\/$/, '');
  return `${clean}/embed/`;
};

const MARKET_COLOR_STYLES: Record<string, { unselected: string; selected: string }> = {
  araz: {
    unselected: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/80',
    selected: 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/25'
  },
  bravo: {
    unselected: 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80',
    selected: 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/25'
  },
  bazarstore: {
    unselected: 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-300/80',
    selected: 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/25'
  },
  oba: {
    unselected: 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-300/80',
    selected: 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-500/25'
  },
  neptun: {
    unselected: 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-300/80',
    selected: 'bg-orange-600 text-white shadow-xs ring-2 ring-orange-500/25'
  },
  rahat: {
    unselected: 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300/80',
    selected: 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/25'
  },
  bolmart: {
    unselected: 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300/80',
    selected: 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/25'
  },
  al: {
    unselected: 'bg-yellow-50 text-yellow-900 hover:bg-yellow-100 border border-yellow-300/80',
    selected: 'bg-yellow-500 text-gray-900 shadow-xs ring-2 ring-yellow-400/25'
  },
  tamstore: {
    unselected: 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-300/80',
    selected: 'bg-cyan-600 text-white shadow-xs ring-2 ring-cyan-500/25'
  },
  grandmart: {
    unselected: 'bg-violet-50 text-violet-800 hover:bg-violet-100 border border-violet-300/80',
    selected: 'bg-violet-600 text-white shadow-xs ring-2 ring-violet-500/25'
  },
  megastore: {
    unselected: 'bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100 border border-fuchsia-300/80',
    selected: 'bg-fuchsia-600 text-white shadow-xs ring-2 ring-fuchsia-500/25'
  }
};

const FALLBACK_PALETTES = [
  { unselected: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/80', selected: 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/25' },
  { unselected: 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300/80', selected: 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/25' },
  { unselected: 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-300/80', selected: 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/25' },
  { unselected: 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-300/80', selected: 'bg-orange-600 text-white shadow-xs ring-2 ring-orange-500/25' },
  { unselected: 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300/80', selected: 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/25' },
  { unselected: 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300/80', selected: 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/25' },
  { unselected: 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-300/80', selected: 'bg-teal-600 text-white shadow-xs ring-2 ring-teal-500/25' },
  { unselected: 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-300/80', selected: 'bg-cyan-600 text-white shadow-xs ring-2 ring-cyan-500/25' },
  { unselected: 'bg-violet-50 text-violet-800 hover:bg-violet-100 border border-violet-300/80', selected: 'bg-violet-600 text-white shadow-xs ring-2 ring-violet-500/25' },
  { unselected: 'bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100 border border-fuchsia-300/80', selected: 'bg-fuchsia-600 text-white shadow-xs ring-2 ring-fuchsia-500/25' },
  { unselected: 'bg-lime-50 text-lime-900 hover:bg-lime-100 border border-lime-300/80', selected: 'bg-lime-600 text-white shadow-xs ring-2 ring-lime-500/25' },
  { unselected: 'bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-300/80', selected: 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-500/25' },
];

const getMarketButtonStyle = (market: MarketData, index: number, isSelected: boolean) => {
  const normId = (market.id || '').toLowerCase().trim().replace(/\s+market$/i, '').replace(/\s+/g, '');
  const normName = (market.name || '').toLowerCase().trim().replace(/\s+market$/i, '').replace(/\s+/g, '');
  const theme = (market.themeColor || '').toLowerCase();

  const matched = 
    MARKET_COLOR_STYLES[normId] || 
    MARKET_COLOR_STYLES[normName] || 
    MARKET_COLOR_STYLES[theme] || 
    FALLBACK_PALETTES[index % FALLBACK_PALETTES.length];

  return isSelected ? matched.selected : matched.unselected;
};

interface InstagramThumbnailProps {
  postUrl: string;
  index: number;
  onClick: () => void;
}

const InstagramThumbnail: React.FC<InstagramThumbnailProps> = ({ postUrl, index, onClick }) => {
  const isInstagram = postUrl.includes('instagram.com');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInstagram || !containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width > 0) {
          setScale(width / 320);
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isInstagram]);

  return (
    <div 
      onClick={onClick}
      className="w-[calc(50%-5px)] sm:w-[calc(33.333%-6.7px)] shrink-0 snap-start aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-all bg-gray-100 relative group/ig border border-gray-100 shadow-xs hover:shadow-md hover:scale-[1.02]"
    >
      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 pointer-events-none">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      )}

      {isInstagram ? (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-gray-100 flex items-center justify-center pointer-events-none">
          {/* Scaled Instagram Embed Viewport */}
          <div 
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              width: '320px',
              height: '320px',
              transform: `scale(${scale})`,
            }}
          >
            {/* Shifted so top Instagram header (52px) is hidden, framing the square image */}
            <div className="absolute top-[-52px] left-0 w-[320px] h-[430px]">
              <iframe 
                src={getEmbedUrl(postUrl)}
                className="w-full h-full border-none pointer-events-none"
                scrolling="no"
                title={`Instagram Fürsət ${index + 1}`}
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>

          {/* Clickable overlay & hover effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-transparent opacity-0 group-hover/ig:opacity-100 transition-opacity pointer-events-none" />
        </div>
      ) : (
        <div className="w-full h-full relative">
          <img 
            src={postUrl} 
            alt={`Fürsət ${index + 1}`} 
            className="w-full h-full object-cover group-hover/ig:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/174/174855.png";
              setIsLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-0 group-hover/ig:opacity-100 transition-opacity pointer-events-none" />
        </div>
      )}

      {/* Index badge */}
      <div className="absolute bottom-1 right-1 z-10 bg-black/50 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md select-none pointer-events-none">
        #{index + 1}
      </div>
    </div>
  );
};

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: string[];
  marketName: string;
  initialIndex?: number;
}

const InstagramViewer: React.FC<InstagramModalProps> = ({ isOpen, onClose, posts, marketName, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  // Modal açılanda və ya market dəyişəndə sıfırla
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsInitialLoaded(false);

      const timer = setTimeout(() => {
        setIsInitialLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, marketName, initialIndex]);

  if (!isOpen || !posts || posts.length === 0) return null;

  // Növbəti posta keçid
  const handleNext = () => {
    if (posts.length <= 1) return;
    setCurrentIndex(prev => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  // Əvvəlki posta keçid
  const handlePrev = () => {
    if (posts.length <= 1) return;
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const currentPostUrl = posts[currentIndex] || '';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Container with Floating Navigation for larger screens */}
      <div className="relative flex items-center justify-center max-w-full">
        {/* Floating Left Button for desktop */}
        {posts.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-xl items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 border border-gray-100"
            title="Əvvəlki"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        <div className="relative w-full max-w-[390px] sm:max-w-[420px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out] flex flex-col border border-gray-100">
          
          {/* Header - Təmiz və minimal */}
          <div className="px-3.5 py-2.5 flex items-center justify-between shrink-0 bg-white border-b border-gray-50 select-none">
            <div className="flex items-center gap-1.5 min-w-0">
               <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></div>
               <h3 className="text-[11px] font-black text-gray-800 tracking-tight uppercase truncate">{marketName}</h3>
               {posts.length > 1 && (
                 <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                   {currentIndex + 1}/{posts.length}
                 </span>
               )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {currentPostUrl && currentPostUrl.includes('instagram.com') && (
                <a 
                  href={currentPostUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-1.5 hover:bg-pink-50 rounded-full text-gray-400 hover:text-pink-600 transition-colors"
                  title="Instagram-da aç"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Content (4:5 Ratio) - Karuselə toxunmaq və şəkilləri vərəqləmək aktivdir */}
          <div className="relative w-full bg-white overflow-hidden shrink-0 select-none" style={{ aspectRatio: '4/5' }}>
            {/* Multi-Slide Track */}
            <div className="w-full h-full relative">
              {posts.map((postUrl, idx) => {
                const offset = idx - currentIndex;
                const isCurrent = offset === 0;
                const isIg = postUrl.includes('instagram.com');
                return (
                  <div 
                    key={`${marketName}-${postUrl}-${idx}`}
                    className={`absolute inset-0 w-full h-full ${isCurrent ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    style={{
                      transform: `translateX(${offset * 100}%)`,
                      transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {isIg ? (
                      <div className="absolute top-[-52px] left-0 w-full h-[calc(100%+110px)]">
                        <iframe 
                          src={getEmbedUrl(postUrl)}
                          className={`w-full h-full border-none ${isCurrent ? 'pointer-events-auto' : 'pointer-events-none'}`}
                          scrolling="no"
                          title={`Instagram Post ${idx + 1}`}
                          onLoad={() => {
                            if (idx === initialIndex) {
                              setIsInitialLoaded(true);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <img 
                          src={postUrl} 
                          alt={`Fürsət ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onLoad={() => {
                            if (idx === initialIndex) {
                              setIsInitialLoaded(true);
                            }
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/174/174855.png";
                            setIsInitialLoaded(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simple Loading Spinner */}
            {!isInitialLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 select-none pointer-events-none">
                <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
              </div>
            )}
            
            {/* Edge Masks */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white z-40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white z-40 pointer-events-none"></div>
          </div>

          {/* Navigation for multiple posts */}
          {posts.length > 1 && (
            <div className="px-4 py-2.5 bg-gray-50/90 flex items-center justify-between border-t border-gray-100 select-none">
               <button 
                 onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                 className="p-1.5 hover:bg-gray-200 active:scale-95 rounded-lg text-gray-500 transition-transform"
                 title="Sola"
               >
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <div className="flex items-center gap-1">
                 {posts.map((_, idx) => (
                   <button
                     key={idx}
                     onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                     className={`h-1.5 rounded-full transition-all ${
                       idx === currentIndex ? 'w-4 bg-pink-600' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                     }`}
                     title={`${idx + 1}-ci post`}
                   />
                 ))}
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); handleNext(); }}
                 className="p-1.5 hover:bg-gray-200 active:scale-95 rounded-lg text-gray-500 transition-transform"
                 title="Sağa"
               >
                 <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>

        {/* Floating Right Button for desktop */}
        {posts.length > 1 && (
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-xl items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 border border-gray-100"
            title="Növbəti"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

interface ViewState {
  activeMarketId: string | null;
  showCheaperOnly: boolean;
  searchQuery: string;
  showFavorites: boolean;
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig | null>(() => {
    try {
      const saved = localStorage.getItem('supabaseConfig');
      if (saved) return JSON.parse(saved);
      return { supabaseUrl: DEFAULT_SUPABASE_URL, supabaseKey: DEFAULT_SUPABASE_KEY };
    } catch { return { supabaseUrl: DEFAULT_SUPABASE_URL, supabaseKey: DEFAULT_SUPABASE_KEY }; }
  });

  const [isCloudConnected, setIsCloudConnected] = useState(() => {
    if (supabaseConfig) return supabaseService.initializeSupabase(supabaseConfig);
    return false;
  });

  const [markets, setMarkets] = useState<MarketData[]>(INITIAL_MARKETS);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('endirim_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('endirim_favorites', JSON.stringify(favorites)); }
    catch (e) {}
  }, [favorites]);
  
  const [activeMarketId, setActiveMarketId] = useState<string | null>(null);
  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null);
  const [activeCatalogByMarket, setActiveCatalogByMarket] = useState<Record<string, string>>({});
  const [visibleDetailCount, setVisibleDetailCount] = useState(24);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  const getProductDiscountPercent = (p: DiscountProduct): number => {
    if (p.discountPercentage) {
      const cleaned = p.discountPercentage.replace(/[^0-9.]/g, '');
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0) return num;
    }
    const oldP = parseFloat(p.oldPrice?.replace(',', '.').replace(/[^0-9.]/g, '') || '');
    const newP = parseFloat(p.newPrice?.replace(',', '.').replace(/[^0-9.]/g, '') || '');
    if (!isNaN(oldP) && !isNaN(newP) && oldP > newP && oldP > 0) {
      return Math.round(((oldP - newP) / oldP) * 100);
    }
    return 0;
  };

  const handleSelectMarket = (marketId: string | null) => {
    setActiveMarketId(marketId);
    setVisibleDetailCount(24);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const [banner1, setBanner1] = useState<BannerData>(INITIAL_BANNER_1);
  const [banner2, setBanner2] = useState<BannerData>(INITIAL_BANNER_2);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(''); 
  const [maxPrice, setMaxPrice] = useState<string>(''); 
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<string>(''); 
  const [showCheaperOnly, setShowCheaperOnly] = useState(false);
  const [deferredCheaperOnly, setDeferredCheaperOnly] = useState(false);
  const [isProcessingCheaper, setIsProcessingCheaper] = useState(false);
  const [visibleProductCount, setVisibleProductCount] = useState(20);
  const cheaperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [activeBannerId, setActiveBannerId] = useState<'banner-1' | 'banner-2'>('banner-1');
  const [isAddMarketModalOpen, setIsAddMarketModalOpen] = useState(false);
  const [isSocialDealsModalOpen, setIsSocialDealsModalOpen] = useState(false);
  const [marketToEdit, setMarketToEdit] = useState<MarketData | null>(null);
  const [productToEdit, setProductToEdit] = useState<{product: DiscountProduct, index: number, catalogId?: string} | null>(null);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<{product: DiscountProduct, marketName: string} | null>(null);
  const [previousViewState, setPreviousViewState] = useState<ViewState | null>(null);
  const [instagramViewerData, setInstagramViewerData] = useState<{posts: string[], name: string, initialIndex: number} | null>(null);

  const handleShowCheaperOnlyChange = (active: boolean) => {
    if (cheaperTimeoutRef.current) {
        clearTimeout(cheaperTimeoutRef.current);
        cheaperTimeoutRef.current = null;
    }
    setShowCheaperOnly(active);
    if (active) {
      setShowFavorites(false);
      setIsProcessingCheaper(true);
      setDeferredCheaperOnly(false);
      setVisibleProductCount(6); 
      cheaperTimeoutRef.current = setTimeout(() => { setDeferredCheaperOnly(true); }, 50); 
    } else {
      setDeferredCheaperOnly(false);
      setIsProcessingCheaper(false);
      setVisibleProductCount(20);
    }
  };
  
  const handleRefreshComparison = () => {
    setIsProcessingCheaper(true);
    setDeferredCheaperOnly(false);
    setTimeout(() => { setDeferredCheaperOnly(true); }, 500);
  };

  useEffect(() => {
    if (deferredCheaperOnly && isProcessingCheaper) { setIsProcessingCheaper(false); }
  }, [deferredCheaperOnly, isProcessingCheaper]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (showCheaperOnly && deferredCheaperOnly && !isProcessingCheaper) {
        intervalId = setInterval(() => {
            setVisibleProductCount(prev => {
                if (prev > 1000) { clearInterval(intervalId); return prev; }
                return prev + 6;
            });
        }, 50);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [showCheaperOnly, deferredCheaperOnly, isProcessingCheaper]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery || '');
      setDebouncedMaxPrice(maxPrice || '');
      setIsSearching(false);
    }, 500);
    return () => { clearTimeout(handler); };
  }, [searchQuery, maxPrice, showFavorites]); 

  useEffect(() => { 
    if (showFavorites) {
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }, [showFavorites]);

  // Reset lazy load count on market, catalog, or search query change
  useEffect(() => {
    setVisibleDetailCount(24);
  }, [activeMarketId, activeCatalogByMarket, debouncedSearchQuery]);

  // IntersectionObserver for lazy loading products as user scrolls down
  useEffect(() => {
    const el = loadMoreSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleDetailCount((prev) => prev + 24);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeMarketId, visibleDetailCount, activeCatalogByMarket]);

  // Fallback window scroll listener for reliable infinite scrolling
  useEffect(() => {
    if (!activeMarketId) return;
    const handleScroll = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 600;
      if (scrollPos >= threshold) {
        setVisibleDetailCount((prev) => prev + 24);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMarketId]);

  const migrateMarketData = (incomingMarkets: MarketData[]): MarketData[] => {
    return (incomingMarkets || []).map(m => {
      let overrideColor = m.themeColor;
      if (m.id === 'araz') overrideColor = 'amber';
      if (m.id === 'oba') overrideColor = 'green';
      
      let overrideLogoUrl = m.logoUrl;
      if (m.name.toLowerCase().includes('rahat')) {
        overrideLogoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTsEY6AAE18u9Y57PHT9fxiujtBzAMxNFVtZl7TgONVA&s=10';
      }
      
      let updatedMarket = { ...m, themeColor: overrideColor, logoUrl: overrideLogoUrl };
      if (!updatedMarket.catalogs) updatedMarket.catalogs = [];
      if (updatedMarket.catalogs.length === 0 && updatedMarket.products && updatedMarket.products.length > 0) {
        return {
          ...updatedMarket,
          catalogs: [{
            id: 'main',
            name: 'Əsas Kataloq',
            products: updatedMarket.products,
            lastUpdated: updatedMarket.lastUpdated || new Date().toISOString(),
            url: updatedMarket.url
          }]
        };
      }
      return updatedMarket;
    });
  };

  useEffect(() => {
    if (supabaseConfig) {
      const success = supabaseService.initializeSupabase(supabaseConfig);
      setIsCloudConnected(success);
    }
  }, [supabaseConfig]);

  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 8000);
    if (isCloudConnected) {
      const unsubMarkets = supabaseService.subscribeToMarkets((data) => {
        if (data && data.length > 0) {
          const migrated = migrateMarketData(data);
          setMarkets(migrated);
          setTimeout(() => setIsLoading(false), 1400);
        } else { setTimeout(() => setIsLoading(false), 1500); }
      });
      const unsubBanners = supabaseService.subscribeToBanners((b1, b2) => {
        if(b1) setBanner1(b1);
        if(b2) setBanner2(b2);
      });
      return () => { unsubMarkets(); unsubBanners(); clearTimeout(safetyTimer); };
    } else {
      try {
        const savedMarkets = localStorage.getItem('marketData_v2');
        if (savedMarkets) {
          const parsed = JSON.parse(savedMarkets);
          setMarkets(migrateMarketData(parsed));
        }
        const savedB1 = localStorage.getItem('bannerData1');
        if (savedB1) setBanner1(JSON.parse(savedB1));
        const savedB2 = localStorage.getItem('bannerData2');
        if (savedB2) setBanner2(JSON.parse(savedB2));
      } catch (e) { console.error(e); } finally { 
        setTimeout(() => setIsLoading(false), 1200); 
        clearTimeout(safetyTimer); 
      }
    }
  }, [isCloudConnected]);

  const persistData = (newMarkets: MarketData[], newB1: BannerData, newB2: BannerData) => {
    if (isCloudConnected) {
      supabaseService.saveMarkets(newMarkets);
      supabaseService.saveBanners(newB1, newB2);
    } else {
      localStorage.setItem('marketData_v2', JSON.stringify(newMarkets));
      localStorage.setItem('bannerData1', JSON.stringify(newB1));
      localStorage.setItem('bannerData2', JSON.stringify(newB2));
    }
  };

  const updateMarketsState = (fn: (prev: MarketData[]) => MarketData[]) => {
    setMarkets(prev => {
      const newState = fn(prev);
      persistData(newState, banner1, banner2);
      return newState;
    });
  };

  const updateBannerState = (b1: BannerData, b2: BannerData) => {
    setBanner1(b1);
    setBanner2(b2);
    persistData(markets, b1, b2);
  };

  const currentMarket = activeMarketId ? markets.find(m => m.id === activeMarketId) : null;
  const currentCatalogs = currentMarket?.catalogs || [];
  const resolvedActiveCatalogId = activeCatalogId && currentCatalogs.find(c => c.id === activeCatalogId) 
      ? activeCatalogId 
      : (currentCatalogs.length > 0 ? currentCatalogs[0].id : null);
  const currentCatalog = currentCatalogs.find(c => c.id === resolvedActiveCatalogId);
  const currentProducts = currentCatalog?.products || currentMarket?.products || [];
  const accentColor = currentMarket?.themeColor || 'green';

  const productPriceIndex = useMemo(() => {
    const index = new Map<string, { price: number; marketId: string }[]>();
    markets.forEach(m => {
        const prods = m.catalogs ? m.catalogs.flatMap(c => c.products) : (m.products || []);
        prods.forEach(p => {
            const name = (p.productName || '').trim().toLowerCase();
            const priceStr = (p.newPrice || '').replace(/[^0-9.]/g, '');
            const price = parseFloat(priceStr);
            if (!isNaN(price) && name) {
                if (!index.has(name)) index.set(name, []);
                index.get(name)!.push({ price, marketId: m.id });
            }
        });
    });
    return index;
  }, [markets]);

  const checkForCheaperAlternative = (currentProduct: DiscountProduct, currentMarketId: string): boolean => {
    const name = (currentProduct.productName || '').trim().toLowerCase();
    const currentPriceStr = (currentProduct.newPrice || '').replace(/[^0-9.]/g, '');
    const currentPrice = parseFloat(currentPriceStr);
    if (isNaN(currentPrice) || !name) return false;
    const alternatives = productPriceIndex.get(name);
    if (!alternatives) return false;
    for (const alt of alternatives) {
        if (alt.marketId !== currentMarketId && alt.price < currentPrice) return true;
    }
    return false;
  };

  const groupedOpportunities = useMemo(() => {
      if (!deferredCheaperOnly) return [];
      const groups = new Map<string, {
          productName: string,
          category: any,
          imageUrl?: string,
          variants: Array<{
              marketId: string,
              marketName: string,
              price: number,
              originalPriceStr: string,
              logoUrl?: string,
              logoPlaceholder: string,
              themeColor: string
          }>
      }>();
      markets.forEach(market => {
          const allProds = market.catalogs ? market.catalogs.flatMap(c => c.products) : (market.products || []);
          allProds.forEach(p => {
             const pName = (p.productName || '').toLowerCase();
             if (debouncedSearchQuery.length > 0 && !pName.includes(debouncedSearchQuery.toLowerCase())) return;
             const normalizedName = (p.productName || '').trim().toLowerCase();
             if (!normalizedName) return;
             const priceStr = (p.newPrice || '').replace(/[^0-9.]/g, '');
             const priceVal = parseFloat(priceStr);
             if (isNaN(priceVal)) return;
             if (debouncedMaxPrice) {
                 const limit = parseFloat(debouncedMaxPrice);
                 if (!isNaN(limit) && priceVal > limit) return;
             }
             if (!groups.has(normalizedName)) {
                 groups.set(normalizedName, {
                     productName: p.productName,
                     category: p.category,
                     imageUrl: p.customImageUrl,
                     variants: []
                 });
             }
             const group = groups.get(normalizedName)!;
             const existingVariantIndex = group.variants.findIndex(v => v.marketId === market.id);
             const variantData = {
                 marketId: market.id,
                 marketName: market.name,
                 price: priceVal,
                 originalPriceStr: p.newPrice,
                 logoUrl: market.logoUrl,
                 logoPlaceholder: market.logoPlaceholder,
                 themeColor: market.themeColor
             };
             if (existingVariantIndex !== -1) {
                 if (priceVal < group.variants[existingVariantIndex].price) {
                     group.variants[existingVariantIndex] = variantData;
                 }
             } else { group.variants.push(variantData); }
             if (p.customImageUrl && !group.imageUrl) group.imageUrl = p.customImageUrl;
          });
      });
      const results = Array.from(groups.values()).filter(g => {
          if (g.variants.length < 2) return false;
          const prices = g.variants.map(v => v.price);
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);
          return maxP > minP;
      });
      return results.sort((a,b) => (a.productName || '').localeCompare(b.productName || ''));
  }, [markets, deferredCheaperOnly, debouncedSearchQuery, debouncedMaxPrice]);
  
  const isFavorite = (productName: string, marketId: string) => {
    return favorites.some(f => f.productName === productName && f.marketId === marketId);
  };

  const toggleFavorite = (product: DiscountProduct, marketId: string) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.productName === product.productName && f.marketId === marketId);
      let newFavorites;
      if (exists) newFavorites = prev.filter(f => !(f.productName === product.productName && f.marketId === marketId));
      else newFavorites = [...prev, { ...product, marketId, addedAt: Date.now() }];
      return newFavorites;
    });
  };

  const filteredMarketData = useMemo(() => {
    if (showFavorites || deferredCheaperOnly) return [];
    return markets
      .filter(m => { if (activeMarketId) return m.id === activeMarketId; return true; })
      .map(market => {
        const allProducts = market.catalogs ? market.catalogs.flatMap(c => c.products) : (market.products || []);
        const results = allProducts.filter(product => {
            const pName = (product.productName || '').toLowerCase();
            if (debouncedSearchQuery.length > 0 && !pName.includes(debouncedSearchQuery.toLowerCase())) return false;
            if (debouncedMaxPrice) {
                const priceStr = (product.newPrice || '').replace(/[^0-9.]/g, '');
                const price = parseFloat(priceStr);
                const limit = parseFloat(debouncedMaxPrice);
                if (!isNaN(price) && !isNaN(limit) && price > limit) return false;
            }
            return true;
        });
        const productsWithMeta = results.map(p => ({ ...p, _hasCheaper: checkForCheaperAlternative(p, market.id) }));
        return { ...market, filteredProducts: productsWithMeta };
      })
      .filter(m => m.filteredProducts.length > 0 || (activeMarketId && m.id === activeMarketId)); 
  }, [markets, debouncedSearchQuery, debouncedMaxPrice, deferredCheaperOnly, activeMarketId, showFavorites, productPriceIndex]);

  const filterProductForDetail = (product: DiscountProduct) => {
     const pName = (product.productName || '').toLowerCase();
     if (debouncedSearchQuery.length > 0 && !pName.includes(debouncedSearchQuery.toLowerCase())) return false;
     return true;
  };
  
  const filteredProductsForDetail = currentProducts.filter(filterProductForDetail);

  const getCatalogDateStatus = (catalog?: Catalog) => {
     if (!catalog || !catalog.startDate || !catalog.endDate) return { isActive: true, label: null };
     const now = new Date();
     const start = new Date(catalog.startDate);
     const end = new Date(catalog.endDate);
     end.setHours(23, 59, 59);
     if (now > end) return { isActive: false, label: 'Endirim müddəti bitdi' };
     if (now < start) return { isActive: false, label: 'Başlamayıb' };
     const diffTime = end.getTime() - now.getTime();
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
     const label = diffDays <= 1 ? 'Bu gün bitir' : `${diffDays} gün qaldı`;
     return { isActive: true, label };
  };

  const handleStreamStart = () => { setIsStreaming(true); };

  const handleStreamUpdate = (updatedProductsList: DiscountProduct[], catalogId: string, catalogName: string, startDate?: string, endDate?: string) => {
    if (activeMarketId) {
      updateMarketsState(prev => prev.map(m => {
        if (m.id === activeMarketId) {
          const newCatalogs = m.catalogs ? [...m.catalogs] : [];
          const catIndex = newCatalogs.findIndex(c => c.id === catalogId);
          if (catIndex >= 0) {
            newCatalogs[catIndex] = {
              ...newCatalogs[catIndex],
              products: updatedProductsList,
              lastUpdated: new Date().toISOString(),
              startDate: startDate || newCatalogs[catIndex].startDate,
              endDate: endDate || newCatalogs[catIndex].endDate
            };
          } else {
            newCatalogs.push({
              id: catalogId,
              name: catalogName,
              products: updatedProductsList,
              lastUpdated: new Date().toISOString(),
              startDate,
              endDate
            });
          }
          return { ...m, catalogs: newCatalogs, lastUpdated: new Date().toISOString() };
        }
        return m;
      }));
      setActiveCatalogId(catalogId);
    }
  };

  const handleStreamEnd = (newUrl?: string, catalogId?: string) => {
    setIsStreaming(false);
    updateMarketsState(prev => {
        if (newUrl && activeMarketId && catalogId) {
             return prev.map(m => {
                if (m.id === activeMarketId) {
                     const newCatalogs = m.catalogs ? [...m.catalogs] : [];
                     const catIndex = newCatalogs.findIndex(c => c.id === catalogId);
                     if (catIndex >= 0) newCatalogs[catIndex].url = newUrl;
                     return { ...m, catalogs: newCatalogs };
                }
                return m;
             });
        }
        return prev;
    });
  };

  const handleLogoUpdate = (newLogoUrl: string) => {
    if (activeMarketId) {
      updateMarketsState(prev => prev.map(m => {
        if (m.id === activeMarketId) return { ...m, logoUrl: newLogoUrl };
        return m;
      }));
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) { if(window.confirm("Çıxış etmək istəyirsiniz?")) setIsAdmin(false); }
    else setIsLoginModalOpen(true);
  };

  const handleAddMarket = (newMarket: MarketData) => {
    updateMarketsState(prev => [...prev, newMarket]);
    setActiveMarketId(newMarket.id);
  };

  const handleDeleteMarket = (marketId: string) => {
    updateMarketsState(prev => prev.filter(m => m.id !== marketId));
    if (activeMarketId === marketId) setActiveMarketId(null);
    setMarketToEdit(null);
  };

  const handleUpdateMarket = (updatedMarket: MarketData) => {
    updateMarketsState(prev => prev.map(m => {
      if (m.id === updatedMarket.id) {
        return { ...m, ...updatedMarket };
      }
      return m;
    }));
    setMarketToEdit(null);
  };

  const handleDeleteCatalog = (catalogId: string) => {
     if (!activeMarketId) return;
     if (window.confirm("Bu kataloqu silmək istədiyinizə əminsiniz?")) {
        updateMarketsState(prev => prev.map(m => {
            if (m.id === activeMarketId) return { ...m, catalogs: m.catalogs?.filter(c => c.id !== catalogId) || [] };
            return m;
        }));
        setActiveCatalogId(null); 
     }
  };

  const handleUpdateProduct = (updatedProduct: DiscountProduct) => {
    if (!productToEdit || !activeMarketId || !productToEdit.catalogId) return;
    updateMarketsState(prev => prev.map(m => {
      if (m.id === activeMarketId) {
        const newCatalogs = m.catalogs ? [...m.catalogs] : [];
        const catIndex = newCatalogs.findIndex(c => c.id === productToEdit.catalogId);
        if (catIndex >= 0) {
            const products = [...newCatalogs[catIndex].products];
            if (productToEdit.index === -1) { // -1 means adding new
                products.unshift(updatedProduct);
            } else if (products[productToEdit.index]) {
                products[productToEdit.index] = updatedProduct;
            }
            newCatalogs[catIndex] = { ...newCatalogs[catIndex], products };
        }
        return { ...m, catalogs: newCatalogs };
      }
      return m;
    }));
    setProductToEdit(null);
  };
  
  const handleAddProductManually = () => {
      if (!resolvedActiveCatalogId) return;
      setProductToEdit({
          product: { productName: '', oldPrice: '', newPrice: '', discountPercentage: '', category: 'Digər' },
          index: -1,
          catalogId: resolvedActiveCatalogId
      });
  };

  const handleEditFromSearch = (product: DiscountProduct, marketId: string) => {
      const market = markets.find(m => m.id === marketId);
      if(!market) return;
      if(market.catalogs) {
          for(const cat of market.catalogs) {
              const idx = cat.products.findIndex(p => p.productName === product.productName && p.newPrice === product.newPrice);
              if(idx !== -1) {
                  setActiveMarketId(marketId);
                  setProductToEdit({ product, index: idx, catalogId: cat.id });
                  return;
              }
          }
      }
  };

  const saveDatabaseConfig = (config: SupabaseConfig) => {
    localStorage.setItem('supabaseConfig', JSON.stringify(config));
    setSupabaseConfig(config);
    window.location.reload(); 
  };

  const handleCompareClick = (targetMarketId: string, productName: string) => {
    setPreviousViewState({ activeMarketId, showCheaperOnly, searchQuery, showFavorites });
    handleShowCheaperOnlyChange(false);
    setShowFavorites(false);
    setSearchQuery(productName);
    setDebouncedSearchQuery(productName);
    setActiveMarketId(targetMarketId);
    setViewProduct(null);
  };

  const handleRestorePreviousView = () => {
      if (previousViewState) {
          setActiveMarketId(previousViewState.activeMarketId);
          handleShowCheaperOnlyChange(previousViewState.showCheaperOnly);
          setShowFavorites(previousViewState.showFavorites);
          setSearchQuery(previousViewState.searchQuery);
          setDebouncedSearchQuery(previousViewState.searchQuery);
          setPreviousViewState(null);
      } else {
        setSearchQuery('');
        setDebouncedSearchQuery('');
        setActiveMarketId(null);
      }
  };

  const handleResetApp = () => {
    setActiveMarketId(null);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setMaxPrice('');
    setDebouncedMaxPrice('');
    handleShowCheaperOnlyChange(false);
    setShowFavorites(false);
    setIsSearching(false);
    setViewProduct(null);
    setPreviousViewState(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isLoading && <CartLoading />}

      <div className={`min-h-screen bg-white pb-24 font-sans flex flex-col transition-all duration-700 ${isLoading ? 'blur-lg scale-[0.99] opacity-80 pointer-events-none overflow-hidden h-screen' : 'blur-0 scale-100 opacity-100'}`}>
        {/* --- UNIFIED STICKY HEADER & MARKET SWITCHER --- */}
        <div className="sticky top-0 z-50 bg-white shadow-xs">
          <Header 
            onAdminClick={handleAdminClick} 
            isAdmin={isAdmin} 
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); setIsSearching(true); }}
            maxPrice={maxPrice}
            onMaxPriceChange={(p) => { setMaxPrice(p); setIsSearching(true); }}
            markets={markets}
            onLogoClick={handleResetApp}
            showCheaperOnly={showCheaperOnly}
            onShowCheaperOnlyChange={handleShowCheaperOnlyChange}
            showFavorites={showFavorites}
            onShowFavoritesChange={(active) => {
               setIsSearching(true);
               setShowFavorites(active);
               if (active) { handleShowCheaperOnlyChange(false); setActiveMarketId(null); }
            }}
            favoritesCount={favorites.length}
          />

          {/* --- HORIZONTAL MARKET SWITCHER (STICKY) --- */}
          {!isLoading && !showFavorites && (
            <nav className="bg-white/95 backdrop-blur-md border-t border-b border-gray-100 py-1.5 sm:py-2 sticky top-[138px] sm:top-[128px] md:top-[132px] z-30">
               <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  {/* Hamısı (All Markets) button */}
                  <button
                    onClick={() => handleSelectMarket(null)}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      activeMarketId === null
                        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/25'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300/80'
                    }`}
                  >
                    Hamısı
                  </button>

                  {/* Market Tags */}
                  {markets.map((market, index) => {
                    const isSelected = activeMarketId === market.id;
                    const displayName = market.name.replace(/\s+Market$/i, '') || market.name;
                    const colorStyle = getMarketButtonStyle(market, index, isSelected);
                    return (
                      <button
                        key={market.id}
                        onClick={() => handleSelectMarket(market.id)}
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${colorStyle}`}
                      >
                        {displayName}
                      </button>
                    );
                  })}
               </div>
            </nav>
          )}
        </div>
        
        {previousViewState && (
           <div className="bg-blue-600 text-white sticky top-[200px] sm:top-[190px] z-40 shadow-md">
               <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm font-medium">
                       <ShoppingCart className="w-4 h-4" />
                       <span>Seçilmiş məhsula baxırsınız.</span>
                   </div>
                   <button 
                     onClick={handleRestorePreviousView}
                     className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-bold transition-colors"
                   >
                       <ArrowLeft className="w-4 h-4" />
                       Geri Qayıt
                   </button>
               </div>
           </div>
        )}
        
        {isAdmin && (
          <div className="px-4 py-1 text-xs text-center font-bold bg-gray-900 text-white">
            {isCloudConnected ? "Supabase Canlı Bağlantı" : "Lokal Rejim"}
          </div>
        )}

        {isAdmin && (
          <div className="max-w-7xl mx-auto px-4 mt-2 flex justify-end gap-2 flex-wrap">
            <button 
              onClick={() => setIsSocialDealsModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors border border-pink-100 shadow-sm"
            >
              <Instagram className="w-3 h-3" />
              Günün Fürsətləri
            </button>
            <button 
              onClick={() => setIsAddMarketModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
            >
              <Plus className="w-3 h-3" />
              Yeni Market
            </button>
            <button 
              onClick={() => setIsDatabaseModalOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Database className="w-3 h-3" />
              Supabase Ayarları
            </button>
          </div>
        )}

        {isStreaming && (
          <div className={`bg-${accentColor}-600 text-white px-4 py-3 shadow-md sticky top-[200px] md:top-[190px] z-50 transition-all`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Kataloq Taranır...</span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6 pt-1.5 pb-6 md:pt-3 md:pb-8">
          <main className="w-full">
            {!showFavorites && (banner1.isVisible || isAdmin) && (
              <div className="xl:hidden mb-4">
                <Banner banner={banner1} isAdmin={isAdmin} onEdit={() => { setActiveBannerId('banner-1'); setIsBannerModalOpen(true); }} variant="horizontal" />
              </div>
            )}

            {showFavorites ? (
               <div className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                       <Heart className="w-6 h-6 text-red-500 fill-current" />
                       Yadda Saxlanılanlar
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{favorites.length} məhsul</span>
                  </div>
                  {favorites.length > 0 ? (
                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 transition-all duration-300 ${isSearching ? 'blur-sm opacity-60' : ''}`}>
                       {favorites.map((product, index) => {
                          const market = markets.find(m => m.id === product.marketId);
                          const marketName = market?.name || 'Naməlum Market';
                          const hasCheaper = market ? checkForCheaperAlternative(product, market.id) : false;
                          return (
                            <div key={`${product.marketId}-${product.productName}-${index}`} className="relative h-full">
                               <div className="absolute top-0 left-0 right-0 bg-gray-900/5 text-[10px] font-bold text-center py-0.5 rounded-t-xl z-0 text-gray-500">{marketName}</div>
                               <div className="pt-4 h-full">
                                  <ProductCard 
                                    product={product}
                                    accentColor={market?.themeColor || 'gray'}
                                    isAdmin={isAdmin}
                                    hasCheaperAlternative={hasCheaper}
                                    onClick={() => !isAdmin && setViewProduct({ product, marketName })}
                                    isFavorite={true}
                                    onToggleFavorite={() => toggleFavorite(product, product.marketId)}
                                  />
                               </div>
                            </div>
                          );
                       })}
                    </div>
                  ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                      <Heart className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Heç bir məhsul seçilməyib</h3>
                      <button onClick={handleResetApp} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors">Kəşf et</button>
                    </div>
                  )}
               </div>
            ) : (
              <>
                 {(debouncedSearchQuery.length > 0 || debouncedMaxPrice.length > 0 || showCheaperOnly) ? (
                  <div className="space-y-8 animate-[fadeIn_0.5s_ease-out] relative min-h-[500px]">
                    {isProcessingCheaper && (
                       <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-4 border border-gray-100">
                              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                              <p className="font-bold text-gray-800 text-xl mb-2">Müqayisə aparılır...</p>
                          </div>
                       </div>
                    )}
                    <div className={`transition-all duration-300 ${isProcessingCheaper ? 'opacity-20 blur-sm' : ''}`}>
                        <div className="flex flex-wrap items-center gap-2">
                        {showCheaperOnly && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                            <TrendingDown className="w-4 h-4" />
                            <span className="font-bold">Fürsətlər</span>
                            {isAdmin && <button onClick={handleRefreshComparison} className="hover:rotate-180 transition-transform"><RotateCcw className="w-3 h-3" /></button>}
                            </div>
                        )}
                        </div>
                        {showCheaperOnly ? (
                            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 mt-4 sm:mt-6`}>
                                {groupedOpportunities.slice(0, visibleProductCount).map((group, idx) => (
                                    <GroupedProductCard key={`${group.productName}-${idx}`} productName={group.productName} category={group.category} imageUrl={group.imageUrl} variants={group.variants} />
                                ))}
                            </div>
                        ) : (
                            filteredMarketData.map((market) => (
                            <div key={market.id} className="bg-white rounded-2xl p-2 sm:p-5 border border-gray-100 shadow-xs mb-5">
                                <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                                    <div className={`w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden`}>
                                        {market.logoUrl ? <img src={market.logoUrl} alt={market.name} className="w-full h-full object-contain p-1" /> : <span className={`text-${market.themeColor}-700 font-bold`}>{market.logoPlaceholder}</span>}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">{market.name}</h3>
                                    <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{market.filteredProducts.length} məhsul</span>
                                </div>
                                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4`}>
                                {market.filteredProducts.slice(0, visibleProductCount).map((product, index) => {
                                    const fav = isFavorite(product.productName || '', market.id);
                                    return <ProductCard key={`${market.id}-${product.productName}-${index}`} product={product} accentColor={market.themeColor} isAdmin={isAdmin} hasCheaperAlternative={(product as any)._hasCheaper} onClick={() => !isAdmin && setViewProduct({ product, marketName: market.name })} onEdit={() => handleEditFromSearch(product, market.id)} isFavorite={fav} onToggleFavorite={() => toggleFavorite(product, market.id)} />;
                                })}
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                  </div>
                ) : (
                  <>
                    {activeMarketId === null ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 animate-[fadeIn_0.5s_ease-out]">
                         {markets.map((market) => {
                           const previewCatalog = market.catalogs && market.catalogs.length > 0 ? market.catalogs[0] : null;
                           const allMarketProducts = (market.catalogs && market.catalogs.length > 0)
                             ? market.catalogs.flatMap(c => c.products || [])
                             : (market.products || []);
                           const catalogProductsCount = previewCatalog ? (previewCatalog.products?.length || 0) : allMarketProducts.length;
                           // Sort descending by discount percentage so highest discount products appear on home page
                           const previewProducts = [...allMarketProducts].sort((a, b) => getProductDiscountPercent(b) - getProductDiscountPercent(a));
                           const dateStatus = getCatalogDateStatus(previewCatalog || undefined);
                           const socialPosts = market.instagramPosts || [];
                           return (
                             <div key={market.id} className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-4 md:p-5 border-b sm:border border-gray-100/90 pb-5 sm:pb-4 transition-all duration-300 flex flex-col">
                               <div className="flex items-center justify-between mb-2.5 sm:mb-4 px-0.5">
                                  <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0" onClick={() => setActiveMarketId(market.id)}>
                                     <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform`}>
                                       {market.logoUrl ? <img src={market.logoUrl} alt={market.name} className="w-full h-full object-contain p-1" /> : <span className={`text-${market.themeColor}-700 font-bold text-base sm:text-xl md:text-2xl`}>{market.logoPlaceholder}</span>}
                                     </div>
                                     <div className="min-w-0">
                                       <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                         <h2 className="text-base sm:text-xl md:text-2xl font-black text-gray-800 group-hover:text-blue-600 transition-colors truncate">{market.name}</h2>
                                         <span className="text-[10px] sm:text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                                           {catalogProductsCount} məhsul
                                         </span>
                                       </div>
                                       {dateStatus.label && <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${dateStatus.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>{dateStatus.label}</span>}
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                     {isAdmin && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setMarketToEdit(market); }}
                                          className="p-1.5 sm:p-2 bg-gray-50 text-gray-400 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                          title="Marketi Düzəlt"
                                        >
                                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                     )}
                                     <button onClick={() => handleSelectMarket(market.id)} className={`text-xs sm:text-sm font-bold text-${market.themeColor}-600 bg-${market.themeColor}-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-${market.themeColor}-100 transition-colors`}>Bax</button>
                                  </div>
                               </div>
                               
                               {/* Products Preview (2 on mobile, 3 on desktop) */}
                               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  {(previewProducts || []).slice(0, 3).map((product, idx) => (
                                    <div key={`${market.id}-preview-${idx}`} className={`${idx === 2 ? "hidden sm:block sm:h-full" : "block sm:h-full"}`}>
                                      <ProductCard product={product} accentColor={market.themeColor} isAdmin={isAdmin} variant="compact" onClick={() => !isAdmin && setViewProduct({ product, marketName: market.name })} onEdit={() => { setActiveMarketId(market.id); setActiveCatalogId(previewCatalog?.id || null); setProductToEdit({ product, index: idx, catalogId: previewCatalog?.id }); }} isFavorite={isFavorite(product.productName || "", market.id)} onToggleFavorite={() => toggleFavorite(product, market.id)} />
                                    </div>
                                  ))}
                               </div>

                               {/* Instagram/Social Preview (2 visible at once on mobile, horizontally scrollable) */}
                               {socialPosts.length > 0 && (
                                  <div className="mt-auto pt-3 sm:pt-3.5 border-t border-gray-100 px-0.5">
                                     <div className="flex items-center justify-between mb-2 px-0.5">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 shrink-0" />
                                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Günün Fürsətləri</span>
                                          {socialPosts.length > 2 && (
                                            <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.2 rounded-full border border-pink-100">
                                              {socialPosts.length}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {socialPosts.length > 2 && (
                                            <span className="text-[9px] text-gray-400 font-medium sm:hidden flex items-center gap-0.5 select-none">
                                              Sürüşdürün <ChevronRight className="w-2.5 h-2.5" />
                                            </span>
                                          )}
                                          <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
                                        </div>
                                     </div>
                                     
                                     <div className="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-0.5 snap-x snap-mandatory overscroll-x-contain">
                                        {socialPosts.map((post, idx) => (
                                          <InstagramThumbnail 
                                            key={`${market.id}-post-${idx}`}
                                            postUrl={post}
                                            index={idx}
                                            onClick={() => setInstagramViewerData({ posts: socialPosts, name: market.name, initialIndex: idx })}
                                          />
                                        ))}
                                     </div>
                                  </div>
                               )}
                             </div>
                           );
                         })}
                      </div>
                    ) : (
                      <div className="animate-[fadeIn_0.3s_ease-out]">
                        {(() => {
                          const mkt = markets.find(m => m.id === activeMarketId) || markets[0];
                          if (!mkt) return null;
                          const mktCatalogs = mkt.catalogs || [];
                          const selectedCatId = activeCatalogByMarket[mkt.id] || (mktCatalogs[0]?.id || null);
                          const mktCatalog = mktCatalogs.find(c => c.id === selectedCatId) || (mktCatalogs.length > 0 ? mktCatalogs[0] : null);
                          const mktDateStatus = getCatalogDateStatus(mktCatalog || undefined);
                          const mktProducts = mktCatalog ? mktCatalog.products : (mkt.products || []);
                          const mktFilteredProducts = mktProducts.filter(filterProductForDetail);
                          const mktAccent = mkt.themeColor || 'green';
                          const displayedProducts = mktFilteredProducts.slice(0, visibleDetailCount);
                          const hasMore = visibleDetailCount < mktFilteredProducts.length;

                          return (
                            <div 
                              key={mkt.id} 
                              id={`market-detail-${mkt.id}`}
                              className="scroll-mt-24 sm:scroll-mt-28"
                            >
                              {/* Compact Market Header (Identical compact style as home page, minimal padding) */}
                              <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs mb-2.5 sm:mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-gray-100 shadow-xs flex items-center justify-center overflow-hidden shrink-0`}>
                                    {mkt.logoUrl ? (
                                      <img src={mkt.logoUrl} alt={mkt.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className={`text-${mktAccent}-700 font-bold text-base sm:text-xl`}>{mkt.logoPlaceholder}</span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h2 className="text-base sm:text-xl font-black text-gray-800 truncate">{mkt.name}</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {mktDateStatus.label && (
                                        <span className={`inline-block text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${mktDateStatus.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                                          {mktDateStatus.label}
                                        </span>
                                      )}
                                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                                        {mktFilteredProducts.length} məhsul
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                  {isAdmin && (
                                    <>
                                      <button 
                                        onClick={() => { setActiveMarketId(mkt.id); handleAddProductManually(); }} 
                                        className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Əllə Əlavə et</span>
                                      </button>
                                      <button 
                                        onClick={() => { setActiveMarketId(mkt.id); setIsScannerOpen(true); }} 
                                        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs shadow-sm transition-all bg-${mktAccent}-600 hover:bg-${mktAccent}-700 text-white active:scale-95`}
                                      >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isStreaming && activeMarketId === mkt.id ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">Kataloqu Yenilə</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Multi-Catalog Tabs ONLY if there are multiple catalogs (> 1) - eliminates single "Əsas Kataloq" tab */}
                              {mktCatalogs.length > 1 && (
                                <div className="mb-3 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                                  <div className="flex space-x-2">
                                    {mktCatalogs.map(catalog => {
                                      const status = getCatalogDateStatus(catalog);
                                      const isCatActive = selectedCatId === catalog.id;
                                      return (
                                        <button
                                          key={catalog.id}
                                          onClick={() => {
                                            setActiveCatalogByMarket(prev => ({ ...prev, [mkt.id]: catalog.id }));
                                            setVisibleDetailCount(24);
                                          }}
                                          className={`whitespace-nowrap px-4 py-2 rounded-t-xl font-bold text-xs transition-all flex items-center gap-2 ${isCatActive ? `bg-white text-${mktAccent}-700 border border-gray-200 border-b-white shadow-xs` : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                          {status.label && <span className={`w-2 h-2 rounded-full ${status.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>}
                                          {catalog.name}
                                          {isAdmin && (
                                            <span onClick={(e) => { e.stopPropagation(); handleDeleteCatalog(catalog.id); }} className="ml-1 p-0.5 rounded-full hover:bg-red-100 text-red-400 opacity-60 hover:opacity-100">
                                              <Trash2 className="w-3 h-3" />
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Products Grid for this market (progressively loaded) */}
                              {displayedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5 md:gap-4">
                                  {displayedProducts.map((product, index) => (
                                    <ProductCard 
                                      key={`${mkt.id}-${product.productName}-${index}`} 
                                      product={product} 
                                      accentColor={mktAccent} 
                                      isAdmin={isAdmin} 
                                      hasCheaperAlternative={checkForCheaperAlternative(product, mkt.id)} 
                                      onClick={() => !isAdmin && setViewProduct({ product, marketName: mkt.name })} 
                                      onEdit={() => { setActiveMarketId(mkt.id); setProductToEdit({ product, index, catalogId: selectedCatId || undefined }); }} 
                                      isFavorite={isFavorite(product.productName || '', mkt.id)} 
                                      onToggleFavorite={() => toggleFavorite(product, mkt.id)} 
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
                                  <p className="text-sm font-medium">Bu marketdə heç bir məhsul tapılmadı.</p>
                                </div>
                              )}

                              {/* Infinite Scroll / Lazy Load Sentinel */}
                              {hasMore && (
                                <div ref={loadMoreSentinelRef} className="py-6 sm:py-8 flex flex-col items-center justify-center">
                                  <button
                                    onClick={() => setVisibleDetailCount(prev => prev + 24)}
                                    className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-full border border-gray-200 transition-colors shadow-xs active:scale-95"
                                  >
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                    <span>Digər məhsullar yüklənir... ({displayedProducts.length} / {mktFilteredProducts.length})</span>
                                  </button>
                                </div>
                              )}
                              {!hasMore && mktFilteredProducts.length > 24 && (
                                <div className="py-6 text-center text-xs font-medium text-gray-400">
                                  Bütün {mktFilteredProducts.length} məhsul göstərildi
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
            </>
            )}
          </main>
        </div>
      </div>

        <ScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} selectedMarket={currentMarket?.name || ''} marketUrl={currentMarket?.url || ''} currentLogoUrl={currentMarket?.logoUrl} existingCatalogs={currentMarket?.catalogs} onStreamStart={handleStreamStart} onStreamUpdate={handleStreamUpdate} onStreamEnd={handleStreamEnd} onLogoUpdate={handleLogoUpdate} />
        <AdminLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />
        <BannerEditorModal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} banner={activeBannerId === 'banner-1' ? banner1 : banner2} onSave={(b) => { if (activeBannerId === 'banner-1') updateBannerState(b, banner2); else updateBannerState(banner1, b); }} />
        <AddMarketModal isOpen={isAddMarketModalOpen} onClose={() => setIsAddMarketModalOpen(false)} onAdd={handleAddMarket} />
        <SocialDealsModal isOpen={isSocialDealsModalOpen} onClose={() => setIsSocialDealsModalOpen(false)} markets={markets} onUpdateMarkets={updateMarketsState} />
        {marketToEdit && <EditMarketModal isOpen={!!marketToEdit} onClose={() => setMarketToEdit(null)} market={marketToEdit} onSave={handleUpdateMarket} onDelete={handleDeleteMarket} />}
        {productToEdit && activeMarketId && <EditProductModal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} product={productToEdit.product} onSave={handleUpdateProduct} />}
        <DatabaseModal isOpen={isDatabaseModalOpen} onClose={() => setIsDatabaseModalOpen(false)} onSave={saveDatabaseConfig} currentConfig={supabaseConfig} />
        <ProductDetailModal isOpen={!!viewProduct} onClose={() => setViewProduct(null)} product={viewProduct?.product || null} marketName={viewProduct?.marketName || ''} allMarkets={markets} onCompareClick={handleCompareClick} canGoBack={!!previousViewState} onBack={handleRestorePreviousView} showComparisons={showCheaperOnly} />
        
        <InstagramViewer 
          isOpen={!!instagramViewerData} 
          onClose={() => setInstagramViewerData(null)} 
          posts={instagramViewerData?.posts || []} 
          marketName={instagramViewerData?.name || ''} 
          initialIndex={instagramViewerData?.initialIndex || 0}
        />
    </>
  );
};

export default App;
