// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	typescript: {
        strict: true,
    },
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: [
		'@pinia/nuxt',
		'nuxt-tsconfig-relative-paths',
	],
	pinia: {
        autoImports: [
            'storeToRefs',
        ],
    },
	routeRules: {
        '/': { ssr: false },
        '/dashboard': { ssr: false },
        '/login': { ssr: false },
    },
})
