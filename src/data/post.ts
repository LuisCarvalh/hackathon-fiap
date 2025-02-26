interface Author {
    id: string;
    name: string;
  }

interface Quiz {
  id: string;
}
  
  interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string | null;
    author: Author;
    quiz: Quiz | null;
  }