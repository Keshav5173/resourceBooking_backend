import { Resource } from "../models/resource.models.js";
import { Booking } from "../models/booking.models.js";
import asyncHandler from "../utilis/asyncHandler.js";


const createBooking = asyncHandler(async (req, res)=>{
    const { resourceId, date } = req.body;
    const userId = req.user._id;

    if(!resourceId){
        return res.status(400).json({
            sucess: false,
            message: "Resource Id is required"
        })
    }

    await Resource.findById(resourceId);

    const booking = await Booking.create({
        resourceId,
        userId,
        date
    })

    if(!booking){
        return res.status(500).json({
            sucess: false,
            message: "failed to create Booking"
        })
    }

    return res.status(201).json({
        sucess: true,
        message: "Sucessfully created a Booking"
    })
})


const getBookingHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const bookingHistory = await Booking.find({ userId })
        .populate("resourceId", "name detail")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "Fetched booking history",
        data: bookingHistory
    });
});



const getBookingStats = asyncHandler(async (req, res) => {
    const booking = await Booking.aggregate([
        {
            $lookup: {
                from: "resources",
                localField: "resourceId",
                foreignField: "_id",
                as: "resource"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$resource",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                date: 1,
                bookingDate: 1,
                status: 1,
                fullName: "$user.fullName",
                email: "$user.email",
                resourceName: "$resource.name"
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        message: "Fetched all booking history",
        data: booking
    });
});


export {
    createBooking,
    getBookingHistory,
    getBookingStats
}
