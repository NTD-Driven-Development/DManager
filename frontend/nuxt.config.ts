// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	typescript: {
        strict: true,
    },
	vite: {
        server: {
            hmr: {
                port: 11111,
            },
        }
    },
	css: ['~/assets/css/main.css'],
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
        {
            path: '~/subPages',
            pathPrefix: false,
        },
    ],
    imports: {
        dirs: [
            './src',
        ],
    },
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: [
		'@pinia/nuxt',
	],
	pinia: {
        autoImports: [
            'storeToRefs',
        ],
    },
	routeRules: {
        '/': { ssr: false },
        '/login': { ssr: false },
        '/dashboard': { ssr: false },
        '/projects': { ssr: false },
        '/boarders': { ssr: false },
        '/records': { ssr: false },
        '/notes': { ssr: false },
        '/options': { ssr: false },
    },
})
