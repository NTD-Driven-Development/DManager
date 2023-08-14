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
