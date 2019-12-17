export default (data) => {

    return {
        id: data.id || 0,
        name: data.name || null,
        description: data.description || null,
        logoURL: data.logoURL || null,
        imageURL: data.imageURL || {},
        country: data.country || {}
    }

}