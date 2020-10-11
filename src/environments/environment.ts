// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    graphql: 'https://20.54.183.57/graphql', // 'http://192.168.1.8:3000/graphql',
    mediaManagerUrl: 'https://20.54.183.57/media-manager/', // 'http://192.168.1.8:8003/',
    hlsStreamUrl: 'https://20.54.183.57/hls-stream/', // 'http://192.168.1.8:8006/',
    projectUrl: 'https://20.54.183.57/project-metadata/' // 'http://192.168.1.8:8007/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
