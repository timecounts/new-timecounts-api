const yup = require('yup')
const { array } = require('yup/lib/locale')

const categorySchema = yup
.string()
.trim()
.lowercase('Category must be of lowercase')
.strict(true)

const goalSchema = yup
    .string()
    .uppercase()
    .trim()

const addOrganizationValidation = yup.object({
    organizationName: yup
        .string()
        .required('Must require an Organization Name.'),
    publicUrl: yup
        .string()
        .url()
        .required('Must contain an unique Public URL.'),
    category: yup
        .array()
        .of(categorySchema),
    areas: yup
        .array()
        .of(yup.string().lowercase().trim()),
    goals: yup
        .array()
        .of(goalSchema),
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
