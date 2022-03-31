/*global QUnit*/

sap.ui.define([
	"Academia2022/zluuc3_tenis/controller/Torneos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Torneos Controller");

	QUnit.test("I should test the Torneos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
