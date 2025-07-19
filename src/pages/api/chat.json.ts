import { OpenAI } from "openai";
import type { APIRoute } from "astro";
import { prompt } from "../../lib/prompt";

export const POST: APIRoute = async ({ request }) => {
	try {
		// Obtener los mensajes del cuerpo de la solicitud
		const body = await request.json();
		console.log("body", body);
		const { messages } = body;

		// Verificar que hay un API key configurado
		if (!import.meta.env.OPENAI_API_KEY) {
			return new Response(
				JSON.stringify({
					error: "La API key de OpenAI no está configurada correctamente",
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// Crear instancia de OpenAI con la API key
		const openai = new OpenAI({
			apiKey: import.meta.env.OPENAI_API_KEY,
		});

		// Añadir un mensaje del sistema con información sobre ti
		const systemMessage = {
			role: "system",
			content: prompt,
		};

		// Preparar los mensajes para la API, incluyendo el mensaje del sistema
		const apiMessages = [systemMessage, ...messages];

		// Llamar a la API de OpenAI
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini-2024-07-18",
			messages: apiMessages,
			max_tokens: 500,
			temperature: 0.7,
		});

		// Extraer la respuesta
		const content = completion.choices[0].message.content;

		// Devolver la respuesta
		return new Response(
			JSON.stringify({
				content,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Error al procesar la solicitud:", error);

		return new Response(
			JSON.stringify({
				error: "Error al procesar la solicitud",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
