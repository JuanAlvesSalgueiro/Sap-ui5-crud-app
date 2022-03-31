sap.ui.define([], function () {
	"use strict";

	return {

		modificarOdata: function (oData, iterarOdata) {
            //Fncion de ayuda que modifica y agrega la informacion que llega de mi oData
            //el parametro iterarOdata es un boolean que en caso de ser verdadero significa que el Info q me llega va tener mas de un registro
            //por lo tanto necesito hacer un loop para obtener todos los registro.
            if (iterarOdata){

                for(let data of oData.results){

                    data.NombreTorneo = data.NombreTorneo.replaceAll('_', ' ');
                    data.FechaInicio = data.FechaInicio.replaceAll('.','/');
                    data.FechaFin = data.FechaFin.replaceAll('.','/');
                    data.Lugar = data.Lugar.replaceAll(',', ', ');
                    data.Lugar = data.Lugar.replaceAll('_', ' ');
                    let pais = data.Lugar.split(",")[1];
                    
                    if (pais === " España"){
                        data.img = "https://img.icons8.com/color/60/spain-circular.png";
                    }
    
                    if (pais === " Francia"){
                        data.img = "https://img.icons8.com/color/60/france-circular.png";
                    }
    
                    if (pais === " Italia"){
                        data.img = "https://img.icons8.com/color/60/italy-circular.png";
                    }
    
                    if (pais === " Usa"){
                        data.img = "https://img.icons8.com/color/60/usa-circular.png";
                    }
    
                    if (pais === " Inglaterra"){
                        data.img = "https://img.icons8.com/color/60/great-britain-circular.png";
                    }
    
                    if (pais === " Australia"){
                        data.img = "https://img.icons8.com/color/60/australia-circular.png";
                    }
    
                    if (pais === " Canada"){
                        data.img = "https://img.icons8.com/color/60/canada-circular.png";
                    }
    
                    if (pais === " China"){
                        data.img = "https://img.icons8.com/color/60/china-circular.png";
                    }
    
                    if (pais === " Monaco"){
                        data.img = "https://img.icons8.com/color/60/monaco-circular.png";
                    }
    
                }
            } else {
                
                oData.NombreTorneo = oData.NombreTorneo.replaceAll('_', ' ');
                oData.FechaInicio = oData.FechaInicio.replaceAll('.','/');
                oData.FechaInicio = oData.FechaInicio.replaceAll('JAN','01');
                oData.FechaInicio = oData.FechaInicio.replaceAll('FEB','02');
                oData.FechaInicio = oData.FechaInicio.replaceAll('MAR','03');
                oData.FechaInicio = oData.FechaInicio.replaceAll('APR','04');
                oData.FechaInicio = oData.FechaInicio.replaceAll('MAY','05');
                oData.FechaInicio = oData.FechaInicio.replaceAll('JUN','06');
                oData.FechaInicio = oData.FechaInicio.replaceAll('JUL','07');
                oData.FechaInicio = oData.FechaInicio.replaceAll('AUG','08');
                oData.FechaInicio = oData.FechaInicio.replaceAll('SEP','09');
                oData.FechaInicio = oData.FechaInicio.replaceAll('OCT','10');
                oData.FechaInicio = oData.FechaInicio.replaceAll('NOV','11');
                oData.FechaInicio = oData.FechaInicio.replaceAll('DEC','12');
                oData.FechaFin = oData.FechaFin.replaceAll('.','/');
                oData.FechaFin = oData.FechaFin.replaceAll('JAN','01');
                oData.FechaFin = oData.FechaFin.replaceAll('FEB','02');
                oData.FechaFin = oData.FechaFin.replaceAll('MAR','03');
                oData.FechaFin = oData.FechaFin.replaceAll('APR','04');
                oData.FechaFin = oData.FechaFin.replaceAll('MAY','05');
                oData.FechaFin = oData.FechaFin.replaceAll('JUN','06');
                oData.FechaFin = oData.FechaFin.replaceAll('JUL','07');
                oData.FechaFin = oData.FechaFin.replaceAll('AUG','08');
                oData.FechaFin = oData.FechaFin.replaceAll('SEP','09');
                oData.FechaFin = oData.FechaFin.replaceAll('OCT','10');
                oData.FechaFin = oData.FechaFin.replaceAll('NOV','11');
                oData.FechaFin = oData.FechaFin.replaceAll('DEC','12');
                oData.Lugar = oData.Lugar.replaceAll(',', ', ');
                oData.Lugar = oData.Lugar.replaceAll('_', ' ');
                let pais = oData.Lugar.split(",")[1];
                
                if (pais === " España"){
                    oData.img = "https://img.icons8.com/color/72/spain-circular.png";
                }
                if (pais === " Francia"){
                    oData.img = "https://img.icons8.com/color/72/france-circular.png";
                }
                if (pais === " Italia"){
                    oData.img = "https://img.icons8.com/color/72/italy-circular.png";
                }
                if (pais === " Usa"){
                    oData.img = "https://img.icons8.com/color/72/usa-circular.png";
                }
                if (pais === " Inglaterra"){
                    oData.img = "https://img.icons8.com/color/72/great-britain-circular.png";
                }
                if (pais === " Australia"){
                    oData.img = "https://img.icons8.com/color/72/australia-circular.png";
                }
                if (pais === " Canada"){
                    oData.img = "https://img.icons8.com/color/72/canada-circular.png";
                }
                if (pais === " China"){
                    oData.img = "https://img.icons8.com/color/72/china-circular.png";
                }
                if (pais === " Monaco"){
                    oData.img = "https://img.icons8.com/color/72/monaco-circular.png";
                } 
            }

        return oData;    
        }
        
	};

});