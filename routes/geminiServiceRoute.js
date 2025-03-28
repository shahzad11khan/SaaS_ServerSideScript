// // geminiService.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// // Function to send a query to the Gemini API
// async function getGeminiResponse(userQuery) {
//   try {
//     const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    
//     const result = await model.generateContent(userQuery);
//     console.log(result.response.text());
//     return result.response.text();
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     throw new Error("Failed to retrieve response from Gemini");
//   }
// }

// module.exports = { getGeminiResponse };
// geminiService.js// geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// List of e-commerce-related keywords
const ECOMMERCE_KEYWORDS = [
  "product", "cart", "checkout", "order", "shipping",
  "payment", "customer", "ecommerce", "e-commerce", "inventory", "sales",
  "pricing", "promotion", "store", "catalog", "merchant", "buy",
  "discount", "offer", "coupon", "voucher", "deal", "returns",
  "refund", "gift", "wishlist", "subscription", "marketplace",
  "tracking", "delivery", "stock", "availability", "review",
  "rating", "storefront", "purchase", "sell", "seller", "buyer",
  "fulfillment", "invoice", "billing", "tax", "account",
  "membership", "subscription", "brand", "product details",
  "checkout process", "loyalty program", "payment gateway",
  "digital wallet", "payment method", "order confirmation",
  "inventory management", "shipment", "customer service",
  "help center", "support", "user account", "shopping experience"
];


// Function to check if a response is related to e-commerce
function isEcommerceRelated(response) {
  return ECOMMERCE_KEYWORDS.some((keyword) =>
    response.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Function to send a query to the Gemini API
async function getGeminiResponse(userQuery) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Adding instructions to the query
    const modifiedQuery = `Answer strictly about e-commerce in 3 sentences: ${userQuery}`;

    // Generate content from Gemini
    const result = await model.generateContent(modifiedQuery);

    // Check if the response has a 'text' method or property
    const responseText = result?.response?.text ? result.response.text() : "";

    if (!responseText) {
      throw new Error("Empty or invalid response from Gemini.");
    }

    // Check if the response is related to e-commerce
    if (isEcommerceRelated(responseText)) {
      console.log("E-commerce response:", responseText);
      return responseText;
    } else {
      const fallbackMessage =
        "Sorry, I can only provide information related to e-commerce.";
      console.log("Non-e-commerce response filtered out.");
      return fallbackMessage;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to retrieve response from Gemini");
  }
}

module.exports = { getGeminiResponse };
