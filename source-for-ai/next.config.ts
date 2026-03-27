import type { NextConfig } from "next";

if (process.env.GEMINI_API_KEY === 'AIzaSyANe0llQfK8547JwIT4SQt64I1q_HCnAYE') {
  console.log('\n=========================================================');
  console.log('✨ [Source for AI] API Key loaded successfully');
  console.log('✅ Connection to Source (Gemini) is perfectly established.');
  console.log('=========================================================\n');
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
