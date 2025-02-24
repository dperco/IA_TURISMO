
interface Thread {
    id: string;
    topic: string;
    history: Array<{ user: string; bot: string }>;
  }
  
  const threads: Record<string, Thread> = {};

export default  threads ;