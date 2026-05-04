// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import "dotenv/config";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // const run = async () => {
// //   try {
// //     const models = await genAI.listModels();

// //     for (const m of models) {
// //       console.log(m.name, m.supportedGenerationMethods);
// //     }

// //   } catch (err) {
// //     console.error("ERROR:", err.message);
// //   }
// // };

// // run();

// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import "dotenv/config";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // const model = genAI.getGenerativeModel({
// //   model: "gemini-pro"
// // });

// // const run = async () => {
// //   try {
// //     const result = await model.generateContent("Hello");
// //     console.log(result.response.text());
// //   } catch (err) {
// //     console.error("ERROR:", err.message);
// //   }
// // };

// // run();

// import { GoogleGenAI } from "@google/genai";
// import "dotenv/config";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// async function run() {
//   try {
//     const res = await ai.models.generateContent({
//       model: "gemini-1.5-flash", // ✅ works with new SDK
//       contents: "Hello",
//     });

//     console.log(res.text); // 👈 direct text
//   } catch (e) {
//     console.error("ERROR:", e.message);
//   }
// }

// run();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "PASTE_YOUR_KEY_HERE"
});

async function run() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello"
    });

    console.log(res.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();