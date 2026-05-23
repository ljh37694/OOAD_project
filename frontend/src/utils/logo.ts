import netflixLogo from "../assets/logo/Netflix_icon.png";
import spotifyLogo from "../assets/logo/Spotify_logo.png";
import youtubeLogo from "../assets/logo/Youtube_logo.png";
import adobeLogo from "../assets/logo/Adobe_logo.jpeg";
import appleMusicLogo from "../assets/logo/AppleMusic_logo.webp";

export const getLogoGradient = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("netflix")) return "from-red-600 to-red-900";
  if (lowerName.includes("youtube")) return "from-red-500 to-rose-600";
  if (lowerName.includes("spotify")) return "from-green-500 to-emerald-700";
  if (lowerName.includes("apple music") || lowerName.includes("applemusic")) return "from-slate-700 to-slate-900";
  if (lowerName.includes("adobe")) return "from-red-500 to-orange-500";
  return "from-slate-600 to-slate-800";
};

export const getLogoIcon = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("netflix")) return netflixLogo;
  if (lowerName.includes("spotify")) return spotifyLogo;
  if (lowerName.includes("youtube")) return youtubeLogo;
  if (lowerName.includes("apple music") || lowerName.includes("applemusic")) return appleMusicLogo;
  if (lowerName.includes("adobe")) return adobeLogo;
  return "";
};

export const isImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  return url.startsWith("data:image") || url.includes("/") || url.includes(".") || url.length > 1;
};
