interface FetchPostsResponse {
    data: Post[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
      };
  }