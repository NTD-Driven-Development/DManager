// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
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
    build: {
        transpile: ['@vuepic/vue-datepicker'],
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
        '/profile': { ssr: false },
        '/projects': { ssr: false },
        '/boarders': { ssr: false },
        '/records': { ssr: false },
        '/notes': { ssr: false },
        '/users': { ssr: false },
        '/duties': { ssr: false },
        '/exports': { ssr: false },
        '/options': { ssr: false },
        '/logs': { ssr: false },
    },
})
