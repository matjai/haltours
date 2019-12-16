export default (data) => {

    return {
        id: data.id || 0,
        companyId: data.companyId || null,
        staffId: data.staffId || null,
        name: data.name || null,
        mobile: data.mobile || null,
        email: data.email || null,
        position: data.position || {},
        department: data.department || {},
        permissions: data.permissions || [],
        checked: false
    }

}