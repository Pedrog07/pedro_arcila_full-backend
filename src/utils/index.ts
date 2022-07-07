export const generateUniqueKey = () => Math.random().toString(36).slice(2);

export const entityAssign = (Entity: any, object: any) => {
  return Object.assign(new Entity(), object);
};
