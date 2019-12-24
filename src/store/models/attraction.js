export default (data) => {

    return {
        id: data.id || 0,
        name: data.name || null,
        alternate_name: data.alternate_name || null,
        description: data.description || null,
        heroURL: data.heroURL || null,
        companyID: data.companyID || null,
        destinationID: data.destinationID || null

    }

}