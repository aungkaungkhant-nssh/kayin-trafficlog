const sanitize = (str?: string | null) => str?.replace(/\s+/g, '') ?? null;

export default sanitize;