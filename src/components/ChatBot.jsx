import React, { useState, useRef, useEffect } from "react";
import { IoSend, IoClose, IoChatbubbleEllipses } from "react-icons/io5";

const FormattedMessage = ({ text }) => {
	if (!text) return null;

	const parts = [];
	let lastIndex = 0;
	const regex = /\*\*(.*?)\*\*/g;
	let match = regex.exec(text);

	while (match !== null) {
		if (match.index > lastIndex) {
			parts.push(text.substring(lastIndex, match.index));
		}
		parts.push(<strong key={match.index}>{match[1]}</strong>);
		lastIndex = match.index + match[0].length;
		match = regex.exec(text);
	}

	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	return <>{parts}</>;
};

const ChatBot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content:
				"¡Hola! 👋 Soy el asistente virtual de Raúl. Pregúntame cualquier cosa sobre él, sus proyectos o habilidades.",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		scrollToBottom();
		if (!isLoading && inputRef.current) {
			inputRef.current.focus();
		}
	}, [messages, isLoading]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [isOpen]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	const handleInputChange = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (input.trim() === "") return;

		const userMessage = { role: "user", content: input };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat.json", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage].map(({ role, content }) => ({
						role,
						content,
					})),
				}),
			});

			if (!response.ok) {
				console.error("Error al comunicarse con el chatbot");
				console.error(response);
				throw new Error("Error al comunicarse con el chatbot");
			}

			const data = await response.json();

			setMessages((prevMessages) => [
				...prevMessages,
				{ role: "assistant", content: data.content },
			]);
		} catch (error) {
			console.error("Error:", error);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					role: "assistant",
					content:
						"Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-4 right-4 flex flex-col items-end space-y-4 z-50 text-gray-100">
			<button
				type="button"
				onClick={toggleChat}
				className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
				aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
			>
				{isOpen ? (
					<IoClose className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
				) : (
					<IoChatbubbleEllipses className="w-6 h-6 animate-pulse" />
				)}
			</button>

			{isOpen && (
				<div className="fixed bottom-20 right-4 w-80 md:w-96 lg:w-[30rem] h-[32rem] lg:h-[40rem] bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-700 backdrop-blur-sm animate-in slide-in-from-bottom-10 duration-300">
					<div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 flex justify-between items-center">
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
							<div>
								<h3 className="font-semibold text-lg">Asistente de Raúl</h3>
								<p className="text-xs text-blue-100">En línea</p>
							</div>
						</div>
						<button
							type="button"
							onClick={toggleChat}
							className="text-white hover:text-gray-200 transition-colors duration-200 hover:bg-white/20 rounded-full p-1"
						>
							<IoClose className="w-5 h-5" />
						</button>
					</div>

					<div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900">
						{messages.map((message, index) => (
							<div
								key={`msg-${message.role}-${index}`}
								className={`flex animate-in fade-in-50 slide-in-from-bottom-5 duration-500 ${
									message.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div className={"flex items-start space-x-2 max-w-[80%]"}>
									{message.role === "assistant" && (
										<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
											R
										</div>
									)}
									<div
										className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${message.role === "user" ? "bg-gradient-to-r from-blue-800 to-purple-800 text-white rounded-br-md" : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-md"}`}
									>
										<p className="text-sm leading-relaxed whitespace-pre-wrap">
											<FormattedMessage text={message.content} />
										</p>
										<span
											className={`text-xs mt-2 block opacity-70 ${
												message.role === "user"
													? "text-blue-100"
													: "text-gray-500"
											}`}
										>
											{new Date().toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
									{message.role === "user" && (
										<div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
											U
										</div>
									)}
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start animate-in fade-in duration-300">
								<div className="flex items-start space-x-2 max-w-[80%]">
									<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
										R
									</div>
									<div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.1s" }}
											/>
											<div
												className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
												style={{ animationDelay: "0.2s" }}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Chat input */}
					<div className="border-t border-gray-700 p-4 bg-gray-800">
						<form onSubmit={handleSubmit} className="flex items-end space-x-3">
							<div className="flex-1">
								<input
									ref={inputRef}
									type="text"
									value={input}
									onChange={handleInputChange}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleSubmit(e);
										}
									}}
									placeholder="Escribe un mensaje..."
									className="flex-1 bg-gray-700 border w-full border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 resize-none text-gray-100 placeholder-gray-400"
									disabled={isLoading}
								/>
							</div>
							<button
								type="submit"
								disabled={isLoading || !input.trim()}
								className={`ml-2 p-3 rounded-full transition-all duration-200 ${
									isLoading || !input.trim()
										? "bg-gray-700 cursor-not-allowed"
										: "bg-gradient-to-r from-blue-800 to-purple-800 hover:from-blue-900 hover:to-purple-900 text-white shadow-lg hover:scale-105 active:scale-95"
								}`}
							>
								<IoSend
									className={`w-5 h-5 transition-transform duration-200 ${
										isLoading || !input.trim() ? "text-gray-500" : "text-white"
									}`}
								/>
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatBot;
