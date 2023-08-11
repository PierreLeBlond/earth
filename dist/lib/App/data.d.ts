declare const currentCountry = "albania";
declare const countryAvailable: {
    [code: number]: number;
};
declare const country: {
    [name: string]: string;
};
declare const countryNames: {
    [code: string]: string;
};
declare const countryPos: {
    [code: string]: {
        lat: string;
        lon: string;
    };
};
declare const countryColorMap: {
    [code: string]: number;
};
export { currentCountry, countryAvailable, country, countryNames, countryPos, countryColorMap };
