export interface Created {
    created_at: Date,
    creator: any,
}

export interface Updated {
    updated_at: Date,
    updater: any,
}

export interface User {
    id: number,
    role: number,
}

export interface BreadItem {
    title: string,
    href: string,
}