function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function setUUIDIfNotExists(): string {
  if (!localStorage.getItem("DEVICE_UUID")) {
    const uuid = generateUUID();
    localStorage.setItem("DEVICE_UUID", uuid);
    
    return uuid;
  }
  return localStorage.getItem("DEVICE_UUID")!;
}

export {generateUUID, setUUIDIfNotExists};