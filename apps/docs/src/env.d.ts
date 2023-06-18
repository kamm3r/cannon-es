/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

type ImportMetaEnv = {
	readonly GITHUB_TOKEN: string | undefined;
}

type ImportMeta = {
	readonly env: ImportMetaEnv;
}
