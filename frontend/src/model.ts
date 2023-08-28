export interface Created {
    created_at: Date,
    creator: any,
}

export interface Updated {
    updated_at: Date,
    updater: any,
}

export interface Project {
    id: number,
    name: string,
    remark?: string,
}

export interface Bunk {
    id: number,
    floor: string,
    room_type: string,
    room_no: string,
    bed: string,
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
    project_bunk: Bunk,
    avatar?: string,
    remark?: string,
    access_card?: string,
    birthday?: string,
    phone?: string,
}

export interface User {
    id: number,
    name: string,
    email: string,
    is_admin: boolean,
}

export interface BoarderContacter {
    id: number,
    name: string,
    tel: string,
    remark?: string,
}

export interface Point {
    id: number,
    remark?: string,
}

export interface TelCard {
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
    duty_date: number,
}