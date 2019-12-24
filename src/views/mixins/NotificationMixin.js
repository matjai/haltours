export default {

    data() {
        return {
            snackbar: false,
            message: null,
            type: null
        };

    },
    methods: {
        showToast(message, type) {
            this.snackbar = true;
            this.message = message;
            this.type = type;
        },
        hideToast(message, type) {
            this.snackbar = false;
            this.message = message;
            this.type = type;
        }
    }
}