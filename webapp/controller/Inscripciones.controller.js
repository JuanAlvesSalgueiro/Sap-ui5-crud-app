sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "Academia2022/zluuc3tenis/helpers/index"
],
    function (Controller, Fragment, MessageBox, index) {
        "use strict";

        var InscripcionesController = Controller.extend("Academia2022.zluuc3tenis.controller.Inscripciones", {
            //funcion definida en la carpeta helpers
            modificarOdata: index.modificarOdata,
            onInit: function (oEvent) {
                this.getOwnerComponent().getRouter("object").getRoute("inscripciones").attachPatternMatched(this._recibirParametros, this);

            },

            /*--------------------------------------------VIEW INSCRIPCIONES AL CARGAR LA PAGINA-------------------------------------------*/ 

            _recibirParametros: function (oEvent) {
                //Recibo los parametros que me pasan de la vista de torneos y muestro las inscripciones correspondientes al torneo que me pasaron.
                var nombreTorneo = oEvent.getParameter("arguments").NombreTorneo;
                this._obtenerInscripciones(nombreTorneo);
                this._obtenerInfoTorneo(nombreTorneo);
            },

            _obtenerInscripciones: function (NombreTorneo) {
                /*
                Busco la informacion del torneo que me pasan por parametro en el oData, 
                armo un modelo y lo seteo a la lista que muestra las inscripciones.
                */
                var oModel = this.getView().getModel();
                var sPath = `/TorneosSet(NombreTorneo='${NombreTorneo}')/InscripcionesSet`;
                oModel.read(sPath, {
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        
                        for (let data of oData.results) {
                            data.NombreJugador = data.NombreJugador.replace('_', ' ');
                        }
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("listInscripciones").setModel(oModelLocalJson, "ModeloLocalInscripciones");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
            },

            _obtenerInfoTorneo: function (nombreTorneo) {
                //Obtengo la informacion del torneo que me pasan por parametro y se lo seteo a la vista en un modelo local.
                var oModel = this.getView().getModel();

                oModel.read(`/TorneosSet(NombreTorneo='${nombreTorneo}')`, {
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        var oDataModificado = this.modificarOdata(oData, false);
                        oModelLocalJson.setData(oDataModificado);

                        this.getView().setModel(oModelLocalJson, "ModeloLocalTorneo");

                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })

            },

/*--------------------------------------------CRUD LOGICA ELIMINAR-------------------------------------------*/ 

            _eliminarInscripcion: function(nombreJugador, nombreTorneo){
                //Elimino la inscripcion de mi Odata
                nombreJugador = nombreJugador.replaceAll(' ', '_');
                nombreTorneo = nombreTorneo.replace(' ', '_');
                

                var oModel = this.getView().getModel();
                var sPath = `/InscripcionesSet(NombreTorneo='${nombreTorneo}',NombreJugador='${nombreJugador}')`;
                oModel.remove(sPath, {
                    success: function (oData) {
                        sap.m.MessageToast.show("Inscripcion eliminada");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
            },

            eliminarInscripcion: function (oEvent) {
                //Elimina una inscripcion, antes muestra un mensajed de confirmacion.
                let nombreJugador = oEvent.getSource().getBindingContext("ModeloLocalInscripciones").getProperty("NombreJugador");
                let nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo;
                MessageBox.confirm("¿Desea eliminar la inscripcion?", {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === "OK"){
                            this._eliminarInscripcion(nombreJugador, nombreTorneo);
                        } else {
                            sap.m.MessageToast.show("No se elimino la inscripcion");
                        }
                    }.bind(this)
                });

            },

/*--------------------------------------------CRUD LOGICA CREAR-------------------------------------------*/ 

            onAddInscripcion: function (evt) {
                //Muestra un popUp con un form para llenar la info de la incripcion que se quiera crear.
                Fragment.load({
                    name: "Academia2022.zluuc3tenis.view.AgregarInscripcion",
                    controller: this
                }).then(function (oPopup) {

                    //se asigna el control en una variable para poder usarlo luego
                    this._oDialogAddIncripciones = oPopup;
                    this.getView().addDependent(oPopup);

                    //se pone que cuando se ejecute el evento de cerrar el popup, lo destruya
                    this._oDialogAddIncripciones.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });


                    this._oDialogAddIncripciones.open();
                }.bind(this));
            },

            onCloseDialogInscripciones: function () {
                //cerrar popup de agregar inscripcion.
                this._oDialogAddIncripciones.close();
            },

            onSaveInscripcion: function () {
                //Obtengo los valores del form y crea una nueva inscripcion en mi oData.
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                var rankingMinimo = this.getView().getModel("ModeloLocalTorneo").getData().MinRanking;
                console.log(rankingMinimo);
                var nombreJugador = sap.ui.getCore().byId("inputNombre").getValue().replaceAll(' ', '_').toUpperCase();
                var ranking = sap.ui.getCore().byId("inputRanking").getValue()
                var edad = sap.ui.getCore().byId("inputEdad").getValue();
                var genero = sap.ui.getCore().byId("selectGenero").mProperties.selectedKey;
                var puntos = sap.ui.getCore().byId("inputPuntos").getValue();
                var sponsor = sap.ui.getCore().byId("selectSponsor").mProperties.selectedKey;
                var oParameters = { NombreTorneo: nombreTorneo, NombreJugador: nombreJugador, Ranking: ranking, Edad: edad, Genero: genero, Puntos: puntos, Sponsor: sponsor };
                var oModel = this.getView().getModel();
                var sPath = `/InscripcionesSet`;
                if ((parseInt(rankingMinimo, 10) < parseInt(ranking, 10))) {
                    MessageBox.error("No cumple con el ranking minimo para entrar al torneo.", {
                        actions: [MessageBox.Action.CLOSE],
                        emphasizedAction: MessageBox.Action.CLOSE,
             
                    });
                } else {
                    oModel.create(sPath, oParameters, {
                        success: function (oData) {
    
                            sap.m.MessageToast.show("Inscripcion creada correctamente");
    
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show("Error al conectarse con SAP");
                        }.bind(this)
                    })
                    this._oDialogAddIncripciones.close();
                }

            },

/*--------------------------------------------FILTROS-------------------------------------------*/  

            handleSelectionSponsors: function (oEvent) {
                //funcionalidad del filtro de sponsors
                var changedItem = oEvent.getParameter("changedItem");
                var isSelected = oEvent.getParameter("selected");

                var state = "Selected";
                if (!isSelected) {
                    state = "Deselected";
                }

                sap.m.MessageToast.show("" + state + " '" + changedItem.getText() + "'", {
                    width: "auto"
                });
            },

            onFiltrarInscripciones: function () {
                /*
                Obtengo los valores de los filtros de las inscripciones y busco la informacion de mi oData con los filtros que se pasaron,
                y seteo la nueva lista de inscripciones.
                */
                var aFilter = [];
                var vSponsors = "",
                    vGenero = "",
                    vPuntosMin = "",
                    vPuntosMax = "";
                if (this.getView().byId("idSponsor").mProperties.selectedKeys) {
                    vSponsors = this.getView().byId("idSponsor").mProperties.selectedKeys;
                    vSponsors.forEach(element => {
                        aFilter.push(new sap.ui.model.Filter("Sponsor", 'EQ', element));
                    });
                }

                if (this.getView().byId("idGenero").getSelectedKey()) {
                    vGenero = this.getView().byId("idGenero").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("Genero", 'EQ', vGenero));
                }
                if (this.getView().byId("idPuntosMin").getValue() && this.getView().byId("idPuntosMax").getValue()) {
                    vPuntosMin = this.getView().byId("idPuntosMin").getValue();
                    vPuntosMax = this.getView().byId("idPuntosMax").getValue();
                    aFilter.push(new sap.ui.model.Filter("Puntos", 'BT', vPuntosMin, vPuntosMax));
                } else {
                    if (this.getView().byId("idPuntosMin").getValue()) {
                        vPuntosMin = this.getView().byId("idPuntosMin").getValue();
                        aFilter.push(new sap.ui.model.Filter("Puntos", 'GT', vPuntosMin));
                    }
                    if (this.getView().byId("idPuntosMax").getValue()) {
                        vPuntosMax = this.getView().byId("idPuntosMax").getValue();
                        aFilter.push(new sap.ui.model.Filter("Puntos", 'LT', vPuntosMax));
                    }
                }
                

                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                var oModel = this.getView().getModel();
                this.getView().byId("listInscripciones").setBusy(true);
                var sPath = `/TorneosSet(NombreTorneo='${nombreTorneo}')/InscripcionesSet`;
                oModel.read(sPath, {
                    filters: aFilter,
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        for (let data of oData.results) {
                            data.NombreJugador = data.NombreJugador.replace('_', ' ');
                        }
                        oModelLocalJson.setData(oData.results);

                        this.getView().byId("listInscripciones").setModel(oModelLocalJson, "ModeloLocalInscripciones");
                        this.getView().byId("listInscripciones").setBusy(false);
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show("Error al conectar con SAP");
                        this.getView().byId("listInscripciones").setBusy(true);
                    }.bind(this)
                });
            },

            onReset: function () {
                //Resetea los valores de los filtros, y vuelve a mostrar todos las inscripciones como cuando cargo la pagina inicialmente.
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                this.getView().byId("idSponsor").setValue(null);
                this.getView().byId("idSponsor").setSelectedKeys(null);
                this.getView().byId("idGenero").setValue(null);
                this.getView().byId("idGenero").setSelectedKey(null);
                this.getView().byId("idPuntosMin").setValue(null);
                this.getView().byId("idPuntosMin").setSelectedKey(null);
                this.getView().byId("idPuntosMax").setValue(null);
                this.getView().byId("idPuntosMax").setSelectedKey(null);
                this._obtenerInscripciones(nombreTorneo);
            },

/*--------------------------------------------FRAGMENT INFO INSCRIPCION-------------------------------------------*/   

            visualizarInfoInscripcion: function (oEvent) {
                /*
                Creo un Popup para cuando se haga click en el link del jugador, el popup va contener informacion
                del jugador que fue selecionado, al popup le seteo un modelo que tenga la informacion de ese jugador.
                */
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                let nombreJugador = oEvent.getSource().getBindingContext("ModeloLocalInscripciones").getProperty("NombreJugador").replace(' ', '_');
                
                
                Fragment.load({
                    name: "Academia2022.zluuc3tenis.view.InfoInscripcion",
                    controller: this
                }).then(function (oPopup) {

                    //se asigna el control en una variable para poder usarlo luego
                    this._oDialogVisualizarInfoInscripcion = oPopup;
                    this.getView().addDependent(oPopup);
                    this._oDialogVisualizarInfoInscripcion.setBusy(true);
                    //se pone que cuando se ejecute el evento de cerrar el popup, lo destruya
                    this._oDialogVisualizarInfoInscripcion.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });
                    this._oDialogVisualizarInfoInscripcion.attachAfterOpen(function () {
                        
                        var oModel = this.getView().getModel();
                        var sPath =  `/InscripcionesSet(NombreTorneo='${nombreTorneo}',NombreJugador='${nombreJugador}')`;
                        oModel.read(sPath, {
                            success: function(oData) {
                                var oModelInfoInscripcion = new sap.ui.model.json.JSONModel();
                                oData.NombreJugador = oData.NombreJugador.replace('_', ' ');
                                console.log(oData);
                                oModelInfoInscripcion.setData(oData);
                                
                                this._oDialogVisualizarInfoInscripcion.setModel(oModelInfoInscripcion, "ModeloLocalInfoInscripcion");
                                this._oDialogVisualizarInfoInscripcion.setBusy(false);
                            }.bind(this),
                            error: function() {
                                this._oDialogVisualizarInfoInscripcion.setBusy(false);
                                sap.m.MessageToast.show("Error al conectarse con SAP");
                            }.bind(this)
                        }) 

                    }.bind(this));


                    this._oDialogVisualizarInfoInscripcion.open();
                }.bind(this));

            },

            onCloseDialogInfoInscripcion: function () {
                //cerrar popup de info inscripcion
                this._oDialogVisualizarInfoInscripcion.close()
            },

