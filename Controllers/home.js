const config = require('../Models/config');
const Spotify = require('node-spotify-api');
const request = require('request');
const XLSX = require('xlsx');
const path = require('path');
const {BulkUpload} = require('../Models/bulkupload');


module.exports={

    getSpotifySongList: async function(req,res){
            
        try{
            //url = 'https://api.spotify.com/v1/browse/new-releases?limit=20';
            let user_id = req.body.user_id || 'oytoqrscnfh9jryb23l0c3quj'

            var spotify = new Spotify({
                id: config.spotify.clientid,
                secret: config.spotify.secrate
            });

            spotify
                .request(config.spotify.url)
                .then(function(data) {
                    console.log(data); 
                    res.status(200).json({
                        success: true,
                        message: '',
                        errorCode: '000',
                        song_list: data
                    });
                })
                .catch(function(err) {

                    const oAuth = err.options.headers.Authorization;

                    console.error('outh - '+ oAuth); 
    
                    var options = {
                        method:'GET',
                        url: config.spotify.url,//+user_id,
                        headers:{
                            'Authorization': oAuth
                        }
                    }
            
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                            
                            let musiclist = JSON.parse(body);
                            res.status(200).json({
                                success: true,
                                message: '',
                                errorCode: '000',
                                song_list :musiclist
                            });

                        }else{
                            console.log(error);

                            res.status(400).json({
                                success: false,
                                message: error,
                                errorCode: '002',
                                song_list : null
                            });
                        }
                        
                    }
            
                    request(options,callback);

                });
                
                 
               

        }catch(e){
            res.status(400).json({
                success: false,
                message: e.toString(),
                errorCode: '001'
            });
        }

        
    },

    searchSpotifySong: async function(req,res){

        try{
            
            var spotify = new Spotify({
                id: config.spotify.clientid,
                secret: config.spotify.secrate
            });
            
            spotify.search({ type: 'track', query: 'heartbeat' ,limit:'1' }, function(err, data) {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: err.toString(),
                    errorCode: '005'
                });
            }else{
                res.status(200).json({
                    success: true,
                    message: '',
                    errorCode: '000',
                    search_song: data,
                })
            }
            
            console.log(data); 
            });
        }catch(e){
            res.status(400).json({
                success: false,
                message: e.toString(),
                errorCode: '001',
                search_song: null
            });
        }

    },

    xlsx : async function(req,res){

        const excel = path.join(__dirname,'../excel/copy1.xlsx');
        var workbook = XLSX.readFile(excel,{type:"binary",cellDates:true,dateNF:'mm/dd/yyyy'});
        var sheet_name_list = workbook.SheetNames;

        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]/*,{raw:false,header:0}*/);
        //console.log(xlData);

        var cnt = 0
        var date = null;
        
        for(var i = 0 ; i< xlData.length ; i++){
            cnt++;
            
            // var date = new Date(xlData[i].Day);
            // var year,month,day,hour,min,sec,milisec;
            // year = date.getFullYear();
            // month = date.getMonth()+1;
            // day = date.getDay();
            // hour =date.getHours();
            // min = date.getMinutes();
            // sec = date.getSeconds();
            // milisec = date.getMilliseconds();

            // console.log(year,month,day,hour,min,sec,milisec);
            // var savedbDate = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec+'.'+milisec;

            //console.log(savedbDate);

            result = {

                Name: xlData[i].Name|| '' ,
                Email: xlData[i].Email || '' ,
                ProjectName : xlData[i].ProjectName || '' ,
                TaskCategory: xlData[i].TaskCategory || '' ,
                TicketId: xlData[i].TicketId || '' ,
                Hours: xlData[i].Hours || '' ,
                Day: xlData[i].Day || '' ,
                Notes: xlData[i].Notes || ''
                
            }
            
            // let res = await BulkUpload.uploadExcelSheet(result);
            // if(!res>0){
            //     console.log(`Error : While Saving in Database: ${res}`);
            //     break;
            // }
        }

        res.json({
            cnt: cnt,
            data: xlData
        });
    }
}