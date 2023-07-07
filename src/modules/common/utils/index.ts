/** @format */

import * as jose from "jose"
import { Schema } from "zod"
import { NextFunction, Response, Request } from "express"

import { decrytData, encryptData } from "../hashings"
import { AppError, CreateErr, IAdmin } from "../../../types"
import { isAfter } from "date-fns"

export const catchError: CreateErr = (
    message,
    code = 403,
    validations = undefined
) => {
    const err = new Error(message)
    // @ts-ignore
    err.code = code
    // @ts-ignore
    err.validations = validations
    return err
}

// export const tokenize = async (data: Partial<IUser> | Partial<IAdmin>) => {
//     const jwk = {
//         kty: "RSA",
//         n: "whYOFK2Ocbbpb_zVypi9SeKiNUqKQH0zTKN1-6fpCTu6ZalGI82s7XK3tan4dJt90ptUPKD2zvxqTzFNfx4HHHsrYCf2-FMLn1VTJfQazA2BvJqAwcpW1bqRUEty8tS_Yv4hRvWfQPcc2Gc3-_fQOOW57zVy-rNoJc744kb30NjQxdGp03J2S3GLQu7oKtSDDPooQHD38PEMNnITf0pj-KgDPjymkMGoJlO3aKppsjfbt_AH6GGdRghYRLOUwQU-h-ofWHR3lbYiKtXPn5dN24kiHy61e3VAQ9_YAZlwXC_99GGtw_NpghFAuM4P1JDn0DppJldy3PGFC0GfBCZASw",
//         e: "AQAB",
//         d: "VuVE_KEP6323WjpbBdAIv7HGahGrgGANvbxZsIhm34lsVOPK0XDegZkhAybMZHjRhp-gwVxX5ChC-J3cUpOBH5FNxElgW6HizD2Jcq6t6LoLYgPSrfEHm71iHg8JsgrqfUnGYFzMJmv88C6WdCtpgG_qJV1K00_Ly1G1QKoBffEs-v4fAMJrCbUdCz1qWto-PU-HLMEo-krfEpGgcmtZeRlDADh8cETMQlgQfQX2VWq_aAP4a1SXmo-j0cvRU4W5Fj0RVwNesIpetX2ZFz4p_JmB5sWFEj_fC7h5z2lq-6Bme2T3BHtXkIxoBW0_pYVnASC8P2puO5FnVxDmWuHDYQ",
//         p: "07rgXd_tLUhVRF_g1OaqRZh5uZ8hiLWUSU0vu9coOaQcatSqjQlIwLW8UdKv_38GrmpIfgcEVQjzq6rFBowUm9zWBO9Eq6enpasYJBOeD8EMeDK-nsST57HjPVOCvoVC5ZX-cozPXna3iRNZ1TVYBY3smn0IaxysIK-zxESf4pM",
//         q: "6qrE9TPhCS5iNR7QrKThunLu6t4H_8CkYRPLbvOIt2MgZyPLiZCsvdkTVSOX76QQEXt7Y0nTNua69q3K3Jhf-YOkPSJsWTxgrfOnjoDvRKzbW3OExIMm7D99fVBODuNWinjYgUwGSqGAsb_3TKhtI-Gr5ls3fn6B6oEjVL0dpmk",
//         dp: "mHqjrFdgelT2OyiFRS3dAAPf3cLxJoAGC4gP0UoQyPocEP-Y17sQ7t-ygIanguubBy65iDFLeGXa_g0cmSt2iAzRAHrDzI8P1-pQl2KdWSEg9ssspjBRh_F_AiJLLSPRWn_b3-jySkhawtfxwO8Kte1QsK1My765Y0zFvJnjPws",
//         dq: "KmjaV4YcsVAUp4z-IXVa5htHWmLuByaFjpXJOjABEUN0467wZdgjn9vPRp-8Ia8AyGgMkJES_uUL_PDDrMJM9gb4c6P4-NeUkVtreLGMjFjA-_IQmIMrUZ7XywHsWXx0c2oLlrJqoKo3W-hZhR0bPFTYgDUT_mRWjk7wV6wl46E",
//         qi: "iYltkV_4PmQDfZfGFpzn2UtYEKyhy-9t3Vy8Mw2VHLAADKGwJvVK5ficQAr2atIF1-agXY2bd6KV-w52zR8rmZfTr0gobzYIyqHczOm13t7uXJv2WygY7QEC2OGjdxa2Fr9RnvS99ozMa5nomZBqTqT7z5QV33czjPRCjvg6FcE",
//     }
//     const privateKey = await jose.importJWK(jwk, "RS256")
//     let token = ""
//     if (NODE_ENV === "production") {
//         token = await new jose.SignJWT(data)
//             .setProtectedHeader({ alg: "RS256" })
//             .setIssuedAt(new Date().getTime())
//             .setIssuer("https://webadge.com")
//             .setExpirationTime("2s")
//             .sign(privateKey)
//     } else {
//         token = await new jose.SignJWT(data)
//             .setProtectedHeader({ alg: "RS256" })
//             .setIssuedAt(new Date().getTime())
//             .setExpirationTime("7d")
//             .sign(privateKey)
//     }

