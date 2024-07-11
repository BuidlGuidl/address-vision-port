export const tokenBalanceFetcher = async (url: string) => {
  const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

  if (!apiKey) {
    throw new Error("Moralis API key is not defined.");
  }

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": apiKey,
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await response.text();
    throw error;
  }
  console.log("response", response);
  return response.json();
};
