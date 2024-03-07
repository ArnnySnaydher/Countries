export interface Country {
    name:{
        common:String
    };
    capital: string[];
    cca3:string;
    flags:{
        alt:string;
        png:string;
    };
    population:number;
    region:string;
}