import bcrypt from "bcrypt"
import _ from "lodash"
import { ProjectBunkModel } from "../models/ProjectBunk"
import { BunkModel } from "../models/Bunk"

const random = (len: number, _mapStr: string | null): string => {
    const mapStr =
        _mapStr ||
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const res = _.sampleSize(mapStr, len)
    return res.join("")
}

const hash = (str: string): string => {
    const saltRounds = 10
    const hash = bcrypt.hashSync(str, saltRounds)
    return hash
}

const verifyHash = (org: string, hashedStr: string): boolean => {
    return bcrypt.compareSync(org, hashedStr)
}

const toBase64 = (buffer: Buffer): string => {
    return Buffer.from(buffer).toString("base64")
}

const fromBase64 = (base64: string): Buffer => {
    return Buffer.from(base64, "base64")
}

const generateAvatarURL = (
    name: string,
    background: string,
    fontColor: string
): string => {
    return `https://ui-avatars.com/api/?name=${name}&background=${background}&color=${fontColor}`
}

const formatBunkString = (bunk: ProjectBunkModel | BunkModel): string => {
    return bunk?.floor + bunk?.room_type + bunk?.room_no + "-" + bunk?.bed
}

export default {
    random,
    hash,
    verifyHash,
    toBase64,
    fromBase64,
    generateAvatarURL,
    formatBunkString
}
