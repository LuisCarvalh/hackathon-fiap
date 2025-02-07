import { API_URL } from '@env';

interface LoginResponse {
  token: string;
  ok: boolean;
}

interface LoginRequest {
  email: string;
  password: string;
}

export default async function loginUser(email: string, password: string): Promise<LoginResponse> {
  console.log(API_URL);
  const response = await fetch(`${API_URL}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data: LoginResponse = await response.json();
  data.ok = response.ok;
  return data;
}

export async function fetchUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/user/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const data: User = await response.json();
  return data;
}

export async function fetchUserList(token: string, content: boolean, page: number = 0, limit: number = 10): Promise<FetchUserListResponse> {

  var url;
  console.log(API_URL);
  if(content === null){
      url = `${API_URL}/user?page=${page}&limit=${limit}`;
  }else{
      url = `${API_URL}/user?page=${page}&limit=${limit}&isadmin=${content}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user list');
  }

  const data: FetchUserListResponse = await response.json();
  return data;
}

export async function deleteUser(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return;
}

export async function createUser(token: string, user: { name: string; email: string; password: string; isadmin: boolean}): Promise<User> {
  const response = await fetch(`${API_URL}/user`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const data: User = await response.json();
  return data;
}

export async function updateUser(token: string, id: string, user: { name: string; email: string; password: string; isadmin: boolean}): Promise<User> {
  const response = await fetch(`${API_URL}/user/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  const data: User = await response.json();
  return data;
}