export default {

    data() {

        return {
            rules: {
                required: value => !!value || 'This field is required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => ('The email and password you entered don\'t match'),
            },
        };
    }
}