export function createAdminApiClient(baseUrl) {
  return {
    async syncBooks(books) {
      return request(`${baseUrl}/admin/books/sync`, {
        method: "POST",
        body: JSON.stringify({ books })
      });
    }
  };
}

async function request(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.error?.message || data?.message || `Admin request failed (${response.status}).`
    );
  }

  return data;
}
