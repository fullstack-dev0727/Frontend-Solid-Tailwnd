const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const idLen = 6;

export function getHash() {
    let id = "";
    for (let i = 0; i < idLen; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}