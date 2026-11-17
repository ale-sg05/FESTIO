const SE_API_URL = "https://webservices.samuelencinas.dev/";

const signInSEAPI = async () => {
  const username = process.env.S_ENCINAS_API_USERNAME;
  const password = process.env.S_ENCINAS_API_PASSWORD;
  try {
    const response = await fetch(`${SE_API_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      console.error(`Sign-in API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error signing in to SE API:", error);
    return null;
  }
};

const searchSpotify = async (q: string, limit: number) => {
  const token = await signInSEAPI();
  if (!token) {
    console.error("Failed to obtain access token for SE API");
    return null;
  }
  try {
    const response = await fetch(
      `${SE_API_URL}music/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(`Spotify API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return null;
  }
};

const getSpotifyArtistDetails = async (artistId: string) => {
  const token = await signInSEAPI();
  if (!token) {
    console.error("Failed to obtain access token for SE API");
    return null;
  }
  try {
    const response = await fetch(`${SE_API_URL}music/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Spotify API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching artist details:", error);
    return null;
  }
};

const paymentCharge = async (
  cardHolder: string,
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  amount: number,
  currency: string,
) => {
  const token = await signInSEAPI();
  if (!token) {
    console.error("Failed to obtain access token for SE API");
    return null;
  }
  try {
    const response = await fetch(`${SE_API_URL}payments/charge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cardHolder,
        cardNumber,
        expiryDate,
        cvv,
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      console.error(`Payment API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error processing payment:", error);
    return null;
  }
};

const paymentRefund = async (transactionId: string) => {
  const token = await signInSEAPI();
  if (!token) {
    console.error("Failed to obtain access token for SE API");
    return null;
  }
  try {
    const response = await fetch(
      `${SE_API_URL}payments/refund/${encodeURIComponent(transactionId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(`Payment refund API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error processing refund:", error);
    return null;
  }
};

export {
  signInSEAPI,
  searchSpotify,
  getSpotifyArtistDetails,
  paymentCharge,
  paymentRefund,
};
