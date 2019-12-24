import moment from 'moment';

export default {

    created() {
        //fetch common stores
    },
    //call commons getters
    computed: {

        getDate(format = null) {
            return format == null ? moment().format('DD-MM-YYYY') : moment().format(format);
        }
    },
};