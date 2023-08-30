import { WatchOptions } from 'vue';
import { Bunk } from '~/src/model';
import ToastNotifier from '~/components/ToastNotifier.vue';
import _ from 'lodash';

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
    if (_.isNaN(+n)) return;

    return n?.toLocaleString();
}

export const showParseError = (notifier: InstanceType<typeof ToastNotifier> | undefined = undefined, error: any) => {
    const messages = [];

    if (_.isObject(error?.response?.data?.error)) {
        _.forEach(error?.response?.data?.error, (v, k) => {
            messages.push(`${k}.${v}`);
            return false; // 暫先只取第一筆
        });
    }
    else if (_.isString(error?.response?.data?.error)) {
        messages.push(error?.response?.data?.error);
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

export const toDBC = (text: string) => { 
    let tmp = ""; 

    for(let i = 0; i < text.length; i++) { 
        if (text.charCodeAt(i) == 32) { 
            tmp = tmp + String.fromCharCode(12288); 
        } 
        if (text.charCodeAt(i) < 127) { 
            tmp = tmp + String.fromCharCode(text.charCodeAt(i) + 65248); 
        }
        else
            tmp += text[i];
    }
    
    return tmp; 
}

export const toStringlish = (bunk: Bunk) => {
    return `${bunk?.floor}${bunk?.room_type}${bunk?.room_no}-${bunk?.bed}`;
}

export const toBunk = (stringlishBunk: string) => {
    const regex = /^[1-9][A-E][1-7]-[1-6]$/;
    
    if (stringlishBunk?.match(regex)) {
        return {
            floor: stringlishBunk[0],
            room_type: stringlishBunk[1],
            room_no: stringlishBunk[2],
            bed: stringlishBunk[4],
        } as Omit<Bunk, 'id'>;
    }
    else return null;
}

export const toSimpleDate = (stringlishDate: string) => {
    try {
        return new Date(stringlishDate)?.toISOString()?.split('T')[0];
    }
    catch(error) {
        return null;
    }
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

export const queryStringInspecter = <T extends object>(ref: Ref<T>, options?: WatchOptions) => {
    const stopHandler = watch(() => ref.value, (n) => {
        const router = useRouter();
        const queries = toQueryString(n);

        router.replace({
            query: queries,
        });
    }, options);

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