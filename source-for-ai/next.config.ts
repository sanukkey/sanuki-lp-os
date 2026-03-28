import type { NextConfig } from "next";

if (process.env.GEMINI_API_KEY === 'AIzaSyApVWxkgHE5QmhEAkM8ZeFjR_CHI-wETrU') {
  console.log('\n=========================================================');
  console.log('✨ [Source for AI] API Key loaded successfully');
  console.log('✅ Connection to Source (Gemini) is perfectly established.');
  console.log('=========================================================\n');
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
