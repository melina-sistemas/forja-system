export function createLoanApiClient(baseUrl) {
  return {
    async fetchSeed() {
      return request(`${baseUrl}/seed`, {
        method: "GET"
      });
    },

    async createLoan(input) {
      return request(`${baseUrl}/loans`, {
        method: "POST",
        body: JSON.stringify(input)
      });
    },

    async returnLoan(input) {
      return request(`${baseUrl}/loans/${input.loanId}/return`, {
        method: "POST",
        body: JSON.stringify(input)
      });
    },

    async importBooksPdf(input) {
      return request(`${baseUrl}/admin/books/import-pdf`, {
        method: "POST",
        body: JSON.stringify(input)
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

  return data;
}
