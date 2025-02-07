import { API_URL } from '@env'

export interface Option {
    content: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    content: string;
    options: Option[];
  }

  export interface Post {
    title: string;
  }

  export interface Quiz {
    postId: string;
    questions: Question[];
    post: Post;
  }
  
  export async function createQuiz(token: string, postId: string, questions: Question[]): Promise<void> {
    const url = `${API_URL}/quiz`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, questions }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
  }

  export async function fetchQuiz(token: string, quizId: string): Promise<Quiz> {
    const url = `${API_URL}/quiz/${quizId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }
  
    return response.json();
}