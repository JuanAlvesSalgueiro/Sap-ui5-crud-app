sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "Academia2022/zluuc3tenis/helpers/index",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, index) {
        "use strict";

        return Controller.extend("Academia2022.zluuc3tenis.controller.Torneos", {
            modificarOdata: index.modificarOdata,
            onInit: function () {
                this._obtenerSuperficies();
                this._obtenerTorneos();
            },

/*--------------------------------------------VIEW TORNEOS AL CARGAR LA PAGINA-------------------------------------------*/ 

            onVisualizarIncripciones: function (oEvent) {
                //Obtengo el nombre del torneo selecionado y navego hacia la vista de inscripciones de ese torneo.
                let nombreTorneo = oEvent.getSource().getBindingContext("ModeloLocalTorneos").getProperty("NombreTorneo");
                nombreTorneo = nombreTorneo.replace(' ', '_');
                this.getOwnerComponent().getRouter().navTo("inscripciones", {
                    NombreTorneo: nombreTorneo
                });
            },

            _obtenerTorneos: function () {
                /*
                Busco la informacion de todos los torneos de mi oData, armo un modelo local con la data que me llego
                y se la seteo a la vista de este controlador.
                */
                var oModel = this.getView().getModel();
                oModel.read("/TorneosSet", {
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        var oDataModificado = this.modificarOdata(oData, true);
                        oModelLocalJson.setData(oDataModificado.results);

                        this.getView().setModel(oModelLocalJson, "ModeloLocalTorneos");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
            },
            
/*----------------------------------------FILTROS-------------------------------------------*/    

            onFiltrarTorneos: function () {
                /*
                Obtengo los valores de los filtros y busco la informacion de mi oData con los filtros que se pasaron,
                y seteo la nueva lista de torneos a la vista.
                */
                var aFilter = [];
                var vSuperficie = "",
                    vPuntos = "",
                    vMinRanking = "";

                var oModel = this.getView().getModel();

                if (this.getView().byId("idSuperficie").getSelectedKey()) {
                    vSuperficie = this.getView().byId("idSuperficie").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("tipoSuperficie", 'EQ', vSuperficie));
                }

                if (this.getView().byId("idPuntos").getSelectedKey()) {
                    vPuntos = this.getView().byId("idPuntos").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("Puntos", 'EQ', vPuntos));
                }

                if (this.getView().byId("idMinRanking").getSelectedKey()) {
                    vMinRanking = this.getView().byId("idMinRanking").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("MinRanking", 'EQ', vMinRanking));
                }

                this.getView().byId("gridList").setBusy(true);
                oModel.read("/TorneosSet", {
                    filters: aFilter,
                    success: function (oData) {
                        if (oData.results) {
                            var oModelLocalJson = new sap.ui.model.json.JSONModel();
                            var oDataModificado = this.modificarOdata(oData, true);
                            oModelLocalJson.setData(oDataModificado.results);
                            this.getView().setModel(oModelLocalJson, "ModeloLocalTorneos");
                        }
                        this.getView().byId("gridList").setBusy(false);
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show("Error al conectar con SAP");
                        this.getView().byId("gridList").setBusy(true);
                    }.bind(this)
                });


            },
            onReset: function () {
                //Resetea los valores de los filtros, y vuelve a mostrar todos los torneos como cuando cargo la pagina inicialmente.
                this.getView().byId("idSuperficie").setValue(null);
                this.getView().byId("idSuperficie").setSelectedKey(null);
                this.getView().byId("idPuntos").setValue(null);
                this.getView().byId("idPuntos").setSelectedKey(null);
                this.getView().byId("idMinRanking").setValue(null);
                this.getView().byId("idMinRanking").setSelectedKey(null);
                this._obtenerTorneos();
            },
            _obtenerSuperficies: function () {
                //Obtengo los valores de las superficies de mi oData y le agrego imagenes.
                var oModel = this.getView().getModel();
                oModel.read("/SuperficiesSet", {
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        for (let data of oData.results) {
                            if (data.CodSuperficie === "1") {
                                data.img = "https://img.icons8.com/emoji/15/blue-square-emoji.png"
                            }
                            if (data.CodSuperficie === "2") {
                                data.img = "https://img.icons8.com/emoji/20/brick-emoji.png"
                            }
                            if (data.CodSuperficie === "3") {

                                data.img = "https://img.icons8.com/color/23/grass.png"
                            }
                        }

                        oModelLocalJson.setData(oData.results);

                        this.getView().byId("idSuperficie").setModel(oModelLocalJson, "ModeloLocalSuperficie");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
            },

/*-----------------------------------------------FRAGMENT INFO TORNEO-------------------------------------------*/  

            infoTorneo: function (oEvent) {
                /*
                Creo un Popup para cuando se haga click en el boton de mas informacion, el popup va contener informacion
                de el torneo que fue selecionado, al popup le seteo un modelo que tenga la informacion de ese torneo.
                */
                let nombreTorneo = oEvent.getSource().getBindingContext("ModeloLocalTorneos").getProperty("NombreTorneo");
                nombreTorneo = nombreTorneo.replace(' ', '_');
                console.log(nombreTorneo);
                Fragment.load({
                    name: "Academia2022.zluuc3tenis.view.InfoTorneo",
                    controller: this
                }).then(function (oPopup) {

                    //se asigna el control en una variable para poder usarlo luego
                    this._oDialogInfoTorneo = oPopup;
                    this.getView().addDependent(oPopup);
                    this._oDialogInfoTorneo.setBusy(true);
                    //se pone que cuando se ejecute el evento de cerrar el popup, lo destruya
                    this._oDialogInfoTorneo.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });

                    this._oDialogInfoTorneo.attachAfterOpen(function () {

                        var oModel = this.getView().getModel();
                        var sPath = `/TorneosSet(NombreTorneo='${nombreTorneo}')`;

                        oModel.read(sPath, {
                            success: function (oData) {
                                var oModelLocalJson = new sap.ui.model.json.JSONModel();
                                var oDataModificado = this.modificarOdata(oData, false);
                                oModelLocalJson.setData(oDataModificado);
                                this._oDialogInfoTorneo.setModel(oModelLocalJson, "ModeloLocalInfoTorneo");
                                this._oDialogInfoTorneo.setBusy(false);
                            }.bind(this),
                            error: function () {
                                this._oDialogInfoTorneo.setBusy(false);
                                sap.m.MessageToast.show("Error al conectarse con SAP");
                            }.bind(this)
                        })
                    }.bind(this));

                    this._oDialogInfoTorneo.open();
                }.bind(this));
            },
            onCloseDialogInfoTorneo: function () {
                //cerrar popup de info torneo
                this._oDialogInfoTorneo.close();
            }


        });
    });
