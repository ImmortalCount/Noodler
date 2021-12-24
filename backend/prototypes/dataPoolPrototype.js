// import { Timestamp } from "bson";

const dataPoolPrototype = {
    _id: String,
    name: String,
    leader: String,
    admins: String,
    description: String,
    isPrivate: Boolean,
    //default false
    isUnlisted: Boolean,
    //default false
    dateCreated: String,
}

var globalPrototype = {
    "_id" : "global",
    "name": "global",
    "leader": "Noodleman0",
    "admins": [],
    "description": "All Noodlers Are Welcome",
    "isPrivate": false,
    "isUnlisted": false,
}