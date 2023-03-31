import crypto from "crypto";

const tokensByAddress = {};

export default function handler(req, res) {
  // Get the wallet address from the request parameters
  const { address } = req.query;

  // Check if the address parameter is missing or invalid
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  // Check if a token has already been generated for this address
  if (tokensByAddress[address]) {
    return res
      .status(400)
      .json({ error: "Token already generated for this address" });
  }

  // Generate a random token using the crypto module
  const token = crypto.randomBytes(32).toString("hex");

  // Store the token for this address
  tokensByAddress[address] = token;

  // Return the token in a JSON response
  res.status(200).json({ token });
}
