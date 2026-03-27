import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Fake generation delay for the UX
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real scenario, we'd call OpenAI DALL-E or Imagen API here.
    // For this prototype, we'll return high-quality Unsplash images representing the requested visions.
    
    const isWealth = prompt.toLowerCase().includes('wealth') || prompt.toLowerCase().includes('富') || prompt.toLowerCase().includes('ラグジュアリー');
    
    const imageUrl = isWealth 
      ? 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' // Luxury resort POV
      : 'https://images.unsplash.com/photo-1542259145898-197eec9315bc?auto=format&fit=crop&w=1200&q=80'; // Hawaii sunset beach POV
      
    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
