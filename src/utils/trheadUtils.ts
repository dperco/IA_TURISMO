import threads from '../types/memoryUtils.js';
export function createThread(topic: string): string {
    const threadId = Math.random().toString(36).substring(7); // ID único
    threads[threadId] = {
      id: threadId,
      topic,
      history: [],
    };
    return threadId;
  }
  
  export function addMessageToThread(threadId: string, userMessage: string, botMessage: string): void {
    if (threads[threadId]) {
      threads[threadId].history.push({ user: userMessage, bot: botMessage });
    } else {
      throw new Error('Hilo no encontrado.');
    }
  }
  
  export function getThreadHistory(threadId: string): Array<{ user: string; bot: string }> {
    if (threads[threadId]) {
      return threads[threadId].history;
    } else {
      throw new Error('Hilo no encontrado.');
    }
  }