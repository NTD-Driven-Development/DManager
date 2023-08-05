import _ from 'lodash';
import { InjectionKey } from 'nuxt/dist/app/compat/capi';
import ToastNotifier from '~/components/ToastNotifier.vue';

export const useUrl = (options?: UrlOptions): string => {
    const config = useRuntimeConfig();
    const isHttps = options?.https ?? config.public.useHttps;
    let url = '';

    url += isHttps ? 'https://' : 'http://';
    url += options?.subDomain ? `${options?.subDomain}.` : '';
    url += config.public.baseUrl;
    url += options?.params ? `${options?.params}` : '';

    return url;
}

export const useTransform = <T, O>(ref: Ref<T>, transformer: (value: T) => O) => computed(() => {
    return transformer(ref.value);
});

export const prefixInteger = (value: string | number, length: number) => {
    const num = parseInt(`${value}`);
    return (Array(length).join('0') + num).slice(-length);
}

export const addComma = (n: number | string) => {
    n = +n;
    if (_.isNaN(n)) return;

    return n?.toLocaleString();
}

// export const download = (resources: Base64Resource[]) => {
//     function next(i: number) {
//         if (i >= resources.length) return;
//         var a = document.createElement('a');
//         a.href = toBase64String(resources[i]);
//         a.target = '_parent';
//         if ('download' in a) {
//             a.download = `${Date.now()}.${MIME.getExtension(resources[i].mediaType)}`;
//         }
//         (document.body || document.documentElement).appendChild(a);
//         a.click && a.click();
//         a.parentNode?.removeChild(a);
//         setTimeout(() => next(i + 1), 500);
//     }
//     next(0);
// }

export const showParseError = (notifier: InstanceType<typeof ToastNotifier>, error: any) => {
    const messages = [];

    if (_.isObject(error?.response?.data?.detail)) {
        _.forEach(error?.response?.data?.detail, (v, k) => {
            messages.push(`${k}.${v}`);
            return false; // 暫先只取第一筆
        });
    }
    else if (_.isString(error?.response?.data?.detail)) {
        messages.push(error?.response?.data?.detail);
    }
    else if (error?.message) {
        messages.push(_.toString(error?.message));
    }
    else {
        messages.push(_.toString(error));
    }

    if (messages?.length) {
        notifier?.error(messages[0]);
    }
}

export const resize = (src: string | Blob, maxSideLength: number, quality: number = 0.7) => {
    return new Promise<string>((resolve, reject) => {
        window.URL = window.URL || window.webkitURL;

        const image = new Image();

        image.onload = () => {
            const originWidth = image.width;
            const originHeight = image.height;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            
            let scale = 1;

            if (originWidth >= originHeight && originWidth > maxSideLength) {
                scale = maxSideLength / originWidth;
            }
            else if (originWidth < originHeight && originHeight > maxSideLength) {
                scale = maxSideLength / originHeight;
            }

            canvas.width = originWidth * scale;
            canvas.height = originHeight * scale;

            ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        }

        image.onerror = (e) => {
            reject(e);
        };

        image.src = src instanceof Blob ? window.URL.createObjectURL(src) : src;
    });
}

export const toQueryString = <T extends object>(value: T) => {
    return _.mapValues(value, (p) => {
        if (false) {
            // 自定義轉義
        }
        else {
            return _.toString(p);
        }
    });
}

export const queryStringInspecter = <T extends object>(ref: Ref<T>) => {
    const stopHandler = watch(() => ref.value, (n) => {
        const router = useRouter();
        const queries = toQueryString(n);

        router.replace({
            query: queries,
        });
    }, { deep: true, immediate: false });

    onBeforeRouteLeave(() => {
        stopHandler();
    });

    return stopHandler;
}

interface UrlOptions {
    https?: boolean,
    subDomain?: string,
    params?: string,
}

// export interface Base64Resource {
//     mediaType: string,
//     resourceContent: string,   
// }