/*--------------------------------------------CRUD LOGICA EDITAR-------------------------------------------*/ 

            editarInscripcion: function (oEvent) {
                //Muestra un popUp con un form con la informacion de la inscripcion seleccionada.
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                let nombreJugador = oEvent.getSource().getBindingContext("ModeloLocalInscripciones").getProperty("NombreJugador").replace(' ', '_');
                
                
                Fragment.load({
                    name: "Academia2022.zluuc3tenis.view.EditarInscripcion",
                    controller: this
                }).then(function (oPopup) {

                    //se asigna el control en una variable para poder usarlo luego
                    this._oDialogEditarInfo = oPopup;
                    this.getView().addDependent(oPopup);
                    this._oDialogEditarInfo.setBusy(true);
                    //se pone que cuando se ejecute el evento de cerrar el popup, lo destruya
                    this._oDialogEditarInfo.attachAfterClose(function (oEvent) {
                        oEvent.getSource().destroy();
                    });
                    this._oDialogEditarInfo.attachAfterOpen(function () {
                        //modelo de pasajeros generado con un dato vacio
                        var oModel = this.getView().getModel();
                        var sPath =  `/InscripcionesSet(NombreTorneo='${nombreTorneo}',NombreJugador='${nombreJugador}')`;
                        oModel.read(sPath, {
                            success: function(oData) {
                                var oModelEditarInscripcion = new sap.ui.model.json.JSONModel();
                                oData.NombreJugador = oData.NombreJugador.replace('_', ' ');
                                ;
                                oModelEditarInscripcion.setData(oData);
                                
                                this._oDialogEditarInfo.setModel(oModelEditarInscripcion, "ModeloLocalEditarInscripcion");
                                this._oDialogEditarInfo.setBusy(false);
                            }.bind(this),
                            error: function() {
                                this._oDialogEditarInfo.setBusy(false);
                                sap.m.MessageToast.show("Error al conectarse con SAP");
                            }.bind(this)
                        }) 

                    }.bind(this));


                    this._oDialogEditarInfo.open();
                }.bind(this));

            },

            onSaveEditarInscripcion: function(oEvent){
                //Obtengo los valores del form y hago el update con la nueva informacion en mi oData.
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                var nombreJugador = sap.ui.getCore().byId("editarNombre").getText().replace(' ', '_');;
                var ranking = sap.ui.getCore().byId("editarRanking").getValue()
                var edad = sap.ui.getCore().byId("editarEdad").getValue();
                var genero = sap.ui.getCore().byId("editarGenero").mProperties.selectedKey;
                var puntos = sap.ui.getCore().byId("editarPuntos").getValue();
                var sponsor = sap.ui.getCore().byId("editarSponsor").mProperties.selectedKey;
                var oParameters = { NombreTorneo: nombreTorneo, NombreJugador: nombreJugador, Ranking: ranking, Edad: edad, Genero: genero, Puntos: puntos, Sponsor: sponsor };
                var oModel = this.getView().getModel();
                var sPath =  `/InscripcionesSet(NombreTorneo='${nombreTorneo}',NombreJugador='${nombreJugador}')`;
                oModel.update(sPath, oParameters, {
                    success: function () {
                        sap.m.MessageToast.show("Inscripcion actualizada correctamente");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
                this._oDialogEditarInfo.close();
            },

            onCloseDialogEditarInscripciones: function () {
                //cierro el Popup de editar inscripcion
                this._oDialogEditarInfo.close()
            },
/*--------------------------------------------LOGICA DEL BOTON ORDENAR POR PUNTOS-------------------------------------------*/ 
            ordenarInscripciones: function(){
                /*
                Obtengo los valores de los filtros, luego llamo a mi oData y recibo la lista de inscripciones, despues las ordeno 
                con un sort y las seteo a la lista de la vista de este controlador.
                */
                //CODIGO REPETIDO...CAMBIAR
                var aFilter = [];
                var vSponsors = "",
                    vGenero = "",
                    vPuntosMin = "",
                    vPuntosMax = "";
                if (this.getView().byId("idSponsor").mProperties.selectedKeys) {
                    vSponsors = this.getView().byId("idSponsor").mProperties.selectedKeys;
                    vSponsors.forEach(element => {
                        aFilter.push(new sap.ui.model.Filter("Sponsor", 'EQ', element));
                    });
                }

                if (this.getView().byId("idGenero").getSelectedKey()) {
                    vGenero = this.getView().byId("idGenero").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("Genero", 'EQ', vGenero));
                }
                if (this.getView().byId("idPuntosMin").getValue() && this.getView().byId("idPuntosMax").getValue()) {
                    vPuntosMin = this.getView().byId("idPuntosMin").getValue();
                    vPuntosMax = this.getView().byId("idPuntosMax").getValue();
                    aFilter.push(new sap.ui.model.Filter("Puntos", 'BT', vPuntosMin, vPuntosMax));
                } else {
                    if (this.getView().byId("idPuntosMin").getValue()) {
                        vPuntosMin = this.getView().byId("idPuntosMin").getValue();
                        aFilter.push(new sap.ui.model.Filter("Puntos", 'GT', vPuntosMin));
                    }
                    if (this.getView().byId("idPuntosMax").getValue()) {
                        vPuntosMax = this.getView().byId("idPuntosMax").getValue();
                        aFilter.push(new sap.ui.model.Filter("Puntos", 'LT', vPuntosMax));
                    }
                }
                var oModel = this.getView().getModel();
                var nombreTorneo = this.getView().getModel("ModeloLocalTorneo").getData().NombreTorneo.replace(' ', '_');
                var sPath = `/TorneosSet(NombreTorneo='${nombreTorneo}')/InscripcionesSet`;
                oModel.read(sPath, {
                    filters: aFilter,
                    success: function (oData) {
                        var oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        for (let data of oData.results) {
                            data.NombreJugador = data.NombreJugador.replace('_', ' ');

                        }
                        oModelLocalJson.setData(oData.results);
                        oData.results.sort((o1, o2) => {
                            if (o1.Puntos > o2.Puntos){
                                return -1
                            } else if (o1.Puntos < o2.Puntos) {
                                return 1
                            } else {
                                return 0;
                            }
                        });
                        
                        

                        this.getView().byId("listInscripciones").setModel(oModelLocalJson, "ModeloLocalInscripciones");

                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show("Error al conectarse con SAP");
                    }.bind(this)
                })
            }
        });
    });