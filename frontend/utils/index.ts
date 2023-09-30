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

export const prefixInteger = (value: string | number, length: number) => {
    const num = parseInt(`${value}`);
    return (Array(length).join('0') + num).slice(-length);
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
    else if (error?.error) {
        messages.push(_.toString(error?.error));
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
            floor: +stringlishBunk[0],
            room_type: stringlishBunk[1],
            room_no: +stringlishBunk[2],
            bed: +stringlishBunk[4],
        } as Omit<Bunk, 'id'>;
    }
    else return null;
}

export const getTeleExtension = (bunk: Bunk) => {
    const typeWeights = {
        'A': 0,
        'B': 7,
        'C': 15,
        'D': 24,
        'E': 30,
    }
    let result = 4000;
    result += +bunk?.floor * 100;
    result += typeWeights[bunk?.room_type];
    result += +bunk?.room_no;

    return result;
}

export const checkValueEmpty = <V, O>(value: V, transformer?: (v: NonNullable<V>) => O, returnIfEmpty: string = '--') => {
    if (_.isNaN(value)) {
        return returnIfEmpty;
    }
    else if (_.isNumber(value)) {
        return transformer ? transformer(value as NonNullable<V>) : value;
    }
    else if (!_.isEmpty(value)) {
        return transformer ? transformer(value as NonNullable<V>) : value;
    }
    else {
        return returnIfEmpty;
    }
}

export const hideMiddle = (value: string) => {
    if (value?.length == 2) {
        return value[0] + '○';
    }
    else if (value?.length >= 2) {
        return value[0] + new Array(value?.length - 2).fill('○').join('○') + value[value?.length - 1]
    }
    else {
        return value;
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

export const queryStringInspecter = <T extends object>(ref: Ref<T>, options: WatchOptions = { deep: true, immediate: false }) => {
    const stopHandler = watch(() => ref.value, async (n) => {
        const router = useRouter();
        const query = toQueryString(n);

        router.replace({
            query: query,
        });
    }, options);

    return stopHandler;
}

interface UrlOptions {
    https?: boolean,
    subDomain?: string,
    params?: string,
}