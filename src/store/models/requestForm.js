
export default (data) => {

    return {
        id: data.id || null,
        companyId: data.companyId || null,
        departureTo: data.departureTo || null,
        departureDate: data.departureDate || null,
        returnFrom: data.returnFrom || null,
        returnDate: data.returnDate || null,
        paxNo: data.paxNo || null,
        mealType: data.mealType || null,
        mealRemark: data.mealRemark || null,
        noOfNight: data.noOfNight || null,
        destination: data.Destination || null,
        tourOption: data.tourOption || null,
        tourOptionRemark: data.tourOptionRemark || null,
        dueDate: data.dueDate || null,
        requestorCompanyId: data.requestorCompanyId || null,
        requestStaffId: data.requestStaffId || null,
        requesteeCompanyId: data.requesteeCompanyId || null,
        requesteeStaffId: data.requesteeStaffId || null,
        dateRequest: data.dateRequest || null,
    };
};