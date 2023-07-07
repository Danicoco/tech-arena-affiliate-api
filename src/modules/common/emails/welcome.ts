type Props = {
    fullName: string;
    ownersName: string;
    businessName: string;
}

function freelancerWelcome ({ businessName, ownersName, fullName }: Props) {
    return `    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Tech Arena</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
      @font-face {
        font-family: "Circular-Std";
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src: url("https://indigo-emr.s3.eu-west-1.amazonaws.com/assets/email-template/fonts/CircularStd-Bold.eot"),
          url("https://indigo-emr.s3.eu-west-1.amazonaws.com/assets/email-template/fonts/CircularStd-Bold.woff") format("woff"),
          url("https://indigo-emr.s3.eu-west-1.amazonaws.com/assets/email-template/fonts/CircularStd-Bold.ttf") format("truetype"),
          url("https://indigo-emr.s3.eu-west-1.amazonaws.com/assets/email-template/fonts/CircularStd-Bold.svg#webfont") format("svg");
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
          "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .button {
        display: inline-block;
        border-radius: 4px;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 14px 32px;
        background-color: #6a69e4;
        border-color: #fff;
        font-family: "Circular-Std", sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
        cursor: pointer;
        text-decoration: none;
        text-align: center;
        text-transform: uppercase;
      }

      h1,
      h2,
      h3,
      h4 {
        font-family: "Circular-Std", sans-serif;
        font-weight: 500;
        font-size: 24px;
        color: #000000;
        margin-top: 0;
        letter-spacing: 1px;
      }

      p,
      ol,
      li,
      ul {
        font-family: "Circular-Std", sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #000;
        line-height: 25px;
        letter-spacing: 0.5px;
        margin-top: 0;
      }
    </style>
  </head>
  <body style="margin: 5px; padding: 0">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td>
          <p style="font-weight: 600;"> Dear ${fullName}, </p>
        </td>
      </tr>
      <tr>
        <td>
          <p> Welcome to the ${businessName} community! We are thrilled to have you onboard, and we can't wait to support you on your freelance journey. Whether you're just starting out or looking to take your freelance career to new heights, we're here to provide you with valuable resources, insights, and opportunities. </p>

          <div style="text-align: center;">
            <button class="button">Get Started</button>
          </div>

          <p> At ${businessName}, we believe in empowering freelancers like you to achieve your professional goals and thrive in the ever-evolving gig economy. As promised, we have an exclusive offer tailored specifically for you. This limited-time offer is designed to help you get new gigs fast, increase your freelance reputation and in turn your revenue. And most importantly, you get access to exclusive support from ${businessName}.</p>

          <p> To take advantage of this offer and unlock the full potential of your freelance career, simply click on the button below.</p>
          <div style="text-align: center;">
            <button class="button">Grab Course Now</button>
          </div>
          <p>
                We're here to help and provide you with the guidance you need to thrive as a freelancer. Once again, welcome to the ${businessName} community! We're excited to have you join us on this incredible journey.
          </p>
          <p>Sincerely,</p>
          <p>${ownersName},</p>
          <p>${businessName}.</p>
        </td>
      </tr>
    </table>
  </body>`
}

export default freelancerWelcome;
