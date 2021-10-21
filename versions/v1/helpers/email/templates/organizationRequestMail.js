const organizationRequestMail = (recieverName, organizationName) => {
    return {
        text: `
        Hi ${recieverName},
        
        Your request to create a new organization - ${organizationName} is pending approval. You should wait until the administrator approves your request.

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
            <title>Organization Creation</title>
        </head>
        <body>
            <h1>Almost there...</h1>

            <p>
            Your request to create a new organization - ${organizationName} is pending approval. You should wait until the administrator approves your request.
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

module.exports = organizationRequestMail