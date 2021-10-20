const organizationApprovalMail = (recieverName, verificationLink) => {
    return {
        text: `
        Hi ${recieverName},
        
        Please verify your organization to get access to thousands of exclusive features of Timecounts.
        Click the link below to verify:
        ${verificationLink}

        Thank you,
        Timecounts
        `,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Organization Verification</title>
        </head>
        <body>
            <h1>Organization Approval</h1>

            <p>
                Please verify your organization to get access to thousands of exclusive features of Timecounts.
                Click the link below to verify:
                ${verificationLink}
            </p>

            <p>
                Thank you,
                Timecounts
            </p>
        </body>
        </html>
        `
    }
}

module.exports = organizationApprovalMail