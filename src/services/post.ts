import { API_URL } from '@env'

export async function fetchPosts(token: string, content: string, page: number = 0, limit: number = 10): Promise<FetchPostsResponse> {

  var url;

  if (content === '') {
    url = `${API_URL}/post/search?page=${page}&limit=${limit}`;
  } else {
    url = `${API_URL}/post/search?page=${page}&limit=${limit}&keyword=${content}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data: FetchPostsResponse = await response.json();
  return data;
}

export async function createPost(token: string, title: string, content: string, author: string): Promise<Post> {
  const url = `${API_URL}/post`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, author }),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  const data: Post = await response.json();
  return data;
}

export async function editPost(token: string, id: string, title: string, content: string, author: string): Promise<Post> {
  const url = `${API_URL}/post/${id}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, title, content, author }),
  });

  if (!response.ok) {
    throw new Error('Failed to update post');
  }

  const data: Post = await response.json();
  return data;
}

export async function deletePost(token: string, id: string): Promise<Response> {
  const url = `${API_URL}/post/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  return response;
}