export const openseaNftFetcher = async (url: string) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;

  if (!apiKey) {
    throw new Error("Opensea API key is not defined.");
  }

  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-api-key": process.env.NEXT_PUBLIC_OPENSEA_API_KEY || "default-key" },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await response.text();
    throw error;
  }
  return response.json();
};
