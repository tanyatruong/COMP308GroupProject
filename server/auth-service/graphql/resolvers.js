const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { Resident } = require('../models/Resident.js');
const { BusinessOwner } = require('../models/BusinessOwner.js');
const { CommunityOrganizer } = require('../models/CommunityOrganizer.js');
const { Location } = require('../models/Location.js');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const resolvers = {
    Location: {
        __resolveReference: async (location) => {
            return await Location.findById(location.id);
        },
    },
    Resident: {
        __resolveReference: async (resident) => {
            return await Resident.findById(resident.id);
        }
    },
    BusinessOwner: {
        __resolveReference: async (businessOwner) => {
            return await BusinessOwner.findById(businessOwner.id);
        }
    },
    CommunityOrganizer: {
        __resolveReference: async (communityOrganizer) => {
            return await CommunityOrganizer.findById(communityOrganizer.id);
        }
    },
    LoginResult: {
        __resolveType(obj) {
            if (obj.role === "Resident") {
                return "Resident";
            }
            if (obj.role === "CommunityOrganizer") {
                return "CommunityOrganizer";
            }
            if (obj.role === "BusinessOwner") {
                return "BusinessOwner";
            }
            return null;
        }
    },
    Query: {
        me: async (_, __, {user}) => {
            switch(user.role){
                case "Resident":
                    const resident = await Resident.findById(user.id);
                    return resident;
                case "CommunityOrganizer":
                    const communityOrganizer = await CommunityOrganizer.findById(user.id);
                    return communityOrganizer;
                case "BusinessOwner":
                    const businessOwner = BusinessOwner.findById(user.id);
                    return businessOwner;
                default:
                    throw new Error("Unable to process user.")
            }
        }
    },
    Mutation: {
        resSignup: async (_, {role, username, password, interests, location}) => {
            const existingResident = await Resident.findOne({username});
            if (existingResident) {
                throw new Error("A resident already exists with that username.");
            }

            let existingLocation = await Location.findOne({
                city: location.city,
                postalCode: location.postalCode,
                address: location.address
            });

            if (!existingLocation){
                const newLocation = new Location({
                    city: location.city,
                    postalCode: location.postalCode,
                    address: location.address
                });
                await newLocation.save();
                existingLocation = newLocation;
            }

            const resident = new Resident({
                role,
                username,
                password,
                interests,
                location: existingLocation.id
            });
            await resident.save();

            const residentWithLocation = await Resident.findOne({_id: resident._id}).populate("location");
            return {
                ...residentWithLocation.toObject(),
                id: residentWithLocation._id.toString(),
                location: {
                    ...residentWithLocation.location.toObject(),
                    id: residentWithLocation.location._id.toString()
                }
            };
        },
        boSignup: async (_, {role, username, password}) => {
            const existingBO = await BusinessOwner.findOne({username});
            if (existingBO) {
                throw new Error("A business owner already exists with that username.");
            }

            const businessOwner = new BusinessOwner({
                role,
                username,
                password
            });
            await businessOwner.save();

            return businessOwner;
        },
        coSignup: async(_, {role, username, password}) => {
            const existingCO = await CommunityOrganizer.findOne({username});
            if(existingCO) {
                throw new Error("A community organizer with that username already exists.");
            }

            const communityOrganizer = new CommunityOrganizer({
                role,
                username,
                password
            });
            await communityOrganizer.save();
            
            return communityOrganizer;
        },
        Login: async(_, {role, username, password}, {res}) => {
            switch (role){
                case "Resident":
                    const resident = await Resident.findOne({username});
                    if(!resident){
                        throw new Error('Resident not found.');
                    }
                    const residentPasswordValid = await bcrypt.compare(password, resident.password);
                    if(!residentPasswordValid){
                        throw new Error("Invalid Password");
                    }
                    const residentToken = jwt.sign({id: resident._id, role: resident.role}, SECRET_KEY, {expiresIn: '1h'});
                    res.cookie("token", residentToken, {httpOnly: true, secure: false, samesite: 'lax'});
                    return resident;
                    break;

                case "CommunityOrganizer":
                    const communityOrganizer = await CommunityOrganizer.findOne({username});
                    if(!communityOrganizer){
                        throw new Error('Community organizer not found');
                    }
                    const coPasswordValid = await bcrypt.compare(password, communityOrganizer.password);
                    if(!coPasswordValid){
                        throw new Error('Invalid Password.');
                    }
                    const coToken = jwt.sign({id: communityOrganizer._id, role: communityOrganizer.role}, SECRET_KEY, {expiresIn: '1h'});
                    res.cookie("token", coToken, {httpOnly: true, secure: false, samesite: 'lax'});
                    return communityOrganizer;
                    break;

                case "BusinessOwner":
                    const businessOwner = await BusinessOwner.findOne({username});
                    if(!businessOwner){
                        throw new Error("Business owner not found");
                    }
                    const boPasswordValid = await bcrypt.compare(password, businessOwner.password);
                    if(!boPasswordValid){
                        throw new Error("Invalid password");
                    }
                    const boToken = jwt.sign({id: businessOwner._id, role: businessOwner.role}, SECRET_KEY, {expiresIn: '1h'});
                    res.cookie("token", boToken, {httpOnly: true, secure: false, samesite: 'lax'});
                    return businessOwner;
                    break;
                default:
                    throw new Error("Invalid Role");
            }
        }
    }
}

module.exports = {resolvers}