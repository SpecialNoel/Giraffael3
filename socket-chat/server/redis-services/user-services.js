// user-services.js

/* Summary:
 * Redis sets were used to store the following attributes: 
 * 1. room:{roomCode}:users,  this manages users who are the members of the room
 * 2. room:{roomCode}:online, this manages users currently inside the room
 * 3. user:{userId}:rooms,    this manages rooms the user is currently in
 * 4. room:${roomCode}:user:${userId}:sockets, this manages sockets the user is currently using in the room
*/

// Add the user to a room in Redis (membership; used when the user first join the room)
async function addUser(redis, roomCode, userId) {
    try {
        await redis.multi()
        .sAdd(`room:${roomCode}:users`, userId)
        .sAdd(`user:${userId}:rooms`, roomCode)
        .exec();
    } catch (err) {
        console.error("Failed to add user to room in Redis:", err);
    };
}

// Add the socket under the user in this room in Redis (ephemeral; used when the user enters the room)
async function addSocketToUser(redis, roomCode, userId, socketId) {
    try {
        await redis.sAdd(`room:${roomCode}:user:${userId}:sockets`, socketId);
    } catch (err) {
        console.error("Failed to add socket to user in Redis:", err);
    };
}

// Remove the socket from user in this room in Redis (ephemeral; used when the user exits the room)
async function removeSocketFromUser(redis, roomCode, userId, socketId) {
    try {
        await redis.sRem(`room:${roomCode}:user:${userId}:sockets`, socketId);
    } catch (err) {
        console.error("Failed to remove socket from user in Redis:", err);
    };
}

// Check if the user is currently online in this room in Redis
async function isUserOnline(redis, roomCode, userId) {
    try {
        // The user is online if they have at least one active socket
        const socketCount = await redis.sCard(`room:${roomCode}:user:${userId}:sockets`);
        return socketCount > 0;
    } catch (err) {
        console.error("Failed to check user online status inside room in Redis:", err);
    };
}

// Remove the user from a room in Redis
async function removeUser(redis, roomCode, userId) {
    try {
        await redis.multi()
        .sRem(`room:${roomCode}:users`, userId)
        .sRem(`user:${userId}:rooms`, roomCode)
        .exec();
    } catch (err) {
        console.error("Failed to remove user from room in Redis:", err);
    };
}

// Fetch all rooms the user had joined in Redis
async function getUserRooms(redis, userId) {
    try {
        return await redis.sMembers(`user:${userId}:rooms`);
    } catch (err) {
        console.error("Failed to get rooms the user had joined in Redis:", err);
    };
}

export { addUser, 
         addSocketToUser,
         removeSocketFromUser,
         isUserOnline,
         removeUser, 
         getUserRooms };