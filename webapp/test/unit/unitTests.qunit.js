/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Academia2022/zluuc3_tenis/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
