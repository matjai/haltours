export default (data) => {

    return {
        id: data.id || 0,
        name: data.name || null,
        description: data.description || null,
        codeType: data.codeType || null

    }

}