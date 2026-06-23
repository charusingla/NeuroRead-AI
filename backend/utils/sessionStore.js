export const activeSessions = global.activeSessions || new Map();

if (!global.activeSessions) {
  global.activeSessions = activeSessions;
}