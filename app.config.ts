import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
	ssr: false,
	server: {
		static: true,
		prerender: {
			crawLinks: true
		},
		baseURL: "/backtesting-playground",
		preset: "static"
	}
});
