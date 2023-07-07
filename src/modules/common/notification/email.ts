/** @format */

import axios from "axios"

import { catchError } from "../utils"
import { IEmail } from "../../../types"
import { format } from "date-fns"

const {
    MAILGUN_URL,
    MAILGUN_WEBADGE_DOMAIN,
    MAILGUN_PASSWORD,
    MAILGUN_USERNAME,
    SUPPORT_EMAIL,
} = process.env

if (
    typeof MAILGUN_URL !== "string" ||
    typeof MAILGUN_WEBADGE_DOMAIN !== "string" ||
    typeof MAILGUN_USERNAME !== "string" ||
    typeof MAILGUN_PASSWORD !== "string" ||
    typeof SUPPORT_EMAIL !== "string"
) {
    throw catchError("ADD MAILGUN URL IN ENV")
}

export const sendTemplateMail = async (values: Partial<IEmail>) => {
    const data = new URLSearchParams()
    data.append("from", `Aderemi Dare <${SUPPORT_EMAIL}>`)
    data.append("subject", values.subject as string)
    data.append("template", values.templateName as string)
    data.append("X-Mailgun-Track-Clicks", "yes");
    data.append("X-Mailgun-Track-Opens", "yes");
    data.append("X-Mailgun-Track", "yes");

    if (values?.to?.length) {
      values?.to?.forEach(t => data.append("to", t))
    }

    if (values.delieveryTime) {
        data.append(
            "X-Mailgun-Deliver-By",
            format(values.delieveryTime, "EEE, dd MMM yyyy HH:mm:ss xxx")
        )
    }

    if (values["t:variables"]) {
      data.append("t:variables", JSON.stringify(values["t:variables"]))
    }

    if (values.content) {
      data.append("", values.content);
    }

    const { data: mailData } = await axios({
        method: "post",
        url: `${MAILGUN_URL}/${MAILGUN_WEBADGE_DOMAIN}/messages`,
        params: data,
        auth: {
            username: MAILGUN_USERNAME,
            password: MAILGUN_PASSWORD,
        },
    }).catch((err) => {
        console.log(err, 'mail err');
        throw catchError("Error sending mail", 400)
    })

    console.log({ mailData }, 'mails');
    return mailData
}
