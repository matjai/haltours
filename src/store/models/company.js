export default (data) => {

    return {
        id: data.id || 0,
        name: data.name || null,
        description: data.description || null,
        registration_number: data.registration_number || null,
        address: data.address || null,
        phone_number: data.phone_number || null,
        fax_number: data.fax_number || null,
        website: data.website || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        logoURL: data.logoURL || null,
        heroURL: data.heroURL || null,
        country: data.country || {}
    }

}