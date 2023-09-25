const avatarUrl = 'https://ui-avatars.com/api';

export const avatar = (name: string = '頭像', color: string = 'FFFFFF', background: string = '000000') => {
    return `${avatarUrl}/?name=${name}&color=${color}&background=${background}`;
}