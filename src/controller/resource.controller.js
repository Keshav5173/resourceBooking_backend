import { Booking } from "../models/booking.models.js";
import { Resource } from "../models/resource.models.js";
import asyncHandler from "../utilis/asyncHandler.js";

const createResource = asyncHandler(async (req, res)=>{
    const { name, detail } = req.body;

    if(!name || !detail){
        return res.status(400).json({
            sucess: false,
            message: "Name and details are required"
        });
    }

    const resource = await Resource.create({
        name,
        detail
    })
    if(!resource){
        return res.status(500).json({
            sucess: false,
            message: "Failed to create Resource"
        })
    }

    return res.status(200).json({
        sucess: true,
        message: "Sucessfully created Resource"
    })
})


const getResourcesWithBookedDates = asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Fetch all resources
    const resources = await Resource.find();

    // Fetch upcoming bookings
    const bookings = await Booking.find({
        date: { $gte: startOfToday },
        status: { $ne: "COMPLETED" }
    }).select("resourceId date status -_id");

    // Attach booked dates to each resource
    const resourceList = resources.map((resource) => {
        const resourceBookings = bookings.filter(
            (booking) =>
                booking.resourceId.toString() === resource._id.toString()
        );

        return {
            ...resource.toObject(),
            bookedDates: resourceBookings.map((booking) => ({
                date: booking.date,
                status: booking.status
            }))
        };
    });

    return res.status(200).json({
        success: true,
        message: resourceList.length
            ? "Successfully fetched resources and booked dates"
            : "No resources found",
        data: resourceList
    });
});
export {
    createResource,
    getResourcesWithBookedDates
}



