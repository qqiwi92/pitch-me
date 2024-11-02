"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateJsonOnValueType } from "./types";

type generateSchemaResponse = {
  status: "error" | "success";
  message: string;
};

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function generateSchema(
  userPrompt: string,
): Promise<generateSchemaResponse> {
  try {
    const systemPrompt =
      "System prompt: Hello I need you to work as a programmer (that sends ONLY JSON in ```json``` code to me) and generate a json file for my app that helps user to prepare for public speeches and so you need to create an array in json each object of it would represent a slide of the presentation (so the words and expressions should be as simple and memorable as possible. And you should add slides as Intro and Conclusion. You should also add 5-6 slides. 10 at top). The json file should be with the following structure of type Value[] of ```export type BulletPoint = { id: string; text: string }; export type Value = { title: string; richEditor: string; bulletPoints: BulletPoint[] };``` (so the response should consist of an array of objects with the attributes title, richEditor, and bulletPoints. The bulletPoints should be an array of objects with the attributes id and text. In bulletPoints array should be written only the needed things that the person should mention in the presentation. In richEditor should be info that would be helpful to the user. DO NOT USE INDENTATIONS (SO NO ENTERS AND LARGE SPACES AND WRITE AS CONCISE AS POSSIBLE). The richEditor is optional, the title and the bulletPoints are required, so you should have at least 2 bulletPoints) for the following user prompt: ";

    const prompt = systemPrompt + userPrompt;

    const response = await model.generateContent([prompt]);
    const resultText = response.response.text();

    const result = extractFirstCodeBlock(resultText);
    if (result === "no code") {
      return {
        status: "error",
        message: `no code recognized look:\n\n ${resultText}`,
      };
    }

    if (!validateJsonOnValueType(JSON.parse(result))) {
      return {
        status: "error",
        message: `json did not match the schema. Look:\n\n ${result}`,
      };
    }

    return {
      status: "success",
      message: result.trim(),
    };
  } catch (error) {
    return {
      status: "error",
      message: "Error generating schema",
    };
  }
}

function extractFirstCodeBlock(text: string): string {
  const pattern = /```json(.*?)```/s;
  const match = text.match(pattern);

  if (match) {
    return match[1];
  } else {
    return "no code";
  }
}
