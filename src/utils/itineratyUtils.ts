export function generateItinerary(activities: any[], days: number, budget: number): any[] {
    const itinerary: any[] = [];
  
    // Dividir las actividades en días
    const activitiesPerDay = Math.ceil(activities.length / days);
  
    for (let i = 0; i < days; i++) {
      const dailyActivities = activities.slice(i * activitiesPerDay, (i + 1) * activitiesPerDay);
      const dailyBudget = budget / days;
  
      itinerary.push({
        day: i + 1,
        activities: dailyActivities,
        budget: dailyBudget,
      });
    }
  
    return itinerary;
  }