const yup = require('yup')

const addOrganizationValidation = yup.object({
    organizationName: yup
        .string()
        .required('Must require an Organization Name.'),
    publicUrl: yup
        .string()
        .url()
        .required('Must contain an unique Public URL.'),
    category: yup
        .string()
        .lowercase()
        .trim()
        .required('Must contain a Category'),
    areas: yup
        .array(
            yup
                .string()
                .lowercase()
                .trim()
        )
        .required('Must contain Area'),
    goals: yup
        .array(
            yup
                .string()
                .uppercase()
                .trim()
        )
        .required('Must contain Goal'),
})

const organizationUrlExistValidation = yup.object({
    publicUrl: yup
        .string()
        .url()
        .required('Must contain an unique Public URL.')
})

module.exports = {
    addOrganizationValidation,
    organizationUrlExistValidation
}
