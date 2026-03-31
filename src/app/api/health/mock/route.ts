import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Returns mock health data as if coming from HealthKit/Health Connect
  const mockData = {
    sleepHours: 6 + Math.random() * 4,
    sleepQuality: 50 + Math.random() * 50,
    activeMinutes: 15 + Math.random() * 120,
    stepCount: 2000 + Math.random() * 15000,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(mockData);
}
