// Open-Meteo Weather Service for North Obhur, Jeddah (أبحر الشمالية - جدة)
// Free, open-access meteorological API with no authentication key required

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  tempMax: number;
  tempMin: number;
  seaCondition: string;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    code: number;
  }>;
  updatedAt: string;
}

// Translate WMO Weather Interpretation Codes to Arabic
export function getWeatherDescription(code: number, isDay = true): { text: string; iconType: 'sun' | 'cloud-sun' | 'cloud' | 'rain' | 'storm' | 'fog' } {
  switch (code) {
    case 0:
      return { text: isDay ? 'صافٍ ومشمس' : 'سماء صافية', iconType: 'sun' };
    case 1:
    case 2:
      return { text: isDay ? 'غائم جزئياً' : 'قليل الغيوم', iconType: 'cloud-sun' };
    case 3:
      return { text: 'غائم معتدل', iconType: 'cloud' };
    case 45:
    case 48:
      return { text: 'ضباب ساحلي خفيف', iconType: 'fog' };
    case 51:
    case 53:
    case 55:
      return { text: 'رذاذ خفيف', iconType: 'rain' };
    case 61:
    case 63:
    case 65:
      return { text: 'أمطار ساحلية', iconType: 'rain' };
    case 80:
    case 81:
    case 82:
      return { text: 'زخات مطر', iconType: 'rain' };
    case 95:
    case 96:
    case 99:
      return { text: 'عواصف رعدية', iconType: 'storm' };
    default:
      return { text: 'أجواء ساحلية معتدلة', iconType: 'sun' };
  }
}

// Sea condition description based on Red Sea coastal wind speed
export function getSeaCondition(windSpeedKmH: number): string {
  if (windSpeedKmH < 10) return 'بحر هادئ ومناسب للإبحار والسباحة';
  if (windSpeedKmH < 20) return 'نسيم عليل وموج خفيف على الشاطئ';
  if (windSpeedKmH < 30) return 'نسيم نشط وموج معتدل في شرم أبحر';
  return 'رياح نشطة وموج مرتفع نسبياً';
}

const FALLBACK_WEATHER: WeatherData = {
  temperature: 30,
  apparentTemperature: 33,
  humidity: 62,
  windSpeed: 14,
  windDirection: 315, // North-West (Red Sea classic breeze)
  weatherCode: 0,
  weatherDescription: 'صافٍ ومشمس مع نسيم البحر الأحمر',
  isDay: true,
  tempMax: 34,
  tempMin: 27,
  seaCondition: 'نسيم عليل وموج خفيف على الشاطئ',
  hourlyForecast: [
    { time: '12:00', temp: 31, code: 0 },
    { time: '15:00', temp: 33, code: 1 },
    { time: '18:00', temp: 30, code: 0 },
    { time: '21:00', temp: 28, code: 0 },
    { time: '00:00', temp: 27, code: 0 },
  ],
  updatedAt: 'محدث الآن',
};

/**
 * Fetches real-time weather data for North Obhur from Open-Meteo
 * North Obhur, Jeddah coordinates: Latitude 21.75, Longitude 39.12
 */
export async function fetchNorthObhurWeather(): Promise<WeatherData> {
  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=21.75&longitude=39.12&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FRiyadh';

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const weatherInfo = getWeatherDescription(current.weather_code, current.is_day === 1);
    const seaCond = getSeaCondition(current.wind_speed_10m);

    // Extract next few hourly forecasts
    const nowHour = new Date().getHours();
    const hourlyList: WeatherData['hourlyForecast'] = [];

    if (hourly && hourly.time && hourly.temperature_2m) {
      for (let i = 0; i < hourly.time.length && hourlyList.length < 5; i++) {
        const itemHour = new Date(hourly.time[i]).getHours();
        if (itemHour >= nowHour) {
          hourlyList.push({
            time: `${itemHour}:00`,
            temp: Math.round(hourly.temperature_2m[i]),
            code: hourly.weather_code?.[i] ?? 0,
          });
        }
      }
    }

    return {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: Math.round(current.wind_direction_10m),
      weatherCode: current.weather_code,
      weatherDescription: weatherInfo.text,
      isDay: current.is_day === 1,
      tempMax: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 3),
      tempMin: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 4),
      seaCondition: seaCond,
      hourlyForecast: hourlyList.length ? hourlyList : FALLBACK_WEATHER.hourlyForecast,
      updatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error) {
    console.warn('Could not fetch live weather from Open-Meteo, falling back to local coastal data:', error);
    return {
      ...FALLBACK_WEATHER,
      updatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
