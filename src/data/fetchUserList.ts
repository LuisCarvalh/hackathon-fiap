interface FetchUserListResponse {
    data: User[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
  }