// Projects.tsx
import type React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import {
	SiNextdotjs,
	SiTailwindcss,
	SiSupabase,
	SiGithub,
} from "react-icons/si";

// Tipos de etiquetas y proyectos
interface Tag {
	name: string;
	class: string;
	icon: React.ComponentType<{ className?: string }>;
}

interface Project {
	title: string;
	description: string;
	github?: string;
	link?: string;
	image: string;
	tags: Tag[];
}

// Array de proyectos
const projects: Project[] = [
	{
		title: "BIT2CHAIN – Blockchain & Crypto Blog",
		description:
			"Blog sobre blockchain y criptomonedas con las últimas noticias.",
		github: "https://github.com/raulbr99/bit2chain",
		link: "https://bit2chain.vercel.app/",
		image: "/projects/B2C.png",
		tags: [
			{ name: "Next.js", class: "bg-black text-white", icon: SiNextdotjs },
			{
				name: "Tailwind CSS",
				class: "bg-[#003159] text-white",
				icon: SiTailwindcss,
			},
		],
	},
	{
		title: "Locksy – Password Manager",
		description: "Genera, guarda y consulta contraseñas seguras.",
		github: "https://github.com/raulbr99/locksy",
		link: "https://locksy.vercel.app/",
		image: "/projects/logo_locksy.png",
		tags: [
			{ name: "Next.js", class: "bg-black text-white", icon: SiNextdotjs },
			{ name: "Supabase", class: "bg-[#005a9e] text-white", icon: SiSupabase },
			{
				name: "Tailwind CSS",
				class: "bg-[#003159] text-white",
				icon: SiTailwindcss,
			},
		],
	},
	// Añade más proyectos si es necesario
];

const Projects: React.FC = () => {
	// Autoplay plugin según docs de Keen Slider
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const autoplay = (slider: any) => {
		let timeout: ReturnType<typeof setTimeout>;
		let mouseOver = false;

		const clearNextTimeout = () => {
			clearTimeout(timeout);
		};
		const nextTimeout = () => {
			clearNextTimeout();
			if (mouseOver) return;
			timeout = setTimeout(() => {
				slider.next();
			}, 5000);
		};

		slider.on("created", () => {
			slider.container.addEventListener("mouseover", () => {
				mouseOver = true;
				clearNextTimeout();
			});
			slider.container.addEventListener("mouseout", () => {
				mouseOver = false;
				nextTimeout();
			});
			nextTimeout();
		});
	};

	// Inicializa el slider con loop y un slide por vista
	const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
		{
			loop: true,
			slides: {
				spacing: 16,
				perView: 1,
			},
		},
		[autoplay],
	);

	return (
		<div className="relative w-full">
			<div ref={sliderRef} className="keen-slider">
				{projects.map((project) => (
					<div
						key={project.title}
						className="keen-slider__slide flex justify-center p-4"
					>
						<article className="w-full max-w-lg bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
							<img
								src={project.image}
								alt={project.title}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<h3 className="text-xl font-bold text-white mb-2">
									{project.title}
								</h3>
								<ul className="flex flex-wrap gap-2 mb-2">
									{project.tags.map((tag) => (
										<li key={tag.name}>
											<span
												className={`inline-flex items-center gap-1 rounded-full text-xs py-1 px-2 ${tag.class}`}
											>
												<tag.icon className="w-4 h-4" /> {tag.name}
											</span>
										</li>
									))}
								</ul>
								<p className="text-gray-300 text-sm mb-4">
									{project.description}
								</p>
								<div className="flex gap-3">
									{project.github && (
										<a
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
										>
											<SiGithub className="w-5 h-5" /> Code
										</a>
									)}
									{project.link && (
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
										>
											Preview
										</a>
									)}
								</div>
							</div>
						</article>
					</div>
				))}
			</div>

			{/* Controles Prev/Next */}
			<button
				type="button"
				onClick={() => slider.current?.prev()}
				className="hidden absolute inset-y-0 left-0 w-12 sm:flex items-center justify-center bg-gradient-to-r from-blue-700/30 to-transparent backdrop-blur-sm text-white text-xl hover:from-black/50 transition rounded-tl-full rounded-bl-full z-10"
			>
				‹
			</button>
			<button
				type="button"
				onClick={() => slider.current?.next()}
				className="hidden absolute inset-y-0 right-0 w-12 sm:flex items-center justify-center bg-gradient-to-l from-blue-700/30 to-transparent backdrop-blur-sm text-white text-xl hover:from-black/50 transition rounded-tr-full rounded-br-full z-10"
			>
				›
			</button>
		</div>
	);
};

export default Projects;
