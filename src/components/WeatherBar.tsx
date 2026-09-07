import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Waves,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Compass,
} from 'lucide-react';
import { fetchNorthObhurWeather, WeatherData, getWeatherDescription } from '../services/weather';
import { BRAND_INFO } from '../data/initialData';

export const WeatherBar: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadWeather = async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const data = await fetchNorthObhurWeather();
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      if (showSpin) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(() => {
      loadWeather();
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderWeatherIcon = (code: number, isDay = true, className = 'w-4 h-4') => {
    const { iconType } = getWeatherDescription(code, isDay);
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-[#C29B63]`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-[#C29B63]`} />;
      case 'cloud':
        return <Cloud className={`${className} text-sky-200`} />;
      case 'rain':
      case 'storm':
        return <CloudRain className={`${className} text-[#028090]`} />;
      default:
        return <Sun className={`${className} text-[#C29B63]`} />;
    }
  };

  return (
    <div className="bg-[#051C2C] text-white text-xs border-b border-[#0C3552] relative z-45 select-none transition-all">
      <div className="max-w-7xl mx-auto px-4 py-1.5 sm:py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Main Weather Overview Pill & City */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Live blinking pulse */}
            <div className="flex items-center gap-1.5 bg-[#0C3552] px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#028090] animate-pulse"></span>
              <span className="text-[#C29B63]">طقس أبحر الشمالية</span>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#028090]" />
                <span>جاري تحميل بيانات الأرصاد...</span>
              </div>
            ) : weather ? (
              <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap text-white/90">
                {/* Temperature & Icon */}
                <div className="flex items-center gap-1.5">
                  {renderWeatherIcon(weather.weatherCode, weather.isDay, 'w-4 h-4')}
                  <span className="text-sm font-black font-sans text-white tracking-tight">
                    {weather.temperature}°C
                  </span>
                  <span className="text-white/70 text-[11px] font-medium hidden xs:inline">
                    ({weather.weatherDescription})
                  </span>
                </div>

                <span className="hidden sm:inline text-white/25">|</span>

                {/* Real-feel */}
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-white/80">
                  <Thermometer className="w-3.5 h-3.5 text-[#C29B63]" />
                  <span>المحسوسة: {weather.apparentTemperature}°C</span>
                </div>

                <span className="hidden md:inline text-white/25">|</span>

                {/* Sea Wind Breeze */}
                <div className="hidden md:flex items-center gap-1 text-[11px] text-white/80">
                  <Wind className="w-3.5 h-3.5 text-[#028090]" />
                  <span>نسيم البحر: {weather.windSpeed} كم/س</span>
                </div>

                <span className="hidden lg:inline text-white/25">|</span>

                {/* Humidity */}
                <div className="hidden lg:flex items-center gap-1 text-[11px] text-white/80">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>الرطوبة: {weather.humidity}%</span>
                </div>

                <span className="hidden xl:inline text-white/25">|</span>

                {/* Day Max / Min */}
                <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-white/70">
                  <span className="text-amber-300 font-semibold">عظمى {weather.tempMax}°</span>
                  <span>•</span>
                  <span className="text-cyan-300 font-semibold">صغرى {weather.tempMin}°</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Controls & Interactive Drawer Trigger */}
          <div className="flex items-center gap-2 ms-auto">
            {/* Interactive Toggle for Forecast & Sea Conditions */}
            <button
              id="weather-details-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 bg-[#0C3552] hover:bg-[#114A6F] text-white/90 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/10 transition-colors"
              title="عرض تفاصيل البحر وتوقعات الساعات القادمة"
            >
              <Waves className="w-3.5 h-3.5 text-[#028090]" />
              <span className="hidden sm:inline">حالة البحر والتوقعات</span>
              <span className="sm:hidden">التفاصيل</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3 text-[#C29B63]" />
              ) : (
                <ChevronDown className="w-3 h-3 text-[#C29B63]" />
              )}
            </button>

            {/* Quick Refresh Button */}
            <button
              id="weather-refresh-btn"
              onClick={() => loadWeather(true)}
              disabled={isRefreshing}
              className="p-1 rounded-lg bg-[#0C3552] hover:bg-[#114A6F] text-white/70 hover:text-white transition-colors border border-white/10"
              title="تحديث بيانات الطقس من المراصد المفتوحة"
              aria-label="تحديث الطقس"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C29B63]' : ''}`} />
            </button>

            {/* Twitter Handle pill */}
            <a
              href={BRAND_INFO.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#0C3552] hover:bg-[#C29B63] transition-colors text-white px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/10"
              title="متابعة رصد الحساب الرسمي"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>{BRAND_INFO.handle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Expandable Drawer: Hourly Forecast & Red Sea Marine Report */}
      {isExpanded && weather && (
        <div className="bg-[#031420] border-t border-[#0C3552] px-4 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Marine & Sea Conditions (North Obhur Bay & Beach) */}
            <div className="md:col-span-6 bg-[#051C2C] p-3.5 rounded-2xl border border-[#0C3552] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#C29B63] flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-[#028090]" />
                  <span>راصد ساحل وشرم أبحر الشمالية</span>
                </span>
                <span className="text-[10px] text-white/50">{weather.updatedAt}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-2">
                <div className="bg-[#0C3552]/70 p-2 rounded-xl">
                  <span className="text-[10px] text-white/60 block">حالة البحر</span>
                  <span className="text-xs font-bold text-white mt-0.5 block truncate">
                    {weather.windSpeed < 18 ? 'معتدل / هادئ' : 'نشط نسبياً'}
                  </span>
                </div>
                <div className="bg-[#0C3552]/70 p-2 rounded-xl">
                  <span className="text-[10px] text-white/60 block">سرعة النسيم</span>
                  <span className="text-xs font-bold text-[#028090] mt-0.5 block">
                    {weather.windSpeed} كم/س
                  </span>
                </div>
                <div className="bg-[#0C3552]/70 p-2 rounded-xl">
                  <span className="text-[10px] text-white/60 block">نسبة الرطوبة</span>
                  <span className="text-xs font-bold text-sky-300 mt-0.5 block">
                    {weather.humidity}%
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-white/80 bg-[#0C3552]/40 p-2 rounded-xl border border-white/5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C29B63] shrink-0" />
                <span>{weather.seaCondition}</span>
              </p>
            </div>

            {/* Upcoming Hourly Forecast for Obhur Coast */}
            <div className="md:col-span-6 bg-[#051C2C] p-3.5 rounded-2xl border border-[#0C3552]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#C29B63] flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#C29B63]" />
                  <span>توقعات الساعات القادمة على ساحل أبحر</span>
                </span>
                <span className="text-[10px] text-white/50">بيانات مفتوحة: Open-Meteo (21.75°N, 39.12°E)</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {weather.hourlyForecast.map((hour, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0C3552]/60 hover:bg-[#0C3552] transition-colors p-2 rounded-xl text-center flex flex-col items-center border border-white/5"
                  >
                    <span className="text-[10px] text-white/70 font-mono mb-1">{hour.time}</span>
                    <div className="my-1">
                      {renderWeatherIcon(hour.code, true, 'w-3.5 h-3.5')}
                    </div>
                    <span className="text-xs font-bold text-white font-sans">{hour.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
