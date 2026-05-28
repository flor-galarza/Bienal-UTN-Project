/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // Aquí puedes agregar otras si quieres, ej:
    // readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
