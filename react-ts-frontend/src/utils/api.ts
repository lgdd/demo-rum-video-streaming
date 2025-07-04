const backendProtocol: string = import.meta.env.VITE_APP_BACKEND_PROTOCOL;
const backendHost: string = import.meta.env.VITE_APP_BACKEND_HOST;
const backendPort: string = import.meta.env.VITE_APP_BACKEND_PORT;

export const BACKEND_BASE_URL : string = `${backendProtocol}://${backendHost}:${backendPort}`