//     return token
// }

export const success = (msg: string, data: any, meta?: object) => ({
    data: encryptData(JSON.stringify(data)),
    status: true,
    message: msg,
    ...(meta && { meta }),
})

export const Authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const tokenKey = req.get("Authorization")
    try {
        const token = tokenKey?.split(" ")[1]
        if (!token) throw catchError("No Authorization header provided", 401)

        const user = jose.decodeJwt(token) as unknown as IAdmin & {
            exp: number
        }
        if (isAfter(user.exp, new Date())) {
            throw catchError("Session expired.")
        }
        if (user?.role) {
            req.admin = user
        } else {
            req.user = user
        }

        return next()
    } catch (error) {
        next(error)
    }
}

export const bodyHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodyMethod = ["POST", "PUT", "PATCH"]
    try {
        const bodyProperties = Object.values(req.body)
        if (bodyMethod.includes(req.method) && bodyProperties.length) {
            if (!req.body.payload)
                throw catchError("Request not properly formated", 403)
            const decryptPayload = decrytData(req.body.payload)
            const parsedData = JSON.parse(decryptPayload)
            req.body = {
                ...parsedData,
            }
        }
        return next()
    } catch (error) {
        next(error)
    }
}

export const errorHandler = (
    error: AppError,
    req: any,
    res: Response,
    _next: any
) => {
    try {
        let code = error.code || 500
        let msg = error.message

        if (error.name === "MongoServerError") {
            if (error.code === 11000) {
                if (
                    error.message.includes("users") &&
                    error.message.includes("email_1_phoneNumber_1 dup key")
                ) {
                    code = 422
                    msg = "Your account already exists. Kindly login"
                } else {
                    msg = "Duplicate Error"
                    code = 422
                }
            }
        }

        console.log(error.name || "Error", error.message)
        // logger.error(error)

        return res.status(code).json({ status: false, message: msg })
    } catch (e) {
        return res.status(500).json({ status: false })
    }
}

export class validator {
    static body(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }

    static query(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.query)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }

    static params(schema: Schema) {
        return (req: Request, _res: Response, next: NextFunction) => {
            try {
                schema.parse(req.params)
                return next()
            } catch (error: any) {
                let message
                const issues = error.issues[0]
                if (issues.code === "unrecognized_keys") {
                    message = `The following keys are not allowed ${issues.keys.join(
                        ", "
                    )}`
                } else {
                    message = issues.message
                }
                throw catchError(message, 402)
            }
        }
    }
}

export const groupBy = <T = any>(arr: T[], index: string) =>
    arr.reduce((result: any, item: any) => {
        if (result[item[index]]) {
            result[item[index]].push(item)
        } else {
            result[item[index]] = [item]
        }

        return result
    }, {})
