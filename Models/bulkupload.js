const config = require('../Models/config');
const sql = require('mssql');

class BulkUpload{

    static async uploadExcelSheet(data){
        try{
            let pool = await sql.connect(config.db_config);
            let result = await pool.request()
                .input('Name',sql.NVarChar(250),data.Name)
                .input('Email',sql.NVarChar(250),data.Email)
                .input('ProjectName',sql.NVarChar(250),data.ProjectName)
                .input('TaskCategory',sql.NVarChar(250),data.TaskCategory)
                .input('TicketId',sql.NVarChar(250),data.TicketId)
                .input('Hours',sql.NVarChar(250),data.Hours)
                .input('Day',sql.DateTime(),data.Day)
                .input('Notes',sql.NVarChar(250),data.Notes)
                .execute('usp_addWorkLog');
            sql.close();
            //console.log(result.recordset[0].Id);
            return result.recordset[0].Id;
        }catch(e){
            console.log(`Exception In BulkUpload : uploadExcelSheet() :: ${e.toString()}`);
        }
    }
}

module.exports = {BulkUpload};