// user-services.js

/* Summary:
 * Redis sets were used to store the following attributes: 
 * 1. room:{roomCode}:users,  this manages users who are the members of the room
 * 2. room:{roomCode}:online, this manages users currently inside the room
 * 3. user:{userId}:rooms,    this manages rooms the user is currently in
 * 4. room:${roomCode}:user:${userId}:sockets, this manages sockets the user is currently using in the room
*/

// Add the user to a room in Redis
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

// Mark the user's status as online in a room
async function markUserAsOnline(redis, roomCode, userId) {
    try {
        await redis.sAdd(`room:${roomCode}:online`, userId);
    } catch (err) {
        console.error("Failed to mark user as online in Redis:", err);
    };
}

// Mark the user's status as offline in a room (by removing the user from online users)
async function markUserAsOffline(redis, roomCode, userId) {
    try {
        await redis.sRem(`room:${roomCode}:online`, userId);
    } catch (err) {
        console.error("Failed to mark user as offline in Redis:", err);
    };
}

// Add the socket under the user in this room in Redis
async function addSocketToUser(redis, roomCode, userId, socketId) {
    try {
        await redis.sAdd(`room:${roomCode}:user:${userId}:sockets`, socketId);
    } catch (err) {
        console.error("Failed to add socket to user in Redis:", err);
    };
}

// Remove the socket from user in this room in Redis
async function removeSocketFromUser(redis, roomCode, userId, socketId) {
    try {
        await redis.sRem(`room:${roomCode}:user:${userId}:sockets`, socketId);
    } catch (err) {
        console.error("Failed to remove socket from user in Redis:", err);
    };
}

// Check if the user is currently online in Redis
async function isUserOnline(redis, userId) {
    try {
        // The user is online if they have at least one active socket
        const socketCount = await redis.sCard(`user:${userId}:sockets`);
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
        .sRem(`room:${roomCode}:online`, userId)
        .sRem(`user:${userId}:rooms`, roomCode)
        .exec();
    } catch (err) {
        console.error("Failed to remove user to room in Redis:", err);
    };
}

// Fetch all online users inside a room in Redis
async function getOnlineUsers(redis, roomCode) {
    try {
        return await redis.sMembers(`room:${roomCode}:online`);
    } catch (err) {
        console.error("Failed to get online users inside room in Redis:", err);
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
         markUserAsOnline, 
         markUserAsOffline,
         addSocketToUser,
         removeSocketFromUser,
         isUserOnline,
         removeUser, 
         getOnlineUsers, 
         getUserRooms };