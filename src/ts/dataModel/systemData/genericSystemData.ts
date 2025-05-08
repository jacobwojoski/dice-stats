export class GenericSystemData {
    DEGREE_SUCCESS = {}; // Overwritten On System Info

    system_id:string = '';

    /* Reformat local data info something handlebars can handle. Handlebars doesn't work well with 2d info 
            TODO: Should the form just handle this?*/
    public getDisplayData(){
    }

    public addSystemData(system_info:GenericSystemData){
    }

    public parseRollMessage(message_obj:any){
    }

    public clear(){
        
    }
}