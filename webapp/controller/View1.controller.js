sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zcrossfilter.controller.View1", {
            onInit: function () {
                var oMaterial = {
                    "aMaterials": []
                }
                var MaterialModel = new JSONModel(oMaterial)
                this.getView().setModel(MaterialModel, "MaterialModel");

                this.getOwnerComponent().getRouter().getRoute("RouteView1").attachPatternMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function () {
                var oModel = this.getView().getModel();
                var MaterialModel = this.getView().getModel("MaterialModel")
                var startupParams = this.getOwnerComponent().getComponentData().startupParameters
                var matno = startupParams.matno[0];

                oModel.read("/Material_DetSet('" + matno + "')", {
                    urlParameters: {
                        "$expand": "mattransportdetnav"
                    },
                    success: function (Response) {
                        MaterialModel.getData().aMaterials.push(Response)
                        MaterialModel.updateBindings(true);
                    },
                    error: function (error) {
                        var errormessage = JSON.parse(error.responseText).error.message.value;
                        MessageBox.error(errormessage);
                    }
                })
            }
        });
    });
