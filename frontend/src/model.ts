export interface CreateInfo {
    creator: {
        id: number,
        name: string,
    },
    created_at: string,
}

export interface UpdateInfo {
    updater: {
        id: number,
        name: string,
    },
    updated_at: Date,
}

export interface DeleteInfo {
    deleter: {
        id: number,
        name: string,
    },
    deleted_at: Date,
}

export interface Project {
    id: number,
    name: string,
    remark?: string,
}

export interface Bunk {
    id: number,
    floor: number,
    room_type: 'A' | 'B' | 'C' | 'D' | 'E',
    room_no: number,
    bed: number,
}

export interface Role {
    id: number,
    name: string,
}

export interface BoarderStatus {
    id: number,
    name: string,
}

export interface BoarderRole {
    id: number,
    name: string,
}

export interface Class {
    id: number,
    name: string,
}

export interface PointRule {
    id: number,
    code: string,
    reason: string,
    point: number,
}

export interface TelCardContacter {
    id: number,
    name: string,
}

export interface Boarder {
    id: string,
    sid?: string,
    name: string,
    avatar?: string,
    remark?: string,
    access_card?: string,
    birthday?: string,
    phone?: string,
}

export interface User {
    id: number,
    sid: string,
    name: string,
    email: string,
    remark?: string,
    is_admin: boolean,
}

export interface BoarderContacter {
    id: number,
    name: string,
    tel: string,
    remark?: string,
}

export interface PointLog {
    id: number,
    point: number,
    remark?: string,
}

export interface TelCardLog {
    id: number,
    remark?: string,
    contacted_at: string,
}

export interface BoarderNote {
    id: number,
    title: string,
    description: string,
}

export interface UserDuty {
    id: number,
    start_time: string,
    end_time: string,
}